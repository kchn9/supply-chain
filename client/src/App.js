import React, { useState, useEffect } from "react";
import ItemList from "./components/ItemList/ItemList";
import AddItemForm from "./components/AddItemForm/AddItemForm"

/**
 * Import web3 & contracts
 */
import ItemManagerContract from "./contracts/ItemManager.json";
// import ItemContract from './contracts/Item.json';
import getWeb3 from "./getWeb3";

// import SupplyChainSteps from "./constants/SupplyChainSteps";
import "./App.css";


const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);

  const [itemManager, setItemManager] = useState(null);

  const [itemCost, setItemCost] = useState('');
  const [itemIdentifier, setItemIdentifier] = useState('');

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
    const createInstanceOf = async (jsonContract, setter) => {
      try {
        const instance = new web3.eth.Contract(
          jsonContract.abi,
          jsonContract.networks[await web3.eth.net.getId()] && jsonContract.networks[await web3.eth.net.getId()].address,
        );
        setter(instance);
      } catch (error) {
        console.error(error);
      }
    }
    if (web3) {
      createInstanceOf(ItemManagerContract, setItemManager);
    }
  }, [web3]);

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
      {web3 ? <p>Web3, accounts, contract connected</p>
        : <p>Loading Web3, accounts, and contract...</p>}
      <h2>Items:</h2>
        <ItemList />
      <h3>Add item:</h3>
        <AddItemForm
          onSubmit={handleItemCreation}
          setItemCost={setItemCost}
          itemCost={itemCost}
          setItemIdentifier={setItemIdentifier}
          itemIdentifier={itemIdentifier}
        />
    </div>
  );
}

export default App;
