import { TextField } from "@mui/material";
import React from "react";

const Field = ({ id, type, labelText, value, setter, required }) => {
    return (
        <TextField
            id={id}
            label={labelText}
            type={type}
            value={value}
            onChange={(e) => setter(e.target.value)}
            required={required}
        />
    )
}

export default Field;