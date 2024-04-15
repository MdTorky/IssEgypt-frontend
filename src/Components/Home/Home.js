// Home.js
import React, { useEffect, useState } from 'react';
import './Home.css';
import { useLanguage } from '../../context/language';
// import Logo from './Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the Logo component
import { faTree, faEnvelope, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';
import images from '../../data/images.json';
import link from '../../data/upcomingEvents.json'
// import { PS } from 'country-flag-icons/react/3x2'
// import Loader from '../Loader/Loader'
import { useFormsContext } from '../../hooks/useFormContext'
// import roleChecker from '../Members/MemberLoader'
// import { useLocation, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Navigation, Pagination, EffectCube } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cube';

function Home({ language, languageData, api }) {


    const root = document.documentElement; // Access the root element
    const themeColor = getComputedStyle(root).getPropertyValue('--theme');


    const { members, dispatch } = useFormsContext()
    const languageText = languageData[language];


    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(true)

    // const isEmpty = (obj) => {
    //     return Object.keys(obj).length == 0;
    // };
    const isRtl = language === 'ar';
    // const [isExpanded, setIsExpanded] = useState(false);
    // Define an array of objects with logo and text data
    const [swiperKey, setSwiperKey] = useState(0);


    useEffect(() => {
        // Update the key to force re-render when language changes
        setSwiperKey(prevKey => prevKey + 1);
    }, [language]);






    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/member`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                console.log(data);
                dispatch({
                    type: 'SET_ITEM',
                    collection: 'members',
                    payload: data
                });
                setMessages(false)
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

    // const hiddenPages = ["/services", "/gallery", "/residences", "/attractions", "/transportation", "/openAccount", "/groups", "/clubs"];

    let combinedPeople = members.filter((member) => member.type == "President");
    combinedPeople.sort((a, b) => a.memberId - b.memberId);




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


    // const SwipperSlide = (img, title, description, creator) => {
    //     return (
    //         <div >
    //             <SwiperSlide style={{ display: "flex", flexDirection: 'column' }}>
    //                 <img src={img} />
    //                 <div className="EventDescription">
    //                     <h2>{languageText.title}<span className="creator"> {languageText.AcademicEventCreator1}</span></h2>
    //                     <p>{languageText.AcademicEventDescription1}</p>
    //                 </div>
    //             </SwiperSlide>
    //         </div>

    //     )
    // }

    //     return (
    //         <div className="SwiperBox">
    //             <Swiper
    //                 key={swiperKey}

    //                 effect={'cube'}
    //                 grabCursor={true}
    //                 cubeEffect={{
    //                     shadow: true,
    //                     slideShadows: true,
    //                     shadowOffset: 20,
    //                     shadowScale: 0.94,
    //                 }}
    //                 pagination={{
    //                     clickable: true,
    //                 }}
    //                 loop={true}
    //                 // navigation={true}
    //                 modules={[EffectCube, Pagination]}
    //                 className="mySwiper"
    //             >
    //                 {SwipperSlide("https://swiperjs.com/demos/images/nature-4.jpg", "AcademicEventTitle1", 'description', 'creator')}
    //             </Swiper>

    //         </div>
    //     )
    // }



    const SwiperComponent = ({ slides }) => {
        return (
            <div className="SwiperBox">
                <Swiper
                    key={swiperKey}

                    effect={'cube'}
                    grabCursor={true}
                    cubeEffect={{
                        shadow: true,
                        slideShadows: true,
                        shadowOffset: 20,
                        shadowScale: 0.94,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    loop={true}
                    // navigation={true}
                    modules={[EffectCube, Pagination]}
                    className="mySwiper"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <img src={slide.img} alt={`Slide ${index + 1}`} />
                            <div className="EventDescription">
                                <h2>{slide.title}
                                    {slide.creator &&
                                        <span className="creator"> {slide.creator}</span>
                                    }
                                </h2>
                                <p>{slide.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    };




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

            {/* <h1 className="nameTitle ">{languageText.IssPres}
                <div className="showMore" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <FontAwesomeIcon icon={faArrowUp} className='color' /> : <FontAwesomeIcon icon={faArrowDown} className='color2' />}
                </div>
            </h1>
            <div className={`homeItems ${isExpanded ? 'expanded' : ''}`}>
                <div className="row">
                    {combinedPeople.map((person, index) => (
                        <Link to={`/members/${person._id}`} className='moreInfo'>
                            <div className='rowCircle'>
                                <img src={`${api}/uploads/${person.img}`} alt="" />
                                <Logo logoSrc={person.logoSrc} />
                                {language === 'ar' ? <p>{person.arabicName}</p> : <p>{person.name}</p>}

                                <span>{roleChecker({ languageText: languageText, committee: person.committee, role: person.type })}</span>
                            </div>
                        </Link>
                    ))}
                </div>

            </div> */}

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

                    <div className="eventBox reveal">
                        <EventBoxTitle text={languageText.ISSEgyptEvents} themeColor={themeColor} isRtl={isRtl} />
                        <SwiperComponent
                            slides={[
                                { img: images.issImg1, title: languageText.ISSEventTitle1, description: languageText.ISSEventDescription1, creator: null },
                                { img: images.issImg2, title: languageText.ISSEventTitle2, description: languageText.ISSEventDescription2, creator: null },
                            ]}
                        />

                    </div>
                    <div className="eventBox reveal">
                        <EventBoxTitle text={languageText.AcademicEvents} themeColor={themeColor} isRtl={isRtl} />
                        <SwiperComponent
                            slides={[
                                { img: images.academicImg1, title: languageText.AcademicEventTitle1, description: languageText.AcademicEventDescription1, creator: languageText.AcademicEventCreator1 },
                                { img: images.academicImg2, title: languageText.AcademicEventTitle2, description: languageText.AcademicEventDescription2, creator: languageText.AcademicEventCreator2 },
                                { img: images.academicImg3, title: languageText.AcademicEventTitle3, description: languageText.AcademicEventDescription3, creator: languageText.AcademicEventCreator3 },
                                { img: images.academicImg4, title: languageText.AcademicEventTitle4, description: languageText.AcademicEventDescription4, creator: languageText.AcademicEventCreator4 },
                                { img: images.academicImg5, title: languageText.AcademicEventTitle5, description: languageText.AcademicEventDescription5, creator: languageText.AcademicEventCreator5 },
                                { img: images.academicImg6, title: languageText.AcademicEventTitle6, description: languageText.AcademicEventDescription6, creator: languageText.AcademicEventCreator6 },
                            ]}
                        />
                    </div>
                    <div className="eventBox reveal">
                        <EventBoxTitle text={languageText.SocialEvents} themeColor={themeColor} isRtl={isRtl} />
                        <SwiperComponent
                            slides={[
                                { img: images.socialImg1, title: languageText.SocialEventTitle1, description: languageText.SocialEventDescription1, creator: null },
                                { img: images.socialImg2, title: languageText.SocialEventTitle2, description: languageText.SocialEventDescription2, creator: null },
                                { img: images.socialImg3, title: languageText.SocialEventTitle3, description: languageText.SocialEventDescription3, creator: null },
                            ]}
                        />

                    </div>





                </div>


                <div className="events">

                    <div className="eventBox reveal">
                        <EventBoxTitle text={languageText.CultureEvents} themeColor={themeColor} isRtl={isRtl} />
                        <SwiperComponent
                            slides={[
                                { img: images.cultureImg1, title: languageText.CultureEventTitle1, description: languageText.CultureEventDescription1, creator: null },
                                { img: images.cultureImg2, title: languageText.CultureEventTitle2, description: languageText.CultureEventDescription2, creator: languageText.CultureEventCreator2 },
                                // { img: images.readingImg2, title: languageText.ReadingEventTitle2, description: languageText.ReadingEventDescription2, creator: languageText.ReadingClubCreator2 },
                            ]}
                        />
                    </div>

                    <div className="eventBox reveal">
                        <EventBoxTitle text={languageText.ReadingClubEvents} themeColor={themeColor} isRtl={isRtl} />
                        <SwiperComponent
                            slides={[
                                { img: images.readingImg1, title: languageText.ReadingEventTitle1, description: languageText.ReadingEventDescription1, creator: languageText.ReadingClubCreator1 },
                                { img: images.readingImg2, title: languageText.ReadingEventTitle2, description: languageText.ReadingEventDescription2, creator: languageText.ReadingClubCreator2 },
                            ]}
                        />
                    </div>

                    <div className="eventBox reveal">
                        <EventBoxTitle text={languageText.SportsEvents} themeColor={themeColor} isRtl={isRtl} />
                        <SwiperComponent
                            slides={[
                                { img: images.sportsImg1, title: languageText.SportsEventTitle1, description: languageText.SportsEventDescription1 },
                            ]}
                        />
                    </div>


                </div>












                {/* Academic Events */}
                {/* <div className="eventBox reveal"> */}

                {/* <div className="eventBox"> */}



                {/* </div> */}
                {/* </div> */}

                {/* <div className="eventBox">
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
                    </div> */}

                {/* Social Events */}
                {/* <div className="eventBox reveal">

                        <EventBoxTitle text={languageText.SocialEvents} themeColor={themeColor} isRtl={isRtl} />

                        <div className="eventBox">
                            <div className="slide2 active">
                                <img src={images.socialImg1} alt="" />
                                <div className="info">
                                    <h2>{languageText.SocialEventTitle1}</h2>
                                    <p>{languageText.SocialEventDescription1}</p>
                                </div>
                            </div>
                        </div>
                    </div> */}

                {/* Cultural Events */}
                {/* <div className="eventBox reveal">
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
                </div> */}


                {/* <div className="eventBox reveal">
                        <EventBoxTitle text={languageText.ReadingClubEvents} themeColor={themeColor} isRtl={isRtl} />

                        <div className="eventBox">
                            <div className="slide3 active">
                                <img src={images.readingImg1} alt="" />
                                <div className="info">
                                    <h2>{languageText.ReadingEventTitle1}<span className="creator"> {languageText.ReadingClubCreator1}</span></h2>
                                    <p>{languageText.ReadingEventDescription1}</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                {/* </div> */}
                {/* </div> */}



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
                {/* {popupVisible && selectedItem && (
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
                )} */}
            </div>
        </div >
    );
}

export default Home;
