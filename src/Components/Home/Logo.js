// Logo.js
import React from 'react';

function Logo({ logoSrc }) {
    return (
        <div className="logo">
            <img src={logoSrc} alt="" />
        </div>
    );
}

export default Logo;
