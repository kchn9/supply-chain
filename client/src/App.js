import React, { useState, useEffect } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {
  const [web3State, setWeb3State] = useState({ web3: null, accounts: null, contract: null })
  const [storageValue, setStorageValue] = useState(0);

  const initializeWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ItemManagerContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ItemManagerContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      setWeb3State({ web3, accounts, contract: instance });
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    initializeWeb3();
  }, [])

  if (!web3State.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show
        a stored value of 5 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 42</strong> of App.js.
      </p>
      <div>The stored value is: {storageValue}</div>
    </div>
  );
}

export default App;
