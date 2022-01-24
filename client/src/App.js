import React, { useState, useEffect, useCallback } from "react";
import ItemTable from "./components/ItemTable/ItemTable";
import AddItemForm from "./components/AddItemForm/AddItemForm"

/**
 * Import web3 & contracts
 */
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from './contracts/Item.json';

import getWeb3 from "./getWeb3";

import "./App.css";


const App = () => {
  const [itemCost, setItemCost] = useState('');
  const [itemIdentifier, setItemIdentifier] = useState('');

  const [web3, setWeb3] = useState(null);
  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const web3 = await getWeb3();
        setWeb3(web3);
      } catch (error) {
        console.error(error);
      }
    }
    initializeWeb3();
  }, []) // init web3

  const [accounts, setAccounts] = useState(null);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
      } catch (error) {
        console.error(error)
      }
    }
    if (web3) fetchAccounts();
  }, [web3]) // init accounts

  const [itemManager, setItemManager] = useState(null);
  useEffect(() => {
    const createItemManager = async () => {
      try {
        const instance = new web3.eth.Contract(
          ItemManagerContract.abi,
          ItemManagerContract.networks[await web3.eth.net.getId()] && ItemManagerContract.networks[await web3.eth.net.getId()].address,
        );
        setItemManager(instance);
      } catch (error) {
        console.error(error);
      }
    }
    if (web3) createItemManager();
  }, [web3]); // init main contract

  const [items, setItems] = useState([]);
  const fetchPreviousItems = useCallback(async () => {
    try {
      const index = await itemManager.methods.index().call();
      const prevItems = [];
      for (let i = 0; i < index; i++) {
        const item = await itemManager.methods.items(i).call();
        const itemInstance = new web3.eth.Contract(ItemContract.abi, item._item); // for fetching price
        prevItems.push({
          index: i,
          identifier: item._identifier,
          price: await itemInstance.methods.priceInWei().call(),
          step: item._step,
          address: item._item
        });
      }
      setItems(prevItems);
    } catch (error) {
      console.log(error);
    }
  }, [web3, itemManager])
  useEffect(() => {
    if (itemManager) fetchPreviousItems();
  }, [itemManager, fetchPreviousItems]) // fetch previous items
  useEffect(() => {
    if (itemManager) {
      itemManager.events.ItemCreation().on("data", (event) => {
        setItems(prev => [...prev, {
          index: event.returnValues._itemIndex,
          identifier: event.returnValues._identifier,
          price: event.returnValues._price,
          step: event.returnValues._step,
          address: event.returnValues._itemAddress
        }]);
      })
    }
  }, [itemManager]); // subscribe for ItemCreation event

  const [item, setItem] = useState(null);
  const [selectedItemAddress, setSelectedItemAddress] = useState(null);
  useEffect(() => {
    const changeSelectedItem = async () => {
      try {
        const instance = new web3.eth.Contract(
          ItemContract.abi,
          selectedItemAddress,
        )
        setItem(instance);
      } catch (error) {
        console.log(error);
      }
    }
    if (web3 && selectedItemAddress) changeSelectedItem();
  }, [web3, selectedItemAddress]) // change Item contract on selection


  const handleItemCreationSubmit = async (event) => {
    event.preventDefault();
    try {
        await itemManager.methods.createItem(itemIdentifier, itemCost).send({ from: accounts[0] });
    } catch (e) {
        console.error(e);
    }
  };

  const handleItemPayment = async () => {
    try {
      const value = await item.methods.priceInWei().call();
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: selectedItemAddress,
        value: value,
      })
      fetchPreviousItems();
    } catch (error) {
      console.error(error);
    }
  }

  const handleItemChange = (event) => {
    event.preventDefault();
    setSelectedItemAddress(event.target.value)
  }

  return (
    <div className="App">
      <h1>Supply Chain Client</h1>
      <h4>(with Event Trigger)</h4>
      {
        web3
          ? <p>Web3, accounts, contract connected</p>
          : <p>Loading Web3, accounts, and contract...</p>
      }
      <h3>Add item:</h3>
      <p>(ItemManager <strong>owner only</strong>)</p>
      <AddItemForm
        handleItemCreationSubmit={handleItemCreationSubmit}
        setItemCost={setItemCost}
        itemCost={itemCost}
        setItemIdentifier={setItemIdentifier}
        itemIdentifier={itemIdentifier}
      />
      <h2>Items:</h2>
      <ItemTable
        items={items}
        handleItemChange={handleItemChange}
      />
      {item &&  <button onClick={() => {handleItemPayment()}} >Pay</button>}
    </div>
  );
}

export default App;
