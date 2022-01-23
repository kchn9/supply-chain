import React, { useState, useEffect } from "react";
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
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);

  const [itemManager, setItemManager] = useState(null);
  const [item, setItem] = useState(null);

  const [itemCost, setItemCost] = useState('');
  const [itemIdentifier, setItemIdentifier] = useState('');

  const [items, setItems] = useState([]); // arr of item object
  const [selectedItemAddress, setSelectedItemAddress] = useState(null); // arr of item object

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const web3 = await getWeb3();
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
      } catch (error) {
        console.error(error);
      }
    }
    (async () => {
      await initializeWeb3();
    })();
  }, [])

  useEffect(() => {
    if (web3) {
      (async () => {
      try {
        const instance = new web3.eth.Contract(
          ItemManagerContract.abi,
          ItemManagerContract.networks[await web3.eth.net.getId()] && ItemManagerContract.networks[await web3.eth.net.getId()].address,
        );
        setItemManager(instance);
      } catch (error) {
        console.error(error);
      }})();
    }
  }, [web3]);

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
  }, [itemManager]);

  useEffect(() => {
    if (web3 && selectedItemAddress) {
      (() => {
        try {
          const instance = new web3.eth.Contract(
            ItemContract.abi,
            selectedItemAddress,
          )
          console.log(instance);
          setItem(instance);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [web3, selectedItemAddress])

  const handleItemCreation = async () => {
    try {
        await itemManager.methods.createItem(itemIdentifier, itemCost).send({ from: accounts[0] });
    } catch (e) {
        console.error(e);
    }
};

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
        onSubmit={handleItemCreation}
        setItemCost={setItemCost}
        itemCost={itemCost}
        setItemIdentifier={setItemIdentifier}
        itemIdentifier={itemIdentifier}
      />
      <h2>Items:</h2>
      <ItemTable
        items={items}
        setSelectedItemAddress={setSelectedItemAddress}
      />
    </div>
  );
}

export default App;
