// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20.sol";

contract DeployTokens {
    function deployAndMint(address recipient) external returns (address[4] memory addrs) {
        ERC20 usdc = new ERC20("USDC", "USDC", 18);
        ERC20 wbtc = new ERC20("WBTC", "WBTC", 18);
        ERC20 xaut = new ERC20("XAUT", "XAUT", 18);
        ERC20 spyon = new ERC20("SPYON", "SPYON", 18);
        uint256 amount = 100_000 * 1e18;
        usdc.mint(recipient, amount);
        wbtc.mint(recipient, amount);
        xaut.mint(recipient, amount);
        spyon.mint(recipient, amount);
        addrs = [address(usdc), address(wbtc), address(xaut), address(spyon)];
    }
}
