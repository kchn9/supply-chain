import React, { useState, useEffect, useCallback } from "react";
import ItemTable from "./components/ItemTable/ItemTable";
import AddItemForm from "./components/AddItemForm/AddItemForm";
import { Button, Grid, Typography, Stack } from "@mui/material/";

/**
 * Import web3 & contracts
 */
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from './contracts/Item.json';

import getWeb3 from "./getWeb3";

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
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.error(error)
      }
    }
    if (web3) fetchAccounts();
  }, [web3]) // init accounts

  const [currentAccount, setCurrentAccount] = useState('');
  useEffect(() => {
    if (web3) {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => setCurrentAccount(web3.utils.toChecksumAddress(accounts[0])))
      } else if (window.web3) {
        window.web3.currentProvider.on('accountsChanged', (accounts) => setCurrentAccount(web3.utils.toChecksumAddress(accounts[0])))
      } else {
        console.log('Fallback to localhost detected - subscription to account change is being ignored now.')
      }
    }
  }, [web3])

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

  const [owner, setOwner] = useState('0x00');
  useEffect(() => {
    const getOwner = async () => {
      const owner = await itemManager.methods.owner().call();
      setOwner(owner);
    }
    if (web3 && itemManager) getOwner();
  }, [web3, itemManager])

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
      console.error(error);
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
        console.error(error);
      }
    }
    if (web3 && selectedItemAddress) changeSelectedItem();
  }, [web3, selectedItemAddress]) // change Item contract on selection

  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  useEffect(() => {
    const getItemIndex = async () => {
      const index = await item.methods.index().call();
      setSelectedItemIndex(index);
    }
    if (item) getItemIndex();
  }, [item])

  const handleItemCreationSubmit = async (event) => {
    event.preventDefault();
    const from = currentAccount || accounts[0];
    try {
        await itemManager.methods.createItem(itemIdentifier, itemCost).send({ from: from });
    } catch (e) {
        console.error(e);
    }
  };

  const handleItemPayment = async () => {
    const from = currentAccount || accounts[0];
    try {
      const value = await item.methods.priceInWei().call();
      await web3.eth.sendTransaction({
        from: from,
        to: selectedItemAddress,
        value: value,
      })
    } catch (error) {
      console.error(error);
    }
    finally {
      fetchPreviousItems();
    }
  }

  const handleItemDelivery = async () => {
    const from = currentAccount || accounts[0];
    try {
      await itemManager.methods.triggerDelivery(selectedItemIndex).send({ from: from });
    } catch (error) {
      console.error(error);
    }
    finally {
      fetchPreviousItems();
    }
  }

  const handleItemChange = (event) => {
    setSelectedItemAddress(event.target.value)
  }

  return (
    <Grid
      container
      spacing={4}
      justifyContent="center"
    >
      <Grid item xs={12}>
        <Stack alignItems="center">
          <Typography variant="h1">Supply Chain Client</Typography>
        </Stack>
      </Grid>
      {
        web3
          ? (<Grid item xs={12}>
              <Stack alignItems="center">
                <Typography variant="subtitle1">Web3, accounts, contract connected</Typography>
              </Stack>
            </Grid>)
          : (<Grid item xs={12}> <Typography variant="subtitle1">Loading Web3, accounts, and contract... Please make sure your gateway is connected.</Typography> </Grid>)
      }
      {owner === currentAccount &&
      <Grid item xs={2}>
        <Typography variant="h4">Add item:</Typography>
        <AddItemForm
          handleItemCreationSubmit={handleItemCreationSubmit}
          setItemCost={setItemCost}
          itemCost={itemCost}
          setItemIdentifier={setItemIdentifier}
          itemIdentifier={itemIdentifier}
        />
      </Grid>
      }
      <Grid item xs={8}>
        <Typography variant="h4">Items:</Typography>
        <ItemTable
          items={items}
          handleItemChange={handleItemChange}
        />
      </Grid>
      {item &&
        <>
          <Grid item xs={4}>
            <Typography variant="h4">Item interaction:</Typography>
            <Button variant="contained" onClick={() => {handleItemPayment()}}>
              Pay
            </Button>
          {owner === currentAccount && <Button variant="contained" onClick={() => {handleItemDelivery()}}>Delivery</Button>}
          </Grid>
        </>
      }
    </Grid>
  );
}

export default App;
