import React from "react";
import Item from "./Item/Item.jsx";
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";

const ItemList = ({ items, handleItemChange }) => {

    if (items.length === 0) {
        return (null);
    }

    return (
        <TableContainer >
            <Table sx={{ minWidth: 300 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Select item</TableCell>
                        <TableCell align="center">Index</TableCell>
                        <TableCell align="center">Item</TableCell>
                        <TableCell align="center">Price [Wei]</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Address</TableCell>
                    </TableRow>
                </TableHead>
                    <TableBody>
                        {items.map(item => (
                            <Item key={item.index} item={item} handleItemChange={handleItemChange} />
                        ))}
                    </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ItemList;

ItemList.defaultProps = {
    // ...
}