import { Stack, Button } from "@mui/material/";
import React from "react";
import Field from "./Field/Field.jsx";

const AddItemForm = ({ handleItemCreationSubmit, setItemIdentifier, setItemCost, itemIdentifier, itemCost }) => {
    return (
        <form onSubmit={(e) => handleItemCreationSubmit(e)} >
            <Stack spacing={2} margin={2}>
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
            </Stack>

            <Button vartiant="outlined" type="submit">
                Create new item
            </Button>
        </form>
    )
}

export default AddItemForm;
