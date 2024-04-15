import React from 'react'
import { useState, useEffect } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'
import InputField from '../components/FormInputField';
import Select from 'react-select';
import SelectStyles from '../components/SelectStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
const BookingForm = ({ api, language, languageData, darkMode }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const languageText = languageData[language];

    const { books, faculties, dispatch } = useFormsContext()
    const [bookData, setBookData] = useState('')
    const [loading, setLoading] = useState(false)
    const [bookLoading, setBookLoading] = useState(false)
    const [error, setError] = useState('')
    const [updating, setUpdating] = useState(false)

    const [reserverName, setReserverName] = useState()
    const [reserverEmail, setReserverEmail] = useState()
    const [reserverPhone, setReserverPhone] = useState()
    const [reserverMatric, setReserverMatric] = useState()
    const [reserverDate, setReserverDate] = useState()
    const [reserverFaculty, setReserverFaculty] = useState("");
    const [filteredBooks, setFilteredBooks] = useState([]);
    const styles = SelectStyles(darkMode);
    const indicesToInclude = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${api}/api/book/${id}`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'GET_ITEM',
                    collection: 'books',
                    payload: data,
                });
                setBookData(data)
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api, dispatch, id]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/faculty`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');

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

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
            } finally {
                // Set loading to false once the data is fetched (success or error)
            }
        };
        fetchData();
    }, [api, dispatch, faculties]);


    const filteredFaculties = faculties
        .filter((_, index) => indicesToInclude.includes(index)) // Filter based on indicesToInclude array
        .map((faculty) => {
            const id = faculty.facultyId;
            return {
                label: languageText[id],
                value: faculty.facultyId
            };
        });




    const handleBookStatusChange = async (id) => {
        try {




            const response = await fetch(`${api}/api/book/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookStatus: "Not Available" }),

            });


            console.log('API Response:', response);

            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }


            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'books',
                payload: { id: id, changes: { bookStatus: "Not Available" } },
            });

            // {
            //     toast.success(`${languageText.statusChanged}`, {
            //         position: "bottom-center",
            //         autoClose: 3000,
            //         hideProgressBar: true,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         theme: darkMode ? "dark" : "colored",
            //         style: {
            //             fontFamily: language === 'ar' ?
            //                 'Noto Kufi Arabic, sans-serif' :
            //                 'Poppins, sans-serif',
            //         },
            //     });
            // }

        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const booking = {
            bookId: id,
            reserverName,
            reserverEmail,
            reserverPhone,
            reserverMatric,
            reserverDate,
            reserverFaculty,
            reserverStatus: "Pending"
        }

        const response = await fetch(`${api}/api/booking`, {
            method: 'POST',
            body: JSON.stringify(booking),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        await handleBookStatusChange(id)
        const json = await response.json()


        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            setError(null)

            dispatch({
                type: 'CREATE_FORM',
                collection: "bookings",
                payload: json
            })
            {
                toast.success(`${languageText.BookingSubmitted}`, {
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
            navigate("/library")
        }
    }

    useEffect(() => {
        const filterBooksByFaculty = () => {
            if (reserverFaculty) {
                // const filtered = books.filter((book) => book.bookFaculty.includes(reserverFaculty) && book._id != id);
                const filtered = books.filter((book) => book.bookFaculty.includes(reserverFaculty));
                setFilteredBooks(filtered);
            }
        };

        filterBooksByFaculty();
    }, [reserverFaculty, books]);

    useEffect(() => {
        const fetchData = async () => {
            setBookLoading(true)
            try {
                const response = await fetch(`${api}/api/book`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');

                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'SET_ITEM',
                    collection: "books",
                    payload: data,
                });
                setBookLoading(false)

                // setFacultyLoading(false);

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
            }
        };
        fetchData();
    }, [api, dispatch, reserverFaculty]);



    return (
        <div className="Form">
            {loading ? (
                <div><Loader darkMode={darkMode} /></div>
            ) : (
                <div className="formBox" style={updating ? { background: "transparent" } : {}}>
                    {updating &&
                        <div>
                            <Loader languageText={languageText.Submitting} darkMode={darkMode} />
                        </div>
                    }
                    {!updating && (
                        <>
                            <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
                                <h2>{languageText.BookingForm}</h2>

                                <div className="FormImage">
                                    <img src={bookData.bookImage} alt="" />
                                </div>
                                <p className="FormDetails">{bookData.bookName}</p>
                                <div className="InputRow">
                                    <InputField option={reserverName} setOption={setReserverName} languageText={languageText.FullName} icon={"openmoji:european-name-badge"} type={"text"} required={true} option2={"reserverName"} />
                                    <InputField option={reserverEmail} setOption={setReserverEmail} languageText={languageText.Email} icon={"eva:email-fill"} type={"email"} required={true} option2={"reserverEmail"} />
                                </div>
                                <div className="InputRow">
                                    <InputField option={reserverPhone} setOption={setReserverPhone} languageText={languageText.Phone} icon={"bi:phone-fill"} type={"number"} required={true} option2={"reserverPhone"} />
                                    <InputField option={reserverMatric} setOption={setReserverMatric} languageText={languageText.Matric} icon={"clarity:id-badge-line"} type={"text"} required={true} option2={"reserverMatric"} />
                                </div>
                                <div className="InputRow">



                                    <div className="InputField">
                                        <Select
                                            className={`CustomSelect ${(reserverFaculty) ? 'valid' : ''}`}
                                            placeholder={<><Icon icon="lucide:school" className="IconSize" /> {languageText.Faculty}</>}
                                            options={filteredFaculties}
                                            isSearchable={false}
                                            noOptionsMessage={() => languageText.NoFaculty}
                                            onChange={opt => {
                                                setReserverFaculty(opt.value);
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
                                    <div className="InputField">
                                        <div className="InputLabelField">
                                            <input
                                                type="datetime-local"
                                                className={`input ${(reserverDate) ? 'valid' : ''}`}
                                                onChange={(e) => { setReserverDate(e.target.value) }}
                                                required
                                                id="reserverDate"
                                            />
                                            {!reserverDate && <label htmlFor="reserverDate" className={`LabelInput ${(reserverDate) ? 'valid' : ''}`}><Icon icon="mdi:sort-date-ascending" /> {languageText.ReturnDate}</label>}
                                        </div>
                                    </div>
                                </div>
                                <button disabled={loading}>{languageText.Submit}</button>

                            </form>
                            {filteredBooks.length > 0 && <div >
                                <h2>Recommended Books</h2>
                                {bookLoading ? (
                                    <div><Loader darkMode={darkMode} /></div>
                                ) : (
                                    <div className="RecommendedBooks">
                                        {filteredBooks.map((book) => (
                                            <Link to={`/bookingForm/${book._id}`} key={book._id} className='RecommendedBook'>
                                                <img src={book.bookImage} alt="" />
                                                <h6>{book.bookName}</h6>
                                            </Link>

                                        ))}
                                    </div>
                                )}
                            </div>}
                        </>
                    )}
                </div>
            )}

        </div>
    )
}

export default BookingForm
