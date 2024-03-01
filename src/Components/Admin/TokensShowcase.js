import { useState, useEffect } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/HorusLoader'
import HorusTokenDay from '../../images/HorusToken.svg'
import HorusTokenDark from '../../images/HorusTokenDark.svg'
import '../KnowledgeBank/KnowledgeBank.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCommentDots, faStar, faUser, faEnvelope, faPen, faTrash, faEye, faBolt, faFileExcel, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddTokenForm from '../components/AddTokenForm'

const TokensShowcase = ({ language, languageData, api, darkMode }) => {
    const { points, dispatch } = useFormsContext()
    const { user } = useAuthContext()
    const languageText = languageData[language];
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddFormOpen, setAddFormOpen] = useState(false);
    const [tokenToAdd, setTokenToAdd] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            try {

                const response = await fetch(`${api}/api/point`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    // setMessages(true);


                    return;
                }

                const data = await response.json();
                const sortedData = data.sort((a, b) => b.points - a.points); // Sort data alphabetically by 'name' field
                dispatch({
                    type: 'SET_ITEM',
                    collection: "points",
                    payload: sortedData,
                });
                // setMessages(false);
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
                // setMessages(true);
            } finally {
                // Set loading to false once the data is fetched (success or error)
                setLoading(false);
            }
        };
        fetchData();
    }, [api, dispatch, points]);;


    const TokensLength = points.length

    const filteredData = points.filter((form) => {
        const searchRegex = new RegExp(searchTerm, 'i');
        return (
            (searchRegex.test(form.name) ||
                searchRegex.test(form.matric))
        );
    });






    const handleStatusChange = async (selectedForm) => {
        try {


            // Find the form in the state based on formId
            const formToUpdate = filteredData.find((token) => token._id === token._id);

            // Ensure the form was found
            if (!formToUpdate) {
                console.error('Form not found in state');
                return;
            }

            let state = null;
            if (selectedForm.status === true) {
                state = false;
            } else {
                state = true;
            }
            const response = await fetch(`${api}/api/point/${selectedForm._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: state }),

            });


            console.log('API Response:', response);

            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }


            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'points',
                payload: { id: selectedForm._id, changes: { status: state } },
            });

            {
                toast.success(`${languageText.statusChanged}`, {
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

        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };


    const handleZero = async (token) => {
        try {
            const confirmed = window.confirm("Are you sure you want to set the tokens to zero?");
            if (confirmed) {
                const response = await fetch(`${api}/api/point/${token._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ points: 0, status: false }), // Parse 'tokens' to an integer
                });

                console.log('API Response:', response);

                if (!response.ok) {
                    console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                dispatch({
                    type: 'UPDATE_ITEM',
                    collection: 'points',
                    payload: { id: token._id, changes: { points: 0 }, status: false },
                });

                toast.success(`${languageText.TokensRemoved}`, {
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
            }


        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };


    const openAddForm = (token) => {
        setAddFormOpen(true);
        setTokenToAdd(token);
    };

    const closeAddForm = () => {
        setAddFormOpen(false);
    };

    return (
        <div className="FormData">
            {loading ? (
                <div><Loader darkMode={darkMode} /></div>
            ) : (
                <div className="FormDataBack">
                    <h2 className="EventName">{languageText.TokensShowcaseAdmin}</h2>
                    <div className="FormResponses">
                        <div className="FormResponsesLeft">
                            <p>{languageText.NoTokens}</p>
                            <p>{TokensLength}</p>
                        </div>
                        {!darkMode ?
                            <img src={HorusTokenDay} className="HorusLogoNumber" alt="" /> :
                            <img src={HorusTokenDark} className="HorusLogoNumber" alt="" />}
                    </div>

                    <div className="SearchForms">
                        <input
                            className={`Search ${searchTerm && filteredData.length === 0 ? 'noMembers' : 'hasMembers'}`}
                            placeholder={`${languageText.searchToken}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />


                    </div>
                    <div className="ResponseBack">
                        <table>
                            <tr className="ResponseHeader">
                                <th >{languageText.FullName}</th>
                                <th >{languageText.Matric}</th>
                                <th >{languageText.Tokens}</th>
                                <th >{languageText.Status}</th>
                                <th >{languageText.Action}</th>
                            </tr>
                            {filteredData.map((token) => (


                                <tr className="ResponseHeader ResponseContent">
                                    <td>{token.name}</td>
                                    <td>{token.matric}</td>
                                    <td>{token.points}</td>
                                    <td ><div className={`${token.status === true ? 'True' : "False"}`}>STATUS</div></td>
                                    <td>
                                        <div className="icons TableIcons">
                                            <button className="icon Status" onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(token)
                                            }}>
                                                <span class="tooltip Delete" >{languageText.changeStatus}</span>
                                                <span><Icon icon="grommet-icons:status-good" width="1.2em" height="1.2em" /></span>
                                            </button>

                                            <button className="icon" onClick={(e) => {
                                                e.stopPropagation();
                                                openAddForm(token)
                                            }}>
                                                <span class="tooltip Delete" >{languageText.AddToken}</span>
                                                <span><Icon icon="icon-park-outline:add-one" width="1.2em" height="1.2em" /></span>
                                            </button>
                                            <button className="icon Zero" onClick={(e) => {
                                                e.stopPropagation();
                                                handleZero(token)
                                            }}>
                                                <span class="tooltip" >{languageText.zeroChange}</span>
                                                <span><Icon icon="tabler:creative-commons-zero" width="1.2em" height="1.2em" /></span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </table>

                    </div>
                    {isAddFormOpen && tokenToAdd && (
                        <AddTokenForm
                            closeAddForm={closeAddForm}
                            languageText={languageText}
                            api={api}
                            filteredData={filteredData}
                            darkMode={darkMode}
                            language={language}
                            token={tokenToAdd} // Pass the token object
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default TokensShowcase;