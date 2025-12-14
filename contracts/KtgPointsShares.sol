// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title KtgPointsShares
 * @notice Non-upgradeable points contract: share-seconds accrual based on sUSDK shares.
 *
 * Model:
 * - pointsRatePerSecond1e18: points minted per 1 share (1e18) per second.
 * - Accrues continuously using a MasterChef-style accumulator.
 *
 * Integration:
 * - StableController calls setShares(user, newShares) on deposit/withdraw.
 * - Faucet calls onFaucetClaim(user) to add optional bonus without reverting.
 */
contract KtgPointsShares {
    // admin
    address public owner;

    // authorized callers
    address public controller;
    address public faucet;

    // points config
    uint256 public pointsRatePerSecond1e18; // 1e18 points per (share*second) where shares are 1e18
    uint256 public bonusPointsPerClaim;     // 1e18

    // accounting
    uint256 public accPointsPerShare1e18;   // 1e18 precision
    uint256 public lastAccrualTs;
    uint256 public totalShares;

    mapping(address => uint256) public sharesOf;
    mapping(address => uint256) public rewardDebt1e18;
    mapping(address => uint256) public points; // accumulated points (1e18)

    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event ControllerSet(address indexed controller);
    event FaucetSet(address indexed faucet);
    event RateSet(uint256 pointsRatePerSecond1e18);
    event BonusSet(uint256 bonusPointsPerClaim);
    event SharesSet(address indexed user, uint256 newShares);
    event Accrued(uint256 dt, uint256 newAccPointsPerShare1e18);
    event Claimed(address indexed user, uint256 amount1e18);
    event FaucetClaimBonus(address indexed user, uint256 bonus1e18);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == controller || msg.sender == faucet, "NOT_AUTHORIZED");
        _;
    }

    modifier onlyFaucet() {
        require(msg.sender == faucet, "NOT_FAUCET");
        _;
    }

    constructor(address _owner, address _controller, address _faucet, uint256 _ratePerSec1e18, uint256 _bonusPerClaim1e18) {
        require(_owner != address(0), "OWNER_0");
        owner = _owner;
        controller = _controller;
        faucet = _faucet;
        pointsRatePerSecond1e18 = _ratePerSec1e18;
        bonusPointsPerClaim = _bonusPerClaim1e18;
        lastAccrualTs = block.timestamp;
    }

    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "OWNER_0");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    function setController(address _controller) external onlyOwner {
        controller = _controller;
        emit ControllerSet(_controller);
    }

    function setFaucet(address _faucet) external onlyOwner {
        faucet = _faucet;
        emit FaucetSet(_faucet);
    }

    function setRate(uint256 _ratePerSec1e18) external onlyOwner {
        _accrue();
        pointsRatePerSecond1e18 = _ratePerSec1e18;
        emit RateSet(_ratePerSec1e18);
    }

    function setBonus(uint256 _bonusPerClaim1e18) external onlyOwner {
        bonusPointsPerClaim = _bonusPerClaim1e18;
        emit BonusSet(_bonusPerClaim1e18);
    }

    function _accrue() internal {
        uint256 ts = block.timestamp;
        if (ts <= lastAccrualTs) return;
        uint256 dt = ts - lastAccrualTs;
        lastAccrualTs = ts;

        if (totalShares == 0 || pointsRatePerSecond1e18 == 0) return;

        // minted = rate * dt * totalShares / 1e18
        uint256 minted1e18 = (pointsRatePerSecond1e18 * dt * totalShares) / 1e18;
        // per-share increment: minted / totalShares
        accPointsPerShare1e18 += (minted1e18 * 1e18) / totalShares;

        emit Accrued(dt, accPointsPerShare1e18);
    }

    function pendingEarned(address user) public view returns (uint256) {
        uint256 _acc = accPointsPerShare1e18;
        uint256 ts = block.timestamp;
        if (ts > lastAccrualTs && totalShares > 0 && pointsRatePerSecond1e18 > 0) {
            uint256 dt = ts - lastAccrualTs;
            uint256 minted1e18 = (pointsRatePerSecond1e18 * dt * totalShares) / 1e18;
            _acc = _acc + (minted1e18 * 1e18) / totalShares;
        }
        uint256 userAcc1e18 = (sharesOf[user] * _acc) / 1e18;
        if (userAcc1e18 <= rewardDebt1e18[user]) return 0;
        return userAcc1e18 - rewardDebt1e18[user];
    }

    function _harvest(address user) internal {
        _accrue();
        uint256 accumulated1e18 = (sharesOf[user] * accPointsPerShare1e18) / 1e18;
        uint256 debt = rewardDebt1e18[user];
        if (accumulated1e18 > debt) {
            uint256 earned = accumulated1e18 - debt;
            points[user] += earned;
            emit Claimed(user, earned);
        }
        rewardDebt1e18[user] = (sharesOf[user] * accPointsPerShare1e18) / 1e18;
    }

    /// @notice Called by the controller on deposit/withdraw.
    function setShares(address user, uint256 newShares) external onlyAuthorized {
        _harvest(user);

        uint256 prev = sharesOf[user];
        sharesOf[user] = newShares;

        if (newShares > prev) totalShares += (newShares - prev);
        else if (prev > newShares) totalShares -= (prev - newShares);

        rewardDebt1e18[user] = (newShares * accPointsPerShare1e18) / 1e18;

        emit SharesSet(user, newShares);
    }

    /// @notice Faucet hook: adds fixed bonus, never reverts.
    function onFaucetClaim(address user) external onlyFaucet returns (uint256 earned1e18, uint256 bonus1e18) {
        // accrue continuous points so the pending shown by UI is consistent
        earned1e18 = pendingEarned(user);
        if (earned1e18 > 0) {
            // realize pending into points
            _harvest(user);
        }

        if (bonusPointsPerClaim > 0) {
            bonus1e18 = bonusPointsPerClaim;
            points[user] += bonus1e18;
            emit FaucetClaimBonus(user, bonus1e18);
        }
    }

    /// @notice Optional manual update (for compatibility with existing UI/backends).
    function update(address user) external onlyAuthorized returns (uint256 earned1e18) {
        earned1e18 = pendingEarned(user);
        _harvest(user);
    }
}
