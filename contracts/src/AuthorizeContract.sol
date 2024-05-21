// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TBill.sol";

contract AuthorizeContract is Ownable {
    TBill private tBillContract;
    ERC20 USDC_Contract = ERC20(address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48));
    //todo time map

    constructor(address _tBillContract, address owner)
    Ownable(owner)
    {
        tBillContract = TBill(_tBillContract);
    }

    function AuthorizeMint(uint256 amount) external onlyOwner {
        // require() check the vault usd value
        tBillContract.mint(address(this), amount);
    }

    function buy(uint256 amount) external {
        // require() check the vault usd value
        require(amount % 1==0, "Invalid Amount");
        USDC_Contract.transferFrom(msg.sender, address(this), amount);
        tBillContract.transferFrom(msg.sender, address(this), amount);
    }

    function sell(uint256 amount) external {
        //
        require(amount % 1==0, "Invalid Amount");
        USDC_Contract.transfer(msg.sender,amount);
        tBillContract.transfer(msg.sender, amount);
    }
    function interest() public view returns(uint256) {
        //
        //check lock period and get interest with the chainlink functions
    return 5;
    }

}
