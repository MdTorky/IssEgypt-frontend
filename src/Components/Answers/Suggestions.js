import './Suggestions.css'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {

    faEnvelope, faXmark, faBellSlash, faCommentSlash
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../Loader/Loader'

import { useFormsContext } from '../../hooks/useFormContext'


const Suggestions = ({ language, languageData, api, darkMode }) => {

    const { forms, dispatch } = useFormsContext()

    const languageText = languageData[language];

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(true)


    // useEffect(() => {
    //     const fetchSuggestions = async () => {
    //         try {
    //             const response = await fetch('/api/forms');

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }

    //             const json = await response.json();
    //             dispatch({ type: 'SET_FORM', payload: json });
    //             setError(''); // Clear the error when the request is successful
    //         } catch (error) {
    //             console.error('Error fetching suggestions:', error);
    //             setError('An error occurred while fetching suggestions.');
    //         }
    //     };

    //     fetchSuggestions();
    // }, [dispatch]);


    const handleDelete = async ({ suggestion }) => {
        try {
            const response = await fetch(`${api}/api/forms/${suggestion._id}`, {
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
                    collection: "forms",
                    payload: json
                });
                {
                    toast.success(`${languageText.suggestionDelete}`, {
                        position: "bottom-center",
                        autoClose: 5000,
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

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    };

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
                console.log(data);
                dispatch({
                    type: 'SET_ITEM',
                    collection: "forms",
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
    return (
        <div className="Suggestions">
            <h1>{languageText.suggestions}</h1>
            <div className="suggestionTable">
                {loading && <div><Loader /></div>}
                {forms && forms.map((suggestion) => (
                    <div className="suggestionCard">
                        <div className="topSuggestion">
                            <div className="info">
                                <h3 key={suggestion._id}>{suggestion.name}</h3>
                                <div className="infoP">
                                    <p key={suggestion._id}>{suggestion.matric}</p>
                                    <p key={suggestion._id}>{suggestion.faculty}</p>
                                </div>

                            </div>

                            <div className="icons">
                                <button className="icon" onClick={() => { window.open("mailto:" + suggestion.email, "_blank") }}>
                                    <span className="tooltip" >{languageText.Email}</span>
                                    <span><FontAwesomeIcon icon={faEnvelope} /></span>
                                </button>
                                <button className="icon delete" onClick={() => { handleDelete({ suggestion: suggestion }) }}>
                                    <span className="tooltip delete" >{languageText.delete}</span>
                                    <span><FontAwesomeIcon icon={faXmark} /></span>
                                </button>
                            </div>

                        </div>
                        <div className="bottomSuggestion">
                            <p key={suggestion._id}>{suggestion.suggestion}</p>
                        </div>
                    </div>
                ))}
                {!loading && isEmpty(forms) && !error && (

                    <center><div className='noAnn'>
                        <div className="noAnn2">
                            <FontAwesomeIcon icon={faCommentSlash} beatFade />
                            <h2 className="noAnnouncements">{languageText.noSuggestions}</h2>
                        </div>

                    </div></center>
                )}

            </div>
        </div>
    );
}

export default Suggestions;