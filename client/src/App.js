import React, { useState, useEffect } from "react";
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
      createInstanceOf(ItemContract, setItem);
    }
  }, [web3]);

  const handleSubmit = async () => {
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
      <form onSubmit={(e) => e.preventDefault()} style={{display: "flex", flexDirection: "column", width: '50%', position: 'relative', left: "50%", transform: 'translateX(-50%)'}}>
        <label htmlFor="cost">
          Cost in Wei:
          <input
            id="cost"
            type="text"
            value={itemCost}
            onChange={(e) => setItemCost(e.target.value)}
          >
          </input>
        </label>
        <label htmlFor="identifier">
          Item identifier:
          <input
            id="identifier"
            type="text"
            value={itemIdentifier}
            onChange={(e) => setItemIdentifier(e.target.value)}
          >
          </input>
        </label>
        <button type="submit" onClick={handleSubmit}>Create new item</button>
      </form>
    </div>
  );
}

export default App;
