// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract _ProxyArtifactsHolder is ProxyAdmin {
    constructor(address initialOwner) ProxyAdmin(initialOwner) {}
}

contract MyTransparentUpgradeableProxy is TransparentUpgradeableProxy {
    constructor(address _logic, address admin, bytes memory data)
        TransparentUpgradeableProxy(_logic, admin, data)
    {}
}
