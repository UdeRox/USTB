// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {OracleLib, AggregatorV3Interface} from "./libraries/OracleLib.sol";
import {FunctionsRequest} from "@chainlink/contracts/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {FunctionsClient} from "@chainlink/contracts/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import "./TBill.sol";

// contract AuthorizeContract is Ownable, FunctionsClient, Pausable {
contract AuthorizeContract is Ownable, Pausable {
    using FunctionsRequest for FunctionsRequest.Request;
    using OracleLib for AggregatorV3Interface;
    using Strings for uint256;

    TBill private tBillContract;
    ERC20 public baseCurrencyContract;
    uint256 private maxUSDSupply;

    enum MintOrRedeem {
        mint,
        redeem
    }

    struct TbillRequest {
        uint256 amountOfToken;
        address requester;
        MintOrRedeem mintOrRedeem;
    }

    uint32 private constant GAS_LIMIT = 300_000;
    uint64 immutable i_subId;
    mapping(bytes32 requestId => TbillRequest request)
        private s_requestIdToRequest;
    mapping(address depositUser => uint256) public s_depositUser;

    error TBill__NotEnoughCollateral();

    // Check to get the router address for your supported network
    // https://docs.chain.link/chainlink-functions/supported-networks
    address s_functionsRouter;
    string s_mintSource;
    // string s_redeemSource;

    bytes32 s_donID;
    uint256 s_portfolioBalance;
    uint64 s_secretVersion;
    uint8 s_secretSlot;

    constructor(
        address _tBillContract,
        address owner,
        address /**_functionsRouter**/,
        uint64 /**_subId**/,
        bytes32 /**_donId**/
    )
        // ) Ownable(owner) FunctionsClient(_functionsRouter) {
        Ownable(owner)
    {
        tBillContract = TBill(_tBillContract);
        // s_donID = _donId;
        // i_subId = _subId;
    }

    function setMintSouceCode(string memory _sourcCode) external onlyOwner {
        s_mintSource = _sourcCode;
    }

    function setBaseCurrency(
        address _baseCurrencyContractAddress
    ) external onlyOwner {
        //0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
        // USDC_Contract = ERC20(address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48));
        baseCurrencyContract = ERC20(address(_baseCurrencyContractAddress));
    }

    function AuthorizeMint(
        uint256 amountOfTokensToMint
    ) external onlyOwner whenNotPaused returns (bytes32 requestId) {
        //@notice This logic must implement
        // if (
        //     _getCollateralRatioAdjustedTotalBalance(amount) >
        //     s_portfolioBalance
        // ) {
        //     revert TBill__NotEnoughCollateral();
        // }
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(s_mintSource); // Initialize the request with JS code
        req.addDONHostedSecrets(s_secretSlot, s_secretVersion);

        // Send the request and store the request ID
        // requestId = _sendRequest(req.encodeCBOR(), i_subId, GAS_LIMIT, s_donID);
        s_requestIdToRequest[requestId] = TbillRequest(
            amountOfTokensToMint,
            msg.sender,
            MintOrRedeem.mint
        );
        return requestId;
    }

    function buy(uint256 amount) external {
        require(amount > 0, "Invalid Amount");
        // Check if the sender has enough allowance for the contract to transfer MockUSDC
        require(
            baseCurrencyContract.allowance(msg.sender, address(this)) >= amount,
            "Insufficient allowance"
        );

        // Transfer MockUSDC from the sender to the contract
        bool success = baseCurrencyContract.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "MockUSDC transfer failed");

        // Calculate 95% of the amount, assuming the token has 18 decimals
        uint256 mintAmount = (amount * 95) / 100;
        // Mint TBill tokens to the sender
        tBillContract.mint(msg.sender, mintAmount * 10 ** 12);
    }

    function setMaxUSDSupply(uint256 _amount) external onlyOwner {
        maxUSDSupply = _amount;
    }

    function getMaxUSDSupply() external view returns (uint256) {
        return maxUSDSupply;
    }

    function approveAllowance(uint256 amount) external {
        require(amount > 0, "Invalid amount");
        bool success = baseCurrencyContract.approve(address(this), amount);
        require(success, "Approval failed");
    }

    function sell(uint256 amount) external {
        //
        require(amount % 1 == 0, "Invalid Amount");
        baseCurrencyContract.transfer(msg.sender, amount);
        tBillContract.transfer(msg.sender, amount);
    }

    function interest() public view returns (uint256) {
        //
        //check lock period and get interest with the chainlink functions
        return 5;
    }

    // function fulfillRequest(
    //     bytes32 requestId,
    //     bytes memory response,
    //     bytes memory
    // )
    //     internal
    //     override
    //     /**
    //      * err*
    //      */
    //     whenNotPaused
    // {
    //     if (s_requestIdToRequest[requestId].mintOrRedeem == MintOrRedeem.mint) {
    //         s_portfolioBalance = uint256(bytes32(response));
    //         tBillContract.mint(
    //             s_requestIdToRequest[requestId].requester,
    //             s_requestIdToRequest[requestId].amountOfToken
    //         );
    //         // _mintFulFillRequest(requestId, response);
    //     } else {
    //         // _redeemFulFillRequest(requestId, response);
    //     }
    // }

    function getPortfolioBalance() public view returns (uint256) {
        return s_portfolioBalance;
    }
}

// Contract address for MockUSDC : 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
//
