// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

// --- Context.sol (OZ 5.0.1) ---
abstract contract Context { function _msgSender() internal view virtual returns (address) { return msg.sender; } function _msgData() internal view virtual returns (bytes calldata) { return msg.data; } }

// --- Ownable.sol (OZ 5.0.0, constructor(address)) ---
abstract contract Ownable is Context { address private _owner; error OwnableUnauthorizedAccount(address account); error OwnableInvalidOwner(address owner); event OwnershipTransferred(address indexed previousOwner, address indexed newOwner); constructor(address initialOwner){ if (initialOwner==address(0)) revert OwnableInvalidOwner(address(0)); _transferOwnership(initialOwner);} modifier onlyOwner(){ if (owner()!=_msgSender()) revert OwnableUnauthorizedAccount(_msgSender()); _; } function owner() public view virtual returns(address){ return _owner; } function renounceOwnership() public virtual onlyOwner { _transferOwnership(address(0)); } function transferOwnership(address newOwner) public virtual onlyOwner { if (newOwner==address(0)) revert OwnableInvalidOwner(address(0)); _transferOwnership(newOwner);} function _transferOwnership(address newOwner) internal virtual { address oldOwner=_owner; _owner=newOwner; emit OwnershipTransferred(oldOwner,newOwner);} }

// --- IERC1967.sol (OZ 5.4.0) ---
interface IERC1967 { event Upgraded(address indexed implementation); event AdminChanged(address previousAdmin, address newAdmin); event BeaconUpgraded(address indexed beacon); }

// --- IBeacon.sol (OZ 5.4.0) ---
interface IBeacon { function implementation() external view returns (address); }

// --- Errors.sol (OZ 5.1.0 minimal used) ---
library Errors { error InsufficientBalance(uint256 balance, uint256 needed); error FailedCall(); }

// --- Address.sol (OZ 5.4.0 minimal used) ---
library Address { function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) { (bool success, bytes memory returndata) = target.delegatecall(data); if (!success) { if (returndata.length > 0) { assembly ("memory-safe") { revert(add(returndata, 0x20), mload(returndata)) } } else { revert Errors.FailedCall(); } } return returndata; } }

// --- StorageSlot.sol (OZ 5.1.0 minimal used) ---
library StorageSlot { struct AddressSlot { address value; } function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) { assembly ("memory-safe") { r.slot := slot } } }

// --- Proxy.sol (OZ 5.0.0) ---
abstract contract Proxy { function _delegate(address implementation) internal virtual { assembly { calldatacopy(0,0,calldatasize()) let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0) returndatacopy(0,0,returndatasize()) switch result case 0 { revert(0, returndatasize()) } default { return(0, returndatasize()) } } } function _implementation() internal view virtual returns (address); function _fallback() internal virtual { _delegate(_implementation()); } fallback() external payable virtual { _fallback(); } receive() external payable virtual { _delegate(_implementation()); } }

// --- ERC1967Utils.sol (OZ 5.4.0) ---
library ERC1967Utils { bytes32 internal constant IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc; bytes32 internal constant ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103; function getImplementation() internal view returns (address) { return StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value; } function getAdmin() internal view returns (address) { return StorageSlot.getAddressSlot(ADMIN_SLOT).value; } function changeAdmin(address newAdmin) internal { address prev = getAdmin(); StorageSlot.getAddressSlot(ADMIN_SLOT).value = newAdmin; emit IERC1967.AdminChanged(prev, newAdmin); } function upgradeToAndCall(address newImplementation, bytes memory data) internal { StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value = newImplementation; emit IERC1967.Upgraded(newImplementation); if (data.length > 0) { Address.functionDelegateCall(newImplementation, data); } }
}

// --- ERC1967Proxy.sol (OZ 5.2.0) ---
contract ERC1967Proxy is Proxy { constructor(address implementation, bytes memory _data) payable { ERC1967Utils.upgradeToAndCall(implementation, _data); } function _implementation() internal view virtual override returns (address) { return ERC1967Utils.getImplementation(); } }

// --- ProxyAdmin.sol (OZ 5.2.0) ---
interface ITransparentUpgradeableProxy is IERC1967 { function upgradeToAndCall(address newImplementation, bytes calldata data) external payable; }
contract ProxyAdmin is Ownable { string public constant UPGRADE_INTERFACE_VERSION = "5.0.0"; constructor(address initialOwner) Ownable(initialOwner) {} function upgradeAndCall(ITransparentUpgradeableProxy proxy, address implementation, bytes memory data) public payable virtual onlyOwner { proxy.upgradeToAndCall{value: msg.value}(implementation, data); } }

// --- TransparentUpgradeableProxy.sol (OZ 5.2.0 immutable admin flavor) ---
contract TransparentUpgradeableProxy is ERC1967Proxy { address private immutable _admin; error ProxyDeniedAdminAccess(); constructor(address _logic, address initialOwner, bytes memory _data) payable ERC1967Proxy(_logic, _data) { _admin = address(new ProxyAdmin(initialOwner)); ERC1967Utils.changeAdmin(_proxyAdmin()); } function _proxyAdmin() internal view virtual returns (address) { return _admin; } function _fallback() internal virtual override { if (msg.sender == _proxyAdmin()) { if (msg.sig != ITransparentUpgradeableProxy.upgradeToAndCall.selector) { revert ProxyDeniedAdminAccess(); } else { _dispatchUpgradeToAndCall(); } } else { super._fallback(); } } function _dispatchUpgradeToAndCall() private { (address newImplementation, bytes memory data) = abi.decode(msg.data[4:], (address, bytes)); ERC1967Utils.upgradeToAndCall(newImplementation, data); } }

// --- Wrapper: ProxyArtifacts.sol ---
contract _ProxyArtifactsHolder is ProxyAdmin { constructor(address initialOwner) ProxyAdmin(initialOwner) {} }
contract MyTransparentUpgradeableProxy is TransparentUpgradeableProxy { constructor(address _logic, address admin, bytes memory data) TransparentUpgradeableProxy(_logic, admin, data) {} }
