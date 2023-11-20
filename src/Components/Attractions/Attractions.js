import "./Attractions.css";
// import { useLanguage } from '../../language';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot, faBus, faXmark, faVanShuttle
} from '@fortawesome/free-solid-svg-icons';
import attractionsData from "../../data/attractions.json"
import useFetch from '../../hooks/useFetch'

var groceries = attractionsData.groceries
var attractions = attractionsData.attractions
var mosques = attractionsData.mosques
var utm = attractionsData.utm

const Attractions = ({ language, languageData }) => {
    useEffect(() => {
    }, [language, languageData]);

    const languageText = languageData[language];


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


    const Button = ({ item, languageText }) => {

        const [popupVisible, setPopupVisible] = useState(false);

        return (
            <div className="icons">

                <button className="icon" onClick={() => { window.open(item.location, "_blank") }}>
                    <span class="tooltip" >{languageText.Location}</span>
                    <span><FontAwesomeIcon icon={faLocationDot} /></span>
                </button>
                {item && item.bus && (

                    <button className={`icon ${popupVisible && selectedBus && selectedBus.id === item.id
                        ? 'active' : ''}`}
                        onClick={() => {
                            if (item && item.bus) {
                                togglePopup(item)
                            }
                            else {
                                alert(languageText.error3 + " " + item.name)
                            }
                        }}>
                        <span class="tooltip" >{languageText.Bus}</span>
                        <span><FontAwesomeIcon icon={faBus} /></span>
                    </button>
                )}
            </div >

        )
    }


    useEffect(() => {
        // Calculate and set animation delay for each card
        const peopleCards = document.querySelectorAll('.card');


        peopleCards.forEach((card, index) => {
            card.style.animationDelay = `${0.2 * index}s`; // Adjust the delay as needed
        });
    }, []);


    // const { data: grocery, error, pending } = useFetch("http://localhost:8000/attractions");
    // const { data: mosque } = useFetch("http://localhost:8000/mosques");
    // const { data: utm } = useFetch("http://localhost:8000/utm");
    // const { data: attraction } = useFetch("http://localhost:8000/attractions");

    return (
        <div className="attraction">
            <h1 className="title">{languageText.attractions}</h1>
            <h1 className="bus" id="bus"></h1>

            <div className="sectionBox">
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.groceries}</h2>
                        <div className="cards">
                            {/* {error && <div>{error}</div>}
                            {pending && <div>Loading...</div>} */}
                            {groceries.map((grocery) => (
                                // {
                                <div className="card" >
                                    <div className="img"><img src={grocery.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{grocery.name} </p>
                                        <Button item={grocery} languageText={languageText} popupVisible={popupVisible} setPopupVisible={setPopupVisible} />
                                    </div>
                                </div>
                                // ))
                            ))}
                        </div>
                    </div>
                </div>
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.mosques}</h2>
                        <div className="cards">
                            {/* {error && <div>{error}</div>}
                            {pending && <div>Loading...</div>} */}
                            {mosques.map((mosque) => (
                                <div className="card">
                                    <div className="img"><img src={mosque.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{mosque.name} </p>
                                        <Button item={mosque} languageText={languageText} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.attraction}</h2>
                        <div className="cards">
                            {attractions.map((attraction, index) => (
                                <div className="card" key={index}>
                                    <div className="img"><img src={attraction.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{attraction.name} </p>
                                        <Button item={attraction} languageText={languageText} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>UTM</h2>
                        <div className="cards">
                            {utm.map((utm, index) => (
                                <div className="card" key={index}>
                                    <div className="img"><img src={utm.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{utm.name} </p>
                                        <Button item={utm} languageText={languageText} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {popupVisible && selectedBus && (
                    <div className={`popup ${popupVisible ? 'popup-opening' : 'popup-closing'}`}>
                        <div className="popup-content">

                            <div className="top">
                                <img src={selectedBus.busImg} alt="" />
                            </div>

                            <div className="bottom">
                                <>
                                    <div className="bus">{selectedBus.bus}</div>
                                    <button className="icon" onClick={closePopup}>
                                        <span className="tooltip" >{languageText.close}</span>
                                        <span><FontAwesomeIcon icon={faXmark} /></span>
                                    </button>
                                </>

                            </div>
                            <div className="iconAnimation">
                                <div className="busIcon">
                                    <FontAwesomeIcon icon={faVanShuttle} />
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Attractions;