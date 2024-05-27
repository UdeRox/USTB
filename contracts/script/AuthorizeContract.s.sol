// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import { Script, console } from "forge-std/Script.sol";
import { TBill } from "../src/TBill.sol";
import { AuthorizeContract } from "../src/AuthorizeContract.sol";

contract AuthorizeContractScript is Script {
    string constant alpacaMintSource = "./functions/sources/alpacaBalance.js";
    string constant alpacaRedeemSource = "./functions/sources/alpacaBalance.js";

    function setUp() public { }

    function run() external {
        // uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // vm.startBroadcast(deployerPrivateKey);
        vm.startBroadcast();

        // Deploy TBill contract
        TBill tBillContract = new TBill(msg.sender);

        // Deploy AuthorizeContract
        uint64 subId = 2820;
        bytes32 donId = "fun-ethereum-sepolia-1";
        string memory mintSource = vm.readFile(alpacaMintSource);
        address functionsRouter = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;
        AuthorizeContract authorizeContract =
            new AuthorizeContract(address(tBillContract), msg.sender, functionsRouter, subId, donId);
        authorizeContract.setMintSouceCode(mintSource);
        // authorizeContract.setBaseCurrency(0xc0EaC85C595318B68b1Ce30A3E3160A245344452);
        vm.stopBroadcast();
    }
}
