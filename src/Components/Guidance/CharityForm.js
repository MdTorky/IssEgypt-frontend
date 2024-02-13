import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'
import './Guidance.css'
import { Icon } from '@iconify/react';
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import AllFacultyCards from '../components/AllFacultiesCard'
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import SelectStyles from '../components/SelectStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const CharityForm = ({ language, languageData, api, darkMode }) => {
    const { courses = [], faculties, dispatch } = useFormsContext()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('')
    const [messages, setMessages] = useState('')
    const languageText = languageData[language];
    const [faculty, setFaculty] = useState("");
    const [sem, setSem] = useState('')
    const [course, setCourse] = useState()
    const [searchTerm, setSearchTerm] = useState('');
    const styles = SelectStyles(darkMode);



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
    }, [api, dispatch, faculties]);








    const courseFilter = courses
        .filter((course) => {
            const searchRegex = new RegExp(searchTerm, 'i');
            return (
                course.facultyId === faculty &&
                course.semester.includes(sem) &&
                (searchRegex.test(course.courseName) ||
                    searchRegex.test(course.semester))
            );
        })
        .sort((a, b) => a.courseName.localeCompare(b.courseName));



    const FilterCourse = courseFilter.map((course) => ({
        label: course.courseName,
        value: course.courseName
    }));

    const filteredFaculties = faculties.map((faculty) => {
        const id = faculty.facultyId;
        return {
            label: languageText[id],
            value: faculty.facultyId
        };
    });


    const SemOptions = [
        { value: "Year 1, Sem 1 (1)", label: 'Semester 1', color: "red" },
        { value: "Year 1, Sem 2 (2)", label: 'Semester 2' },
        { value: "Year 2, Sem 1 (3)", label: 'Semester 3' },
        { value: "Year 2, Sem 2 (4)", label: 'Semester 4' },
        { value: "Year 3, Sem 1 (5)", label: 'Semester 5' },
        { value: "Year 3, Sem 2 (6)", label: 'Semester 6' },
        { value: "Year 3, Sem 3 (Short)", label: 'Short Semester' },
        { value: "Year 4, Sem 1 (7)", label: 'Semester 7' },
        { value: "Year 4, Sem 2 (8)", label: 'Semester 8' },
        { value: "Elective", label: "Elective" },
        { value: "PRISM", label: "PRISM" },
    ];





    return (
        <div className="Form Guidance">
            <div className="CharityText">
                <h2>عِلْمٍ يُنْتَفَعُ بِهِ</h2>
                <h3>Knowledge that can be benefited from</h3>
                <p><Icon icon="fa-solid:exclamation" /> {languageText.RegularReg}</p>
            </div>

            {loading ? (
                <div><Loader /></div>
            ) : (
                <div className="formBox">
                    {updating &&
                        <div>
                            <p className='Updating'>{languageText.Submitting}</p>
                            <Loader />
                        </div>
                    }
                    {!updating && (
                        <form encType="multipart/form-data">
                            <h2>{languageText.KnowledgeCharity}</h2>

                            <div className="InputField">
                                <Select
                                    className={`CustomSelect ${(faculty) ? 'valid' : ''}`}
                                    // placeholder={<><Icon icon="fa-solid:university" /> {languageText.FacultyHelp}</>}
                                    placeholder={languageText.FacultyHelp}
                                    options={filteredFaculties}
                                    isSearchable
                                    noOptionsMessage={() => languageText.NoFaculty}
                                    onChange={opt => setFaculty(opt.value)}
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

                            {/* <select
                                    className={`input ${(faculty) ? 'valid' : ''}`}
                                    onChange={(e) => setFaculty(e.target.value)}
                                    required
                                >
                                    <option value="" disabled selected hidden>{languageText.FacultyHelp}</option>
                                    {faculties.map((faculty) => (
                                        <option value={faculty.facultyId}><AllFacultyCards languageText={languageText} facultyId={faculty.facultyId} /></option>
                                    ))}
                                </select> */}


                            <div className="InputField">
                                <Select
                                    className={`CustomSelect ${(sem) ? 'valid' : ''}`}
                                    placeholder={languageText.SemesterHelp}
                                    options={SemOptions}
                                    isSearchable
                                    noOptionsMessage={() => languageText.NoSemester}
                                    onChange={opt => setSem(opt.value)}
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

                            {/* <div className="InputField">
                                <input
                                    className="Search"
                                    placeholder={languageText.searchResponse}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div> */}

                            {faculty && sem && FilterCourse.length > 0 ? (
                                <div className="InputField">
                                    <Select
                                        className={`CustomSelect ${(course) ? 'valid' : ''}`}
                                        placeholder={languageText.CourseHelp}
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


                                // <div className="InputField">
                                //     <select
                                //         className={`input ${(course) ? 'valid' : ''}`}
                                //         onChange={(e) => setCourse(e.target.value)}
                                //         required
                                //     >
                                //         <option value="" disabled selected hidden>{languageText.SemesterHelp}</option>

                                //         {courseFilter.map((course) =>
                                //             <option value={course.courseName}>{course.courseName}</option>

                                //         )}
                                //     </select>
                                // </div>


                            ) :
                                <>
                                    Not Been Added Yet
                                </>
                            }
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default CharityForm;