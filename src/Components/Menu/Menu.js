import "./Menu.css"
import { useLanguage } from '../../language';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import people from "../../data/people.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faLinkedin } from '@fortawesome/free-brands-svg-icons';




const Menu = ({ language, languageData }) => {
    const { toggleLanguage } = useLanguage();
    const location = useLocation();

    useEffect(() => {
        // Ensure that the languageData and language are updated when the language changes
        // You can use this hook to make sure the component updates when the language changes
    }, [language, languageData]);

    const languageText = languageData[language];
    const isRtl = language === 'ar';


    const names = [
        {
            id: 1,
            text: languageText.President,
            name: languageText.PresidentName
        },
        {
            id: 2,
            text: languageText.VicePresident,
            name: languageText.VicePresidentName
        },
        {
            id: 3,
            text: languageText.Secretary,
            name: languageText.SecretaryName
        },
        {
            id: 4,
            text: languageText.Treasurer,
            name: languageText.TreasurerName
        },
        {
            id: 5,
            text: languageText.Academic,
            name: languageText.AcademicName

        },
        {
            id: 6,
            text: languageText.Social,
            name: languageText.SocialName
        },
        {
            id: 7,
            text: languageText.Culture,
            name: languageText.CultureName
        },
        {
            id: 8,
            text: languageText.Media,
            name: languageText.MediaName
        },
        {
            id: 9,
            text: languageText.Sport,
            name: languageText.SportName
        },
        {
            id: 10,
            text: languageText.HR,
            name: languageText.HRName
        },
        {
            id: 11,
            text: languageText.Logistics,
            name: languageText.LogisticsName
        },
        {
            id: 12,
            text: languageText.Women,
            name: languageText.WomenName
        },
        {
            id: 13,
            text: languageText.PublicRelation,
            name: languageText.PublicRelationName
        },


        // Add more objects as needed
    ];


    const combinedPeople = people.map((person, index) => ({
        ...person,
        text: names[index].text,
        name: names[index].name,
    }));


    useEffect(() => {
        // Calculate and set animation delay for each card
        const peopleCards = document.querySelectorAll('.peopleCard');

        peopleCards.forEach((card, index) => {
            card.style.animationDelay = `${0.1 * index}s`; // Adjust the delay as needed
        });
    }, []);

    // const hiddenPages = ["/services", "/gallery", "/residences", "/attractions", "/transportation", "/openAccount", "/groups", "/clubs"];

    const isMenuVisible = location.pathname === "/" && location.pathname !== "*";

    // const isNotServicesPage = location.pathname !== '/services';
    // const isNotGalleryPage = location.pathname !== '/gallery';
    // const isNotResidencesPage = location.pathname !== '/residences';
    // const isNotAttractionsPage = location.pathname !== '/attractions';
    // const isNotTransportationPage = location.pathname !== '/transportation';
    // const isNotAccountPage = location.pathname !== '/openAccount';
    // const isNotGroupsPage = location.pathname !== '/groups';
    // const isNotClubsPage = location.pathname !== '/clubs';
    // const isNotFoundPage = location.pathname !== '*';


    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const togglePopup = (person) => {
        if (selectedItem && selectedItem.id === person.id) {
            // If the same story is clicked again, close the popup
            setPopupVisible(false);
            setSelectedItem(null);
        } else {
            // Close the college popup if open
            setSelectedItem(person);
            setPopupVisible(true);
        }
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    useEffect(() => {
        if (selectedItem && selectedItem.id) {
            const updatedItem = combinedPeople.find(combinedPeople => combinedPeople.id === selectedItem.id);
            if (updatedItem) {
                setSelectedItem(updatedItem);
            }
        }
    }, [language]);

    return (
        <div className={`sideMenu 
        ${language === "ar" ? "arabic" : ""} 
        ${isMenuVisible ? "" : "hidden"
            }`}
        >

            <div className="liveBox">
                <div className="title">
                    <h1>{languageText.Egypt}</h1>
                    <h3>{languageText.IssPres2}</h3>
                </div>
                {combinedPeople.map((person, index) => (
                    <div className="people" key={index}>
                        <div className={`peopleCard ${popupVisible && selectedItem && selectedItem.id === person.id
                            ? 'active' : ''
                            } `}
                            onClick={() => { togglePopup(person) }}>
                            <div className="peopleImg">
                                <img src={person.imgSrc} alt="" />
                            </div>
                            <div className="peopleText">
                                <p className="name">{person.name}</p>
                                <p className="role">{person.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {popupVisible && selectedItem && (
                    <div className={`popup ${popupVisible ? 'popup-opening' : 'popup-closing'} `}>
                        <div className="popup-content">

                            <div className="topPart">
                                <button className="icon" onClick={closePopup}>
                                    <span className="tooltip" >{languageText.close}</span>
                                    <span><FontAwesomeIcon icon={faXmark} /></span>
                                </button>

                            </div>

                            <div className="middlePart">
                                <>
                                    <img src={selectedItem.imgSrc} />
                                </>


                            </div>
                            <div className="bottomPart">
                                <div className="text">
                                    <h3>{selectedItem.name}</h3>
                                    <p>{selectedItem.text}</p>
                                </div>
                                {/* <hr /> */}
                                <div className="links">
                                    {selectedItem.no &&
                                        <button className="icon" onClick={() => window.open(selectedItem.no, "_blank")}>
                                            <span className="tooltip" >{languageText.Group}</span>
                                            <span><FontAwesomeIcon icon={faWhatsapp} /></span>
                                        </button>
                                    }
                                    {selectedItem.linkedIn && <button className="icon" onClick={() => window.open(selectedItem.linkedIn, "_blank")}>
                                        <span className="tooltip" >{languageText.linkedin}</span>
                                        <span><FontAwesomeIcon icon={faLinkedin} /></span>
                                    </button>
                                    }
                                </div>
                            </div>


                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default Menu;