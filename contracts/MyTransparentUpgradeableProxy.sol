// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @notice Minimal TransparentUpgradeableProxy (EIP-1967) implementation.
 * @dev This is provided to avoid adding external dependencies.
 *      Admin can upgrade implementation; non-admin calls are delegated.
 */
contract MyTransparentUpgradeableProxy {
    // EIP-1967 slots
    bytes32 private constant _IMPLEMENTATION_SLOT = bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
    bytes32 private constant _ADMIN_SLOT = bytes32(uint256(keccak256("eip1967.proxy.admin")) - 1);

    event Upgraded(address indexed implementation);
    event AdminChanged(address previousAdmin, address newAdmin);

    constructor(address _logic, address admin_, bytes memory _data) payable {
        require(_logic != address(0), "LOGIC_0");
        require(admin_ != address(0), "ADMIN_0");
        _setAdmin(admin_);
        _upgradeTo(_logic);
        if (_data.length > 0) {
            (bool ok, bytes memory ret) = _logic.delegatecall(_data);
            require(ok, string(ret));
        }
    }

    modifier ifAdmin() {
        if (msg.sender == _admin()) {
            _;
        } else {
            _fallback();
        }
    }

    function admin() external ifAdmin returns (address) {
        return _admin();
    }

    function implementation() external ifAdmin returns (address) {
        return _implementation();
    }

    function changeAdmin(address newAdmin) external ifAdmin {
        require(newAdmin != address(0), "ADMIN_0");
        emit AdminChanged(_admin(), newAdmin);
        _setAdmin(newAdmin);
    }

    function upgradeTo(address newImplementation) external ifAdmin {
        _upgradeTo(newImplementation);
    }

    function upgradeToAndCall(address newImplementation, bytes calldata data) external payable ifAdmin {
        _upgradeTo(newImplementation);
        (bool ok, bytes memory ret) = newImplementation.delegatecall(data);
        require(ok, string(ret));
    }

    fallback() external payable {
        _fallback();
    }

    receive() external payable {
        _fallback();
    }

    function _admin() internal view returns (address adm) {
        bytes32 slot = _ADMIN_SLOT;
        assembly {
            adm := sload(slot)
        }
    }

    function _implementation() internal view returns (address impl) {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            impl := sload(slot)
        }
    }

    function _setAdmin(address newAdmin) internal {
        bytes32 slot = _ADMIN_SLOT;
        assembly {
            sstore(slot, newAdmin)
        }
    }

    function _upgradeTo(address newImplementation) internal {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            sstore(slot, newImplementation)
        }
        emit Upgraded(newImplementation);
    }

    function _fallback() internal {
        address impl = _implementation();
        require(impl != address(0), "IMPL_0");
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}
