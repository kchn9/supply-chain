import React from "react";
import Field from "./Field/Field.jsx";

const AddItemForm = ({ handleItemCreationSubmit, setItemIdentifier, setItemCost, itemIdentifier, itemCost }) => {
    return (
        <form onSubmit={(e) => handleItemCreationSubmit(e)} style={{display: "flex", flexDirection: "column", width: '50%', position: 'relative', left: "50%", transform: 'translateX(-50%)'}}>
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

            <button type="submit">
                Create new item
            </button>
        </form>
    )
}

export default AddItemForm;
