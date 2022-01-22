import React from "react";

/*
{
    index: event.returnValues._itemIndex,
    identifier: event.returnValues._identifier,
    price: event.returnValues._price,
    step: event.returnValues._step,
    address: event.returnValues._itemAddress
}
*/

const Item = ({ item }) => {
    if (item) {
        return (
            <tr>
                <td>{item.index}</td>
                <td>{item.identifier}</td>
                <td>{item.price}</td>
                <td>{item.step}</td>
                <td>{item.address}</td>
            </tr>
        )
    } else {
        return (null);
    }
}

export default Item;