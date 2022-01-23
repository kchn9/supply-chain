// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ItemManager } from  "./ItemManager.sol";

contract Item {
    ItemManager manager;
    uint index;
    uint public priceInWei;
    uint weiPaid;

    constructor(ItemManager _manager, uint _index, uint _priceInWei) {
        manager = _manager;
        index = _index;
        priceInWei = _priceInWei;
    }

    /**
     * @dev Calls trigger payment for item in manager.
     */
    receive() external payable {
        require(msg.value == priceInWei, "Item: Only exact values accepted.");
        weiPaid += msg.value;
        (bool success, ) = address(manager).call{value: msg.value}
            (abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success, "Item: Transaction failed.");
    }
}