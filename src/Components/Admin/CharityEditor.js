import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'
import '../Guidance/Guidance.css'
import { Icon } from '@iconify/react';
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react"
import { useFormsContext } from '../../hooks/useFormContext'


const CharityEditor = ({ language, languageText, api, darkMode }) => {
    const { courses = [], dispatch } = useFormsContext()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [faculty, setFaculty] = useState("");
    const [error, setError] = useState('')
    const [messages, setMessages] = useState('')
    const courseName = 'Construction Practice'


    const [inputs, setInputs] = useState([]);
    // const [faculties, setFaculties] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState(false);
    const [expandedFaculty, setExpandedFaculty] = useState(false);






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

    const courseFilter = courses.filter((course) => course.courseName === courseName);
    const courseId = courseFilter.length > 0 ? courseFilter[0]._id : null;


    const [form, setForm] = useState(null);


    useEffect(() => {
        // Fetch form data based on type and formId
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/course/${courseId}`);
                if (!response.ok) {
                    console.error(`Error fetching form data. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'GET_ITEM',
                    collection: "courses",
                    payload: data,
                });
                setForm(data);
                setInputs(data.semester)
                // setFaculties(data.facultyId)
            } catch (error) {
                console.error('An error occurred while fetching form data:', error);
            } finally {
                // Set loading to false once the data is fetched (success or error)
                setLoading(false);
            }
        };

        fetchData();
    }, [api, courseId, dispatch]);


    const showCheckboxes = (type) => {
        if (type === 'categories') {
            setExpandedCategories(!expandedCategories);
            // setExpandedFaculty(false)
            // } else if (type === 'faculties') {
            //     setExpandedFaculty(!expandedFaculty);
            //     setExpandedCategories(false)
        }
    };


    const generateCheckbox = categories => {
        return categories.map(category => checkbox(category));
    };

    // const generateFacultyCheckbox = categories => {
    //     return categories.map(category => facultyCheckBox(category));
    // };

    const checkbox = ({ type }) => {
        return (
            <label htmlFor={type}>
                <input
                    type="checkbox"
                    id={type}
                    value={type}
                    checked={inputs.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                />
                {type}
            </label>
        )
    }

    // const facultyCheckBox = ({ type }) => {
    //     return (
    //         <label htmlFor={type}>
    //             <input
    //                 type="checkbox"
    //                 id={type}
    //                 value={type}
    //                 checked={faculties.includes(type)}
    //                 onChange={() => handleFacultyCheckboxChange(type)}
    //             />
    //             {type}
    //         </label>
    //     )
    // }



    const handleCheckboxChange = (value) => {
        const updatedCategories = [...inputs];
        if (updatedCategories.includes(value)) {
            updatedCategories.splice(updatedCategories.indexOf(value), 1);
        } else {
            updatedCategories.push(value);
        }
        setInputs(updatedCategories);
    };

    // const handleFacultyCheckboxChange = (value) => {
    //     const updatedCategories = [...faculties];
    //     if (updatedCategories.includes(value)) {
    //         updatedCategories.splice(updatedCategories.indexOf(value), 1);
    //     } else {
    //         updatedCategories.push(value);
    //     }
    //     setFaculties(updatedCategories);
    // };





    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);


        try {
            const formToUpdate = courses.find((course) => course._id === courseId);

            // Ensure the form was found
            if (!formToUpdate) {
                console.error('Form not found in state');
                console.log('forms array:', courses);
                console.log('formId:', courseId);
                return;
            }


            const response = await fetch(`${api}/api/course/${courseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseName: courses.courseName,
                    facultyId: courses.facultyId,
                    semester: inputs,

                }),
            });


            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }

            // Assuming the API response contains the updated form data
            const updatedCourseData = await response.json();
            console.log('Updated Form Data:', updatedCourseData);
            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'courses',
                payload: { id: courseId, changes: updatedCourseData },
            });

            {
                toast.success(`${languageText.formEdited}`, {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: darkMode ? "dark" : "colored",
                    style: {
                        fontFamily: language === 'ar' ?
                            'Noto Kufi Arabic, sans-serif' :
                            'Poppins, sans-serif',
                    },
                });
            }
            setUpdating(false);



        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };







    const handleCourseDelete = async () => {
        try {
            const response = await fetch(`${api}/api/course/${courseId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error(`Error deleting suggestion. Status: ${response.status}, ${response.statusText}`);
                return;
            }



            if (response.ok) {
                const json = await response.json();
                dispatch({
                    type: 'DELETE_ITEM',
                    collection: "courses",
                    payload: json
                });
                {
                    toast.success(`${languageText.formDeleted}`, {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: darkMode ? "dark" : "colored",
                        style: {
                            fontFamily: language === 'ar' ?
                                'Noto Kufi Arabic, sans-serif' :
                                'Poppins, sans-serif',
                        },
                    });
                }

            }

        } catch (error) {
            console.error('An error occurred while deleting data:', error);
        }
    };







    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };


    // const [courseName, setCourseName] = useState('');

    // const handleInputChange = (e) => {
    //     const { value } = e.target;
    //     setCourseName(value); // Update the courseName state with the input value
    // };



    return (
        <div className="Form Guidance">
            <div className="CharityText">
                {/* <h2>عِلْمٍ يُنْتَفَعُ بِهِ</h2>
                <h3>Knowledge that can be benefited from</h3>
                <h3>This follows the regular</h3> */}
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
                        <form encType="multipart/form-data" onSubmit={handleUpdate}>
                            <h2>{languageText.KnowledgeCharity}</h2>
                            {courseFilter.map((course) => (
                                <div>
                                    {course.courseName}
                                    <p>{course.facultyId}</p>
                                    <button className="icon Delete" onClick={(e) => { handleCourseDelete() }}>
                                        <span class="tooltip Delete" >{languageText.delete}</span>
                                        <span>Delete</span>
                                    </button>
                                    <div className="InputField">
                                        <div className="multiselect">
                                            <div className="selectBox" onClick={() => showCheckboxes('categories')}>
                                                <select>
                                                    <option>{languageText.SelectInputs}</option>
                                                </select>
                                                <div className="overSelect"></div>
                                            </div>
                                            <div id="locationsCheckboxes" style={{ display: expandedCategories ? 'flex' : 'none', flexDirection: 'column' }}>
                                                {generateCheckbox([
                                                    { type: "Year 1, Sem 1 (1)" },
                                                    { type: "Year 1, Sem 2 (2)" },
                                                    { type: "Year 1, Sem 3 (Short)" },
                                                    { type: "Year 2, Sem 1 (3)" },
                                                    { type: "Year 2, Sem 2 (4)" },
                                                    { type: "Year 2, Sem 3 (Short)" },
                                                    { type: "Year 3, Sem 1 (5)" },
                                                    { type: "Year 3, Sem 2 (6)" },
                                                    { type: "Year 3, Sem 3 (Short)" },
                                                    { type: "Year 4, Sem 1 (7)" },
                                                    { type: "Year 4, Sem 2 (8)" },
                                                    { type: "Elective" },
                                                ])}
                                            </div>
                                        </div>
                                    </div>


                                    {/* <div className="InputField">
                                        <div className="multiselect">
                                            <div className="selectBox" onClick={() => showCheckboxes('faculties')}>
                                                <select>
                                                    <option>{languageText.Faculty}</option>
                                                </select>
                                                <div className="overSelect"></div>
                                            </div>
                                            <div id="locationsCheckboxes" style={{ display: expandedFaculty ? 'flex' : 'none', flexDirection: 'column' }}>
                                                {generateFacultyCheckbox([
                                                    { type: "FKE" },
                                                    { type: "FC" },
                                                    { type: "FKM" },
                                                ])}
                                            </div>
                                        </div>
                                    </div> */}
                                    {/* <div className="InputField">
                                        <div className="InputLabelField">
                                            <input
                                                type="text"
                                                className={`input ${(course.courseName) ? 'valid' : ''}`}
                                                onChange={handleInputChange}
                                                required
                                                value={courseName}
                                                id="courseName"
                                                name="courseName"
                                            />
                                            {!course.courseName && <label for="courseName" className={`LabelInput ${(course.courseName) ? 'valid' : ''}`}>CourseName</label>}
                                        </div>

                                    </div> */}
                                </div>


                            ))}
                            <button type="submit">{languageText.Update}</button>

                            {/* <div className="InputField">
                                <select
                                    className={`input ${(faculty) ? 'valid' : ''}`}

                                    onChange={(e) => setFaculty(e.target.value)}
                                    required

                                >
                                    <option value="" disabled selected hidden>{languageText.FacultyHelp}</option>
                                    <option value="Electrical" >{languageText.FKE}</option>
                                    <option value="Computing" >{languageText.FC}</option>
                                    <option value="Mechanical" >{languageText.FKM}</option>
                                    <option value="Civil" >{languageText.FKA}</option>
                                    <option value="Chemical" >{languageText.FKT}</option>
                                    <option value="Biosciences" >{languageText.FBME}</option>
                                    <option value="Build" >{languageText.FAB}</option>
                                    <option value="Geoinformation" >{languageText.FGHT}</option>
                                    <option value="Education" >{languageText.FP}</option>
                                    <option value="Management" >{languageText.FM}</option>
                                    <option value="Science" >{languageText.FS}</option>
                                    <option value="Islamic" >{languageText.FIC}</option>
                                    <option value="Bridging" >{languageText.Found}</option>
                                    <option value="Other" >{languageText.Other}</option>
                                </select>
                            </div> */}
                        </form>
                    )}
                </div>

            )}
            {/* {visitorCount} */}

        </div>
    );
}

export default CharityEditor;