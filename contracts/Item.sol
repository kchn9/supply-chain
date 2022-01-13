// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ItemManager.sol";

contract Item {
    ItemManager manager;
    string identifier;
    uint priceInWei;
    uint balance;

    constructor(ItemManager _manager, string memory _identifier, uint _priceInWei) {
        manager = _manager;
        identifier = _identifier;
        priceInWei = _priceInWei;
    }
}