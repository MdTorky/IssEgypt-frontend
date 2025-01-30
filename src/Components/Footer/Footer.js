import "./Footer.css";
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import { faFacebook, faInstagram, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Icon } from "@iconify/react";

const Footer = ({ language, languageText }) => {


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
                    <a className="social-icon__link" href="https://www.instagram.com/issegypt/">
                        <Icon icon="jam:instagram" />
                    </a>
                </li>
                <li className="social-icon__item">
                    <a className="social-icon__link" href="https://www.facebook.com/Eg.UTM">
                        <Icon icon="mingcute:facebook-fill" />
                    </a>
                </li>
                <li className="social-icon__item">
                    <a className="social-icon__link" href="https://www.youtube.com/@issegypt">
                        <Icon icon="mingcute:youtube-fill" />

                    </a>
                </li>
                <li className="social-icon__item">
                    <a className="social-icon__link" href="https://www.linkedin.com/in/iss-egypt-utm-821447267/">
                        <Icon icon="mdi:linkedin" className="linkedIn" />

                    </a>
                </li>
                <li className="social-icon__item">
                    <a className="social-icon__link" href="https://linktr.ee/issegypt?utm_source=linktree_profile_share&ltsid=fd5e7ee8-41ba-4efa-bbc0-ac5f555b3edb">
                        <Icon icon="ph:linktree-logo" />

                    </a>
                </li>
            </div>
            <div className="menu">
                <li className="menu__item"><Link className="menu__link" to="/">{languageText.home}</Link></li>
                <li className="menu__item"><Link className="menu__link" to="/services">{languageText.services}</Link></li>
                <li className="menu__item"><Link className="menu__link" to="/gallery">{languageText.gallery}</Link></li>
                <li className="menu__item"><Link className="menu__link" to="/members">{languageText.members}</Link></li>
            </div>
            <Link to='./terms&Conditions' className="Terms"
            >{languageText.terms}</Link>
            <p className="Rights">{languageText.rights}</p>
            <button className="Inquires"
                onClick={() => window.open("https://wa.me/201554206775", '_blank')}
            >{languageText.inquiries}</button>

        </footer>
    );
}

export default Footer;