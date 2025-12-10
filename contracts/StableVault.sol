// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

import "./ERC20.sol";

contract StableVault is ERC20 {
    IERC20 public immutable usdc;

    constructor(address _usdc) ERC20("sUSDC", "sUSDC", 18) {
        usdc = IERC20(_usdc);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "AMOUNT_ZERO");
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC_TRANSFER_FAIL");
        _mint(msg.sender, amount); // 1:1 sUSDC using internal mint
    }

    function withdraw(uint256 amount) external {
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
