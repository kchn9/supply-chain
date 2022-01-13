// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ItemManager {
    enum SupplyChainSteps {Created, Paid, Delivery } // to express state of order

    struct SupplyItem {
        ItemManager.SupplyChainSteps _step;
        string _identifier;
        uint _priceInWei;
    }
    mapping (uint => SupplyItem) public items;
    uint index;

    event SupplyChainStepChanged(uint _itemIndex, uint _step);

    /**
     * @dev Adds item to register
     * @param _identifier Name of item
     * @param _priceInWei Wei price of item
     */
    function createItem(string memory _identifier, uint _priceInWei) public {
        items[index]._step = SupplyChainSteps.Created;
        items[index]._identifier = _identifier;
        items[index]._priceInWei = _priceInWei;
        emit SupplyChainStepChanged(index, uint(items[index]._step));
        index++;
    }

    /**
     * @param _index Register index of item to trigger the payment
     */
    function triggerPayment(uint _index) public payable {
        require(items[_index]._priceInWei <= msg.value, "ItemManager: Partial payments not accepted.");
        require(items[_index]._step == SupplyChainSteps.Created, "ItemManager: Item is no longer available.");
        items[_index]._step = SupplyChainSteps.Paid;
        emit SupplyChainStepChanged(_index, uint(items[_index]._step));
    }

    /**
     * @param _index Register index of item to trigger the delivery
     */
    function triggerDelivery(uint _index) public payable {
        require(items[_index]._step == SupplyChainSteps.Paid, "ItemManager: Item is not paid yet.");
        items[_index]._step = SupplyChainSteps.Delivery;
        emit SupplyChainStepChanged(_index, uint(items[_index]._step));
    }
}