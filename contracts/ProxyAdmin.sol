// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

// Thin wrapper so Remix can compile/deploy ProxyAdmin easily
contract KryptageProxyAdmin is ProxyAdmin {
    constructor() ProxyAdmin(msg.sender) {}
}
