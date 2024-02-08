import React, { useEffect } from 'react';
import circle from '../../images/404Circle.png'
import circle2 from '../../images/404Circle Dark.png'
import "./NotFound.css";
import { PS } from 'country-flag-icons/react/3x2'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the Logo component
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';



const UnderCons = ({ darkMode, language, languageData }) => {

    useEffect(() => {
    }, [language, languageData]);
    const languageText = languageData[language];
    return (
        <div className="underConst">
            <div className="BottomFound underConstBack">
                <h2 className="UnderConstruction">{languageText.underCon}</h2>
                {/* <p>{languageText.exists}</p> */}
                <div className="freePal">
                    <p>{languageText.Palestine}</p>
                    <PS className='flag' />
                </div>
                {/* <Link to="/" className='link'>{languageText.homePage}
                    {language === 'en' ? <FontAwesomeIcon icon={faArrowRight} /> : <FontAwesomeIcon icon={faArrowLeft} />}
                </Link> */}
                <Link to="/" class="HomeButton">
                    <p className="HomeButtonText">{languageText.homePage}</p>
                    <div class="HomeButtonIcon">
                        {language === 'en' ? <FontAwesomeIcon icon={faArrowRight} /> : <FontAwesomeIcon icon={faArrowLeft} />}
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default UnderCons;