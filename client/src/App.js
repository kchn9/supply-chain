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

  const initializeWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      setWeb3(web3);
      console.log('web3 ready');
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    } catch (error) {
      console.error(error);
    }
  }

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

  useEffect(() => {
    (async () => {
      await initializeWeb3();
    })();
  }, [])

  useEffect(() => {
    if (web3) {
      createInstanceOf(ItemManagerContract, setItemManager);
      createInstanceOf(ItemContract, setItem);
    }
  }, [web3]);

  return (
    <div className="App">
      <h1>Supply-chain smart contact client</h1>
      {web3 ? <p>Web3, accounts, contract connected</p>
        : <p>Loading Web3, accounts, and contract...</p>}
    </div>
  );
}

export default App;
