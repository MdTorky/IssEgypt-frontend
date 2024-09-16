import "./Internships.css"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInfoCircle, faAt, faSquareUpRight, faCheck, faEnvelope, faXmark, faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Loader from '../Loader/Loader'

import { useFormsContext } from '../../hooks/useFormContext'

const Internships = ({ language, languageData, api }) => {

    const { internships = [], dispatch } = useFormsContext();


    const languageText = languageData[language];

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedLocations, setSelectedLocations] = useState([]);

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
    }, [api, dispatch, internships]);;





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
            case 3: interns = filteredInternships.filter((interns) => interns.faculty === 'Mechanical');
                break;
            case 4: interns = filteredInternships.filter((interns) => interns.faculty === 'Civil');
                break;
            case 5: interns = filteredInternships.filter((interns) => interns.faculty === 'Chemical');
                break;
            case 6: interns = filteredInternships.filter((interns) => interns.faculty === 'Other');
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






    const handleLocationChange = (e) => {
        const selectedLocation = e.target.value;
        setSelectedLocation(selectedLocation === '' ? 'all' : selectedLocation);
        if (selectedLocation === '') {
            // If "All Locations" is selected, clear the selected locations
            setSelectedLocations([]);
            const select = document.getElementById('locationFilter');
            const options = select.options;
            for (let i = 0; i < options.length; i++) {
                options[i].classList.remove('selected-option');
            }
        } else {
            setSelectedLocations((prevSelectedLocations) => {
                if (prevSelectedLocations.includes(selectedLocation)) {
                    // Remove location if already selected
                    return prevSelectedLocations.filter((location) => location !== selectedLocation);
                } else {
                    // Add location if not already selected
                    return [...prevSelectedLocations, selectedLocation];
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




    const clearLocationFilters = () => {
        // Clear selected location, locations, and search term
        setSelectedLocation('');
        setSelectedLocations([]);
        setSearchTerm('');
        const select = document.getElementById('locationFilter');
        const options = select.options;
        for (let i = 0; i < options.length; i++) {
            options[i].classList.remove('selected-option');
        }
    };

    const renderSelectedLocations = () => {
        if (selectedLocations.length === 0) {
            return <p style={{ display: 'none' }}></p>;
        }

        return (
            <div className="selectedCategories">
                <div className="rowCategories rowLocations">
                    {selectedLocations.map((location) => (
                        <div key={location}> <FontAwesomeIcon icon={faLocationDot} />      {location}</div>
                    ))}
                </div>
            </div>
        );
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
            value: 'AI',
            label: languageText.ai
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
            value: 'Chemical',
            label: languageText.chemical
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
            value: 'E-Commerce',
            label: languageText.eCommerce
        },
        {
            value: 'Cybersecurity',
            label: languageText.security
        },
        {
            value: 'Research',
            label: languageText.research
        }
    ];



    const locationOptions = [
        {
            value: '',
            label: languageText.allLocation
        },
        {
            value: 'Johor',
            label: "Johor"
        },
        {
            value: 'Kedah',
            label: "Kedah"
        },
        {
            value: 'Kelantan',
            label: "Kelantan"
        },
        {
            value: 'Kuala Lumpur',
            label: "Kuala Lumpur"
        },
        {
            value: 'Melacca',
            label: "Melacca"
        },
        {
            value: 'Negeri Sembilan',
            label: "Negeri Sembilan"
        },
        {
            value: 'Pahang',
            label: "Pahang"
        },
        {
            value: 'Penang',
            label: "Penang"
        },
        {
            value: 'Perak',
            label: "Perak"
        },
        {
            value: 'Perlis',
            label: "Perlis"
        },
        {
            value: 'Sabah',
            label: "Sabah"
        },
        {
            value: 'Sarawak',
            label: "Sarawak"
        },
        {
            value: 'Selangor',
            label: "Selangor"
        },
        {
            value: 'Terengganu',
            label: "Terengganu"
        },
        {
            value: 'Overseas',
            label: "Overseas"
        }
    ];





    const card = (text, number) => {
        const internsToShow = allInterns(number).filter((intern) => {
            const matchesSearch = (
                intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                intern.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                intern.categories.toLowerCase().includes(searchTerm.toLowerCase()) ||
                intern.location.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesCategories = (
                selectedCategories.length === 0 ||
                (intern.categories && intern.categories.some((category) => selectedCategories.includes(category)))
            );

            const matchesLocations = (
                selectedLocations.length === 0 ||
                (intern.location && intern.location.some((location) => selectedLocations.includes(location)))
            );
            return matchesSearch && matchesCategories && matchesLocations;
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
                                <p>{intern._id}</p>
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

                                    {/*   {intern && intern.categories && (
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
            <div className="allFilters">
                <div className="categoryFilter">
                    {/* <label htmlFor="categoryFilter">{languageText.chooseCategory}</label> */}
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
                                    <div className="checkIcon">✓ </div>
                                )}
                                {option.label}

                            </option>
                        ))}
                    </select>

                    <button className={`icon filter`} onClick={clearFilters}>
                        <span className="tooltip" >{languageText.clear}</span>
                        <span><FontAwesomeIcon icon={faXmark} /></span>
                    </button>


                </div>
                <div className="categoryFilter locationFilter">
                    {/* <label htmlFor="locationFilter">{languageText.chooseLocation}</label> */}
                    <select
                        id="locationFilter"
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        className={selectedLocation ? 'selected' : ''}
                    >
                        {locationOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {selectedLocations.includes(option.value) && (
                                    <div className="checkIcon">✓ </div>
                                )}
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button className={`icon filter`} onClick={clearLocationFilters}>
                        <span className="tooltip" >{languageText.clear}</span>
                        <span><FontAwesomeIcon icon={faXmark} /></span>
                    </button>

                </div>
            </div>
            <div className="filters">
                {renderSelectedCategories()}
                {renderSelectedLocations()}
            </div>
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

            <div className="scroll">
                <div className="sectionBox">

                    {/* {internships.length === 0 && searchTerm === '' && (
                        <p>No internships available.</p>
                    )}
                    {filteredInternships.length === 0 && searchTerm !== '' && (
                        <p>No results found.</p>
                    )} */}
                    <>
                        {card(languageText.General, 6)}
                        {card(languageText.FKE, 1)}
                        {card(languageText.FC, 2)}
                        {card(languageText.FKM, 3)}
                        {card(languageText.FKA, 4)}
                        {card(languageText.FKT, 5)}
                        {loading && (
                            <div><Loader /></div>
                        )}
                    </>

                </div>

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