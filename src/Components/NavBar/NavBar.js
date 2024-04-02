// NavBar.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBook, faPerson, faUsers } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useLocation } from 'react-router-dom';
import { useDarkMode } from '../../context/DarkModeContext'; // Import useDarkMode
import { Icon } from '@iconify/react';
import { useLanguage } from '../../context/language';
import languageData from '../../language.json';



const NavBar = () => {
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useDarkMode(); // Get dark mode state and toggle function


    // useEffect(() => {
    // }, [language, toggleLanguage, languageData]);

    // const languageText = languageData[language];
    // const isRtl = language === 'ar';

    const { language, changeLanguage } = useLanguage();
    const { isRTL } = useLanguage();
    const languageText = languageData[language]

    const handleChangeLanguage = () => {
        const newLanguage = language === 'en' ? 'ar' : 'en';
        changeLanguage(newLanguage);
    };
    return (
        <div className={`navbar ${language === "ar" ? "arabic" : ""}`}>
            <ul>
                <li className={location.pathname === '/' ? 'active' : ''}>
                    <Link to="/">
                        {/* <icon data-content={languageText.home}><FontAwesomeIcon icon={faHouse} /></icon> */}
                        <div className="NavBarIcon" data-content={languageText.home}><Icon icon="gravity-ui:house" width="2rem" height="2rem" /></div>
                    </Link>
                </li>
                <li className={location.pathname === '/services' ? 'active' : ''}>
                    <Link to="/services">
                        {/* <icon data-content={languageText.services}><FontAwesomeIcon icon={faBook} /></icon> */}
                        <div className="NavBarIcon" data-content={languageText.services}><Icon icon="fa-solid:hands-helping" width="2rem" height="2rem" /></div>
                    </Link>
                </li>
                <li className={location.pathname === '/members' ? 'active' : ''}>
                    <Link to="/members">
                        {/* <icon data-content={languageText.members}><FontAwesomeIcon icon={faUsers} /></icon> */}
                        <div className="NavBarIcon" data-content={languageText.members}><Icon icon="heroicons:users-solid" width="2rem" height="2rem" /></div>
                    </Link>
                </li>
                {/* <li className={location.pathname === '/gallery' ? 'active' : ''}><a href="/gallery"><icon data-content={languageText.gallery}><FontAwesomeIcon icon={faImage} /></icon></a></li> */}
                <li onClick={handleChangeLanguage} className='language'>
                    <div className="NavBarIcon" data-content={languageText.language}>
                        {/* {language === "en" ? "EN" : "ع"} */}
                        {language === "en" ? <Icon icon="ri:english-input" width="2rem" height="2rem" /> : <Icon icon="mdi:abjad-arabic" width="2rem" height="2rem" />}
                    </div>

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
