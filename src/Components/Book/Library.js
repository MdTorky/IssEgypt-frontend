import './Library.css'
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


const Library = ({ api, languageData, language }) => {

    const [search, setSearch] = useState();
    const languageText = languageData[language];
    const { books, dispatch } = useFormsContext()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/book`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                // const sortData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                // const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort data alphabetically by 'name' field
                dispatch({
                    type: 'SET_ITEM',
                    collection: "books",
                    payload: data,
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

    const filteredData = books.filter((book) => {
        const searchRegex = new RegExp(searchTerm, 'i');
        return (
            (searchRegex.test(book.bookName))
        );
    });



    const BookCard = ({ book }) => {
        return (
            <div className="BookCard">
                <div className="BookAvailability"><Icon icon="oui:dot" /></div>
                <div className="BookImage">
                    <img src={book.bookImage} alt="" />
                </div>
                <div className="BookCardText">
                    <h3>{book.bookName}</h3>
                    <button>
                        <span class="BookBox">
                            Book Now
                        </span>
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div className="Library">
            <div className="LibraryContainer">
                <div className="SearchBarContainer">

                    <div className="SearchBar">
                        <button>
                            <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                                <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                        <input className="SearchInput" placeholder="Type your text"
                            required
                            type="text"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="SearchReset" type="reset">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="NormalBooksContainer">
                    <h2>Library Books</h2>
                    <div className="NormalBooks">
                        {filteredData.map((book) => (
                            <BookCard book={book} key={book.id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Library;