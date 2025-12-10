// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}

contract KryptageFaucet {
    address public owner;

    // Allowed users (after email verification)
    mapping(address => bool) public allowed;
    // Last claim timestamp
    mapping(address => uint256) public lastClaim;

    // Fixed list of tokens and per-claim amounts
    address[] public tokens;
    mapping(address => uint256) public claimAmount; // token => amount per claim

    // Limits
    uint256 public cooldownSec;
    bool public paused;

    // Simple reentrancy guard
    bool private _locked;
    modifier nonReentrant() {
        require(!_locked, "Reentrancy");
        _locked = true;
        _;
        _locked = false;
    }

    event AllowedSet(address indexed user, bool allowed);
    event CooldownSet(uint256 cooldownSec);
    event ClaimAmountSet(address indexed token, uint256 amount);
    event PausedSet(bool paused);
    event Claimed(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier notPaused() {
        require(!paused, "Paused");
        _;
    }

    constructor(address _owner, address[] memory _tokens, uint256[] memory _amounts, uint256 _cooldownSec) {
        require(_owner != address(0), "owner=0");
        require(_tokens.length == _amounts.length && _tokens.length > 0, "bad tokens");
        owner = _owner;
        tokens = _tokens;
        // Validate tokens unique and amounts > 0
        for (uint256 i = 0; i < _tokens.length; i++) {
            require(_tokens[i] != address(0), "token=0");
            require(_amounts[i] > 0, "amount=0");
            // Prevent duplicates
            for (uint256 j = 0; j < i; j++) {
                require(_tokens[i] != _tokens[j], "duplicate token");
            }
            claimAmount[_tokens[i]] = _amounts[i];
        }
        require(_cooldownSec > 0, "cooldown=0");
        cooldownSec = _cooldownSec;
    }

    // Admin
    function setAllowed(address user, bool ok) external onlyOwner {
        require(user != address(0), "user=0");
        allowed[user] = ok;
        emit AllowedSet(user, ok);
    }

    function setCooldown(uint256 sec) external onlyOwner {
        require(sec > 0, "cooldown=0");
        cooldownSec = sec;
        emit CooldownSet(sec);
    }

    function setClaimAmount(address token, uint256 amount) external onlyOwner {
        require(token != address(0), "token=0");
        require(amount > 0, "amount=0");
        claimAmount[token] = amount;
        emit ClaimAmountSet(token, amount);
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PausedSet(_paused);
    }

    // Claim all configured tokens
    function claim() external notPaused nonReentrant {
        require(allowed[msg.sender], "Email not verified");
        uint256 last = lastClaim[msg.sender];
        require(block.timestamp >= last + cooldownSec, "Cooldown");

        // Effects first
        lastClaim[msg.sender] = block.timestamp;

        // Interactions
        for (uint256 i = 0; i < tokens.length; i++) {
            address t = tokens[i];
            uint256 amt = claimAmount[t];
            if (amt == 0) continue;
            require(IERC20(t).balanceOf(address(this)) >= amt, "Insufficient faucet balance");
            require(IERC20(t).transfer(msg.sender, amt), "Transfer failed");
        }
        emit Claimed(msg.sender);
    }

    // View
    function tokensCount() external view returns (uint256) {
        return tokens.length;
    }

    function remainingCooldown(address user) external view returns (uint256) {
        uint256 last = lastClaim[user];
        if (block.timestamp >= last + cooldownSec) return 0;
        return (last + cooldownSec) - block.timestamp;
    }

    // Owner rescue in case of misconfigurations
    function rescue(address token, address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "to=0");
        require(IERC20(token).transfer(to, amount), "Rescue failed");
    }
}
