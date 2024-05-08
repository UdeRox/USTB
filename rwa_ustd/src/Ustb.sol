// SPDX-License-Identifier: MIT

pragma solidity 0.8.25;

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";

/**
 * @title Ustbc
 * @author Udeshika Perera
 */
contract Ustbc is ConfirmedOwner, FunctionsClient, Pausable {
    constructor(
        address functionsRouter
    ) ConfirmedOwner(msg.sender) FunctionsClient(functionsRouter) {}

    ///Send an http request
    /// 1. See how much bought or how much buy,
    /// 2. if enough have mind USTBC
    /// 2 Transactions in singel function
    function sendBuyRequest() external onlyOwner whenNotPaused {}

    function _mintFulfillRequest() internal {}

    /// @notice User sends request to sell
    /// Buy USDC on external broker protal
    /// Send USDC to this contract for the uer to withdraw
    function sendSellRequest() external {}

    function _setllFullFillRequest() internal {}

    // constructor(
    //     address newOwner
    // )
    //     override(ConfirmedOwner, FunctionsClient)
    //     ConfirmedOwnerWithProposal(newOwner, address(0))
    // {}

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal virtual override {}
}
