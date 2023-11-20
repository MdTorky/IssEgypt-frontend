import React, { useEffect } from 'react';
import circle from '../../images/404Circle.png'
import circle2 from '../../images/404Circle Dark.png'
import "./NotFound.css";
import { PS } from 'country-flag-icons/react/3x2'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the Logo component
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';



const NotFound = ({ darkMode, language, languageData }) => {

    useEffect(() => {
    }, [language, languageData]);
    const languageText = languageData[language];
    return (
        <div className="notFound">
            <div className="TopFound">
                <h2>4</h2>
                {!darkMode ? <img src={circle} alt="" /> : <img src={circle2} alt="" />}
                <h2>4</h2>
            </div>
            <div className="BottomFound">
                <h2>{languageText.nothing}</h2>
                <p>{languageText.exists}</p>
                <div className="freePal">
                    <p>{languageText.Palestine}</p>
                    <PS className='flag' />
                </div>
                <Link to="/" className='link'>{languageText.homePage}
                    {language === 'en' ? <FontAwesomeIcon icon={faArrowRight} /> : <FontAwesomeIcon icon={faArrowLeft} />}
                </Link>
            </div>
        </div>
    );
}

export default NotFound;