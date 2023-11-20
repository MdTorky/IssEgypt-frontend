import "./Footer.css";
import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLanguage } from '../../language';
import { Link } from "react-router-dom";
import { faTree } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';


const Footer = ({ language, languageData }) => {
    const { toggleLanguage } = useLanguage();

    useEffect(() => {
        // Ensure that the languageData and language are updated when the language changes
        // You can use this hook to make sure the component updates when language changes
    }, [language, languageData]);

    const languageText = languageData[language];
    const isRtl = language === 'ar';

    const footerClass = isRtl ? 'footer rtl' : 'footer';

    return (
        <footer className={footerClass}>
            <div className="waves">
                <div className="wave" id="wave1"></div>
                <div className="wave" id="wave2"></div>
                <div className="wave" id="wave3"></div>
                <div className="wave" id="wave4"></div>
            </div>
            <div className="social-icon">
                <li className="social-icon__item">
                    <a className="social-icon__link" href="https://www.facebook.com/Eg.UTM">
                        <FontAwesomeIcon icon={faFacebook} />
                        {/* <span>{languageText.facebook}</span> */}
                    </a>
                </li>
                <li className="social-icon__item">
                    <a className="social-icon__link" href="https://www.instagram.com/issegypt/">
                        <FontAwesomeIcon icon={faInstagram} />
                        {/* <span>{languageText.instagram}</span> */}
                    </a>
                </li>
                <li className="social-icon__item">
                    <a className="social-icon__link" href="https://www.youtube.com/@issegypt7345">
                        <FontAwesomeIcon icon={faYoutube} />
                        {/* <span>{languageText.youtube}</span> */}

                    </a>
                </li>
                <li className="social-icon__item">
                    <a className="social-icon__link" href="https://www.linkedin.com/in/iss-egypt-utm-821447267/">
                        <FontAwesomeIcon icon={faLinkedin} />
                        {/* <span>{languageText.linkedin}</span> */}

                    </a>
                </li>
                <li className="social-icon__item">
                    <a className="social-icon__link" href="https://linktr.ee/issegypt?utm_source=linktree_profile_share&ltsid=fd5e7ee8-41ba-4efa-bbc0-ac5f555b3edb">
                        <FontAwesomeIcon icon={faTree} />
                        {/* <span>{languageText.linktree}</span> */}

                    </a>
                </li>
            </div>
            <div className="menu">
                <li className="menu__item"><Link className="menu__link" to="/">{languageText.home}</Link></li>
                <li className="menu__item"><Link className="menu__link" to="/services">{languageText.services}</Link></li>
            </div>
            <p>{languageText.rights}</p>
        </footer>
    );
}

export default Footer;