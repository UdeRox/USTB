// contracts/TestToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor() ERC20("TestToken", "TST") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint 1,000,000 tokens to deployer for testing
    }
}