import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays, faCircleInfo, faFileLines,
    faEnvelope, faLocationDot, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import faculties from "../../data/faculties.json";
import { Icon } from '@iconify/react';
import { useFormsContext } from '../../hooks/useFormContext'
import Loader from '../Loader/Loader';


const Services = ({ language, languageText, api }) => {
    const { forms = [], dispatch } = useFormsContext()
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState(true);

    useEffect(() => {
        if (selectedFaculty && selectedFaculty.id) {
            const updatedFaculty = combinedFaculties.find(combinedFaculties => combinedFaculties.id === selectedFaculty.id);
            if (updatedFaculty) {
                setSelectedFaculty(updatedFaculty);
            }
        }
    }, [language]);




    const facultiesData = [
        {
            // Icon: faCarBattery,
            Icon: "material-symbols:electric-bolt-rounded",
            Title: languageText.FKE,

        },
        {
            // Icon: faLaptopCode,
            Icon: "icon-park-solid:code-laptop",
            Title: languageText.FC,
        },
        {
            // Icon: faHelmetSafety,
            Icon: "fa6-solid:helmet-safety",
            Title: languageText.FKA,

        },
        {
            // Icon: faGears,
            Icon: "vaadin:tools",
            Title: languageText.FKM,

        },
        {
            // Icon: faFlaskVial,
            Icon: "mdi:flask",
            Title: languageText.FKT,

        },
        {
            // Icon: faBookBookmark,
            Icon: "tdesign:architecture-hui-style-filled",
            Title: languageText.FAB,

        },
        {
            // Icon: faBookBookmark,
            Icon: "icon-park-solid:book-one",
            Title: languageText.Found,

        },
    ];


    const combinedFaculties = faculties.map((faculty, index) => ({
        ...faculty,
        Icon: facultiesData[index]?.Icon || "default-icon", // Fallback icon
        Title: facultiesData[index]?.Title || "Default Title", // Fallback title
    }));




    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);


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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/forms`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                const sortedData = data.filter((form) => form.status === true); // Sort data alphabetically by 'name' field
                dispatch({
                    type: 'SET_ITEM',
                    collection: "forms",
                    payload: sortedData,
                });
                setMessages(false);
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
                setMessages(true);
            } finally {
                // Set loading to false once the data is fetched (success or error)
                setLoading(false);
            }
        };
        fetchData();
    }, [api, dispatch]);




    const typeStyles = {
        Academic: {
            icon: "solar:square-academic-cap-2-bold",
            backgroundColor: "#8E1616",
        },
        Social: {
            icon: "raphael:people",
            backgroundColor: "#155E95",
        },
        Culture: {
            icon: "carbon:worship-muslim",
            backgroundColor: "#EFB036",
        },
        Sports: {
            icon: "fluent:sport-16-filled",
            backgroundColor: "#FF8000",
        },
        Sports: {
            icon: "fluent:sport-16-filled",
            backgroundColor: "#FF8000",
        },
        Media: {
            icon: "basil:camera-solid",
            backgroundColor: "#48A6A7",

        },
        WomenAffairs: {
            icon: "icon-park-solid:women",
            backgroundColor: "#FF748B",
        },
        PR: {
            icon: "mdi:loudspeaker",
            backgroundColor: "#1F4529",
        },
        HR: {
            icon: "tdesign:member-filled",
            backgroundColor: "#4C1F7A",
        },
        Leadership: {
            icon: "ph:crown-bold",
            backgroundColor: "#FFD700",
        },
        // Add more types here as needed
    };


    const leadershipRoles = ["Vice", "ISS Egypt", "Secretary", "Treasurer", "Admin"];

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
                                    <Icon icon={faculty.Icon} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="annContainer">
                <div className="annContainer2">
                    <div className="annStories">
                        <h2>{languageText.forms}</h2>
                        {loading ? (
                            <div><Loader /></div>
                        ) : (
                            <div className='annStories2'>
                                <Link className="AnnStories2Button" to="/charity" data-text={languageText.courseTip}>
                                    <Icon icon="mdi:charity" className="svgIcon" />
                                </Link>

                                <Link className="AnnStories2Button" to="/underconstruction" data-text={languageText.Shop} style={{ backgroundColor: "mediumseagreen" }}>
                                    <Icon icon="solar:shop-bold" className="svgIcon" />
                                </Link>

                                {forms.map((form) => {
                                    // Check if the type is in the shared roles
                                    const isLeadership = leadershipRoles.includes(form.type);
                                    const { icon, backgroundColor } = isLeadership
                                        ? typeStyles.Leadership
                                        : typeStyles[form.type] || {
                                            icon: "solar:shop-bold", // Default icon
                                            backgroundColor: "mediumseagreen", // Default color
                                        };

                                    return (
                                        <Link
                                            key={form.eventName}
                                            className="AnnStories2Button"
                                            to={`/form/${form._id}`}
                                            data-text={form.eventName}
                                            style={{ backgroundColor }}
                                        >
                                            <Icon icon={icon} className="svgIcon" />
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

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
                                        {language == 'ar' ? <p>{selectedAnnouncement.organizerArabic}</p> : <p>{selectedAnnouncement.organizer}</p>}
                                    </div>
                                    <button onClick={closePopup} className="closeButton">
                                        <Icon icon="zondicons:close-outline" />
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
                                <p className="time-text"><span>{languageText.residence}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.residence2}</p>
                                <Icon icon="material-symbols:house-rounded" className='moon' />
                            </Link>
                            <Link to="/attractions" className="newStudentCard">
                                <p className="time-text"><span>{languageText.attractions}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.attractions2}</p>
                                {/* <FontAwesomeIcon icon={faUmbrellaBeach} className='moon' /> */}
                                <Icon icon="streamline:beach-solid" className='moon' />
                            </Link>
                            <Link to="/transportation" className="newStudentCard">
                                <p className="time-text"><span>{languageText.transportation}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.transportation2}</p>
                                <Icon icon="mingcute:car-door-fill" className='moon' />
                            </Link>
                            <div className="newStudentCard notyet">
                                <p className="time-text"><span>{languageText.Seniors}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.handbook2}</p>
                                <Icon icon="fa-solid:user-graduate" className='moon' />


                            </div>
                        </div>
                    </div>
                    <div className="newStudents">
                        <h2>{languageText.extraServices}</h2>
                        <div className="newStudentsRow2">
                            <Link to="/internships" className="newStudentCard">
                                <p className="time-text"><span>{languageText.internships}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.internships2}</p>
                                <Icon icon="tabler:briefcase-filled" className='moon' />
                            </Link>
                            <Link to="/openAccount" className="newStudentCard smaller">
                                <p className="time-text"><span>{languageText.bankAccount}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.bankAccount2}</p>
                                <Icon icon="heroicons:credit-card-16-solid" className='moon' />
                            </Link>
                            <Link to="/clubs" className="newStudentCard">
                                <p className="time-text"><span>{languageText.clubs}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.clubs2}</p>
                                <Icon icon="icon-park-solid:entertainment" className='moon' />
                            </Link>

                            <Link to="/courses" className="newStudentCard">
                                <p className="time-text"><span>{languageText.extraCourses}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.extraCourses2}</p>
                                <Icon icon="simple-icons:coursera" className='moon' />
                            </Link>
                            <Link to="/coursesTips" className="newStudentCard">
                                <p className="time-text"><span>{languageText.coursesTips}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.coursesTips2}</p>

                                <Icon icon="ic:baseline-tips-and-updates" className='moon' />
                            </Link>

                            <Link to="/" className="newStudentCard notyet">
                                <p className="time-text"><span>{languageText.Lecturers}</span><span className="time-sub-text"></span></p>
                                <p className="day-text">{languageText.handbook2}</p>

                                <Icon icon="mdi:lecture" className='moon' />
                            </Link>
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
                                    <Icon icon={faculty.Icon} />
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
                                            <Icon icon={selectedFaculty.Icon} />
                                        </div>
                                        <div className="textBox">
                                            <div className="textContent">
                                                <h3>{selectedFaculty.abb}</h3>
                                                <button onClick={closePopup} className="closeButton">
                                                    <Icon icon="fa:close" />

                                                </button>
                                            </div>
                                            <h2 className="p">{selectedFaculty.Title}</h2>
                                        </div>
                                    </div>

                                    <div className="bottomSection">
                                        <img src={selectedFaculty.image} alt="" />
                                        <div className="bottomLinks">
                                            {selectedFaculty.group && <button onClick={() => window.open(selectedFaculty.group, '_blank')}>
                                                <div className="sign">
                                                    <FontAwesomeIcon icon={faWhatsapp} />
                                                </div>
                                                <div className="text">{languageText.Group}</div>
                                            </button>}
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
