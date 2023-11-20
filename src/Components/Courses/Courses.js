import "./Courses.css"
import { useEffect, useState } from 'react';
import courses from "../../data/courses.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faLink } from '@fortawesome/free-solid-svg-icons';

var programming = courses.Programming
var AI = courses.AI


const Courses = ({ language, languageData }) => {
    useEffect(() => {
    }, [language, languageData]);

    const languageText = languageData[language]


    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);

    const togglePopup = (bus) => {
        if (selectedBus && selectedBus.id === bus.id) {
            // If the same story is clicked again, close the popup
            setPopupVisible(false);
            setSelectedBus(null);
        } else {
            // Close the college popup if open
            setSelectedBus(bus);
            setPopupVisible(true);
        }
    };

    const closePopup = () => {
        setPopupVisible(false);
    };


    return (
        <div className="courses">
            <h1 className="title">{languageText.extraCourses}</h1>
            <h1 className="bus" id="bus"></h1>

            <div className="sectionBox">
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.programming}</h2>
                        <div className="cards">
                            {/* {error && <div>{error}</div>}
                            {pending && <div>Loading...</div>} */}
                            {programming.map((program) => (
                                // {
                                <div className="card" >
                                    <div className="img"><img src={program.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <div className="coursesTitle">
                                            {language == "ar" ? <p>{program.nameArabic} </p> : <p>{program.name} </p>}
                                            {language == "ar" ? <p className="creator">{program.creatorArabic}</p> : <p className="creator">{program.creator} </p>}

                                        </div>
                                        <button className="icon" onClick={() => window.open(program.link, "_blank")}>
                                            <span className="tooltip">{languageText.courseLink}</span>
                                            <span><FontAwesomeIcon icon={faLink} /></span>
                                        </button>
                                    </div>
                                </div>
                                // ))
                            ))}
                        </div>
                    </div>
                </div>
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.AI}</h2>
                        <div className="cards">
                            {/* {error && <div>{error}</div>}
                            {pending && <div>Loading...</div>} */}
                            {AI.map((ai) => (
                                // {
                                <div className="card" >
                                    <div className="img"><img src={ai.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <div className="coursesTitle">
                                            {language == "ar" ? <p>{ai.nameArabic} </p> : <p>{ai.name} </p>}
                                            {language == "ar" ? <p className="creator">{ai.creatorArabic}</p> : <p className="creator">{ai.creator} </p>}
                                        </div>

                                        <button className="icon" onClick={() => window.open(ai.link, "_blank")}>
                                            <span className="tooltip">{languageText.courseLink}</span>
                                            <span><FontAwesomeIcon icon={faLink} /></span>
                                        </button>
                                    </div>
                                </div>
                                // ))
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Courses;