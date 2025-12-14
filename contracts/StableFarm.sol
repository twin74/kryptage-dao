// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Minimal {
    function balanceOf(address) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @notice StableFarm v2 (controller-only)
/// @dev Rewards are paid in USDC from this contract's balance (funded by owner/treasury).
///      APR is applied on totalStaked with per-second accrual and distributed pro-rata via accRewardPerShare.
contract StableFarm {
    IERC20Minimal public immutable usdc;

    address public owner;
    address public controller;

    // APR in 1e18, e.g. 0.30e18 = 30% APR
    uint256 public apr1e18;

    // MasterChef-style accounting
    uint256 public totalStaked;
    uint256 public accRewardPerShare1e18; // cumulative rewards per staked USDC, scaled 1e18
    uint256 public lastUpdate;

    mapping(address => uint256) public stakeOf; // staked principal per staker
    mapping(address => uint256) public rewardDebt; // rewards already accounted: stake * accRPS

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event ControllerSet(address indexed controller);
    event APRUpdated(uint256 apr1e18);

    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, address indexed to, uint256 amount);
    event Claimed(address indexed staker, address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyController() {
        require(msg.sender == controller, "NOT_CONTROLLER");
        _;
    }

    constructor(address _usdc, uint256 _apr1e18) {
        require(_usdc != address(0), "BAD_USDC");
        usdc = IERC20Minimal(_usdc);
        owner = msg.sender;
        apr1e18 = _apr1e18 == 0 ? 0.30e18 : _apr1e18;
        lastUpdate = block.timestamp;
        emit OwnershipTransferred(address(0), msg.sender);
        emit APRUpdated(apr1e18);
    }

    // -------------------------
    // Admin
    // -------------------------

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_ADDRESS");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /// @notice Sets the only account allowed to stake/unstake/claim (your StableController).
    function setController(address _controller) external onlyOwner {
        require(_controller != address(0), "BAD_CONTROLLER");
        controller = _controller;
        emit ControllerSet(_controller);
    }

    /// @notice Update APR for testing.
    function setAPR(uint256 _apr1e18) external onlyOwner {
        _accrue();
        apr1e18 = _apr1e18;
        emit APRUpdated(_apr1e18);
    }

    /// @notice Optional: can be used to ensure rewards are funded.
    function fundRewards(uint256 amount) external onlyOwner {
        require(amount > 0, "AMOUNT_ZERO");
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC_TRANSFER_FAIL");
    }

    function defund(uint256 amount) external onlyOwner {
        require(amount > 0, "AMOUNT_ZERO");
        require(usdc.transfer(msg.sender, amount), "USDC_TRANSFER_FAIL");
    }

    // -------------------------
    // Views
    // -------------------------

    function pendingRewards(address staker) external view returns (uint256) {
        uint256 _acc = accRewardPerShare1e18;
        if (block.timestamp > lastUpdate && totalStaked > 0) {
            uint256 dt = block.timestamp - lastUpdate;
            uint256 reward = (totalStaked * apr1e18 * dt) / (365 days) / 1e18;
            _acc = _acc + ((reward * 1e18) / totalStaked);
        }
        uint256 st = stakeOf[staker];
        uint256 accumulated = (st * _acc) / 1e18;
        uint256 debt = rewardDebt[staker];
        if (accumulated <= debt) return 0;
        return accumulated - debt;
    }

    // -------------------------
    // Core accounting
    // -------------------------

    function _accrue() internal {
        if (block.timestamp <= lastUpdate) return;
        if (totalStaked == 0) {
            lastUpdate = block.timestamp;
            return;
        }
        uint256 dt = block.timestamp - lastUpdate;
        uint256 reward = (totalStaked * apr1e18 * dt) / (365 days) / 1e18;
        // distribute pro-rata
        accRewardPerShare1e18 = accRewardPerShare1e18 + ((reward * 1e18) / totalStaked);
        lastUpdate = block.timestamp;
    }

    // -------------------------
    // Controller-only actions
    // -------------------------

    function stake(uint256 amount) external onlyController {
        require(amount > 0, "AMOUNT_ZERO");
        _accrue();

        address staker = msg.sender; // controller is the only staker (aggregator)
        // pull USDC in
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC_TRANSFER_FAIL");

        // update accounting
        uint256 st = stakeOf[staker];
        if (st > 0) {
            // bring debt up-to-date before changing stake
            rewardDebt[staker] = (st * accRewardPerShare1e18) / 1e18;
        }
        stakeOf[staker] = st + amount;
        totalStaked += amount;
        // set new debt
        rewardDebt[staker] = (stakeOf[staker] * accRewardPerShare1e18) / 1e18;

        emit Staked(staker, amount);
    }

    function claim(address to) external onlyController returns (uint256 claimed) {
        require(to != address(0), "BAD_TO");
        _accrue();

        address staker = msg.sender;
        uint256 st = stakeOf[staker];
        if (st == 0) {
            rewardDebt[staker] = 0;
            return 0;
        }

        uint256 accumulated = (st * accRewardPerShare1e18) / 1e18;
        uint256 debt = rewardDebt[staker];
        if (accumulated <= debt) {
            return 0;
        }

        claimed = accumulated - debt;
        // update debt first
        rewardDebt[staker] = accumulated;

        // pay out from funded USDC balance
        require(usdc.transfer(to, claimed), "USDC_TRANSFER_FAIL");
        emit Claimed(staker, to, claimed);
    }

    function unstake(uint256 amount, address to) external onlyController {
        require(to != address(0), "BAD_TO");
        require(amount > 0, "AMOUNT_ZERO");

        _accrue();

        address staker = msg.sender;
        uint256 st = stakeOf[staker];
        require(amount <= st, "BAD_AMOUNT");

        // update debt to current before changing stake
        rewardDebt[staker] = (st * accRewardPerShare1e18) / 1e18;

        stakeOf[staker] = st - amount;
        totalStaked -= amount;

        // update debt after
        rewardDebt[staker] = (stakeOf[staker] * accRewardPerShare1e18) / 1e18;

        require(usdc.transfer(to, amount), "USDC_TRANSFER_FAIL");
        emit Unstaked(staker, to, amount);
    }
}
