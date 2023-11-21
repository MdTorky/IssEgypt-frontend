import './Suggestions.css'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope, faXmark, faBellSlash
} from '@fortawesome/free-solid-svg-icons';

import { useFormsContext } from '../../hooks/useFormContext'


const Suggestions = ({ language, languageData }) => {

    const { forms, dispatch } = useFormsContext()

    const languageText = languageData[language];

    const [error, setError] = useState('')


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
        const response = await fetch('/api/forms/' + suggestion._id, {
            method: 'DELETE'

        })
        const json = await response.json();
        if (response.ok) {
            dispatch({ type: 'DELETE_FORM', payload: json })
        }
    }


    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://iss-egypt-backend.vercel.app/api/forms'); // Update with your API domain
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    return;
                }

                const data = await response.json();
                console.log(data);
                dispatch({ type: 'SET_FORM', payload: data });
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
            }
        };
        fetchData();
    }, []);
    return (
        <div className="Suggestions">
            <h1>ISS Egypt Website Suggestions</h1>
            <div className="suggestionTable">
                {!isEmpty(forms) ? (forms.map((suggestion) => (
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
                                <button className="icon" onClick={() => { handleDelete({ suggestion: suggestion }) }}>
                                    <span className="tooltip" >{languageText.delete}</span>
                                    <span><FontAwesomeIcon icon={faXmark} /></span>
                                </button>
                            </div>

                        </div>
                        <div className="bottomSuggestion">
                            <p key={suggestion._id}>{suggestion.suggestion}</p>
                        </div>
                    </div>
                ))) :
                    (
                        <div className='noAnn'>
                            <FontAwesomeIcon icon={faBellSlash} beatFade />
                            <h2 className="noAnnouncements">{languageText.noAnnouncement}</h2>

                        </div>
                    )}

            </div>
        </div>
    );
}

export default Suggestions;