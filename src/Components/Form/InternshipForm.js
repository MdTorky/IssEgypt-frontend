import "./Form.css"
import { useEffect, useState } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InternshipForm = ({ language, languageData, api, darkMode }) => {
    const { dispatch } = useFormsContext()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [img, setImg] = useState('');
    const [faculty, setFaculty] = useState('');
    const [website, setWebsite] = useState('');
    const [applyEmail, setApplyEmail] = useState('');
    const [apply, setApply] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [error, setError] = useState(null);

    const languageText = languageData[language];
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = { name, email, img, faculty, website, applyEmail, apply, categories: selectedCategories, }

        const response = await fetch(`${api}/api/internship`, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            setError(null)

            dispatch({
                type: 'CREATE_FORM',
                collection: "forms",
                payload: json
            })
            toast.success(`${languageText.memberAdded}`, {
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
            setName('')
            setEmail('')
            setImg('')
            setFaculty('')
            setWebsite('')
            setApplyEmail('')
            setApply('')
            window.location.reload();

        }

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullNameRegex = /^[a-zA-Z\s'-]{2,}$/;

    const matricRegex = /^[A-Za-z][2][0-4][A-Za-z]{2}\d{4}$/;



    var expanded = false;
    const showCheckboxes = () => {
        var checkboxes = document.getElementById("checkboxes");
        if (!expanded) {
            checkboxes.style.display = "block";
            expanded = true;
        } else {
            checkboxes.style.display = "none";
            expanded = false;
        }
    }

    const handleCheckboxChange = (value) => {
        const updatedCategories = [...selectedCategories];
        if (updatedCategories.includes(value)) {
            updatedCategories.splice(updatedCategories.indexOf(value), 1);
        } else {
            updatedCategories.push(value);
        }
        setSelectedCategories(updatedCategories);
    };


    const checkbox = ({ number, type }) => {
        return (
            <label htmlFor={number}>
                <input
                    type="checkbox"
                    id={number}
                    value={type}
                    checked={selectedCategories.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                />
                {type}
            </label>
        )
    }

    const generateCheckboxes = categories => {
        return categories.map(category => checkbox(category));
    };

    return (
        <div className="Form">
            <div className="formBox">
                <form action="" onSubmit={handleSubmit}>
                    <h2>Add a Company</h2>



                    <div className="InputField">
                        <input
                            // placeholder=" &#xf5b7; &nbsp; Name"
                            placeholder={`\uf219  Company's Name`}

                            type="text"
                            className={`input ${(name) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setName(e.target.value) }}
                        />
                    </div>



                    <div className="InputField">
                        <input
                            placeholder=" &#xf0e0; &nbsp; Email"
                            type="email"
                            className={`input ${emailRegex.test(email) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </div>
                    <div className="InputField">
                        <div class="multiselect">
                            <div class="selectBox" onClick={() => showCheckboxes()}>
                                <select>
                                    <option>Select Category</option>
                                </select>
                                <div class="overSelect"></div>
                            </div>
                            <div id="checkboxes">
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
                                    { number: 25, type: "Renewable Energy" },
                                ])}
                            </div>
                        </div>
                    </div>
                    <div className="InputField">
                        <select
                            className={`input ${(faculty) ? 'valid' : 'invalid'}`}

                            onChange={(e) => setFaculty(e.target.value)}
                            required

                        >
                            <option value="" disabled selected hidden>Choose a Faculty</option>
                            <option value="Electrical" >Electrical Engineering</option>
                            <option value="Computing" >Computer Science</option>
                            <option value="Civil" >Civil Engineering</option>
                            <option value="Mechanical" >Mechanical Engineering</option>
                            <option value="Chemical" >Chemical Engineering</option>
                            <option value="Other" >Other</option>
                        </select>

                    </div>


                    <div className="InputField">
                        <input
                            placeholder=" &#xf03e; &nbsp; Image Link"
                            type="text"
                            className={`input ${(img) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setImg(e.target.value) }}
                        />
                    </div>

                    <div className="InputField">
                        <input
                            placeholder=" &#xf0ac; &nbsp; Website Link"
                            type="text"
                            className={`input ${(website) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setWebsite(e.target.value) }}
                        />
                    </div>

                    <div className="InputField">
                        <input
                            placeholder=" &#x40; &nbsp; Apply Email"
                            type="text"
                            className={`input ${(applyEmail) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setApplyEmail(e.target.value) }}
                        />
                    </div>
                    <div className="InputField">
                        <input
                            placeholder=" &#xf08e; &nbsp; Apply"
                            type="text"
                            className={`input ${(apply) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setApply(e.target.value) }}
                        />
                    </div>
                    {/* <div className="InputField">
                        <textarea
                            rows="3"
                            className={`input ${(suggestion) ? 'valid' : 'invalid'}`}
                            columns="5"
                            placeholder="Suggestion"
                            onChange={(e) => setSuggestion(e.target.value)}
                            value={suggestion}
                            required

                        />
                    </div> */}

                    <button>Add Company</button>
                    {error && <div className="formError">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default InternshipForm;