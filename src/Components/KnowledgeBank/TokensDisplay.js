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
import './KnowledgeBank.css'

const TokensDisplay = ({ language, languageData, api, darkMode }) => {
    const { points, dispatch } = useFormsContext()
    const { user } = useAuthContext()
    const languageText = languageData[language];
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
                const sortedData2 = data.sort((a, b) => b.points - a.points); // Sort data alphabetically by 'name' field
                const sortedData = sortedData2.filter((token) => token.status); // Sort data alphabetically by 'name' field
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

    return (
        <div className="FormData">
            {loading ? (
                <div><Loader darkMode={darkMode} /></div>
            ) : (
                <div className="FormDataBack">
                    <h2 className="EventName">{languageText.TokensShowcase}</h2>
                    {/* <div className="FormResponses">
                        <div className="FormResponsesLeft">
                            <p>{languageText.NoTokens}</p>
                            <p>{TokensLength}</p>
                        </div>
                        {!darkMode ?
                            <img src={HorusTokenDay} className="HorusLogoNumber" alt="" /> :
                            <img src={HorusTokenDark} className="HorusLogoNumber" alt="" />}
                    </div> */}
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
                                <th >{languageText.Matric}</th>
                                {/* <th style={language === "ar" ? { width: 'fit-content' } : {}}>{languageText.Tokens}</th> */}
                                <th>{languageText.Tokens}</th>
                            </tr>
                            {filteredData.map((token) => (


                                <tr className="ResponseHeader ResponseContent">
                                    <td>{token.matric}</td>
                                    <td>{token.points}</td>
                                </tr>
                            ))}
                        </table>

                    </div>

                </div>
            )}
        </div>
    );
}

export default TokensDisplay;