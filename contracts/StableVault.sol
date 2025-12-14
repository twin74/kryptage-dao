// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IERC20Minimal {
    function balanceOf(address) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}

interface IUSDK {
    function mint(address to, uint256 amount) external;
    function burnFrom(address from, uint256 amount) external;
    function decimals() external view returns (uint8);
}

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @notice StableVault v2: share-based vault for USDK.
/// @dev Shares (sUSDK) represent a pro-rata claim on USDK balance held by this vault.
contract StableVault is Initializable, ERC20Upgradeable {
    IUSDK public usdk;

    bool private initialized;
    address public controller;
    address public owner;

    bool public paused;
    bool private reentrancyLock;

    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event ControllerChanged(address indexed oldController, address indexed newController);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    event Deposited(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);
    event Redeemed(address indexed caller, address indexed receiver, address indexed owner, uint256 shares, uint256 assets);

    modifier onlyController() {
        require(msg.sender == controller, "NOT_CONTROLLER");
        _;
    }

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

    function initialize(address _usdk) external initializer {
        require(_usdk != address(0), "BAD_USDK");
        __ERC20_init("sUSDK", "sUSDK");
        usdk = IUSDK(_usdk);
        initialized = true;
        controller = msg.sender;
        owner = msg.sender;
    }

    // -------- admin --------

    function setController(address _controller) external onlyController {
        require(_controller != address(0), "BAD_CONTROLLER");
        emit ControllerChanged(controller, _controller);
        controller = _controller;
    }

    function setOwner(address newOwner) external onlyController {
        require(newOwner != address(0), "BAD_OWNER");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    function pause() external onlyController {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyController {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // -------- ERC4626-like accounting --------

    /// @notice Total USDK assets held by the vault.
    function totalAssets() public view returns (uint256) {
        return IERC20Minimal(address(usdk)).balanceOf(address(this));
    }

    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = totalSupply();
        uint256 assetsBefore = totalAssets();
        if (supply == 0 || assetsBefore == 0) return assets;
        return (assets * supply) / assetsBefore;
    }

    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply();
        uint256 assetsNow = totalAssets();
        if (supply == 0 || assetsNow == 0) return shares;
        return (shares * assetsNow) / supply;
    }

    // -------- Controller entrypoints --------

    /// @notice Comptroller deposits `assets` USDK into the vault for `receiver`.
    /// @dev Assumes the USDK tokens are already in the vault (minted to vault by controller).
    function depositAssets(uint256 assets, address receiver) external onlyController whenNotPaused nonReentrant returns (uint256 shares) {
        require(initialized, "NOT_INIT");
        require(receiver != address(0), "BAD_RECEIVER");
        require(assets > 0, "AMOUNT_ZERO");

        shares = convertToShares(assets);
        require(shares > 0, "ZERO_SHARES");

        _mint(receiver, shares);
        emit Deposited(msg.sender, receiver, assets, shares);
    }

    /// @notice Redeem `shares` from `owner_`, sending USDK assets to `receiver`.
    /// @dev Only controller can burn shares and transfer USDK.
    function redeemShares(uint256 shares, address receiver, address owner_) external onlyController whenNotPaused nonReentrant returns (uint256 assets) {
        require(initialized, "NOT_INIT");
        require(receiver != address(0), "BAD_RECEIVER");
        require(owner_ != address(0), "BAD_OWNER");
        require(shares > 0, "AMOUNT_ZERO");

        assets = convertToAssets(shares);
        require(assets > 0, "ZERO_ASSETS");

        _burn(owner_, shares);
        require(IERC20Minimal(address(usdk)).transfer(receiver, assets), "USDK_TRANSFER_FAIL");
        emit Redeemed(msg.sender, receiver, owner_, shares, assets);
    }
}
