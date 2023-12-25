import "./Internships.css"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInfoCircle, faAt, faSquareUpRight, faCheck, faEnvelope, faXmark
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
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const Button = ({ item, languageText }) => {

        // const [popupVisible, setPopupVisible] = useState(false);

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




    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setSelectedCategory(selectedCategory === '' ? 'all' : selectedCategory);
        if (selectedCategory === '') {
            // If "All Categories" is selected, clear the selected categories
            setSelectedCategories([]);
            const select = document.getElementById('categoryFilter');
            const options = select.options;
            for (let i = 0; i < options.length; i++) {
                options[i].classList.remove('selected-option');
            }
        } else {
            setSelectedCategories((prevSelectedCategories) => {
                if (prevSelectedCategories.includes(selectedCategory)) {
                    // Remove category if already selected
                    return prevSelectedCategories.filter((category) => category !== selectedCategory);
                } else {
                    // Add category if not already selected
                    return [...prevSelectedCategories, selectedCategory];
                }
            });
        }

        const select = e.target;
        const selectedOption = select.options[select.selectedIndex];
        selectedOption.classList.add('selected-option');
    };

    const clearFilters = () => {
        // Clear selected category, categories, and search term
        setSelectedCategory('');
        setSelectedCategories([]);
        setSearchTerm('');
        const select = document.getElementById('categoryFilter');
        const options = select.options;
        for (let i = 0; i < options.length; i++) {
            options[i].classList.remove('selected-option');
        }

    };

    const categoryOptions = [
        {
            value: '',
            label: languageText.allCategory
        },
        {
            value: 'Technology',
            label: languageText.technology
        },
        {
            value: 'Finance',
            label: languageText.finance
        },
        {
            value: 'Retail',
            label: languageText.retail
        },
        {
            value: 'Manufacturing',
            label: languageText.manufacturing
        },
        {
            value: 'Telecom',
            label: languageText.telecom
        },
        {
            value: 'Energy',
            label: languageText.energy
        },
        {
            value: 'Transport',
            label: languageText.transport
        },
        {
            value: 'Entertainment',
            label: languageText.entertainment
        },
        {
            value: 'Automotive',
            label: languageText.automotive
        },
        {
            value: 'Education',
            label: languageText.education
        },
        {
            value: 'Hospitality & Healthcare',
            label: languageText.hospitalityHealthcare
        },
        {
            value: 'Real Estate',
            label: languageText.realEstate
        },
        {
            value: 'Media & Communication',
            label: languageText.mediaCommunication
        },
        {
            value: 'Consulting',
            label: languageText.consulting
        },
        {
            value: 'Consumer Goods',
            label: languageText.consumerGoods
        },
        {
            value: 'Pharmaceuticals & Biotech',
            label: languageText.pharmaceuticalsBiotech
        },
        {
            value: 'Aerospace',
            label: languageText.aerospaceEngineering
        },
        {
            value: 'Nonprofit',
            label: languageText.nonprofit
        },
        {
            value: 'Fashion',
            label: languageText.fashion
        },
        {
            value: 'Food',
            label: languageText.food
        },
        {
            value: 'Insurance',
            label: languageText.insurance
        },
        {
            value: 'Logistics',
            label: languageText.logistics
        },
        {
            value: 'Internet Services',
            label: languageText.internetServices
        },
        {
            value: 'Renewable Energy',
            label: languageText.renewableEnergy
        }
    ];


    const renderSelectedCategories = () => {
        if (selectedCategories.length === 0) {
            return <p style={{ display: 'none' }}></p>;
        }

        return (
            <div className="selectedCategories">
                {/* <p>Selected Categories:</p> */}
                <div className="rowCategories">
                    {selectedCategories.map((category) => (
                        <div key={category}> • {category}</div>
                    ))}
                </div>
            </div>
        );
    };

    const card = (text, number) => {
        const internsToShow = allInterns(number).filter((intern) => {
            const matchesSearch = (
                intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                intern.faculty.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesCategories = (
                selectedCategories.length === 0 ||
                (intern.categories && intern.categories.some((category) => selectedCategories.includes(category)))
            );

            return matchesSearch && matchesCategories;
        });

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
                                    {intern && intern.categories && (
                                        <div className="categories">
                                            {intern.categories.map((category) => (
                                                <span key={category} className="category">
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* {intern && intern.categories && (
                                        <div className="categoryDropdown">
                                            <select className="categorySelect" value={selectedCategory}
                                                onChange={handleCategoryChange}>
                                                <option disabled selected value="" hidden>Categories</option>
                                                {intern.categories.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )} */}
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

            <div className="categoryFilter">
                <label htmlFor="categoryFilter">{languageText.chooseCategory}</label>
                <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className={selectedCategory ? 'selected' : ''}
                >


                    {categoryOptions.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {selectedCategories.includes(option.value) && (
                                // <FontAwesomeIcon icon={faCheck} className="checkIcon" />
                                <div className="checkIcon">✓ </div>
                            )}
                            {option.label}

                        </option>
                    ))}
                </select>

                {/* <button onClick={clearFilters} className="clearFilter"><FontAwesomeIcon icon={faXmark} /></button> */}
                <button className={`icon filter`} onClick={clearFilters}>
                    <span className="tooltip" >{languageText.clear}</span>
                    <span><FontAwesomeIcon icon={faXmark} /></span>
                </button>

            </div>
            {renderSelectedCategories()}

            <div className="textBox">
                <div className="hintField">
                    <FontAwesomeIcon icon={faInfoCircle} className="hintIcon" />
                    <p>{languageText.Website}</p>
                </div>
                <div className="hintField">
                    <FontAwesomeIcon icon={faEnvelope} className="hintIcon" />
                    <p>{languageText.Email}</p>
                </div>
                <div className="hintField">
                    <FontAwesomeIcon icon={faAt} className="hintIcon" />
                    <p>{languageText.ApplyEmail}</p>
                </div>
                <div className="hintField">
                    <FontAwesomeIcon icon={faSquareUpRight} className="hintIcon" />
                    <p>{languageText.Apply}</p>
                </div>
            </div>
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