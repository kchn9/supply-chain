import React, { defaultProps, ReactPropTypes, useState, useEffect } from "react";
import Item from "./Item/Item.jsx";

const ItemList = ({items}) => {

    if (!items) {
        return (null);
    }

    return (
        <>
            <table style={{width: "100%"}}>
                <tr>
                    <th>Index</th>
                    <th>Item</th>
                    <th>Price [Wei]</th>
                    <th>Status</th>
                    <th>Address</th>
                </tr>
            {items.map(item => (
                <Item key={item.index} item={item} />
            ))}
            </table>
        </>
    )
}

export default ItemList;

ItemList.defaultProps = {
    // ...
}