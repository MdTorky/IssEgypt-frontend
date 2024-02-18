import React from 'react';
import './Loader.css'
import LogoSvg from '../../images/LogoSvg.svg'
const LogoLoader = ({ language, languageData }) => {

    const languageText = languageData[language];

    return (
        language === 'en' ?
            <div class="spinner">

                <span>U</span>
                <span>P</span>
                <span>L</span>
                <span>O</span>
                <span>D</span>
                <span>I</span>
                <span>N</span>
                <span>G</span>
            </div>
            :
            <div class="spinner">

                <span>جار</span>
                <span>التحميل</span>
            </div>
    )
};

export default LogoLoader;