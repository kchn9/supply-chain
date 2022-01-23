import React, { useEffect, useRef } from "react";

/*
{
    index: event.returnValues._itemIndex,
    identifier: event.returnValues._identifier,
    price: event.returnValues._price,
    step: event.returnValues._step,
    address: event.returnValues._itemAddress
}
*/

const Item = ({ item, setSelectedItemAddress }) => {
    if (item) {
        return (
            <tr>
                <td>
                    <input onChange={(e) => setSelectedItemAddress(e.target.value)} type="radio" id={item.identifier} name="selectItem" value={item.address} />
                </td>
                <td>{item.index}</td>
                <td>{item.identifier}</td>
                <td>{item.price}</td>
                <td><StepIcon step={item.step} /></td>
                <td>{item.address}</td>
            </tr>
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