import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'
import InputLoader from '../Loader/InputLoader'
import LogoLoader from '../Loader/LogoLoader'
import './Guidance.css'
import { Icon } from '@iconify/react';
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import AllFacultyCards from '../components/AllFacultiesCard'
import Select from 'react-select';
import SelectStyles from '../components/SelectStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faPlus } from '@fortawesome/free-solid-svg-icons';

// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import app from '../../firebase'





const CoursesTips = ({ language, languageData, api, darkMode }) => {
    const { courses = [], faculties, charities = [], dispatch } = useFormsContext()
    const navigate = useNavigate();
    const languageText = languageData[language];
    const [loading, setLoading] = useState(false);
    const [facultyLoading, setFacultyLoading] = useState(true);
    const [courseLoading, setCourseLoading] = useState(true);
    const [error, setError] = useState('')
    const [messages, setMessages] = useState('')
    const styles = SelectStyles(darkMode);
    const [faculty, setFaculty] = useState("");
    const [sem, setSem] = useState('')
    const [course, setCourse] = useState()
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCharities, setFilteredCharities] = useState([]);
    const [swiperKey, setSwiperKey] = useState(0);


    useEffect(() => {
        // Update the key to force re-render when language changes
        setSwiperKey(prevKey => prevKey + 1);
    }, [language]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/course`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                // const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort data alphabetically by 'name' field
                dispatch({
                    type: 'SET_ITEM',
                    collection: "courses",
                    payload: data,
                });
                setMessages(false);
                setCourseLoading(false);

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
                setMessages(true);
            } finally {
                // Set loading to false once the data is fetched (success or error)
            }
        };
        fetchData();
    }, [api, dispatch, courses]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/faculty`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                const sortData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                // const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort data alphabetically by 'name' field
                dispatch({
                    type: 'SET_ITEM',
                    collection: "faculties",
                    payload: sortData,
                });
                setMessages(false);
                setFacultyLoading(false);

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
                setMessages(true);
            } finally {
                // Set loading to false once the data is fetched (success or error)
            }
        };
        fetchData();
    }, [api, dispatch, faculties]);





    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/charity`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();

                dispatch({
                    type: 'SET_ITEM',
                    collection: "charities",
                    payload: data,
                });
                setMessages(false);

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
                setMessages(true);
            } finally {
                // Set loading to false once the data is fetched (success or error)
            }
        };
        fetchData();
    }, [api, dispatch, charities]);





    const courseFilter = courses
        .filter((course) => {
            const searchRegex = new RegExp(searchTerm, 'i');
            return (
                ((course.facultyId === faculty &&
                    course.semester.includes(sem)) ||
                    (faculty === "Found" && course.facultyId === faculty)) &&
                (searchRegex.test(course.courseName) ||
                    searchRegex.test(course.semester))
            );
        })
        .sort((a, b) => a.courseName.localeCompare(b.courseName));



    const FilterCourse = courseFilter.map((course) => ({
        label: course.courseName,
        value: course.courseName
    }));

    const indicesToInclude = [0, 1, 2, 3, 4, 5, 11];


    const filteredFaculties = faculties
        .filter((_, index) => indicesToInclude.includes(index)) // Filter based on indicesToInclude array
        .map((faculty) => {
            const id = faculty.facultyId;
            return {
                label: languageText[id],
                value: faculty.facultyId
            };
        });



    // const filteredCharities = charities.filter(charity => {
    //     return charity.faculty === faculty && charity.course === course;
    // });
    useEffect(() => {
        // Filter charities based on selected faculty and course
        const filtered = charities.filter(charity => charity.faculty === faculty && charity.course === course && charity.status === "true");
        setFilteredCharities(filtered);
    }, [charities, faculty, course]);

    const SemOptions = [
        { value: "Year 1, Sem 1 (1)", label: 'Semester 1' },
        { value: "Year 1, Sem 2 (2)", label: 'Semester 2' },
        { value: "Year 1, Sem 3 (Short)", label: 'Sem 3 Short Semester' },
        { value: "Year 2, Sem 1 (3)", label: 'Semester 3' },
        { value: "Year 2, Sem 2 (4)", label: 'Semester 4' },
        { value: "Year 2, Sem 3 (Short)", label: 'Sem 5 Short Semester' },
        { value: "Year 3, Sem 1 (5)", label: 'Semester 5' },
        { value: "Year 3, Sem 2 (6)", label: 'Semester 6' },
        { value: "Year 3, Sem 3 (Short)", label: 'Sem 7 Short Semester' },
        { value: "Year 4, Sem 1 (7)", label: 'Semester 7' },
        { value: "Year 4, Sem 2 (8)", label: 'Semester 8' },
        { value: "Elective", label: "Elective" },
        { value: "PRISM", label: "PRISM" },
    ];


    const TipButton = ({ link }) => {
        if (!link.type) {
            return null; // Return null if link.type is empty
        }
        return (
            <div className="icon" onClick={() => { window.open(link.url, "_blank") }}>
                <span className="tooltip">
                    {link.type === "Website" ? languageText.Website :
                        link.type === "Drive" ? languageText.Drive :
                            link.type === "Youtube" ? languageText.YoutubeVideo :
                                link.type === "Article" ? languageText.Article :
                                    link.type === "Online Course" ? languageText.OnlineCourse :
                                        link.type === "General" ? languageText.GeneralLink :
                                            link.type === "File" ? languageText.File :
                                                null
                    }

                </span>
                <span>

                    <Icon icon={`${link.type === "Website" ? "fluent-mdl2:website" :
                        link.type === "Drive" ? "logos:google-drive" :
                            link.type === "Youtube" ? "openmoji:youtube" :
                                link.type === "Article" ? "ic:outline-article" :
                                    link.type === "Online Course" ? "fluent:hat-graduation-12-filled" :
                                        link.type === "General" ? "ph:link-simple-bold" :
                                            link.type === "File" ? "fa6-regular:file-pdf" :
                                                null
                        }`} /></span>
            </div>
        )
    }



    const TipCard = ({ faculty, slideNumber }) => {
        return (
            // faculty.status && (
            <SwiperSlide>
                <div class="TipCard">
                    <p className='TipNo'>{slideNumber + 1}</p>
                    <p class="TipHeading">{languageText.courseTip}</p>
                    {faculty.name && faculty.condition === "true" && <p class="TipName">{faculty.name}</p>}
                    <p class="TipTip">{faculty.advice}</p>
                    {faculty.industrial && <p class="TipIndustrial"><Icon icon="mdi:work" /> {faculty.industrial}</p>}
                    <div className="TipButtons">

                        {faculty.links.map((link, index) => (
                            <TipButton link={link} />
                        ))}
                    </div>
                    <p class="TipDa3wa"><Icon icon="guidance:praying-room" className="PrayerIcon" /> {languageText.ForgetPrayer}</p>

                </div>
            </SwiperSlide>
            // )
        )
    }


    return (
        <div className="Form Guidance">
            <h2>{languageText.coursesTips}</h2>
            <div className="CharityPage">
                {facultyLoading ? (
                    <div style={{ marginTop: "20px" }}><Loader /></div>
                ) : (
                    <div className="formBox">
                        <form encType="multipart/form-data">
                            <h2>{languageText.ChooseCourse}</h2>
                            <div className="InputField AnimatedInput">
                                <Select
                                    className={`CustomSelect ${(faculty) ? 'valid' : ''}`}
                                    placeholder={<><Icon icon="lucide:school" className="IconSize" /> {languageText.FacultyHelp}</>}
                                    options={filteredFaculties}
                                    isSearchable={false}
                                    noOptionsMessage={() => languageText.NoFaculty}
                                    onChange={opt => {
                                        setFaculty(opt.value);
                                        setCourse(null);
                                    }}
                                    styles={styles}
                                    theme={theme => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            primary25: 'lightgray',
                                            primary: 'var(--theme)',
                                        },
                                    })}
                                />

                            </div>

                            {faculty != "Found" && <div className="InputField AnimatedInput">
                                <Select
                                    className={`CustomSelect ${(sem) ? 'valid' : ''}`}
                                    placeholder={<><Icon icon="lets-icons:date-fill" className="IconSize" /> {languageText.SemesterHelp}</>}
                                    options={SemOptions}
                                    isSearchable={false}
                                    noOptionsMessage={() => languageText.NoSemester}
                                    onChange={opt => {
                                        setSem(opt.value);
                                        setCourse(null);
                                    }}
                                    styles={styles}
                                    theme={theme => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            primary25: 'lightgray',
                                            primary: 'var(--theme)',
                                        },
                                    })}
                                />
                            </div>
                            }

                            {((faculty && sem && courseLoading) || (faculty == "Found" && courseLoading)) ? (
                                <div className={loading ? 'InputField animated-input' : 'InputField'}>
                                    <InputLoader /></div>) : (

                                ((faculty && sem && FilterCourse.length > 0) || (faculty == "Found")) && (
                                    <div className="InputField AnimatedInput">
                                        <Select
                                            className={`CustomSelect ${(course) ? 'valid' : ''}`}
                                            // placeholder={languageText.CourseHelp}
                                            placeholder={<><Icon icon="carbon:course" className="IconSize" /> {languageText.CourseHelp}</>}

                                            options={FilterCourse}
                                            isSearchable
                                            noOptionsMessage={() => languageText.NoCourse}
                                            onChange={opt => setCourse(opt.value)}
                                            styles={styles}
                                            theme={theme => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: 'lightgray',
                                                    primary: 'var(--theme)',
                                                },
                                            })}
                                        />

                                    </div>


                                ))}
                            {/* {FilterCourse.length === 0 && sem && faculty && !courseLoading &&
                                <p className="CourseNotFound">{languageText.CourseNotFound}</p>
                            } */}

                            {((FilterCourse.length === 0 && sem && faculty && !courseLoading) ||
                                ((FilterCourse.length === 0 && faculty === "Found" && !courseLoading))) &&
                                <p className="CourseNotFound">{languageText.CourseNotFound}</p>
                            }
                            {course && faculty && filteredCharities.length == 0 &&
                                <p className="CourseNotFound AnimatedInput">{languageText.CourseNotFound2}</p>
                            }
                        </form>
                    </div>
                )}

                {/* {console.log(filteredCharities)} */}
                {filteredCharities.length > 0 &&
                    <div className="HintCourseTips">
                        {/* <div className="textBox">
                            <div className="hintField">
                                <Icon icon="fluent-mdl2:website" className="hintIcon" />
                                <p>{languageText.Website}</p>
                            </div>
                            <div className="hintField">
                                <Icon icon="logos:google-drive" className="hintIcon" />
                                <p>{languageText.Drive}</p>
                            </div>
                            <div className="hintField">
                                <Icon icon="logos:youtube-icon" className="hintIcon" />
                                <p>{languageText.YoutubeVideo}</p>
                            </div>
                            <div className="hintField">
                                <Icon icon="ic:outline-article" className="hintIcon" />
                                <p>{languageText.Article}</p>
                            </div>
                            <div className="hintField">
                                <Icon icon="fluent:hat-graduation-12-filled" className="hintIcon" />
                                <p>{languageText.OnlineCourse}</p>
                            </div>
                            <div className="hintField">
                                <Icon icon="ph:link-simple-bold" className="hintIcon" />
                                <p>{languageText.GeneralLink}</p>
                            </div>
                            <div className="hintField">
                                <Icon icon="fa6-regular:file-pdf" className="hintIcon" />
                                <p>{languageText.File}</p>
                            </div>
                        </div> */}
                        <h3 className="CourseTipName AnimatedCard2">{course}</h3>
                        <div className="CoursesTips AnimatedCard">

                            <div className="formBox">
                                <Swiper
                                    key={swiperKey}
                                    grabCursor={true}
                                    effect={'creative'}
                                    loop={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    // navigation={true}
                                    creativeEffect={{
                                        prev: {
                                            shadow: true,
                                            translate: ['-120%', 0, -500],
                                        },
                                        next: {
                                            shadow: true,
                                            translate: ['120%', 0, -500],
                                        },
                                    }}
                                    modules={[EffectCreative, Pagination]}
                                    className="mySwiper2"
                                >

                                    {filteredCharities.map((charity, index) => (
                                        <SwiperSlide key={index}>
                                            <TipCard faculty={charity} slideNumber={index} />
                                        </SwiperSlide>
                                        // <TipCard key={index} faculty={charity} slideNumber={index} />
                                    ))}

                                </Swiper>
                            </div>
                        </div>
                    </div>


                }

            </div>
        </div>
    );
}

export default CoursesTips;