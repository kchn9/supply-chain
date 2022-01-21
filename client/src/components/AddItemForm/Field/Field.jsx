import React from "react";

const Field = ({ id, type, labelText, value, setter, required }) => {
    return (
        <label htmlFor={id}>
        {labelText}
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required={required}
            >
            </input>
        </label>
    )
}

export default Field;