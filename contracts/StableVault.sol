// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

// Minimal USDK interface (proxy address will be used on-chain)
interface IUSDK {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function decimals() external view returns (uint8);
}

// Minimal StableFarm interface
interface IStableFarm {
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function pendingRewards() external view returns (uint256);
    function compound() external;
}

import "./ERC20.sol";

contract StableVault is ERC20 {
    IERC20 public usdc;
    IUSDK public usdk;
    IStableFarm public stableFarm;

    bool private initialized;
    address public controller; // authorized orchestrator

    // Security
    bool public paused;
    bool private reentrancyLock;

    event SharesMinted(address indexed to, uint256 amount);
    event SharesBurned(address indexed from, uint256 amount);
    event USDKDeposited(uint256 amount);
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event ControllerChanged(address indexed oldController, address indexed newController);

    // initializer per proxy (invece del costruttore)
    function initialize(address _usdc, address _usdk, address _farm) external {
        require(!initialized, "ALREADY_INITIALIZED");
        require(_usdc != address(0) && _usdk != address(0) && _farm != address(0), "BAD_ADDR");
        usdc = IERC20(_usdc);
        usdk = IUSDK(_usdk);
        stableFarm = IStableFarm(_farm);
        initialized = true;
        controller = msg.sender;
    }

    modifier onlyController() {
        require(msg.sender == controller, "NOT_CONTROLLER");
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

    function pause() external onlyController {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyController {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function setController(address _controller) external onlyController {
        require(_controller != address(0), "BAD_CONTROLLER");
        emit ControllerChanged(controller, _controller);
        controller = _controller;
    }

    // Controller API: deposit USDK into vault custody (USDK held by vault)
    function depositUSDK(uint256 amount) external onlyController whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        require(amount > 0, "AMOUNT_ZERO");
        emit USDKDeposited(amount);
    }

    // Controller API: mint/burn shares (sUSDK) to users
    function mintShares(address to, uint256 amount) external onlyController whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        require(to != address(0), "BAD_TO");
        require(amount > 0, "AMOUNT_ZERO");
        _mint(to, amount);
        emit SharesMinted(to, amount);
    }

    function burnShares(address from, uint256 amount) external onlyController whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        require(from != address(0), "BAD_FROM");
        require(amount > 0, "AMOUNT_ZERO");
        _burn(from, amount);
        emit SharesBurned(from, amount);
    }

    // Deposito USDC diretto (legacy): minta quote sUSDK 1:1 e invia USDC alla Farm
    function depositUSDC(uint256 amount) external whenNotPaused nonReentrant {
        require(initialized, "NOT_INIT");
        require(amount > 0, "AMOUNT_ZERO");
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC_TRANSFER_FAIL");
        require(usdc.approve(address(stableFarm), amount), "USDC_APPROVE_FAIL");
        stableFarm.stake(amount);
        _mint(msg.sender, amount);
        usdk.mint(address(this), amount);
        emit USDKDeposited(amount);
    }

    // Harvest (legacy single-user) non più mint su utente: lasciare alla logica controller globale
    function harvest(address /*user*/ ) external {
        require(initialized, "NOT_INIT");
        // Defer to controller for global harvest & pro-rata distribution
        revert("USE_CONTROLLER");
    }

    // Compound globale (legacy): deferito al controller
    function compoundGlobal() external {
        revert("USE_CONTROLLER");
    }

    // Prelievo diretto legacy in USDC: mantenuto per compatibilità ma non consigliato
    function withdraw(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "AMOUNT_ZERO");
        _burn(msg.sender, amount);
        require(usdc.transfer(msg.sender, amount), "USDC_TRANSFER_FAIL");
    }

    function _burn(address from, uint256 value) internal {
        require(balanceOf[from] >= value, "INSUFFICIENT_BALANCE");
        unchecked { balanceOf[from] -= value; }
        totalSupply -= value;
        emit Transfer(from, address(0), value);
    }
}
