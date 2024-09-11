import React from 'react';

const InputField = ({ label, type = "text", value, onChange, id }) => {
    return (
        <div className="input-field">
            <label htmlFor={id}>{label}:</label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                className="orderPostInput"
            />
        </div>
    );
}

export default InputField;
