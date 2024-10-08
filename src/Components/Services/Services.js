import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Services.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays, faXmark, faCircleInfo, faCarBattery, faFileLines, faBellSlash,
    faLaptopCode, faHelmetSafety, faGears, faFlaskVial, faBookBookmark, faEnvelope, faLocationDot, faInfoCircle,
    faBuilding, faMapLocationDot, faCarSide, faFilePdf, faCreditCard, faGraduationCap, faFutbol, faHouseChimney, faBriefcase, faUmbrellaBeach
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';

import images from "../../data/images.json";
import links from "../../data/upcomingEvents.json";
import faculties from "../../data/faculties.json";
import { useLanguage } from '../../context/language';
import { Icon } from '@iconify/react';
import HorusTokenDay from '../../images/HorusToken.svg'
import HorusTokenDark from '../../images/HorusTokenDark.svg'

// import announcements from "../../data/announcements.json";

const Services = ({ language, languageData, darkMode }) => {
    const { toggleLanguage } = useLanguage();
    // Get the current location
    const location = useLocation();

    useEffect(() => {
    }, [language, languageData]);

    useEffect(() => {
        if (selectedAnnouncement && selectedAnnouncement.id) {
            const updatedAnnouncement = announcements.find(announcement => announcement.id === selectedAnnouncement.id);
            if (updatedAnnouncement) {
                setSelectedAnnouncement(updatedAnnouncement);
            }
        }
    }, [language]);

    useEffect(() => {
        if (selectedFaculty && selectedFaculty.id) {
            const updatedFaculty = combinedFaculties.find(combinedFaculties => combinedFaculties.id === selectedFaculty.id);
            if (updatedFaculty) {
                setSelectedFaculty(updatedFaculty);
            }
        }
    }, [language]);
    const languageText = languageData[language];



    var AcademicImg = images.academicAnnouncement;
    var SocialImg = images.socialAnnouncement;
    var CultureImg = images.cultureAnnouncement;
    var ElectronImg = images.electionsAnnouncement;
    var OtherImg = images.otherAnnouncement;


    var Academic = languageText.academicAnnouncementOrganizer
    var Social = languageText.socialAnnouncementOrganizer
    var Culture = languageText.cultureAnnouncementOrganizer
    var Election = languageText.electionAnnouncementOrganizer
    var Other = languageText.otherAnnouncementOrganizer
    // 1. Add a new Id

    // 2. Add Icon based on the Announcement, choose from these
    //              a. AcademicImg (if academic announcement)
    //              b. SocialImg (if social announcement)
    //              c. CultureImg (if culture announcement)
    //              d. ElectionImg (if election announcement)
    //              d. OtherImg (if any other announcement)

    // 3. Add Event Image in the Background Image

    // 4. Add A TITLE in English and Arabic

    // 5. Add Organizer either
    //               a. Academic (if the academic committee is the organizer)
    //               b. Social (if the social committee is the organizer)
    //               c. Culture (if the culture committee is the organizer)
    //               d. Election (if the election committee is the organizer)
    //               e. Other (if the other committee is the organizer)

    // FOR 6, 7, and 8 IF THERE IS NO LINKS LEAVE IT BLANK

    // 6. Add the Form Link 

    // 7. Add Social media link

    // 8. Add the Calender Link

    const announcements = [
        // {
        //     id: 1,
        //     img: AcademicImg,
        //     backgroundImg: "https://drive.google.com/uc?export=view&id=1R0tcmB5r21wsVwEKlpcc-Jb9Mht3XrcA",
        //     title: "Math 1 Revision",
        //     titleArabic: "مراجعة Math 1",
        //     organizer: Academic,
        //     organizerArabic: Academic,
        //     form: 'https://math1revision.fillout.com/t/qiBP8y3KCnus',
        //     link: "",
        //     calendarLink: "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=M3V0ZWZkaHMzaGs1ZG43NGVmaHJjODA3cTEgNzkyN2Y2YmQwNTE0Y2M4ZjBkYWNhYjEzM2I2MWYyZWZkNjkyNjA2NmRhNGEzZGY5NjNjZTY1NTA5YTM2OTlmMkBn&tmsrc=7927f6bd0514cc8f0dacab133b61f2efd6926066da4a3df963ce65509a3699f2%40group.calendar.google.com"
        // },
        // {
        //     img: CultureImg,
        //     backgroundImg: "https://i.ibb.co/w6CjD9D/Ann2.jpg",
        //     title: "Stories of the Prophets",
        //     titleArabic: "قصص الأنبياء",
        //     organizer: Culture,
        //     organizerArabic: Culture,
        //     form: '',
        //     link: "https://chat.whatsapp.com/EUU9mUlO1fpLWjLofX50a8",
        //     calendarLink: ""
        // },

    ];





    const facultiesData = [
        {
            Icon: faCarBattery,
            Title: languageText.FKE,

        },
        {
            Icon: faLaptopCode,
            Title: languageText.FC,
        },
        {
            Icon: faHelmetSafety,
            Title: languageText.FKA,

        },
        {
            Icon: faGears,
            Title: languageText.FKM,

        },
        {
            Icon: faFlaskVial,
            Title: languageText.FKT,

        },
        {
            Icon: faBookBookmark,
            Title: languageText.Found,

        },
    ];


    const combinedFaculties = faculties.map((faculty, index) => ({
        ...faculty,
        Icon: facultiesData[index].Icon,
        Title: facultiesData[index].Title,
    }));




    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const togglePopup = (announcement) => {
        if (selectedAnnouncement && selectedAnnouncement.id === announcement.id) {
            // If the same story is clicked again, close the popup
            setPopupVisible(false);
            setSelectedAnnouncement(null);
        } else {
            // Close the college popup if open
            setPopupVisibleFaculty(false);
            setSelectedFaculty(null);

            setSelectedAnnouncement(announcement);
            setPopupVisible(true);
        }
    };

    const [popupVisibleFaculty, setPopupVisibleFaculty] = useState(false)
    const [selectedFaculty, setSelectedFaculty] = useState(null);

    const togglePopupFaculty = (faculty) => {
        if (selectedFaculty && selectedFaculty.id === faculty.id) {
            setPopupVisibleFaculty(false);
            setSelectedFaculty(null);
        } else {
            // Close the announcement popup if open
            setPopupVisible(false);
            setSelectedAnnouncement(null);

            setSelectedFaculty(faculty);
            setPopupVisibleFaculty(true);
        }
    };
    const closePopup = () => {
        setPopupVisible(false);
        setPopupVisibleFaculty(false);
    };













    useEffect(() => {
        const peopleCards = document.querySelectorAll('.college');

        peopleCards.forEach((card, index) => {
            card.style.animationDelay = `${0.2 * index}s`; // Adjust the delay as needed
        });
    }, []);


    useEffect(() => {
        const peopleCards = document.querySelectorAll('.newStudentCard');


        peopleCards.forEach((card, index) => {
            card.style.animationDelay = `${0.2 * index}s`;
        });
    }, []);


    // const { data: announcements, error, pending } = useFetch("http://localhost:8000/announcements");

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    };
    return (
        <div className="services">
            <div className="rightContainer">
                <div className="collegesBoxTitle">
                    <h2>{languageText.Drives}</h2>
                    <div className="collegesBox">
                        {combinedFaculties.map((faculty, index) => (
                            <div
                                className="college"
                                key={index}
                                onClick={() => { window.open(faculty.driveLink, '_blank') }}
                            >
                                <div className="img">
                                    <FontAwesomeIcon icon={faculty.Icon} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="annContainer">
                <div className="annContainer2">
                    {/* <div className="annStories">
                        <h2>{languageText.announcements}</h2>
                        <div className='annStories2'>
                            {!isEmpty(announcements) ? (announcements.map((announcement, index) => (

                                <div className={`box ${popupVisible && selectedAnnouncement && selectedAnnouncement.id === announcement.id
                                    ? 'active' : ''}`}
                                    key={index}
                                    onClick={() => togglePopup(announcement)}>
                                    <div className="announcement" >
                                        <img src={announcement.img} alt={announcement.title} />
                                    </div>
                                </div>
                            ))) :
                                (
                                    <div className='noAnn'>
                                        <FontAwesomeIcon icon={faBellSlash} beatFade />
                                        <h2 className="noAnnouncements">{languageText.noAnnouncement}</h2>

                                    </div>
                                )}
                        </div>
                    </div> */}
                    <div className="annStories">
                        <h2>{languageText.forms}</h2>
                        <div className='annStories2'>
                            <Link className="AnnStories2Button" to="/charity" data-text={languageText.courseTip}>
                                <Icon icon="mdi:charity" className="svgIcon" />
                            </Link>

                            {/* <Link className="AnnStories2Button" to="/addLecturer" data-text={languageText.AddLecturer} style={{ backgroundColor: "mediumseagreen" }}>
                                <Icon icon="mdi:lecturn" className="svgIcon" />
                            </Link> */}

                        </div>

                    </div>


                    {popupVisible && selectedAnnouncement && (
                        <div className={`services popup ${popupVisible ? 'popup-opening' : 'popup-closing'}`} style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0,
                0.5), rgba(0, 0, 0, 0.5)), url(${selectedAnnouncement.backgroundImg})`
                        }}>
                            <div className="popup-content">
                                <div className="topContent">
                                    <img src={selectedAnnouncement.img} alt={selectedAnnouncement.title} />
                                    <div className="topText">
                                        {language == 'ar' ? <h3>{selectedAnnouncement.titleArabic}</h3> : <h3>{selectedAnnouncement.title}</h3>}
                                        {/* {language == 'ar' ? <p>{selectedAnnouncement.organizerArabic}</p> : <p>{selectedAnnouncement.organizer}</p>} */}
                                        {language == 'ar' ? <p>{selectedAnnouncement.organizerArabic}</p> : <p>{selectedAnnouncement.organizer}</p>}
                                    </div>
                                    <button onClick={closePopup} className="closeButton">
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>
                                <div className="bottomContent">
                                    {selectedAnnouncement.form &&
                                        <button onClick={() => window.open(selectedAnnouncement.form, '_blank')} className="form">
                                            <div className="sign">
                                                <FontAwesomeIcon icon={faFileLines} />
                                            </div>
                                            <div className="text">{languageText.Form}</div>
                                        </button>
                                    }
                                    {selectedAnnouncement.link &&
                                        <button onClick={() => window.open(selectedAnnouncement.link, '_blank')}>
                                            <div className="sign">
                                                <FontAwesomeIcon icon={faCircleInfo} />
                                            </div>
                                            <div className="text">{languageText.info}</div>
                                        </button>
                                    }
                                    {selectedAnnouncement.calendarLink &&
                                        <button onClick={() => window.open(selectedAnnouncement.calendarLink, '_blank')} className="calender">
                                            <div className="sign">
                                                <FontAwesomeIcon icon={faCalendarDays} />
                                            </div>
                                            <div className="text">{languageText.calender}</div>
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="newStudents">
                        <h2>{languageText.newStudents}</h2>
                        <div className="newStudentsRow">
                            <Link to="/residences" className="newStudentCard">
                                {/* <div > */}
                                <p className="time-text"><span>{languageText.residence}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.residence2}</p>
                                <FontAwesomeIcon icon={faHouseChimney} className='moon' />
                                {/* </div> */}
                            </Link>
                            <Link to="/attractions" className="newStudentCard">
                                <p className="time-text"><span>{languageText.attractions}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.attractions2}</p>
                                {/* <FontAwesomeIcon icon={faMapLocationDot} className='moon' /> */}
                                <FontAwesomeIcon icon={faUmbrellaBeach} className='moon' />
                                {/* <Icon icon="fluent:beach-20-regular" className='moon' /> */}
                            </Link>
                            <Link to="/transportation" className="newStudentCard">
                                <p className="time-text"><span>{languageText.transportation}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.transportation2}</p>
                                <FontAwesomeIcon icon={faCarSide} className='moon' />
                            </Link>
                            <div className="newStudentCard notyet">
                                <p className="time-text"><span>{languageText.Seniors}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.handbook2}</p>
                                <Icon icon="fa-solid:user-graduate" className='moon' />

                                {/* <FontAwesomeIcon icon={faFilePdf} className='moon' /> */}

                            </div>
                        </div>
                    </div>
                    <div className="newStudents">
                        <h2>{languageText.extraServices}</h2>
                        <div className="newStudentsRow2">
                            <Link to="/internships" className="newStudentCard">
                                {/* <Link to="" className="newStudentCard notyet"> */}
                                <p className="time-text"><span>{languageText.internships}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.internships2}</p>
                                {/* <p className="day-text">{languageText.handbook2}</p> */}
                                {/* <FontAwesomeIcon icon={faTelegram} className='moon' /> */}
                                {/* <FontAwesomeIcon icon={faBuilding} className='moon' /> */}
                                <FontAwesomeIcon icon={faBriefcase} className='moon' />
                                {/* <Icon icon="ic:baseline-work" className='moon' /> */}
                            </Link>
                            <Link to="/openAccount" className="newStudentCard smaller">
                                <p className="time-text"><span>{languageText.bankAccount}</span><span className="time-sub-text"></span></p>
                                {/* <p className="day-text">Unlock Financial Freedom</p> */}
                                <p className="day-text">{languageText.bankAccount2}</p>
                                <FontAwesomeIcon icon={faCreditCard} className='moon' />
                            </Link>
                            <Link to="/clubs" className="newStudentCard">
                                <p className="time-text"><span>{languageText.clubs}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.clubs2}</p>
                                <FontAwesomeIcon icon={faFutbol} className='moon' />
                            </Link>

                            <Link to="/courses" className="newStudentCard">
                                <p className="time-text"><span>{languageText.extraCourses}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.extraCourses2}</p>
                                <FontAwesomeIcon icon={faGraduationCap} className='moon' />
                            </Link>
                            {/* <Link to="" className="newStudentCard notyet"> */}
                            <Link to="/coursesTips" className="newStudentCard">
                                <p className="time-text"><span>{languageText.coursesTips}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.coursesTips2}</p>
                                {/* <p className="day-text">{languageText.handbook2}</p> */}

                                <Icon icon="ic:baseline-tips-and-updates" className='moon' />
                            </Link>

                            {/* <Link to="/lecturers" className="newStudentCard notyet"> */}
                            <Link to="/" className="newStudentCard notyet">
                                <p className="time-text"><span>{languageText.Lecturers}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.handbook2}</p>

                                <Icon icon="mdi:lecture" className='moon' />
                            </Link>

                            {/* <Link to="/library" className="newStudentCard notyet"> */}
                            {/* <Link to="/" className="newStudentCard notyet">
                                <p className="time-text"><span>{languageText.library}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.handbook2}</p>

                                <Icon icon="ion:library" className='moon' />
                            </Link> */}

                            {/* <Link to="/tokens" className="newStudentCard"> */}
                            {/* <p className="day-text">{languageText.coursesTips2}</p> */}
                            {/* <Link to="" className="newStudentCard notyet">
                                <p className="time-text"><span>{languageText.Tokens}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.handbook2}</p>

                                {!darkMode ?
                                    <img src={HorusTokenDark} className="moon HorusLogoNumber" alt="" /> :
                                    <img src={HorusTokenDark} className="moon HorusLogoNumber" alt="" />}
                            </Link> */}

                        </div>
                    </div>

                </div>
            </div >
            <div className="leftContainer">
                <div className="collegesBoxTitle">
                    <h2>{languageText.Faculties}</h2>
                    <div className="collegesBox">
                        {combinedFaculties && combinedFaculties.map((faculty, index) => (
                            <div
                                className={`college ${popupVisibleFaculty && selectedFaculty && selectedFaculty.id === faculty.id ? 'active' : ''}`}
                                key={index}
                                onClick={() => togglePopupFaculty(faculty)}
                            >
                                <div className="img">
                                    <FontAwesomeIcon icon={faculty.Icon} />
                                </div>
                                <div className="textBox">
                                    <div className="textContent">
                                        <p className="h1">{faculty.Title}</p>
                                        <span className="span">{faculty.abb}</span>
                                    </div>
                                    <p className="p">{faculty.email}</p>
                                </div>

                            </div>
                        ))}

                        {popupVisibleFaculty && selectedFaculty && (
                            <div className={`popupFaculty ${popupVisibleFaculty ? 'popup-opening' : 'popup-closing'}`}>
                                <div className="container">
                                    <div className="topSection">
                                        <div className="img">
                                            <FontAwesomeIcon icon={selectedFaculty.Icon} />
                                        </div>
                                        <div className="textBox">
                                            <div className="textContent">
                                                <h3>{selectedFaculty.abb}</h3>
                                                <button onClick={closePopup} className="closeButton">
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </div>
                                            <h2 className="p">{selectedFaculty.Title}</h2>
                                        </div>
                                    </div>

                                    <div className="bottomSection">
                                        <img src={selectedFaculty.image} alt="" />
                                        <div className="bottomLinks">
                                            <button onClick={() => window.open(selectedFaculty.group, '_blank')}>
                                                <div className="sign">
                                                    <FontAwesomeIcon icon={faWhatsapp} />
                                                </div>
                                                <div className="text">{languageText.Group}</div>
                                            </button>
                                            <button onClick={() => window.open(selectedFaculty.location, '_blank')}>
                                                <div className="sign">
                                                    <FontAwesomeIcon icon={faLocationDot} />
                                                </div>
                                                <div className="text">{languageText.Location}</div>
                                            </button>
                                            <button onClick={() => window.open(selectedFaculty.website, '_blank')}>
                                                <div className="sign">
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                </div>
                                                <div className="text">{languageText.Website}</div>

                                            </button>
                                            <button onClick={() => window.open(selectedFaculty.email2, '_blank')}>
                                                <div className="sign">
                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                </div>
                                                <div className="text">{languageText.Email}</div>

                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Services;
