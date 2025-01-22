import './Library.css'
import { useState, useEffect } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { useNavigate, Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'
const Categories = ({ text, onChange, type }) => {

    return (
        <div className="CustomCheckBoxHolder">

            <input type="checkbox" onChange={() => onChange(type)} id={text} className="CustomCheckBoxInput" />
            <label for={text} className="CustomCheckBoxWrapper">
                <div className="CustomCheckBox">
                    <div className="InnerText">{text}</div>
                </div>
            </label>

        </div>
    );
};



const Library = ({ api, languageText, darkMode }) => {

    const { books, dispatch } = useFormsContext()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${api}/api/book`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'SET_ITEM',
                    collection: "books",
                    payload: data,
                });
                setMessages(false);
                setLoading(false)

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


    const handleCategoryChange = (category) => {
        if (category === 'All') {
            setSelectedCategories([]);
        } else {
            const index = selectedCategories.indexOf(category);
            if (index === -1) {
                setSelectedCategories([...selectedCategories, category]);
            } else {
                setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
            }
        }
    };
    const FilterBooks = (books) => {
        const categoryFilter = selectedCategories.length === 0 || books.bookFaculty.some((book) => selectedCategories.includes(book));
        return categoryFilter;
    };


    const BookCard = ({ book }) => {
        return (
            <div className="BookCard">
                <div className={`BookAvailability ${book.bookStatus === 'Available' ? 'Available' : ""}`}><Icon icon="oui:dot" /></div>
                <div className="BookImage">
                    <div className={`BookStatus ${book.bookStatus === 'Available' ? 'Available' : ""}`} data-attr={book.bookStatus}></div>
                    <img src={book.bookImage} alt="" />
                </div>
                <div className="BookCardText">
                    <h3>{book.bookName}</h3>
                    {book.bookStatus === "Available" && <Link className='BookingButton' to={`/bookingForm/${book._id}`} ><span class="BookNow">Book Now</span>
                        <span className="BookNowIcon">
                            <Icon icon="fluent:book-star-20-filled" />
                        </span></Link>}
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
                    {loading ? (
                        <div><Loader darkMode={darkMode} /></div>
                    ) : (
                        <div className="NormalBooks">
                            {filteredData.map((book) => (
                                <BookCard book={book} key={book.id} />
                            ))}
                        </div>
                    )}

                </div>

                <div className="NormalBooksContainer">
                    <h2>{languageText.Faculty}</h2>


                    <div className="BookCategories">
                        <div className="BookFaculties">
                            {Categories({ text: "All", status: selectedCategories.includes("All"), onChange: handleCategoryChange, type: "All" })}
                            {Categories({ text: languageText.FKE, status: selectedCategories.includes("FKE"), onChange: handleCategoryChange, type: "FKE" })}
                            {Categories({ text: languageText.FC, status: selectedCategories.includes("FC"), onChange: handleCategoryChange, type: "FC" })}
                            {Categories({ text: languageText.FKM, status: selectedCategories.includes("FKM"), onChange: handleCategoryChange, type: "FKM" })}
                            {Categories({ text: languageText.FKA, status: selectedCategories.includes("FKA"), onChange: handleCategoryChange, type: "FKA" })}
                            {Categories({ text: languageText.FKT, status: selectedCategories.includes("FKT"), onChange: handleCategoryChange, type: "FKT" })}
                            {Categories({ text: languageText.FAB, status: selectedCategories.includes("FAB"), onChange: handleCategoryChange, type: "FAB" })}
                            {Categories({ text: languageText.FGHT, status: selectedCategories.includes("FGHT"), onChange: handleCategoryChange, type: "FGHT" })}
                            {Categories({ text: languageText.FP, status: selectedCategories.includes("FP"), onChange: handleCategoryChange, type: "FP" })}
                            {Categories({ text: languageText.FM, status: selectedCategories.includes("FM"), onChange: handleCategoryChange, type: "FM" })}
                            {Categories({ text: languageText.FS, status: selectedCategories.includes("FS"), onChange: handleCategoryChange, type: "FS" })}
                            {Categories({ text: languageText.FIC, status: selectedCategories.includes("FIC"), onChange: handleCategoryChange, type: "FIC" })}
                            {Categories({ text: languageText.Space, status: selectedCategories.includes("Found"), onChange: handleCategoryChange, type: "Found" })}

                        </div>


                    </div>
                    {loading ? (
                        <div><Loader darkMode={darkMode} /></div>
                    ) : (
                        <div className="NormalBooks">
                            {filteredData.filter(FilterBooks).map((book) => (
                                <BookCard book={book} key={book.id} />
                            ))}
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}

export default Library;