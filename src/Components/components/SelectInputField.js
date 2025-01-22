import React, { useState } from 'react';

const SelectInputField = ({ selectInput = {}, value = [], onChange }) => {
    // Always call useState at the top level
    const [expanded, setExpanded] = useState(false);

    if (!selectInput) return null;

    const { label = '', options = [], isMultiSelect = false } = selectInput;

    if (!label || !options.length) return null;

    const handleCheckboxChange = (option) => {
        const updatedValues = value.includes(option)
            ? value.filter((val) => val !== option) // Remove if already selected
            : [...value, option]; // Add if not selected
        onChange(updatedValues);
    };

    const showCheckboxes = () => {
        setExpanded(!expanded);
    };

    const generateCheckbox = (options) => {
        return options.map((option, index) => (
            <div className="CategoryInput" key={index}>
                <input
                    type="checkbox"
                    id={`checkbox-${label}-${index}`}
                    value={option}
                    checked={value.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                />
                <label htmlFor={`checkbox-${label}-${index}`}>{option}</label>
            </div>
        ));
    };

    return (
        <div className="InputField">
            <div className="InputLabelField">
                {!isMultiSelect ? (
                    // Single-select dropdown
                    <select
                        className={`input ${value ? 'valid' : 'invalid'}`}
                        onChange={(e) => onChange(e.target.value)}
                        required
                        value={value || ''}
                        id={`select-${label}`}
                    >
                        <option value="" disabled>
                            {label}
                        </option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ) : (
                    // Multi-select dropdown with checkboxes
                    <div className="multiselect">
                        <div className="selectBox" onClick={showCheckboxes}>
                            <select>
                                <option>{label}</option>
                            </select>
                            <div className="overSelect"></div>
                        </div>
                        <div
                            id={`checkboxes-${label}`}
                            style={{
                                display: expanded ? 'flex' : 'none',
                            }}
                            className="CustomInputsContaner"

                        >
                            {generateCheckbox(options)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectInputField;
