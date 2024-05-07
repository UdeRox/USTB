// SPDX-License-Identifier: MIT

pragma solidity 0.8.25;

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

/**
 * @title Ustbc
 * @author Udeshika Perera
 */
contract Ustbc is ConfirmedOwner {
    constructor() ConfirmedOwner(msg.sender) {}

    ///Send an http request
    /// 1. See how much bought or how much buy,
    /// 2. if enough have mind USTBC
    /// 2 Transactions in singel function
    function sendBuyRequest() external {}

    function _mintFulfillRequest() internal {}

    /// @notice User sends request to sell
    /// Buy USDC on external broker protal
    /// Send USDC to this contract for the uer to withdraw
    function sendSellRequest() external {}

    function _setllFullFillRequest() internal {}
}
