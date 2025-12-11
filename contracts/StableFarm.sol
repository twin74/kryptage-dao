// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Minimal {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract StableFarm {
    IERC20Minimal public immutable usdc;
    address public owner;

    uint256 public apr1e18; // APR in 1e18 (e.g., 0.1e18 = 10%)

    struct DepositInfo {
        uint256 amount;
        uint256 lastAccrual;
        uint256 rewards;
    }
    mapping(address => DepositInfo) public deposits;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event APRUpdated(uint256 apr1e18);
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "NOT_OWNER"); _; }

    constructor(address _usdc, uint256 _apr1e18) {
        usdc = IERC20Minimal(_usdc);
        owner = msg.sender;
        // default APR to 30% if _apr1e18 is 0
        apr1e18 = _apr1e18 == 0 ? 0.30e18 : _apr1e18;
        emit OwnershipTransferred(address(0), msg.sender);
        emit APRUpdated(apr1e18);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_ADDRESS");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setAPR(uint256 _apr1e18) external onlyOwner {
        apr1e18 = _apr1e18;
        emit APRUpdated(_apr1e18);
    }

    function _accrue(address user) internal {
        DepositInfo storage d = deposits[user];
        if (d.amount == 0) { d.lastAccrual = block.timestamp; return; }
        uint256 dt = block.timestamp - d.lastAccrual;
        if (dt == 0) return;
        // rewards = amount * apr * dt / secondsPerYear
        uint256 rewards = d.amount * apr1e18 * dt / (365 days) / 1e18;
        d.rewards += rewards;
        d.lastAccrual = block.timestamp;
    }

    // Controller-compatible: stake USDC from caller (e.g., Controller)
    function stake(uint256 amount) external {
        require(amount > 0, "AMOUNT_ZERO");
        _accrue(msg.sender);
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC_TRANSFER_FAIL");
        deposits[msg.sender].amount += amount;
        emit Deposited(msg.sender, amount);
    }

    // Controller-compatible: unstake USDC back to caller
    function unstake(uint256 amount) external {
        DepositInfo storage d = deposits[msg.sender];
        require(amount > 0 && amount <= d.amount, "BAD_AMOUNT");
        _accrue(msg.sender);
        d.amount -= amount;
        require(usdc.transfer(msg.sender, amount), "USDC_TRANSFER_FAIL");
        emit Withdrawn(msg.sender, amount);
    }

    // Original user deposit (legacy)
    function deposit(uint256 amount) external {
        require(amount > 0, "AMOUNT_ZERO");
        _accrue(msg.sender);
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC_TRANSFER_FAIL");
        deposits[msg.sender].amount += amount;
        emit Deposited(msg.sender, amount);
    }

    // Original user withdraw (legacy)
    function withdraw(uint256 amount) external {
        DepositInfo storage d = deposits[msg.sender];
        require(amount > 0 && amount <= d.amount, "BAD_AMOUNT");
        _accrue(msg.sender);
        d.amount -= amount;
        require(usdc.transfer(msg.sender, amount), "USDC_TRANSFER_FAIL");
        emit Withdrawn(msg.sender, amount);
    }

    // Controller-compatible: global pending rewards (simple sum for caller)
    function pendingRewards() external view returns (uint256) {
        DepositInfo memory d = deposits[msg.sender];
        if (d.amount == 0) return d.rewards;
        uint256 dt = block.timestamp - d.lastAccrual;
        uint256 rewards = d.amount * apr1e18 * dt / (365 days) / 1e18;
        return d.rewards + rewards;
    }

    // Controller-compatible: compound (no-op for simple farm)
    function compound() external {
        // No-op in this mock farm; rewards accrue linearly
    }

    // Owner funding to pay rewards/fees
    function fundUSDC(uint256 amount) external onlyOwner {
        require(amount > 0, "AMOUNT_ZERO");
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC_TRANSFER_FAIL");
    }

    function defundUSDC(uint256 amount) external onlyOwner {
        require(amount > 0, "AMOUNT_ZERO");
        require(usdc.transfer(msg.sender, amount), "USDC_TRANSFER_FAIL");
    }
}
