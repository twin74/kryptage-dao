// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IStableFarm {
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function pendingRewards() external view returns (uint256);
    function compound() external;
    function claim() external returns (uint256);
}

interface IUSDK {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

interface IStableVault {
    function mintShares(address to, uint256 amount) external;
    function burnShares(address from, uint256 amount) external;
    function depositUSDK(uint256 amount) external;
    function redeemUSDK(address to, uint256 shares) external;
    function setOwner(address newOwner) external;
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

contract StableController {
    IERC20 public usdc;
    IUSDK public usdk;
    IStableFarm public farm;
    IStableVault public vault;

    bool private initialized;
    address public owner;

    // Security
    bool public paused;
    bool private reentrancyLock;

    uint256 public rewardPerShare; // reward cumulativo per ogni sUSDK (1e18 precisione)
    mapping(address => uint256) public userRewardDebt; // reward già “pagato” a ciascun utente

    event Deposited(address indexed user, uint256 usdcAmount, uint256 sharesMinted);
    event Harvested(uint256 rewardUSDC, uint256 mintedUSDK, uint256 ktgPoints);
    event Compounded(uint256 timestamp, uint256 amount);
    event Withdrawn(address indexed user, uint256 sharesBurned, uint256 usdkOut);
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event FarmChanged(address indexed oldFarm, address indexed newFarm);

    modifier onlyOwner() { require(msg.sender == owner, "NOT_OWNER"); _; }
    modifier whenNotPaused() { require(!paused, "PAUSED"); _; }
    modifier nonReentrant() { require(!reentrancyLock, "REENTRANT"); reentrancyLock = true; _; reentrancyLock = false; }

    function initialize(address _usdc, address _usdk, address _farm, address _vault) external {
        require(!initialized, "ALREADY_INIT");
        require(_usdc != address(0) && _usdk != address(0) && _farm != address(0) && _vault != address(0), "BAD_ADDR");
        usdc = IERC20(_usdc);
        usdk = IUSDK(_usdk);
        farm = IStableFarm(_farm);
        vault = IStableVault(_vault);
        owner = msg.sender;
        initialized = true;
    }

    function setOwner(address _owner) external onlyOwner {
        require(_owner != address(0), "BAD_OWNER");
        emit OwnerChanged(owner, _owner);
        owner = _owner;
    }

    function pause() external onlyOwner { paused = true; emit Paused(msg.sender); }
    function unpause() external onlyOwner { paused = false; emit Unpaused(msg.sender); }

    // Convert USDC (18 decimals) amount to USDK (6 decimals)
    function _toUSDK(uint256 usdcAmount) internal pure returns (uint256) {
        // assumes USDC=18, USDK=6 -> divide by 1e12
        return usdcAmount / 1_000_000_000_000;
    }

    // Deposit USDC -> stake in Farm, mint USDK into vault, mint sUSDK (shares) to user
    function depositUSDC(uint256 amount) external whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        require(amount > 0, "AMOUNT_ZERO");
        // --- reward accounting: update user pending before changing shares ---
        uint256 userShares = vault.balanceOf(msg.sender);
        if (userShares > 0) {
            // Optionally: store/emit pending rewards for user here
        }
        // Update userRewardDebt to current shares * rewardPerShare after deposit
        // (will be updated after minting new shares below)
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC_XFER_FAIL");
        require(usdc.approve(address(farm), amount), "USDC_APPROVE_FAIL");
        farm.stake(amount);
        uint256 mintAmount = _toUSDK(amount);
        usdk.mint(address(vault), mintAmount);
        vault.depositUSDK(mintAmount);
        vault.mintShares(msg.sender, amount);
        // Update userRewardDebt to new shares * rewardPerShare
        uint256 newUserShares = vault.balanceOf(msg.sender);
        userRewardDebt[msg.sender] = (newUserShares * rewardPerShare) / 1e18;
        emit Deposited(msg.sender, amount, amount);
    }

