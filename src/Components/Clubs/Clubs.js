import "./Clubs.css";
import { useEffect, useState } from "react";
import clubsData from "../../data/clubs.json"
import { Icon } from '@iconify/react';
var selfImprovement = clubsData.selfImprovement;
var hobby = clubsData.hobby;
var academic = clubsData.academic;


const Clubs = ({ language, languageText }) => {


    const descriptions = {


        selfImprovement: [

            {
                id: 1,
                description: languageText.resalaDesc
            },
            {
                id: 2,
                description: languageText.aiesecDesc
            },
            {
                id: 2,
                description: languageText.tedDesc

            },
            {
                id: 3,
                description: languageText.toastDesc

            },

        ],
        hobby: [
            {
                id: 4,
                description: languageText.readingDesc,

            },
            {
                id: 5,
                description: languageText.photoDesc

            },
            {
                id: 6,
                description: languageText.esportsDesc

            },
        ],
        academic: [
            {
                id: 7,
                description: languageText.roboconDesc

            },
            {
                id: 8,
                description: languageText.airostDesc

            },
            {
                id: 9,
                description: languageText.googleDesc

            },
        ],


    };

    const combinedDescriptionSelf = selfImprovement.map((item, index) => ({
        ...item,
        description: descriptions.selfImprovement[index].description,
    }));

    const combinedDescriptionHobby = hobby.map((item, index) => ({
        ...item,
        description: descriptions.hobby[index].description,
    }));

    const combinedDescriptionAcademic = academic.map((item, index) => ({
        ...item,
        description: descriptions.academic[index].description,
    }));

    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const togglePopup = (bus) => {
        if (selectedItem && selectedItem.id === bus.id) {
            setPopupVisible(false);
            setSelectedItem(null);
        } else {
            setSelectedItem(bus);
            setPopupVisible(true);
        }
    };

    const closePopup = () => {
        setPopupVisible(false);
    };


    useEffect(() => {
        if (selectedItem && selectedItem.id) {
            const updatedItem = combinedDescriptionSelf.find(combinedDescriptionSelf => combinedDescriptionSelf.id === selectedItem.id);
            if (updatedItem) {
                setSelectedItem(updatedItem);
            }
        }
        if (selectedItem && selectedItem.id) {
            const updatedItem = combinedDescriptionHobby.find(combinedDescriptionHobby => combinedDescriptionHobby.id === selectedItem.id);
            if (updatedItem) {
                setSelectedItem(updatedItem);
            }
        }
        if (selectedItem && selectedItem.id) {
            const updatedItem = combinedDescriptionAcademic.find(combinedDescriptionAcademic => combinedDescriptionAcademic.id === selectedItem.id);
            if (updatedItem) {
                setSelectedItem(updatedItem);
            }
        }
    }, [language]);

    useEffect(() => {

    }, [language]);

    useEffect(() => {

    }, [language]);

    const Button = ({ item, languageText }) => {

        const [popupVisible, setPopupVisible] = useState(false);

        return (
            <div className="icons">

                {item && item.link && (
                    <button className="icon" onClick={() => { window.open(item.link, "_blank") }}>
                        <span className="tooltip" >{languageText.Website}</span>
                        <span><Icon icon="mdi:web" /></span>
                    </button>
                )}
                {item && item.description && (

                    <button className={`icon ${popupVisible && selectedItem && selectedItem.id === item.id
                        ? 'active' : ''}`}
                        onClick={() => { togglePopup(item) }}>
                        <span className="tooltip" >{languageText.Description}</span>
                        <span><Icon icon="material-symbols:description" /></span>
                    </button>
                )}
            </div >

        )
    }





    return (
        <div className="clubs">
            <h1 className="title">{languageText.clubs}</h1>
            <div className="sectionBox">
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.SelfImprovement}</h2>
                        <div className="cards">
                            {combinedDescriptionSelf.map((self, index) => (
                                <div className="card" key={index}>
                                    <div className="img"><img src={self.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{self.name} </p>
                                        <Button item={self} languageText={languageText} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.Hobby}</h2>
                        <div className="cards">
                            {combinedDescriptionHobby.map((hobby, index) => (
                                <div className="card" key={index}>
                                    <div className="img"><img src={hobby.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{hobby.name} </p>
                                        <Button item={hobby} languageText={languageText} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.AcademicTitle}</h2>
                        <div className="cards">
                            {combinedDescriptionAcademic.map((academic, index) => (
                                <div className="card" key={index}>
                                    <div className="img"><img src={academic.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{academic.name} </p>
                                        <Button item={academic} languageText={languageText} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                {popupVisible && selectedItem && (
                    <div className={`popup ${popupVisible ? 'popup-opening' : 'popup-closing'}`}>
                        <div className="popup-content">

                            <div className="bottom">
                                <>
                                    <div className="header">
                                        <div className="headerImg">
                                            <img src={selectedItem.img} alt="" />
                                            <div className="headerTitle">{selectedItem.name}</div>
                                        </div>

                                        <button className="icon" onClick={closePopup}>
                                            <span className="tooltip" >{languageText.close}</span>
                                            <span><Icon icon="icon-park-outline:close-one" /></span>
                                        </button>

                                    </div>
                                    <div className="bus new">{selectedItem.description}</div>
                                </>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Clubs;