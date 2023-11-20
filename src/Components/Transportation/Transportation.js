import "./Transportation.css";
// import { useLanguage } from '../../language';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot, faBus, faXmark, faVanShuttle, faDownload, faFileLines
} from '@fortawesome/free-solid-svg-icons';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';

import transportationData from "../../data/transportation.json"

var utm = transportationData.UTM;
var apps = transportationData.Apps;
// var attractions = attractionsData.attractions
// var mosques = attractionsData.mosques






const Transportation = ({ language, languageData }) => {
    useEffect(() => {
    }, [language, languageData]);

    const languageText = languageData[language];




    const descriptions = {
        UTM: [
            {
                id: 1,
                name: languageText.busSchedule,
                description: languageText.busUtm
            },
        ],
        Apps: [
            {
                id: 1,
                name: "InDrive",
                description: languageText.inDriveDesc
            },
            {
                id: 2,
                name: "Lugo",
                description: languageText.lugoDesc
            },
            {
                id: 3,
                name: "Kumpool",
                description: languageText.kumpoolDesc
            },
            {
                id: 4,
                name: "Red Bus",
                description: languageText.redBusDesc
            },
        ]
    };

    const combinedDescriptionUtm = utm.map((item, index) => ({
        ...item,
        description: descriptions.UTM[index].description,
        name: descriptions.UTM[index].name,
    }));

    const combinedDescriptionApps = apps.map((item, index) => ({
        ...item,
        description: descriptions.Apps[index].description,
        name: descriptions.Apps[index].name,
    }));


    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const togglePopup = (bus) => {
        if (selectedItem && selectedItem.id === bus.id) {
            // If the same story is clicked again, close the popup
            setPopupVisible(false);
            setSelectedItem(null);
        } else {
            // Close the college popup if open
            setSelectedItem(bus);
            setPopupVisible(true);
        }
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    useEffect(() => {
        if (selectedItem && selectedItem.id) {
            const updatedItem = combinedDescriptionUtm.find(combinedDescriptionUtm => combinedDescriptionUtm.id === selectedItem.id);
            if (updatedItem) {
                setSelectedItem(updatedItem);
            }
        }
    }, [language]);


    useEffect(() => {
        if (selectedItem && selectedItem.id) {
            const updatedItem = combinedDescriptionApps.find(combinedDescriptionApps => combinedDescriptionApps.id === selectedItem.id);
            if (updatedItem) {
                setSelectedItem(updatedItem);
            }
        }
    }, [language]);
    const Button = ({ item, languageText }) => {

        const [popupVisible, setPopupVisible] = useState(false);

        return (
            <div className="icons">

                {item && item.linkAndroid && (
                    <button className="icon" onClick={() => { window.open(item.linkAndroid, "_blank") }}>
                        <span className="tooltip" >{languageText.Android}</span>
                        <span><FontAwesomeIcon icon={faAndroid} /></span>
                    </button>
                )}
                {item && item.linkIOS && (
                    <button className="icon" onClick={() => { window.open(item.linkIOS, "_blank") }}>
                        <span className="tooltip" >{languageText.Apple}</span>
                        <span><FontAwesomeIcon icon={faApple} /></span>
                    </button>
                )}
                {item && item.link && (
                    <button className="icon" onClick={() => { window.open(item.link, "_blank") }}>
                        <span className="tooltip" >{languageText.Download}</span>
                        <span><FontAwesomeIcon icon={faDownload} /></span>
                    </button>
                )}
                {item && item.description && (

                    <button className={`icon ${popupVisible && selectedItem && selectedItem.id === item.id
                        ? 'active' : ''}`}
                        onClick={() => { togglePopup(item) }}>
                        <span className="tooltip" >{languageText.Description}</span>
                        <span><FontAwesomeIcon icon={faFileLines} /></span>
                    </button>
                )}
            </div >

        )
    }

    // function busRoute(item) {
    //     var busElement = document.getElementById("bus");
    //     busElement.innerHTML = "Bus: " + item;
    // }

    return (
        <div className="transportation">
            <h1 className="title">{languageText.transportation}</h1>


            <div className="sectionBox">
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>UTM</h2>
                        <div className="cards">
                            {combinedDescriptionUtm.map((utm, index) => (
                                <div className="card" key={index}>
                                    <div className="img"><img src={utm.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{utm.name} </p>
                                        <Button item={utm} languageText={languageText} popupVisible={popupVisible} setPopupVisible={setPopupVisible} index={index} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.apps}</h2>
                        <div className="cards">
                            {combinedDescriptionApps.map((utm, index) => (
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

                {popupVisible && selectedItem && (
                    <div className={`popup ${popupVisible ? 'popup-opening' : 'popup-closing'}`}>
                        <div className="popup-content">

                            {/* <div className="top">
                                <img src={selectedItem.busImg} alt="" />
                            </div> */}

                            <div className="bottom">
                                <>
                                    <div className="bus new">{selectedItem.description}</div>
                                    <button className="icon" onClick={closePopup}>
                                        <span className="tooltip" >{languageText.close}</span>
                                        <span><FontAwesomeIcon icon={faXmark} /></span>
                                    </button>
                                </>

                            </div>
                            {/* <div className="iconAnimation">
                                <div className="busIcon">
                                    <FontAwesomeIcon icon={faVanShuttle} />
                                </div>
                            </div> */}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Transportation;