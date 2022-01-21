import React, { defaultProps, useState } from "react";
import Item from "./Item/Item.jsx";

const ItemList = (props) => {
    const [items, setItems] = useState(null);
    const { web3 } = props;
    const fetchItems = async () => {
        // await - SUBSCRIBE EVENT LISTENER HERES
    }

    if (!items) {
        return (null);
    }

    return (
        <>
            {items.map(item => (<Item></Item>)) }
        </>
    )
}

export default ItemList;

ItemList.defaultProps = {
    // ...
}