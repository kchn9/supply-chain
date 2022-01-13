// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ItemManager.sol";



contract Item {
    ItemManager manager;
    uint public index;
    uint public priceInWei;

    constructor(ItemManager _manager, uint _index, uint _priceInWei) {
        manager = _manager;
        index = _index;
        priceInWei = _priceInWei;
    }

    receive() external payable {
        require(msg.value == priceInWei, "Item: Only exact values accepted.");
        (bool success, ) = address(manager).call{value: msg.value}
(abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success, "Item: Transaction failed.");
    }
}