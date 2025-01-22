import { useEffect, useState } from 'react'
import "./BankAccount.css"
import { Icon } from '@iconify/react';

const BankAccount = ({ language, languageText }) => {



    const Popup = ({ onClose, text, condition, link, language }) => {
        const [popupLanguage, setPopupLanguage] = useState(language);

        useEffect(() => {
            setPopupLanguage(language);
        }, [language]);

        return (
            <div className="pop">
                <div className="popup-content">
                    <div className="buttons">
                        {condition && (
                            <button className="icon" onClick={() => window.open(link, "_blank")}>
                                <span className="tooltip">{languageText.Location}</span>
                                <span><Icon icon="basil:location-solid" /></span>
                            </button>
                        )}
                        <button className="icon" onClick={onClose}>
                            <span className="tooltip">{languageText.close}</span>
                            <span><Icon icon="icon-park-outline:close-one" /></span>
                        </button>
                    </div>

                    <p>{text}</p>
                </div>
            </div>
        );
    };




    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupText, setPopupText] = useState(null);
    const [popupCondition, setPopupCondition] = useState(false);
    const [popupLink, setPopupLink] = useState("")

    const openPopup = (popupText, condition, link) => {
        setIsPopupOpen(true);
        setPopupText(popupText);
        setPopupCondition(condition);
        setPopupLink(link);
        // Set the pop-up text based on the parameter
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };


    return (
        <div className="account">
            <h1 className="title">{languageText.bankAccount}</h1>
            <div className="sectionBox">
                <div className="outerOuterBox">
                    <div className="outerBox">
                        <div className="innerBox">
                            <h2>{languageText.guidelines}</h2>
                            <div className="steps">
                                <p>{languageText.rule1} <span>{languageText.rule11}</span> {languageText.rule111}</p>
                                <p>{languageText.rule2} <span>{languageText.rule22}</span> {languageText.rule222}</p>
                                <p>{languageText.rule3} <span>{languageText.rule33}</span> {languageText.rule333}</p>
                                <p>{languageText.rule4} <span>{languageText.rule44}</span> </p>
                            </div>
                        </div>
                    </div>
                    <div className="outerBox">
                        <div className="innerBox">
                            <h2>{languageText.completion}</h2>
                            <div className="steps">
                                <div className="button">
                                    <p>{languageText.rule5} <span>{languageText.rule55}</span></p>
                                    <div className="buttons">
                                        <button className="icon" onClick={() => window.open("https://maps.app.goo.gl/veVsE1kQTsyTA9dB7", "_blank")}>
                                            <span className="tooltip">{languageText.Location}</span>
                                            <span><Icon icon="basil:location-solid" /></span>
                                        </button>
                                    </div>
                                </div>
                                {/* <p>Once all documents are ready go to the Bank</p> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="outerBox">
                    <div className="innerBox">
                        <h2>{languageText.documents}</h2>
                        <div className="steps">
                            <p>{languageText.d1}</p>
                            <p>{languageText.d2}</p>
                            <div className="button">
                                <p>{languageText.d3}</p>
                                <div className="buttons">
                                    <button className="icon" onClick={() => openPopup(languageText.offerLetter, true, "https://maps.app.goo.gl/niiSUZm65jALPyRu5")}>
                                        <span className="tooltip">{languageText.Description}</span>
                                        <span><Icon icon="material-symbols:description" /></span>
                                    </button>
                                    <button className="icon" onClick={() => window.open("https://drive.google.com/file/d/1XqBMGLcpxaNh8S5BGC3gyxJypHejL7Bp/view?usp=drive_link", "_blank")}>
                                        <span className="tooltip">{languageText.Image}</span>
                                        <span><Icon icon="mynaui:image-solid" /></span>
                                    </button>
                                </div>
                            </div>
                            <div className="button">
                                <p>{languageText.d4}</p>
                                <div className='buttons'>
                                    <button className="icon" onClick={() => openPopup(languageText.confirmLetter, true, "https://maps.app.goo.gl/6RjyRNvt5ZK5ABor6")}>
                                        <span className="tooltip">{languageText.Description}</span>
                                        <span><Icon icon="material-symbols:description" /></span>
                                    </button>
                                    <button className="icon" onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSec5ZHcR2f0LmStwRsOspp8dx1nz0Uv8MPoRPlTR1pEaOkd7A/viewform", "_blank")}>
                                        <span className="tooltip">{languageText.Form}</span>
                                        <span><Icon icon="fluent:form-20-filled" /></span>
                                    </button>

                                </div>
                            </div>

                            <div className="button">
                                <p>{languageText.d5}</p>
                                <div className="buttons">
                                    <button className="icon" onClick={() => openPopup(languageText.verificationLetter, false)}>
                                        <span className="tooltip">{languageText.Description}</span>
                                        <span><Icon icon="material-symbols:description" /></span>
                                    </button>
                                    <button className="icon" onClick={() => window.open("https://academic.utm.my/UGStudent/Surat.aspx", "_blank")}>
                                        <span className="tooltip">{languageText.Website}</span>
                                        <span><Icon icon="mdi:web" /></span>
                                    </button>
                                </div>
                            </div>
                            <p>{languageText.d6}</p>
                            <p>{languageText.d7}</p>
                            <p>{languageText.d8}</p>
                        </div>
                    </div>
                </div>
                {isPopupOpen && <Popup
                    key={language}
                    onClose={closePopup}
                    text={popupText}
                    condition={popupCondition}
                    link={popupLink}
                    language={language}
                />
                }
            </div>
        </div >
    );
}

export default BankAccount;