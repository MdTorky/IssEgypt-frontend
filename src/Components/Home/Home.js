// Home.js
import React, { useEffect, useState } from 'react';
import './Home.css';
import { useLanguage } from '../../language';
import Logo from './Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the Logo component
import { faArrowUp, faArrowDown, faXmark, faTree, faEnvelope, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin, faYoutube, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import images from '../../data/images.json';
import link from '../../data/upcomingEvents.json'
import people from "../../data/people.json";
import { PS } from 'country-flag-icons/react/3x2'


function Home({ language, languageData }) {
    const { toggleLanguage } = useLanguage();

    useEffect(() => {
        // Ensure that the languageData and language are updated when the language changes
        // You can use this hook to make sure the component updates when the language changes
    }, [language, languageData]);

    const root = document.documentElement; // Access the root element
    const themeColor = getComputedStyle(root).getPropertyValue('--theme');


    const languageText = languageData[language];
    const isRtl = language === 'ar';
    const [isExpanded, setIsExpanded] = useState(false);
    // Define an array of objects with logo and text data
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




    const [currentSlide, setCurrentSlide] = useState(0); // Use a single currentSlide state
    const [currentSlide2, setCurrentSlide2] = useState(0); // Use a single currentSlide state
    const [currentSlide3, setCurrentSlide3] = useState(0); // Use a single currentSlide state

    useEffect(() => {
        const slides = document.querySelectorAll(".slide");
        const slides2 = document.querySelectorAll(".slide2");
        const slides3 = document.querySelectorAll(".slide3");
        const btns = document.querySelectorAll(".btn");
        const btns2 = document.querySelectorAll(".btn2");
        const btns3 = document.querySelectorAll(".btn3");

        const manualNav = (manual) => {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                btns[index].classList.remove('active');
            });

            slides[manual].classList.add("active");
            btns[manual].classList.add("active");
        };

        const manualNav2 = (manual) => {
            slides2.forEach((slide, index) => {
                slide.classList.remove('active');
                btns2[index].classList.remove('active');
            });

            slides2[manual].classList.add("active");
            btns2[manual].classList.add("active");
        };

        const manualNav3 = (manual) => {
            slides3.forEach((slide, index) => {
                slide.classList.remove('active');
                btns3[index].classList.remove('active');
            });

            slides3[manual].classList.add("active");
            btns3[manual].classList.add("active");
        };

        btns.forEach((btn, i) => {
            btn.addEventListener("click", () => {
                setCurrentSlide(i); // Update the current slide
                manualNav(i);
            });
        });

        btns2.forEach((btn, i) => {
            btn.addEventListener("click", () => {
                setCurrentSlide2(i); // Update the current slide
                manualNav2(i);
            });
        });
        btns3.forEach((btn, i) => {
            btn.addEventListener("click", () => {
                setCurrentSlide3(i); // Update the current slide
                manualNav3(i);
            });
        });
    }, []);




    function UpcomingEvent({ upcomingEventImg, upcomingEventSubtitle, upcomingEventDescription, eventLink }) {
        return (<div className="blogItem">
            <img src={upcomingEventImg} alt="" />
            <div className="line">
                <p className="subtitle">{upcomingEventSubtitle}</p>
                {eventLink && <a target="_blank" href={eventLink}><button>{languageText.calender} <FontAwesomeIcon icon={faCalendarDays} /></button></a>
                }
            </div>
            <h2 className="description">{upcomingEventDescription}</h2>
        </div>
        )
    }




    function EventBoxTitle({ text, themeColor, isRtl }) {
        return (
            <h1>
                {isRtl ? (
                    <>
                        {text.split(' ').slice(0, -1).join(' ')}
                        <span style={{ color: themeColor }}>
                            {text.split(' ').pop()}
                        </span>
                    </>
                ) : (
                    <>
                        <span style={{ color: themeColor }}>
                            {text.split(' ')[0]}
                        </span>{' '}
                        {text.split(' ').slice(1).join(' ')}
                    </>
                )}
            </h1>
        );
    }




    // useEffect(()=>{

    // })




    return (
        <div className="home-container ">
            <div className="homeWrapper ">

                <p>{languageText.together}</p>
                <div className="words ">
                    <span>
                        {languageText.rise} <br />
                        {languageText.advance} <br />
                        {languageText.succeed} <br />
                        {languageText.rejoice} <br />
                    </span>
                </div>
                <div className=""></div>
            </div>

            <h1 className="nameTitle ">{languageText.IssPres}
                <div className="showMore" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <FontAwesomeIcon icon={faArrowUp} className='color' /> : <FontAwesomeIcon icon={faArrowDown} className='color2' />}
                </div>
            </h1>
            <div className={`homeItems ${isExpanded ? 'expanded' : ''}`}>
                {/* <div className="homeItems"> */}
                <div className="row">
                    {combinedPeople.map((person, index) => (
                        <div className={`rowCircle ${popupVisible && selectedItem && selectedItem.id === person.id
                            ? 'active' : ''}`}
                            onClick={() => { togglePopup(person) }}>
                            <img src={person.imgSrc} alt="" />
                            <Logo logoSrc={person.logoSrc} />
                            <p>{person.name}</p>
                            <span>{person.text}</span>
                        </div>
                    ))}
                </div>

            </div>

            <div className="homeBoxes">
                <h1 className="homeTitle">{languageText.achievements}</h1>
                <div className="blog">
                    <div className="blogContainer ">
                        <div className="blogImg">
                            <img src={images.achievementImg} alt="" />
                        </div>
                        <div className="blogText reveal">
                            <p className="subtitle">{languageText.blogSubtitle}</p>
                            <h2 className="title">{languageText.blogTitle1} <span className="color">{languageText.blogTitle2} </span>{languageText.blogTitle3}</h2>
                            <p className="description">{languageText.blogDescription}</p>
                        </div>
                    </div>
                    <div className="blogContainer2">
                        {/* <div className="blogItem">
                            <img src={images.upcomingEventImg1} alt="" />
                            <div className="line">
                                <p className="subtitle">{languageText.upcomingEventSubtitle1}</p>
                                <button>Add</button>
                            </div>
                            <h2 className="description">{languageText.upcomingEventDescription1}</h2>
                        </div> */}
                        <UpcomingEvent
                            upcomingEventImg={link.upcomingEventImg1}
                            upcomingEventSubtitle={languageText.upcomingEventSubtitle1}
                            upcomingEventDescription={languageText.upcomingEventDescription1}
                            eventLink={link.upcomingEventLink1}
                        />
                        <UpcomingEvent
                            upcomingEventImg={link.upcomingEventImg2}
                            upcomingEventSubtitle={languageText.upcomingEventSubtitle2}
                            upcomingEventDescription={languageText.upcomingEventDescription2}
                            eventLink={link.upcomingEventLink2}
                        />
                    </div>
                </div>
                <div className="events">

                    {/* Academic Events */}
                    <div className="eventBox reveal">
                        <EventBoxTitle text={languageText.AcademicEvents} themeColor={themeColor} isRtl={isRtl} />

                        <div className="eventBox">
                            <div className="slide active ">
                                <img src={images.academicImg1} alt="" />
                                <div className="info special">
                                    <h2>{languageText.AcademicEventTitle1}<span className="creator"> {languageText.AcademicEventCreator1}</span></h2>
                                    <p>{languageText.AcademicEventDescription1}</p>
                                </div>
                            </div>
                            <div className="slide">
                                <img src={images.academicImg2} alt="" />
                                <div className="info">
                                    <h2>{languageText.AcademicEventTitle2}<span className="creator"> {languageText.AcademicEventCreator2}</span></h2>
                                    <p>{languageText.AcademicEventDescription2}</p>

                                </div>
                            </div>
                            <div className="slide">
                                <img src={images.academicImg3} alt="" />
                                <div className="info special">
                                    <h2>{languageText.AcademicEventTitle3}<span className="creator"> {languageText.AcademicEventCreator3}</span></h2>
                                    <p>{languageText.AcademicEventDescription3}</p>

                                </div>
                            </div>
                            <div className="navigation">
                                <div className="btn active"></div>
                                <div className="btn"></div>
                                <div className="btn"></div>
                            </div>
                        </div>
                    </div>

                    {/* Social Events */}
                    <div className="eventBox reveal">

                        <EventBoxTitle text={languageText.SocialEvents} themeColor={themeColor} isRtl={isRtl} />

                        <div className="eventBox">
                            <div className="slide2 active">
                                <img src={images.socialImg1} alt="" />
                                <div className="info">
                                    <h2>{languageText.SocialEventTitle1}</h2>
                                    <p>{languageText.SocialEventDescription1}</p>
                                </div>
                            </div>
                            <div className="slide2">
                                <img src={images.socialImg2} alt="" />
                                <div className="info">
                                    <h2>{languageText.SocialEventTitle2}</h2>
                                    <p>{languageText.SocialEventDescription2}</p>

                                </div>
                            </div>
                            <div className="slide2">
                                <img src={images.socialImg3} alt="" />
                                <div className="info">
                                    <h2>{languageText.SocialEventTitle3}</h2>
                                    <p>{languageText.SocialEventDescription3}</p>

                                </div>
                            </div>
                            <div className="navigation">
                                <div className="btn2 active"></div>
                                <div className="btn2"></div>
                                <div className="btn2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Cultural Events */}
                    <div className="eventBox reveal">
                        <EventBoxTitle text={languageText.CultureEvents} themeColor={themeColor} isRtl={isRtl} />

                        <div className="eventBox">
                            <div className="slide3 active">
                                <img src={images.cultureImg1} alt="" />
                                <div className="info">
                                    <h2>{languageText.CultureEventTitle1}<span className="creator"> {languageText.CultureEventCreator1}</span></h2>
                                    <p>{languageText.CultureEventDescription1}</p>
                                </div>
                            </div>
                            <div className="slide3">
                                <img src={images.cultureImg2} alt="" />
                                <div className="info">
                                    <h2>{languageText.CultureEventTitle2}<span className="creator"> {languageText.CultureEventCreator2}</span></h2>
                                    <p>{languageText.CultureEventDescription2}</p>

                                </div>
                            </div>
                            <div className="slide3">
                                <img src={images.cultureImg3} alt="" />
                                <div className="info">
                                    <h2>{languageText.CultureEventTitle3}</h2>
                                    <p>{languageText.CultureEventDescription3}</p>
                                </div>
                            </div>
                            <div className="navigation ">
                                <div className="btn3 active"></div>
                                <div className="btn3"></div>
                                <div className="btn3"></div>
                            </div>
                        </div>
                    </div>
                </div>


                <h1 className="connectTitle ">{languageText.connect}</h1>
                <div className="connect">
                    <div className="socialBar">
                        <a href="https://www.facebook.com/Eg.UTM"><div className="socialCircle facebook"><FontAwesomeIcon icon={faFacebook} className="facebook" /></div></a>
                        <a href="https://www.instagram.com/issegypt/"><div className="socialCircle instagram"><FontAwesomeIcon icon={faInstagram} className="instagram" /></div></a>
                        <a href="https://www.youtube.com/@issegypt7345"><div className="socialCircle youtube"><FontAwesomeIcon icon={faYoutube} className="youtube" /></div></a>
                        <a href="https://www.linkedin.com/in/iss-egypt-utm-821447267/"><div className="socialCircle linkedIn"><FontAwesomeIcon icon={faLinkedin} className="linkedIn" /></div></a>
                        <a href="https://linktr.ee/issegypt?utm_source=linktree_profile_share&ltsid=fd5e7ee8-41ba-4efa-bbc0-ac5f555b3edb"><div className="socialCircle linktree"><FontAwesomeIcon icon={faTree} className="linktree" /></div></a>
                    </div>
                    <div className="emailUs">
                        <a href='mailto:issegypt0@gmail.com'>
                            <button className="button" type="button">
                                <span className="button__text">{languageText.email}</span>
                                <span className="button__icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                            </button>
                        </a>
                    </div>
                </div>
                {popupVisible && selectedItem && (
                    <div className={`popup ${popupVisible ? 'popup-opening' : 'popup-closing'}`}>
                        <div className="popup-content">

                            <div className="topPart">
                                <button className="icon" onClick={closePopup}>
                                    <span className="tooltip" >{languageText.close}</span>
                                    <span><FontAwesomeIcon icon={faXmark} /></span>
                                </button>

                            </div>

                            <div className="middlePart">
                                <>
                                    <img src={selectedItem.imgSrc} alt="" />
                                </>


                            </div>
                            <div className="bottomPart">
                                <div className="text">
                                    <h3>{selectedItem.name}</h3>
                                    <p>{selectedItem.text}</p>
                                </div>
                                {/* <hr /> */}
                                <div className="links">
                                    <button className="icon" onClick={() => window.open(selectedItem.no, "_blank")}>
                                        <span className="tooltip" >{languageText.Group}</span>
                                        <span><FontAwesomeIcon icon={faWhatsapp} /></span>
                                    </button>
                                    <button className="icon" onClick={() => window.open(selectedItem.linkedIn, "_blank")}>
                                        <span className="tooltip" >{languageText.linkedin}</span>
                                        <span><FontAwesomeIcon icon={faLinkedin} /></span>
                                    </button>
                                </div>
                            </div>


                        </div>

                    </div>
                )}
            </div>
        </div >
    );
}

export default Home;
