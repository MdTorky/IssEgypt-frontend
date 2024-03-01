import React from 'react';
import './Loader.css'
import HorusToken from '../../images/HorusTokenGif.gif'
import HorusTokenDark from '../../images/HorusTokenGifBlack.gif'

const HorusLoader = ({ languageText, darkMode }) => {
    return (
        <div className="HorusLoader">
            {darkMode ? <img src={HorusTokenDark} alt="" /> : <img src={HorusToken} alt="" />}
            <div class="HorusText" data-loading={languageText}></div>

        </div>


    )
};

export default HorusLoader;