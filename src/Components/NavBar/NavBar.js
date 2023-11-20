// NavBar.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBook } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useLocation } from 'react-router-dom';
import { useDarkMode } from '../../DarkModeContext'; // Import useDarkMode

const NavBar = ({ language, toggleLanguage, languageData }) => {
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useDarkMode(); // Get dark mode state and toggle function

    useEffect(() => {
        // Ensure that the languageData and language are updated when the language changes
    }, [language, toggleLanguage, languageData]);

    const languageText = languageData[language];
    const isRtl = language === 'ar';

    return (
        <div className={`navbar ${language === "ar" ? "arabic" : ""}`}>
            <ul>
                <li className={location.pathname === '/' ? 'active' : ''}>
                    <Link to="/">
                        <icon data-content={languageText.home}><FontAwesomeIcon icon={faHouse} /></icon>
                    </Link>
                </li>
                <li className={location.pathname === '/services' ? 'active' : ''}>
                    <Link to="/services">
                        <icon data-content={languageText.services}><FontAwesomeIcon icon={faBook} /></icon>
                    </Link>
                </li>
                {/* <li className={location.pathname === '/gallery' ? 'active' : ''}><a href="/gallery"><icon data-content={languageText.gallery}><FontAwesomeIcon icon={faImage} /></icon></a></li> */}
                <li onClick={toggleLanguage}>

                    <icon data-content={languageText.language}>
                        {language === "en" ? "EN" : "ع"}
                    </icon>

                </li>
                <li onClick={toggleDarkMode}>
                    <span className="theme__toggle-wrap">

                        <input
                            id="theme"
                            className="theme__toggle"
                            type="checkbox"
                            role="switch"
                            name="theme"
                            value="dark"
                            checked={darkMode} // Set the checked state based on darkMode
                            onChange={() => { }}
                        />

                        <span className="theme__fill"></span>
                    </span>
                </li>
            </ul>
        </div>
    );
}

export default NavBar;
