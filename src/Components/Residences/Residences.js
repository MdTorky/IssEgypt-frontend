import "./Residences.css"
import kollegesData from "../../data/kolleges.json"
import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';


const kolleges = kollegesData.on;
const kollegesOff = kollegesData.off;


const Button = ({ kollege, languageText }) => {

    return (
        <div className="icons">
            <button className="icon" onClick={() => { if (kollege && kollege.link) { window.open(kollege.link, "_blank") } else { alert(languageText.error) } }}>
                <span className="tooltip">{languageText.Website}</span>
                <span><Icon icon="mdi:web" /></span>
            </button>
            <button className="icon" onClick={() => { window.open(kollege.location, "_blank") }}>

                <span className="tooltip" >{languageText.Location}</span>
                <span><Icon icon="basil:location-solid" /></span>
            </button>
            <button className="icon" onClick={() => { window.open(kollege.phone, "_blank") }}>
                <span className="tooltip" >{languageText.Phone}</span>
                <span><Icon icon="iconamoon:phone-fill" /></span>
            </button>
            <button className="icon" onClick={() => { if (kollege && kollege.email) { window.open(kollege.email, "_blank") } else { alert(languageText.error2) } }}>

                <span className="tooltip" >{languageText.Email}</span>
                <span><Icon icon="material-symbols:alternate-email" /></span>
            </button>

        </div>

    )
}


const Residences = ({ languageText }) => {




    useEffect(() => {
        const peopleCards = document.querySelectorAll('.card');


        peopleCards.forEach((card, index) => {
            card.style.animationDelay = `${0.2 * index}s`;
        });
    }, []);

    return (
        <div className="section">
            <h1 className="title">{languageText.residence}</h1>
            <div className="sectionBox">
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.on}</h2>
                        <div className="cards">
                            {kolleges.map((kollege, index) => (
                                <div className="card" key={index}>
                                    <div className="img"><img src={kollege.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{kollege.name} <span>{kollege.female}</span></p>
                                        <Button kollege={kollege} languageText={languageText} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.off}</h2>
                        <div className="cards">
                            {kollegesOff.map((kollege, index) => (
                                <div className="card" key={index}>
                                    <div className="img"><img src={kollege.img} alt="" /></div>
                                    <div className="cardsBottomContent">
                                        <p>{kollege.name} <span>{kollege.female}</span></p>
                                        <Button kollege={kollege} languageText={languageText} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Residences;