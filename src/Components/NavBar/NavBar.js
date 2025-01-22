// NavBar.js

import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useLocation } from 'react-router-dom';
import { useDarkMode } from '../../context/DarkModeContext'; // Import useDarkMode
import { Icon } from '@iconify/react';
import { useLanguage } from '../../context/language';
import languageData from '../../language.json';
import { useAuthContext } from '../../hooks/useAuthContext';



const NavBar = () => {
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useDarkMode(); // Get dark mode state and toggle function
    const { user } = useAuthContext()


    const { language, changeLanguage } = useLanguage();
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
                <li className={location.pathname === '/gallery' ? 'active' : ''}>
                    <Link to="/gallery">
                        <div className="NavBarIcon" data-content={languageText.gallery}><Icon icon="solar:gallery-wide-bold" width="2rem" height="2rem" /></div>
                    </Link>
                </li>
                <li className={location.pathname === '/members' ? 'active' : ''}>
                    <Link to="/members">
                        {/* <icon data-content={languageText.members}><FontAwesomeIcon icon={faUsers} /></icon> */}
                        <div className="NavBarIcon" data-content={languageText.members}><Icon icon="heroicons:users-solid" width="2rem" height="2rem" /></div>
                    </Link>
                </li>
                {user && <li className={location.pathname === '/adminDashboard' ? 'active' : ''}>
                    <Link to="/adminDashboard">
                        <div className="NavBarIcon" data-content={languageText.admin}><Icon icon="eos-icons:admin" width="2rem" height="2rem" /></div>
                    </Link>
                </li>
                }
                <li onClick={handleChangeLanguage} className='language'>
                    <div className="NavBarIcon" data-content={languageText.language}>
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
