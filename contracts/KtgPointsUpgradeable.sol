// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IERC20Minimal {
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}

/**
 * @title KtgPointsUpgradeable
 * @notice Upgradeable points accumulator based on user's portfolio balances.
 *
 * Points model (daily accrual):
 * - score = normalized(USDC balance) + normalized(USDK balance) + normalized(sUSDK balance)
 * - basePoints = score / divisor
 * - earned = basePoints * elapsed / 1 days
 * - points[user] += earned
 *
 * Update trigger:
 * - The Faucet calls update(user) when user claims (once per day via faucet cooldown).
 * - The Controller may optionally call update(user) on deposit/withdraw.
 */
contract KtgPointsUpgradeable {
    // --- storage (do not reorder) ---
    address public owner;

    address public controller; // optional caller
    address public faucet;     // optional caller

    IERC20Minimal public usdc;  // 18
    IERC20Minimal public usdk;  // 6
    IERC20Minimal public susdk; // 18

    uint256 public divisor; // score units -> points base (both scaled to 1e18)
    uint256 public minUpdateInterval; // e.g. 1 days

    // bonusPointsPerClaim is added to points on each faucet claim hook (1e18 decimals)
    uint256 public bonusPointsPerClaim;

    mapping(address => uint256) public points; // accumulated points (18 decimals)
    mapping(address => uint256) public lastUpdate; // timestamp

    bool private initialized;

    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event ControllerSet(address indexed controller);
    event FaucetSet(address indexed faucet);
    event ParamsSet(uint256 divisor, uint256 minUpdateInterval, uint256 bonusPointsPerClaim);
    event Updated(address indexed user, uint256 earned, uint256 newTotal, uint256 timestamp);
    event FaucetClaimBonus(address indexed user, uint256 bonus, uint256 newTotal, uint256 timestamp);

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

    function initialize(
        address _owner,
        address _usdc,
        address _usdk,
        address _susdk,
        uint256 _divisor,
        uint256 _minUpdateInterval
    ) external {
        require(!initialized, "ALREADY_INIT");
        require(_owner != address(0), "OWNER_0");
        require(_usdc != address(0) && _usdk != address(0) && _susdk != address(0), "TOKEN_0");
        require(_divisor > 0, "DIV_0");

        owner = _owner;
        usdc = IERC20Minimal(_usdc);
        usdk = IERC20Minimal(_usdk);
        susdk = IERC20Minimal(_susdk);

        divisor = _divisor;
        minUpdateInterval = _minUpdateInterval;
        bonusPointsPerClaim = 0;

        initialized = true;
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

    function setParams(uint256 _divisor, uint256 _minUpdateInterval, uint256 _bonusPointsPerClaim) external onlyOwner {
        require(_divisor > 0, "DIV_0");
        divisor = _divisor;
        minUpdateInterval = _minUpdateInterval;
        bonusPointsPerClaim = _bonusPointsPerClaim;
        emit ParamsSet(_divisor, _minUpdateInterval, _bonusPointsPerClaim);
    }

    function _normalizeTo1e18(uint256 amount, uint8 decimals) internal pure returns (uint256) {
        if (decimals == 18) return amount;
        if (decimals < 18) return amount * (10 ** (18 - decimals));
        return amount / (10 ** (decimals - 18));
    }

    function scoreOf(address user) public view returns (uint256 score1e18) {
        // IMPORTANT: normalize each token to 1e18 based on its own decimals
        uint256 usdcBal = usdc.balanceOf(user);
        uint256 usdkBal = usdk.balanceOf(user);
        uint256 susdkBal = susdk.balanceOf(user);

        score1e18 = _normalizeTo1e18(usdcBal, usdc.decimals())
            + _normalizeTo1e18(usdkBal, usdk.decimals())
            + _normalizeTo1e18(susdkBal, susdk.decimals());
    }

    function pendingEarned(address user) public view returns (uint256 earned1e18) {
        uint256 last = lastUpdate[user];
        if (last == 0) return 0;
        if (block.timestamp <= last) return 0;

        uint256 dt = block.timestamp - last;
        if (minUpdateInterval > 0 && dt < minUpdateInterval) return 0;

        // basePoints in 1e18 decimals
        uint256 basePoints = scoreOf(user) / divisor;
        // daily accrual
        earned1e18 = (basePoints * dt) / 1 days;
    }

    function update(address user) external onlyAuthorized returns (uint256 earned1e18) {
        uint256 last = lastUpdate[user];
        if (last == 0) {
            // first touch: set baseline, no mint
            lastUpdate[user] = block.timestamp;
            emit Updated(user, 0, points[user], block.timestamp);
            return 0;
        }

        uint256 dt = block.timestamp - last;
        if (minUpdateInterval > 0) {
            require(dt >= minUpdateInterval, "COOLDOWN");
        }

        uint256 basePoints = scoreOf(user) / divisor;
        earned1e18 = (basePoints * dt) / 1 days;

        points[user] += earned1e18;
        lastUpdate[user] = block.timestamp;

        emit Updated(user, earned1e18, points[user], block.timestamp);
    }

    /// @notice Called by the faucet per claim; adds a fixed bonus (e.g. 10 points) and optionally updates daily accrual.
    /// @dev IMPORTANT: never reverts due to cooldown, so faucet claim won't "silently skip" bonuses.
    function onFaucetClaim(address user) external onlyFaucet returns (uint256 earned1e18, uint256 bonus1e18) {
        uint256 last = lastUpdate[user];

        if (last == 0) {
            // first touch: set baseline so future accrual has a reference point
            lastUpdate[user] = block.timestamp;
        } else {
            uint256 dt = block.timestamp - last;

            // cooldown affects only the time-based accrual, not the bonus.
            // If cooldown not met yet, earned stays 0 and we do NOT revert.
            if (minUpdateInterval == 0 || dt >= minUpdateInterval) {
                uint256 basePoints = scoreOf(user) / divisor;
                earned1e18 = (basePoints * dt) / 1 days;
                points[user] += earned1e18;
                lastUpdate[user] = block.timestamp;
                emit Updated(user, earned1e18, points[user], block.timestamp);
            }
        }

        if (bonusPointsPerClaim > 0) {
            bonus1e18 = bonusPointsPerClaim;
            points[user] += bonus1e18;
            emit FaucetClaimBonus(user, bonus1e18, points[user], block.timestamp);
        }
    }

    uint256[44] private __gap;
}
