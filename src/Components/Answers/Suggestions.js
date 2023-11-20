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


    useEffect(() => {
        const fetchSuggestions = async () => {
            const response = await fetch('/api/forms')
            const json = await response.json()


            if (response.ok) {
                dispatch({ type: 'SET_FORM', payload: json })
                setError('');
            }
            else {
                setError("No")
            }
        }

        fetchSuggestions()
    }, [dispatch])


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