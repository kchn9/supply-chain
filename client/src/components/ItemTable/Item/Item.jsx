import React, { useEffect, useRef } from "react";
import { TableRow, TableCell } from "@mui/material";

const Item = ({ item, handleItemChange }) => {
    if (item) {
        return (
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }}} >
                <TableCell align="center">
                    <input onChange={(e) => handleItemChange(e)} type="radio" id={item.identifier} name="selectItem" value={item.address} />
                </TableCell>
                <TableCell align="center">{item.index}</TableCell>
                <TableCell align="center">{item.identifier}</TableCell>
                <TableCell align="center">{item.price}</TableCell>
                <TableCell align="center"><StepIcon step={item.step} /></TableCell>
                <TableCell align="center">{item.address}</TableCell>
            </TableRow>
        )
    } else {
        return (null);
    }
}

const StepIcon = ({ step }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let color;
        switch (step) {
            case '0':
                color = 'red'
                break;
            case '1':
                color = 'yellow'
                break;
            case '2':
                color = 'green'
                break;
            default:
                color = "purple"
                break;
        }
        context.fillStyle = color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    }, [step])

    return <canvas ref={canvasRef} width={16} height={16}></canvas>
}

export default Item;