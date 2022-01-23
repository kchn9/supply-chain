import React, { defaultProps, ReactPropTypes, useState, useEffect } from "react";
import Item from "./Item/Item.jsx";

const ItemList = ({ items, setSelectedItemAddress }) => {

    if (!items) {
        return (null);
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Select item</th>
                        <th>Index</th>
                        <th>Item</th>
                        <th>Price [Wei]</th>
                        <th>Status</th>
                        <th>Address</th>
                    </tr>
                </thead>
                    <tbody>
                        {items.map(item => (
                            <Item key={item.index} item={item} setSelectedItemAddress={setSelectedItemAddress} />
                        ))}
                    </tbody>
            </table>
        </>
    )
}

export default ItemList;

ItemList.defaultProps = {
    // ...
}