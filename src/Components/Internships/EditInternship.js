import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext'
import Loader from '../Loader/Loader'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@iconify/react';

const EditInternship = ({ language, languageText, api, darkMode }) => {
    const { dispatch } = useFormsContext();
    const { id } = useParams();
    const [intern, setIntern] = useState()
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    const [selectedLocations, setSelectedLocations] = useState([]);
    const [expandedLocations, setExpandedLocations] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/internship/${id}`);
                if (!response.ok) {
                    console.error(`Error fetching form data. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'GET_ITEM',
                    collection: "internships",
                    payload: data,
                });
                setIntern(data);
                setSelectedLocations(data.location)
                setSelectedCategories(data.categories)

                console.log(data)
            } catch (error) {
                console.error('An error occurred while fetching form data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api, id, dispatch]);





    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIntern((prevGallery) => ({
            ...prevGallery,
            [name]: value,
        }));
    };







    const showCheckboxes = (type) => {
        if (type === 'categories') {
            setExpandedCategories(!expandedCategories);
            setExpandedLocations(false);
        } else if (type === 'locations') {
            setExpandedLocations(!expandedLocations);
            setExpandedCategories(false);
        }
    };


    const locationCheckbox = ({ location }) => {
        return (
            <div className="CategoryInput" >

                <input
                    type="checkbox"
                    id={location}
                    value={location}
                    checked={selectedLocations.includes(location)}
                    onChange={() => handleLocationChange(location)}
                />
                <label htmlFor={location}>{" " + location}</label>

            </div>
        );
    };
    const checkbox = ({ number, type }) => {
        return (
            <div className="CategoryInput" >

                <input
                    type="checkbox"
                    id={number}
                    value={type}
                    checked={selectedCategories.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                />
                <label htmlFor={number}>{" " + type}</label>
            </div>
        )
    }

    const generateLocationCheckboxes = cities => {
        return cities.map(city => locationCheckbox(city));
    };
    const generateCheckboxes = categories => {
        return categories.map(category => checkbox(category));
    };

    const handleLocationChange = (value) => {
        const updatedLocations = [...selectedLocations];
        if (updatedLocations.includes(value)) {
            updatedLocations.splice(updatedLocations.indexOf(value), 1);
        } else {
            updatedLocations.push(value);
        }
        setSelectedLocations(updatedLocations);
    };

    const handleCheckboxChange = (value) => {
        const updatedCategories = [...selectedCategories];
        if (updatedCategories.includes(value)) {
            updatedCategories.splice(updatedCategories.indexOf(value), 1);
        } else {
            updatedCategories.push(value);
        }
        setSelectedCategories(updatedCategories);
    };




    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);


        try {
            const response = await fetch(`${api}/api/internship/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: intern.name,
                    email: intern.email,
                    img: intern.img,
                    faculty: intern.faculty,
                    website: intern.website,
                    applyEmail: intern.applyEmail,
                    apply: intern.apply,
                    categories: selectedCategories,
                    location: selectedLocations
                }),
            });


            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }

            // Assuming the API response contains the updated form data
            const updatedInternData = await response.json();
            // console.log('Updated Form Data:', updatedMemberData);
            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'internships',
                payload: { id, changes: updatedInternData },
            });

            {
                toast.success(`${languageText.galleryEdited}`, {
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
            setUpdating(false);
            navigate(-1);


        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };


    return (
        <div className='Form'>
            {loading ? (
                <div><Loader /></div>
            ) : (
                <div className="formBox">
                    {updating &&
                        <div>
                            <p className='Updating'>{languageText.Updating}</p>
                            <Loader />
                        </div>
                    }
                    {!updating && (
                        <form
                            onSubmit={handleUpdate}
                        >
                            <h2>{languageText.editIntern}</h2>

                            <img src={intern.img} className="MemberEditorImg" />

                            <div className="InputRow">
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(intern.name) ? 'valid' : ''}`}
                                            required
                                            value={intern.name}
                                            id="name"
                                            name="name"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!intern.name && <label htmlFor="name" className={`LabelInput ${(intern.name) ? 'valid' : ''}`}><Icon icon="eos-icons:namespace" />Company's Name</label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(intern.email) ? 'valid' : ''}`}
                                            required
                                            value={intern.email}
                                            id="email"
                                            name="email"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!intern.email && <label htmlFor="email" className={`LabelInput ${(intern.email) ? 'valid' : ''}`}><Icon icon="line-md:email-arrow-up-filled" />Company's Email</label>}
                                    </div>
                                </div>
                            </div>
                            <div className="InputRow">
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(intern.img) ? 'valid' : ''}`}
                                            value={intern.img}
                                            id="img"
                                            name="img"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!intern.img && <label htmlFor="img" className={`LabelInput ${(intern.img) ? 'valid' : ''}`}><Icon icon="ion:image" />Company's Image Link</label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(intern.website) ? 'valid' : ''}`}
                                            required
                                            value={intern.website}
                                            id="website"
                                            name="website"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!intern.website && <label htmlFor="website" className={`LabelInput ${(intern.website) ? 'valid' : ''}`}><Icon icon="mdi:web" />Company's Website</label>}
                                    </div>
                                </div>
                            </div>

                            <div className="InputRow">
                                <div className="InputField">
                                    <select
                                        className={`input ${(intern.faculty) ? 'valid' : ''}`}
                                        value={intern.faculty}
                                        onChange={handleInputChange}
                                        required
                                        name="faculty"
                                    >
                                        <option value="" disabled selected hidden>{languageText.ChooseFaculty}</option>
                                        <option value="Electrical Engineering" >{languageText.FKE}</option>
                                        <option value="Computer Science" >{languageText.FC}</option>
                                        <option value="Mechanical Engineering" >{languageText.FKM}</option>
                                        <option value="Civil Engineering" >{languageText.FKA}</option>
                                        <option value="Chemical Engineering" >{languageText.FKT}</option>
                                        <option value="Bridging & Foundation" >{languageText.Found}</option>
                                        <option value="Other" >{languageText.Other}</option>
                                    </select>
                                </div>


                                <div className="InputField">
                                    <div className="multiselect">
                                        <div className="selectBox" onClick={() => showCheckboxes('locations')}>
                                            <select>
                                                <option>Select Location</option>
                                            </select>
                                            <div className="overSelect"></div>
                                        </div>
                                        <div id="locationsCheckboxes" style={{ display: expandedLocations ? 'flex' : 'none' }} className="CustomInputsContaner">
                                            {generateLocationCheckboxes([
                                                { location: "Johor" },
                                                { location: "Kedah" },
                                                { location: "Kelantan" },
                                                { location: "Kuala Lumpur" },
                                                { location: "Melacca" },
                                                { location: "Negeri Sembilan" },
                                                { location: "Pahang" },
                                                { location: "Penang" },
                                                { location: "Perak" },
                                                { location: "Perlis" },
                                                { location: "Sabah" },
                                                { location: "Sarawak" },
                                                { location: "Selangor" },
                                                { location: "Terengganu" },
                                                { location: "Overseas" },
                                            ])}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="InputRow">
                                <div className="InputField">
                                    <div class="multiselect">
                                        <div class="selectBox" onClick={() => showCheckboxes('categories')}>
                                            <select>
                                                <option>Select Category</option>
                                            </select>
                                            <div class="overSelect"></div>
                                        </div>
                                        <div id="categoriesCheckboxes" style={{ display: expandedCategories ? 'flex' : 'none' }} className="CustomInputsContaner">
                                            {generateCheckboxes([
                                                { number: 1, type: "Technology" },
                                                { number: 26, type: "AI" },
                                                { number: 2, type: "Finance" },
                                                { number: 3, type: "Retail" },
                                                { number: 4, type: "Manufacturing" },
                                                { number: 5, type: "Telecom" },
                                                { number: 6, type: "Energy" },
                                                { number: 7, type: "Transport" },
                                                { number: 8, type: "Entertainment" },
                                                { number: 9, type: "Automotive" },
                                                { number: 10, type: "Education" },
                                                { number: 11, type: "Hospitality & Healthcare" },
                                                { number: 12, type: "Real Estate" },
                                                { number: 13, type: "Media & Communication" },
                                                { number: 14, type: "Consulting" },
                                                { number: 15, type: "Consumer Goods" },
                                                { number: 16, type: "Pharmaceuticals & Biotech" },
                                                { number: 17, type: "Aerospace" },
                                                { number: 19, type: "Chemical" },
                                                { number: 20, type: "Fashion" },
                                                { number: 21, type: "Food" },
                                                { number: 22, type: "Insurance" },
                                                { number: 23, type: "Logistics" },
                                                { number: 24, type: "Internet Services" },
                                                { number: 25, type: "E-Commerce" },
                                                { number: 27, type: "Cybersecurity" },
                                                { number: 28, type: "Research" },
                                            ])}
                                        </div>
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(intern.apply) ? 'valid' : ''}`}

                                            value={intern.apply}
                                            id="apply"
                                            name="apply"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!intern.apply && <label htmlFor="apply" className={`LabelInput ${(intern.apply) ? 'valid' : ''}`}><Icon icon="mdi:arrow-top-left-bold-box" />Company's Apply Link</label>}
                                    </div>
                                </div>
                            </div>
                            <div className="InputField">
                                <div className="InputLabelField">
                                    <input
                                        type="text"
                                        className={`input ${(intern.applyEmail) ? 'valid' : ''}`}

                                        value={intern.applyEmail}
                                        id="applyEmail"
                                        name="applyEmail"
                                        onChange={handleInputChange}
                                        style={{
                                            direction: "ltr"
                                        }}

                                    />
                                    {!intern.applyEmail && <label htmlFor="applyEmail" className={`LabelInput ${(intern.applyEmail) ? 'valid' : ''}`}><Icon icon="entypo:email" />Company's Apply Email</label>}
                                </div>
                            </div>





                            <button type="submit">{languageText.Update}</button>

                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default EditInternship