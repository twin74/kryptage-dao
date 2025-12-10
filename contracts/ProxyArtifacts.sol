// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This file exists only to ensure Hardhat compiles and emits artifacts for
// OpenZeppelin TransparentUpgradeableProxy and ProxyAdmin, so we can deploy
// them from scripts via hre.artifacts.readArtifact.
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
