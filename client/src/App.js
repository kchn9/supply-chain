import React, { useState, useEffect, useCallback } from "react";
import ItemTable from "./components/ItemTable/ItemTable";
import AddItemForm from "./components/AddItemForm/AddItemForm";
import { Button, Grid, Typography, Stack, Divider, Box, Container } from "@mui/material/";

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

  /*
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
  */

  const [currentAccount, setCurrentAccount] = useState('');
  useEffect(() => {
    if (web3) {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
          console.log(accounts);
          setCurrentAccount(web3.utils.toChecksumAddress(accounts[0]))
        })
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
      itemManager.events.ItemCreation().on("data", event => {
        setItems(prev => [...prev, {
          index: event.returnValues._itemIndex,
          identifier: event.returnValues._identifier,
          price: event.returnValues._price,
          step: event.returnValues._step,
          address: event.returnValues._itemAddress
        }]);
      })
      itemManager.events.ItemPaid().on("data", event => {
        console.log(`Item of ID: ${event.returnValues._itemIndex} at address ${event.returnValues._itemAddress} has been paid for.`)
      });
      itemManager.events.ItemDelivery().on("data", event => {
        console.log(`Item of ID: ${event.returnValues._itemIndex} at address ${event.returnValues._itemAddress} is being delivered now.`)
      });
    }
  }, [itemManager]); // subscribe for ItemCreation event - event trigger

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
    const from = currentAccount;
    try {
        await itemManager.methods.createItem(itemIdentifier, itemCost).send({ from: from });
    } catch (e) {
        console.error(e);
    }
  };

  const handleItemPayment = async () => {
    const from = currentAccount;
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
    const from = currentAccount;
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
      padding={"0 32px"}

    >
      <Grid item xs={12}>
        <Typography variant="h2" component="h1" paddingTop="48px" align="center">
          Supply Chain Client
        </Typography>
      </Grid>
      <Grid item xs={12}>
      {
      web3
        ? (
          currentAccount !== "" ? <Typography align="center" variant="subtitle1">Connected succefully</Typography> :
            <Typography align="center" variant="subtitle1">Web3 detected - make sure to connect your account</Typography> 
          )
        : (<Grid item xs={12}> <Typography align="center" variant="subtitle1">Loading Web3, accounts, and contract... Please make sure your gateway is connected.</Typography> </Grid>)
      }
      </Grid>
      <Grid item>
        <Stack boxShadow={"#5f5f5f50 12px 12px 54px"} padding={2}>
          <Stack direction={"row"} marginBottom={2}>
          {owner === currentAccount &&
            <Container>
              <Typography variant="h5" component={"h2"}>Add item:</Typography>
              <AddItemForm
                handleItemCreationSubmit={handleItemCreationSubmit}
                setItemCost={setItemCost}
                itemCost={itemCost}
                setItemIdentifier={setItemIdentifier}
                itemIdentifier={itemIdentifier}
              />
            </Container>
          }
          {item &&
            <Container>
              <Typography variant="h5" component={"h2"}>Item interaction:</Typography>
              <Stack spacing={4} height={"calc(100% - 64px)"} justifyContent={"center"}>
                <Button variant="contained" fullWidth onClick={() => {handleItemPayment()}}>
                  Pay
                </Button>
                {owner === currentAccount && <Button variant="contained" fullWidth onClick={() => {handleItemDelivery()}}>Delivery</Button>}
              </Stack>
            </Container>
          }
          </Stack>
        {items.length && <Divider variant="middle"/>}
          <Box >
            {items.length ? <Typography variant="h4" component={"h2"} align="center" marginTop={2} gutterBottom>Items:</Typography> : <Typography variant="body1" color={"gray"} marginBottom={2}>There is nothing to show.</Typography>}
            <ItemTable
              items={items}
              handleItemChange={handleItemChange}
            />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default App;
