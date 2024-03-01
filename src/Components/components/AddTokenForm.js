
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar, faCommentDots, faMoneyBill, faEnvelope, faPhone, faAddressBook, faLocation, faLocationPin, faLocationDot, faClose } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HorusTokenDay from '../../images/HorusToken.svg'
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFormsContext } from '../../hooks/useFormContext'

const AddTokenForm = ({ closeAddForm, languageText, api, filteredData, darkMode, language, token }) => {

    const [tokens, setToken] = useState('')
    const { points, dispatch } = useFormsContext()
    const navigate = useNavigate();


    const handleTokenSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await fetch(`${api}/api/point/${token._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ points: token.points + parseInt(tokens) }), // Parse 'tokens' to an integer

            });

            console.log('API Response:', response);

            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }

            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'points',
                payload: { id: token._id, changes: { points: token.points + parseInt(tokens) } },
            });

            toast.success(`${languageText.TokensAdded}`, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: darkMode ? "dark" : "colored",
                style: {
                    fontFamily: language === 'ar' ? 'Noto Kufi Arabic, sans-serif' : 'Poppins, sans-serif',
                },
            });

            closeAddForm(); // Close the form after successful submission

        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };





    return (
        <div className="FormPopup">
            <h3>{languageText.AddToken}</h3>
            <form onSubmit={(e) => handleTokenSubmit(e)}>
                <div className="InputField">
                    <div className="InputLabelField">
                        <input
                            type="number"
                            className={`input ${(tokens) ? 'valid' : ''}`}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            id="token"
                            name="token"
                        />
                        {!tokens && <label for="token" className={`LabelInput ${(tokens) ? 'valid' : ''}`}>
                            <img src={HorusTokenDay} className="InputLogo"></img>

                            {languageText.Token}</label>}
                    </div>
                </div>



                <button className="SubmitButton">{languageText.Submit}</button>

            </form>
            <button className="icon Delete CloseFormButton" onClick={(e) => {
                e.stopPropagation();
                closeAddForm()
            }}>
                <span class="tooltip Delete" >{languageText.close}</span>
                <span><Icon icon="icon-park-outline:add-one" width="1.2em" height="1.2em" /></span>
            </button>

        </div >

    );
}

export default AddTokenForm;