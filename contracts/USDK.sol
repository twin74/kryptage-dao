// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Upgradeable OpenZeppelin imports
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

/// @title USDK - Kryptage USD-pegged stablecoin (Upgradeable via Transparent Proxy)
/// @notice ERC20 upgradeable with roles for mint/burn/pause; 6 decimals (USDT-aligned)
contract USDK is Initializable, ERC20Upgradeable, AccessControlUpgradeable, PausableUpgradeable {
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Events for mint/burn with operator metadata
    event Minted(address indexed to, uint256 value, address indexed operator);
    event Burned(address indexed from, uint256 value, address indexed operator);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize proxy (instead of constructor)
    /// @param admin Address to receive DEFAULT_ADMIN_ROLE (and PAUSER_ROLE for convenience)
    function initialize(address admin) public initializer {
        require(admin != address(0), "ZERO_ADMIN");
        __ERC20_init("Kryptage USDK", "USDK");
        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    /// @notice Override decimals to 6 (USDT-aligned)
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    // -----------------------------
    // ERC20 exposed actions
    // -----------------------------
    function transfer(address to, uint256 value) public override whenNotPaused returns (bool) {
        return super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, value);
    }

    // -----------------------------
    // Mint/Burn API
    // -----------------------------
    /// @notice Mint USDK to `to`. Callable by MINTER_ROLE (e.g., Vaults/PoolManager/Treasury as configured).
    function mint(address to, uint256 value) external whenNotPaused onlyRole(MINTER_ROLE) {
        _mint(to, value);
        emit Minted(to, value, msg.sender);
    }

    /// @notice Holder self-burn. Useful for redemptions or user-initiated burns.
    function burn(uint256 value) external whenNotPaused {
        _burn(msg.sender, value);
        emit Burned(msg.sender, value, msg.sender);
    }

    /// @notice Authorized burn without allowance, callable by BURNER_ROLE (e.g. PoolManager during rebalancing).
    function burnFrom(address from, uint256 value) external whenNotPaused onlyRole(BURNER_ROLE) {
        _burn(from, value);
        emit Burned(from, value, msg.sender);
    }

    // -----------------------------
    // Pause controls
    // -----------------------------
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // -----------------------------
    // Storage gap for future upgrades
    // -----------------------------
    uint256[45] private __gap; // reserve storage slots (after OZ parents) for upgrade safety
}
