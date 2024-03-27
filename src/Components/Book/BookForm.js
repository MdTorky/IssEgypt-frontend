import { useState, useEffect } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'
import InputField from '../components/FormInputField';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faPlus } from '@fortawesome/free-solid-svg-icons';




const BookForm = ({ api, language, languageData, darkMode }) => {
    const languageText = languageData[language];
    const { books, faculties, dispatch } = useFormsContext()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [bookName, setBookName] = useState("");
    const [bookImage, setBookImage] = useState(null);
    const [selectedImageText, setSelectedImageText] = useState(null);
    const [bookFaculty, setBookFaculty] = useState([]);
    const [expandedBookFaculty, setExpandedBookFaculty] = useState(false);
    const [messages, setMessages] = useState(false)

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
                // setFacultyLoading(false);

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
                setMessages(true);
            } finally {
                // Set loading to false once the data is fetched (success or error)
            }
        };
        fetchData();
    }, [api, dispatch]);


    const handleImgChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setBookImage(file);
            setSelectedImageText(file.name);
        }
    };
    const handleRemoveImage = (e) => {
        e.preventDefault()
        setBookImage(null);
        setSelectedImageText(null);
    }


    const showCheckboxes = () => {
        setExpandedBookFaculty(!expandedBookFaculty)

    };

    const handleFacultyChange = (value) => {
        const updatedFaculties = [...bookFaculty];
        if (updatedFaculties.includes(value)) {
            updatedFaculties.splice(updatedFaculties.indexOf(value), 1);
        } else {
            updatedFaculties.push(value);
        }
        setBookFaculty(updatedFaculties);
    };
    const facultyCheckboxes = ({ faculty, facultyId }) => {
        return (
            <div className="CategoryInput" >

                <input
                    type="checkbox"
                    id={facultyId}
                    value={facultyId}
                    checked={bookFaculty.includes(facultyId)}
                    onChange={() => handleFacultyChange(facultyId)}
                />
                <label htmlFor={facultyId}>{" " + faculty}</label>

            </div>
        );
    };
    // const generateFacultyCheckboxes = faculties => {
    //     return faculties.map(faculty => facultyCheckboxes(faculty));
    // };
    const generateFacultyCheckboxes = faculties => {
        return faculties.map(faculty => facultyCheckboxes({ faculty: faculty.facultyName, facultyId: faculty.facultyId }));
    };

    const uploadFile = async (type, file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", type === 'image' ? 'books_preset' : '');

        try {
            let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME2;
            let resourceType = type === 'image' ? 'image' : 'video';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, data);
            const { secure_url } = res.data;
            console.log(secure_url);
            return secure_url;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const imgUrl = await uploadFile('image', bookImage);

        const book = {
            bookName,
            bookImage: imgUrl,
            bookFaculty: bookFaculty,
            bookStatus: "Available"
        }

        const response = await fetch(`${api}/api/book`, {
            method: 'POST',
            body: JSON.stringify(book),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()


        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            setError(null)

            dispatch({
                type: 'CREATE_FORM',
                collection: "books",
                payload: json
            })
            {
                toast.success(`${languageText.BookSubmitted}`, {
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
            setBookName("")
            setBookFaculty("")
            setBookImage("")
            navigate("/adminDashboard")
        }
    }


    return (
        <div className="Form">
            {loading ? (
                <div><Loader languageText={languageText.Submitting} darkMode={darkMode} /></div>
            ) : (
                <div className="formBox" style={updating ? { background: "transparent" } : {}}>
                    {updating &&
                        <div>
                            <Loader languageText={languageText.Submitting} darkMode={darkMode} />
                        </div>
                    }
                    {!updating && (
                        <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
                            <h2>{languageText.BookForm}</h2>

                            <InputField option={bookName} setOption={setBookName} languageText={languageText.BookName} icon={"mdi:book-edit"} type={"text"} required={true} option2={"bookName"} />

                            <div className="InputField">

                                <label for="bookImage" className={`LabelInputImg ${(bookImage) ? 'valid' : ''}`}>
                                    <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><Icon icon="flowbite:book-solid" />{selectedImageText || languageText.BookImage}</div>
                                    {(bookImage)
                                        ? <button className="XImgButton" onClick={handleRemoveImage}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                        : <FontAwesomeIcon icon={faCloudArrowUp} />}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="bookImage"
                                    className={`input ${(bookImage) ? 'valid' : ''}`}
                                    style={{ display: 'none' }}
                                    onChange={handleImgChange}
                                />
                            </div>
                            <div className="InputField">
                                <div className="multiselect">
                                    <div className="selectBox" onClick={() => showCheckboxes()}>
                                        <select>
                                            <option><Icon icon="lucide:university" />{languageText.BookFaculty}</option>
                                        </select>
                                        <div className="overSelect"></div>
                                    </div>
                                    <div id="locationsCheckboxes" style={{ display: expandedBookFaculty ? 'flex' : 'none', flexDirection: 'column' }}>
                                        {generateFacultyCheckboxes(faculties)}
                                    </div>
                                </div>
                            </div>



                            <button disabled={loading}>{languageText.Submit}</button>
                        </form>
                    )}
                    {error && <div className="formError"><Icon icon="ooui:error" />{error}</div>}
                </div>
            )}
        </div>
    );
}

export default BookForm;