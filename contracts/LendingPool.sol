// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Ex {
    function balanceOf(address) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IPriceOracle {
    function getPrice(address asset) external view returns (uint256 price1e18, uint256 updatedAt);
}

contract LendingPool {
    address public owner;
    IERC20Ex public immutable usdc;
    IPriceOracle public immutable oracle;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() { require(msg.sender == owner, "NOT_OWNER"); _; }

    constructor(address _usdc, address _oracle) {
        usdc = IERC20Ex(_usdc);
        oracle = IPriceOracle(_oracle);
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_ADDRESS");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    address[] public collaterals; // allowed collateral assets
    mapping(address => bool) public isCollateral;
    mapping(address => uint256) public ltv1e18; // asset LTV (e.g., 0.7e18)
    mapping(address => uint256) public liqThreshold1e18; // liquidation threshold (e.g., 0.85e18)
    mapping(address => uint256) public liqBonus1e18; // bonus for liquidator (e.g., 0.05e18)

    function addCollateralAsset(address asset, uint256 _ltv1e18, uint256 _liqTh1e18, uint256 _liqBonus1e18) external onlyOwner {
        require(!isCollateral[asset], "ALREADY_ADDED");
        isCollateral[asset] = true;
        collaterals.push(asset);
        ltv1e18[asset] = _ltv1e18;
        liqThreshold1e18[asset] = _liqTh1e18;
        liqBonus1e18[asset] = _liqBonus1e18;
    }

    struct UserState {
        uint256 debtUSDC; // principal + accrued
    }
    mapping(address => UserState) public users;
    mapping(address => mapping(address => uint256)) public collateralOf; // user => asset => amount

    uint256 public borrowAPR1e18 = 0.08e18; // 8% APR
    mapping(address => uint256) public lastAccrual; // user => last timestamp accrual

    function setBorrowAPR(uint256 apr1e18) external onlyOwner { borrowAPR1e18 = apr1e18; }

    function _accrue(address user) internal {
        uint256 last = lastAccrual[user];
        if (last == 0) { lastAccrual[user] = block.timestamp; return; }
        uint256 dt = block.timestamp - last;
        if (dt == 0) return;
        uint256 interest = users[user].debtUSDC * borrowAPR1e18 * dt / (365 days) / 1e18;
        users[user].debtUSDC += interest;
        lastAccrual[user] = block.timestamp;
    }

    function depositCollateral(address asset, uint256 amount) external {
        require(isCollateral[asset], "NOT_ALLOWED");
        require(amount > 0, "AMOUNT_ZERO");
        IERC20Ex token = IERC20Ex(asset);
        require(token.transferFrom(msg.sender, address(this), amount), "TRANSFER_FAIL");
        collateralOf[msg.sender][asset] += amount;
    }

    function _collateralValue(address user) public view returns (uint256 val1e18) {
        for (uint256 i = 0; i < collaterals.length; i++) {
            address asset = collaterals[i];
            uint256 amt = collateralOf[user][asset];
            if (amt == 0) continue;
            (uint256 price, ) = oracle.getPrice(asset);
            // assume 18-decimals assets; adjust if needed
            val1e18 += amt * price / 1e18;
        }
    }

    function maxBorrowable(address user) public view returns (uint256) {
        uint256 max1e18;
        for (uint256 i = 0; i < collaterals.length; i++) {
            address asset = collaterals[i];
            uint256 amt = collateralOf[user][asset];
            if (amt == 0) continue;
            (uint256 price, ) = oracle.getPrice(asset);
            uint256 ltv = ltv1e18[asset];
            max1e18 += amt * price / 1e18 * ltv / 1e18;
        }
        return max1e18;
    }

    function healthFactor(address user) public view returns (uint256 hf1e18) {
        uint256 th1e18;
        uint256 collVal = 0;
        for (uint256 i = 0; i < collaterals.length; i++) {
            address asset = collaterals[i];
            uint256 amt = collateralOf[user][asset];
            if (amt == 0) continue;
            (uint256 price, ) = oracle.getPrice(asset);
            uint256 th = liqThreshold1e18[asset];
            collVal += amt * price / 1e18 * th / 1e18;
        }
        if (users[user].debtUSDC == 0) return type(uint256).max;
        return collVal * 1e18 / users[user].debtUSDC;
    }

    function borrow(uint256 amountUSDC) external {
        _accrue(msg.sender);
        require(amountUSDC > 0, "AMOUNT_ZERO");
        uint256 maxB = maxBorrowable(msg.sender);
        require(users[msg.sender].debtUSDC + amountUSDC <= maxB, "EXCEEDS_LTV");
        users[msg.sender].debtUSDC += amountUSDC;
        lastAccrual[msg.sender] = block.timestamp;
        require(usdc.transfer(msg.sender, amountUSDC), "USDC_TRANSFER_FAIL");
    }

    function repay(uint256 amountUSDC) external {
        _accrue(msg.sender);
        require(amountUSDC > 0 && amountUSDC <= users[msg.sender].debtUSDC, "BAD_AMOUNT");
        require(usdc.transferFrom(msg.sender, address(this), amountUSDC), "USDC_TRANSFER_FAIL");
        users[msg.sender].debtUSDC -= amountUSDC;
    }

    function withdrawCollateral(address asset, uint256 amount) external {
        _accrue(msg.sender);
        require(amount > 0 && amount <= collateralOf[msg.sender][asset], "BAD_AMOUNT");
        // check HF after withdrawal
        collateralOf[msg.sender][asset] -= amount;
        require(healthFactor(msg.sender) >= 1e18, "HF_TOO_LOW");
        require(IERC20Ex(asset).transfer(msg.sender, amount), "TRANSFER_FAIL");
    }

    function liquidate(address user, uint256 repayUSDC, address collateralAsset) external {
        _accrue(user);
        require(healthFactor(user) < 1e18, "HF_OK");
        require(usdc.transferFrom(msg.sender, address(this), repayUSDC), "USDC_TRANSFER_FAIL");
        users[user].debtUSDC -= repayUSDC;
        // transfer collateral with bonus proportional to repay
        (uint256 price, ) = oracle.getPrice(collateralAsset);
        uint256 bonus = liqBonus1e18[collateralAsset];
        uint256 collToSeize = repayUSDC * 1e18 / price; // base
        collToSeize = collToSeize + (collToSeize * bonus / 1e18);
        require(collateralOf[user][collateralAsset] >= collToSeize, "INSUFFICIENT_COLLATERAL");
        collateralOf[user][collateralAsset] -= collToSeize;
        require(IERC20Ex(collateralAsset).transfer(msg.sender, collToSeize), "TRANSFER_FAIL");
    }

    // Admin funding USDC liquidity
    function fundUSDC(uint256 amount) external onlyOwner {
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC_TRANSFER_FAIL");
    }

    function defundUSDC(uint256 amount) external onlyOwner {
        require(usdc.transfer(msg.sender, amount), "USDC_TRANSFER_FAIL");
    }
}
