import "./Internships.css"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInfoCircle, faAt, faSquareUpRight, faLocationDot, faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Loader from '../Loader/Loader'

import { useFormsContext } from '../../hooks/useFormContext'

const Internships = ({ language, languageData, api }) => {

    const { internships, dispatch } = useFormsContext()

    const languageText = languageData[language];

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');


    const Button = ({ item, languageText }) => {

        const [popupVisible, setPopupVisible] = useState(false);

        return (
            <div className="icons">

                {item && item.website && (
                    <button className="icon" onClick={() => { window.open(item.website, "_blank") }}>
                        <span className="tooltip" >{languageText.Website}</span>
                        <span><FontAwesomeIcon icon={faInfoCircle} /></span>
                    </button>
                )}
                {item && item.email && (

                    <button className={`icon`} onClick={() => { window.open(`mailto:${item.email}`, "_blank") }}>
                        <span className="tooltip" >{languageText.Email}</span>
                        <span><FontAwesomeIcon icon={faEnvelope} /></span>
                    </button>
                )}
                {item && item.applyEmail && (

                    <button className={`icon`} onClick={() => { window.open(`mailto:${item.applyEmail}`, "_blank") }}>
                        <span className="tooltip" >{languageText.ApplyEmail}</span>
                        <span><FontAwesomeIcon icon={faAt} /></span>
                    </button>
                )}
                {item && item.apply && (

                    <button className={`icon`} onClick={() => { window.open(item.apply, "_blank") }}>
                        <span className="tooltip" >{languageText.Apply}</span>
                        <span><FontAwesomeIcon icon={faSquareUpRight} /></span>
                    </button>
                )}
            </div >

        )
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/internship`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort data alphabetically by 'name' field
                dispatch({
                    type: 'SET_ITEM',
                    collection: "internships",
                    payload: sortedData,
                });
                setMessages(false);
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
    }, [api, dispatch]);;



    const filteredInternships = Array.isArray(internships) ? internships.filter(
        (internships) =>
            internships.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internships.faculty.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];


    const allInterns = (number) => {
        let interns = filteredInternships; // Change const to let here


        switch (number) {
            case 1: interns = filteredInternships.filter((interns) => interns.faculty === 'Electrical');
                break;
            case 2: interns = filteredInternships.filter((interns) => interns.faculty === 'Computing');
                break;
            case 5: interns = filteredInternships.filter((interns) => interns.faculty === 'Other');
                break;
            default: break;
        }
        return interns;
    }


    const card = (text, number) => {
        const internsToShow = allInterns(number).filter((intern) =>
            intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            intern.faculty.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!internsToShow.length) {
            return null;
        }
        return (

            <div className="outerBox">
                <div className="innerBox">
                    <h2>{text}</h2>
                    <div className="cards">
                        {internsToShow && internsToShow.map((intern) => (
                            <div className="card">
                                <div className="img"><img src={intern.img} alt="" /></div>
                                <div className="cardsBottomContent">
                                    <p>{intern.name} </p>
                                    <Button item={intern} languageText={languageText} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="internships">
            <h1 className="title">{languageText.internships}</h1>
            <div className="searchContainer">
                <input
                    className={`Search ${searchTerm && filteredInternships.length === 0 ? 'noMembers' : 'hasMembers'}`}
                    placeholder={`${languageText.searchIntern}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


            <div className="sectionBox">
                {card(languageText.FKE, 1)}
                {card(languageText.FC, 2)}
                {card(languageText.General, 5)}
                {loading && (
                    <div><Loader /></div>
                )}




                {/* {popupVisible && selectedItem && (
                    <div className={`popup ${popupVisible ? 'popup-opening' : 'popup-closing'}`}>
                        <div className="popup-content">

                            <div className="bottom">
                                <>
                                    <div className="header">
                                        <div className="headerImg">
                                            <img src={selectedItem.img} alt="" />
                                            <div className="headerTitle">{selectedItem.name}</div>
                                        </div>

                                        <button className="icon" onClick={closePopup}>
                                            <span className="tooltip" >{languageText.close}</span>
                                            <span><FontAwesomeIcon icon={faXmark} /></span>
                                        </button>

                                    </div>
                                    <div className="bus new">{selectedItem.description}</div>

                                </>

                            </div>
           

                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
}

export default Internships;