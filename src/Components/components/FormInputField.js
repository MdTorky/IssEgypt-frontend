import React from 'react';
import { Icon } from '@iconify/react';

const InputField = ({ option, setOption, languageText, icon, type, required, option2 }) => {
    return (
        <div className="InputField">
            <div className="InputLabelField">
                <input
                    type={type}
                    className={`input ${(option) ? 'valid' : ''}`}
                    onChange={(e) => { setOption(e.target.value) }}
                    required={required}
                    id={option2}
                />
                {!option && <label htmlFor={option2} className={`LabelInput ${(option) ? 'valid' : ''}`}><Icon icon={icon} /> {languageText}</label>}
            </div>
        </div>
    );
}

export default InputField;
