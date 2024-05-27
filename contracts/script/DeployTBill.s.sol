// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Script.sol";
import "../src/TBill.sol";

contract DeployTBill is Script {
    function run() external {
        vm.startBroadcast();

        TBill tbill = new TBill(msg.sender);

        vm.stopBroadcast();
        console.log("TBill contract deployed at:", address(tbill));
    }
}