// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";

contract DeployMockUSDC is Script {
    function run() external {
        vm.startBroadcast();
        MockUSDC mockUSDC = new MockUSDC(); // Deploy with 1000 USDC initial supply
        vm.stopBroadcast();
    }
}
