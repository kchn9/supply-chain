import React from "react";
import Field from "./Field/Field.jsx";

const AddItemForm = ({ onSubmit, setItemIdentifier, setItemCost, itemIdentifier, itemCost }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit();
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)} style={{display: "flex", flexDirection: "column", width: '50%', position: 'relative', left: "50%", transform: 'translateX(-50%)'}}>
            <Field
                id='cost'
                type='text'
                labelText="Cost in Wei:"
                value={itemCost}
                setter={setItemCost}
                required
            />
            <Field
                id='identifier'
                type='text'
                labelText="Item identifier:"
                value={itemIdentifier}
                setter={setItemIdentifier}
                required
            />

            <button type="submit" onClick={(e) => handleSubmit(e)}>
                Create new item
            </button>
        </form>
    )
}

export default AddItemForm;
