// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

interface IStableFarm {
    function stake(uint256 amount) external;
    function claim(address to) external returns (uint256 claimed);
    function unstake(uint256 amount, address to) external;
    function pendingRewards(address staker) external view returns (uint256);
    function totalStaked() external view returns (uint256);
}

interface IUSDK {
    function mint(address to, uint256 amount) external;
    function decimals() external view returns (uint8);
}

interface IStableVault {
    function depositAssets(uint256 assets, address receiver) external returns (uint256 shares);
    function redeemShares(uint256 shares, address receiver, address owner_) external returns (uint256 assets);
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function totalAssets() external view returns (uint256);
    function convertToAssets(uint256 shares) external view returns (uint256);
    function setOwner(address newOwner) external;
}

interface IKtgPoints {
    function update(address user) external returns (uint256);
}

contract StableController {
    IERC20 public usdc;
    IUSDK public usdk;
    IStableFarm public farm;
    IStableVault public vault;

    bool private initialized;
    address public owner;

    // Optional: points contract (upgradeable proxy address)
    address public points;

    // external pool that will receive USDC on withdrawals (to back USDK<->USDC swap pool)
    address public usdcPool;

    // treasury that receives the 1/6 USDC remainder of harvests
    address public treasury;

    // Security
    bool public paused;
    bool private reentrancyLock;

    // Harvest config
    uint256 public constant YEAR = 365 days;
    uint256 public constant ONE = 1e18;
    uint256 public lastHarvest;
    uint256 public harvestCooldown; // seconds; set to 60 for 1/min

    event Deposited(address indexed user, uint256 usdcIn, uint256 usdkMinted, uint256 sharesOut);
    event Harvested(uint256 usdcClaimed, uint256 usdcRestaked, uint256 usdkMintedToVault, uint256 usdcToTreasury);
    event Withdrawn(address indexed user, uint256 sharesBurned, uint256 usdkOut, uint256 usdcToPool);

    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event FarmChanged(address indexed oldFarm, address indexed newFarm);
    event PointsSet(address indexed points);
    event UsdcPoolSet(address indexed oldPool, address indexed newPool);
    event TreasurySet(address indexed oldTreasury, address indexed newTreasury);
    event HarvestCooldownSet(uint256 secondsCooldown);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "PAUSED");
        _;
    }

    modifier nonReentrant() {
        require(!reentrancyLock, "REENTRANT");
        reentrancyLock = true;
        _;
        reentrancyLock = false;
    }

    function initialize(address _usdc, address _usdk, address _farm, address _vault, address _usdcPool, address _treasury) external {
        require(!initialized, "ALREADY_INIT");
        require(_usdc != address(0) && _usdk != address(0) && _farm != address(0) && _vault != address(0), "BAD_ADDR");
        require(_usdcPool != address(0), "BAD_POOL");
        require(_treasury != address(0), "BAD_TREASURY");

        usdc = IERC20(_usdc);
        usdk = IUSDK(_usdk);
        farm = IStableFarm(_farm);
        vault = IStableVault(_vault);
        usdcPool = _usdcPool;
        treasury = _treasury;

        owner = msg.sender;
        initialized = true;

        harvestCooldown = 60; // default: 1/min
        lastHarvest = 0;
    }

    function setOwner(address _owner) external onlyOwner {
        require(_owner != address(0), "BAD_OWNER");
        emit OwnerChanged(owner, _owner);
        owner = _owner;
    }

    function setPoints(address _points) external onlyOwner {
        points = _points;
        emit PointsSet(_points);
    }

    function setUsdcPool(address _pool) external onlyOwner {
        require(_pool != address(0), "BAD_POOL");
        emit UsdcPoolSet(usdcPool, _pool);
        usdcPool = _pool;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "BAD_TREASURY");
        emit TreasurySet(treasury, _treasury);
        treasury = _treasury;
    }

    function setHarvestCooldown(uint256 secondsCooldown) external onlyOwner {
        harvestCooldown = secondsCooldown;
        emit HarvestCooldownSet(secondsCooldown);
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function setFarm(address _farm) external onlyOwner {
        require(_farm != address(0), "BAD_FARM");
        emit FarmChanged(address(farm), _farm);
        farm = IStableFarm(_farm);
    }

    function setAllowance(uint256 amount) external onlyOwner whenNotPaused {
        usdc.approve(address(farm), 0);
        require(usdc.approve(address(farm), amount), "APPROVE_FAIL");
    }

    function setVaultOwner(address newOwner) external onlyOwner {
        vault.setOwner(newOwner);
    }

    function _updatePoints(address user) internal {
        if (points == address(0)) return;
        try IKtgPoints(points).update(user) {
        } catch {
        }
    }

    function _scaleToUSDK(uint256 usdcAmount) internal view returns (uint256) {
        // uses token decimals instead of assumptions
        uint8 usdcDec = usdc.decimals();
        uint8 usdkDec = usdk.decimals();
        if (usdcDec == usdkDec) return usdcAmount;
        if (usdcDec > usdkDec) return usdcAmount / (10 ** (usdcDec - usdkDec));
        return usdcAmount * (10 ** (usdkDec - usdcDec));
    }

    // -------------------------
    // User flows
    // -------------------------

    /// @notice User deposits USDC; controller stakes into farm; mints USDK to vault and mints shares to user via vault ratio.
    function depositUSDC(uint256 usdcAmount) external whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        require(usdcAmount > 0, "AMOUNT_ZERO");

        _updatePoints(msg.sender);

        require(usdc.transferFrom(msg.sender, address(this), usdcAmount), "USDC_XFER_FAIL");

        // stake principal
        usdc.approve(address(farm), 0);
        require(usdc.approve(address(farm), usdcAmount), "USDC_APPROVE_FAIL");
        farm.stake(usdcAmount);

        // mint 1:1 USDK (in USDK decimals) into vault
        uint256 usdkAssets = _scaleToUSDK(usdcAmount);
        usdk.mint(address(vault), usdkAssets);

        // deposit into vault -> shares minted proportionally
        uint256 sharesOut = vault.depositAssets(usdkAssets, msg.sender);

        emit Deposited(msg.sender, usdcAmount, usdkAssets, sharesOut);
    }

    /// @notice Withdraw by redeeming shares for USDK (to user) and sending corresponding USDC principal to the pool.
    /// @dev Also triggers points update. USDC out is computed from the redeemed USDK assets (1:1 notionally).
    function withdrawShares(uint256 shares) external whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        require(shares > 0, "AMOUNT_ZERO");

        _updatePoints(msg.sender);

        // Redeem shares -> sends USDK to user
        uint256 usdkOut = vault.redeemShares(shares, msg.sender, msg.sender);

        // Convert USDK assets back to USDC units (USDK=6, USDC=18)
        uint8 usdcDec = usdc.decimals();
        uint8 usdkDec = usdk.decimals();
        uint256 usdcOut;
        if (usdcDec == usdkDec) usdcOut = usdkOut;
        else if (usdcDec > usdkDec) usdcOut = usdkOut * (10 ** (usdcDec - usdkDec));
        else usdcOut = usdkOut / (10 ** (usdkDec - usdcDec));

        // Unstake equivalent USDC to pool
        farm.unstake(usdcOut, usdcPool);

        emit Withdrawn(msg.sender, shares, usdkOut, usdcOut);
    }

    // -------------------------
    // Keeper flow
    // -------------------------

    /// @notice Claims accrued USDC rewards, re-stakes them (auto-compound), mints 5/6 as USDK to the vault,
    ///         and sends the remaining 1/6 USDC to treasury.
    function harvestAndSync() external whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        if (harvestCooldown > 0) {
            require(block.timestamp >= lastHarvest + harvestCooldown, "COOLDOWN");
        }
        lastHarvest = block.timestamp;

        // claim rewards in USDC to controller
        uint256 claimed = farm.claim(address(this));
        if (claimed == 0) {
            emit Harvested(0, 0, 0, 0);
            return;
        }

        // Split claimed: 5/6 compounded (restaked) and minted as USDK to vault, 1/6 to treasury.
        uint256 usdcToTreasury = claimed / 6;
        uint256 usdcToCompound = claimed - usdcToTreasury; // 5/6 (rounded)

        // pay treasury first
        if (usdcToTreasury > 0) {
            require(usdc.transfer(treasury, usdcToTreasury), "TREASURY_XFER_FAIL");
        }

        // restake 5/6 into the farm (auto-compound)
        usdc.approve(address(farm), 0);
        require(usdc.approve(address(farm), usdcToCompound), "USDC_APPROVE_FAIL");
        farm.stake(usdcToCompound);

        // mint 5/6 (in USDK units) as yield to the vault (assets increase => share price up)
        uint256 usdkToVault = _scaleToUSDK(usdcToCompound);
        if (usdkToVault > 0) {
            usdk.mint(address(vault), usdkToVault);
        }

        emit Harvested(claimed, usdcToCompound, usdkToVault, usdcToTreasury);
    }
}
