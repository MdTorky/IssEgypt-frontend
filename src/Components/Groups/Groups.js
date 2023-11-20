import "./Groups.css";
// import { useLanguage } from '../../language';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot, faBus, faXmark, faVanShuttle, faDownload, faFileLines
} from '@fortawesome/free-solid-svg-icons';
import { faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import groupsData from "../../data/groups.json"


var utm = groupsData.UTM;
var food = groupsData.Food;


const Groups = ({ language, languageData }) => {

    useEffect(() => {

    }, [language, languageData]);

    const languageText = languageData[language];




    const descriptions = {


        UTM: [
            {
                id: 1,
                name: "MPP",
                description: "hhh"
            },
        ],
        Food: [
            {
                id: 1,
                name: "Food1",
                description: "hhh"
            },
        ],

        // Apps: [
        //     {
        //         id: 1,
        //         name: languageText.grab,
        //         description: languageText.grabDesc
        //     },
        //     {
        //         id: 2,
        //         name: "Lugo",
        //         description: languageText.lugoDesc
        //     },
        //     {
        //         id: 3,
        //         name: "Kumpool",
        //         description: languageText.kumpoolDesc
        //     },
        //     {
        //         id: 4,
        //         name: "Red Bus",
        //         description: languageText.redBusDesc
        //     },
        // ]
    };

    const combinedDescriptionUtm = utm.map((item, index) => ({
        ...item,
        description: descriptions.UTM[index].description,
        name: descriptions.UTM[index].name,
    }));

    const combinedDescriptionFood = food.map((item, index) => ({
        ...item,
        description: descriptions.Food[index].description,
        name: descriptions.Food[index].name,
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
            const updatedItem = combinedDescriptionFood.find(combinedDescriptionFood => combinedDescriptionFood.id === selectedItem.id);
            if (updatedItem) {
                setSelectedItem(updatedItem);
            }
        }
    }, [language]);
    const Button = ({ item, languageText }) => {

        const [popupVisible, setPopupVisible] = useState(false);

        return (
            <div className="icons">

                {item && item.whatsLink && (
                    <button className="icon" onClick={() => { window.open(item.whatsLink, "_blank") }}>
                        <span className="tooltip" >{languageText.WhatsApp}</span>
                        <span><FontAwesomeIcon icon={faWhatsapp} /></span>
                    </button>
                )}
                {item && item.teleLink && (
                    <button className="icon" onClick={() => { window.open(item.teleLink, "_blank") }}>
                        <span className="tooltip" >{languageText.Telegram}</span>
                        <span><FontAwesomeIcon icon={faTelegram} /></span>
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





    return (<div className="groups">
        <h1 className="title">{languageText.groups}</h1>


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
                                    <Button item={utm} languageText={languageText} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="outerBox">
                <div className="innerBox">
                    <h2>ISS</h2>
                    <div className="cards">
                        {combinedDescriptionFood.map((food, index) => (
                            <div className="card" key={index}>
                                <div className="img"><img src={food.img} alt="" /></div>
                                <div className="cardsBottomContent">
                                    <p>{food.name} </p>
                                    <Button item={food} languageText={languageText} />
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

export default Groups;