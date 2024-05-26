// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import { Test, console } from "forge-std/Test.sol";
import "../src/TBill.sol";
import "../src/AuthorizeContract.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract TBillTest is Test {
    TBill private tBill;
    AuthorizeContract private authoritativeContract;
    address private owner;
    address private initialHolder;
    address private executor;
    address private functionsRouter;

    function setUp() public {
        owner = vm.addr(1);
        initialHolder = vm.addr(2);
        executor = vm.addr(3);
        vm.prank(executor);
        tBill = new TBill(owner);
        vm.prank(executor);
        authoritativeContract = new AuthorizeContract(address(tBill), owner, functionsRouter);
    }

    function test_PausedContract() public {
        vm.prank(owner);
        tBill.pause();
        vm.prank(owner);
        vm.expectRevert(bytes4(keccak256("EnforcedPause()")));
        tBill.mint(initialHolder, 1000);
    }

    function test_UnAuthorized() public {
        vm.prank(owner);
        tBill.pause();
        vm.prank(executor);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", executor));
        tBill.mint(initialHolder, 1000);
    }

    function testFuzz_UnPausedContract(uint256 x) public {
        vm.prank(owner);
        tBill.pause();
        vm.prank(owner);
        tBill.unpause();
        vm.prank(owner);
        tBill.mint(initialHolder, 1000);
    }
}