    // Harvest global rewards: split full reward 5/6 USDK to vault, 1/6 KTG points (accounting off-chain or separate contract)
    function harvestGlobal() external onlyOwner whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        farm.compound();
        uint256 pending = farm.pendingRewards();
        if (pending == 0) return;
        uint256 claimed = farm.claim();
        uint256 reward = claimed;
        if (reward == 0) reward = pending;
        // normalize reward from USDC(18) to USDK(6)
        uint256 rewardUsdkUnits = _toUSDK(reward);
        uint256 usdkPart = (rewardUsdkUnits * 5) / 6; // 83.33%
        uint256 ktgPart = rewardUsdkUnits - usdkPart;  // 16.66%
        usdk.mint(address(vault), usdkPart);
        vault.depositUSDK(usdkPart);
        // --- rewardPerShare update logic ---
        uint256 totalShares = vault.totalSupply();
        if (totalShares > 0 && usdkPart > 0) {
            // scale by 1e18 for precision
            rewardPerShare += (usdkPart * 1e18) / totalShares;
        }
        emit Harvested(rewardUsdkUnits, usdkPart, ktgPart);
    }

    // Compound: claim rewards and restake into Farm
    function compoundGlobal() external whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        // get pending rewards
        uint256 pending = farm.pendingRewards();
        if (pending == 0) {
            emit Compounded(block.timestamp, 0);
            return;
        }
        // claim rewards (USDC) to this controller
        uint256 claimed = farm.claim();
        require(claimed > 0, "NO_CLAIM");
        // safe approve pattern (handles strict tokens)
        // reset allowance if needed
        usdc.approve(address(farm), 0);
        // set allowance to claimed
        require(usdc.approve(address(farm), claimed), "APPROVE_FAIL");
        // restake rewards
        farm.stake(claimed);
        emit Compounded(block.timestamp, claimed);
    }

    // Withdraw by burning sUSDK shares; user receives USDK, USDC are balanced via pool by vault
    function withdrawShares(uint256 shares) external whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        require(shares > 0, "AMOUNT_ZERO");
        // --- reward accounting: update user pending before changing shares ---
        uint256 userShares = vault.balanceOf(msg.sender);
        if (userShares > 0) {
            // Optionally: store/emit pending rewards for user here
        }
        vault.burnShares(msg.sender, shares);
        vault.redeemUSDK(msg.sender, shares);
        // Update userRewardDebt to new shares * rewardPerShare
        uint256 newUserShares = vault.balanceOf(msg.sender);
        userRewardDebt[msg.sender] = (newUserShares * rewardPerShare) / 1e18;
        emit Withdrawn(msg.sender, shares, shares);
        // Note: vault/pool must handle USDC removal from farm and maintain 1:1 via mint/burn separately.
    }

    function setFarm(address _farm) external onlyOwner {
        require(_farm != address(0), "BAD_FARM");
        emit FarmChanged(address(farm), _farm);
        farm = IStableFarm(_farm);
    }

    function setAllowance(uint256 amount) external onlyOwner whenNotPaused {
        // safe approve pattern
        usdc.approve(address(farm), 0);
        require(usdc.approve(address(farm), amount), "APPROVE_FAIL");
    }

    function setVaultOwner(address newOwner) external onlyOwner {
        vault.setOwner(newOwner);
    }

    // View function: returns the pending rewards for a user (in USDK, 6 decimals)
    function pendingRewards(address user) public view returns (uint256) {
        uint256 userShares = vault.balanceOf(user);
        uint256 accumulated = (userShares * rewardPerShare) / 1e18;
        if (accumulated < userRewardDebt[user]) {
            return 0;
        }
        return accumulated - userRewardDebt[user];
    }

    // Claim function: transfers pending rewards to user and updates userRewardDebt
    function claim() external whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        uint256 reward = pendingRewards(msg.sender);
        require(reward > 0, "NO_REWARD");
        // Transfer USDK from vault to user
        require(IERC20(address(usdk)).transferFrom(address(vault), msg.sender, reward), "USDK_XFER_FAIL");
        // Update userRewardDebt to current shares * rewardPerShare
        uint256 userShares = vault.balanceOf(msg.sender);
        userRewardDebt[msg.sender] = (userShares * rewardPerShare) / 1e18;
    }
}
