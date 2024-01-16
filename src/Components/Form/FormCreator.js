

import "./Form.css"
import { useState } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { } from '@fortawesome/free-solid-svg-icons';



const FormCreator = ({ language, languageData, api }) => {
    const { dispatch } = useFormsContext()

    const [eventName, setEventName] = useState('');
    const [arabicEventName, setArabicEventName] = useState('');
    const [eventImg, setEventImg] = useState('');
    const [type, setType] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [sheetLink, setSheetLink] = useState('');
    const [groupLink, setGroupLink] = useState('');
    const [error, setError] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(false);
    const [inputs, setInputs] = useState([]);





    const UploadState = {
        IDLE: 1,
        UPLOADING: 2,
        UPLOADED: 3,
    };
    Object.freeze(UploadState);
    const [uploadState, setUploadState] = useState(UploadState.IDLE);

    const [selectedImage, setSelectedImage] = useState(null);


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Set the image file to the state
            setEventImg(file);

            // Optionally, preview the selected image
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadState(UploadState.UPLOADING);

        const formData = new FormData();
        formData.append("eventName", eventName);
        formData.append("arabicEventName", arabicEventName);
        formData.append("file", eventImg); // Use the actual file, not e.target.value
        formData.append("eventDescription", eventDescription);
        formData.append("sheetLink", sheetLink);
        formData.append("type", type);
        formData.append("inputs", JSON.stringify(inputs)); // Convert inputs array to a string
        formData.append("groupLink", groupLink);

        try {
            const response = await fetch(`${api}/api/forms`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const json = await response.json();
                setError(json.error);
            } else {
                setError(null);
                const json = await response.json();
                dispatch({
                    type: 'CREATE_FORM',
                    collection: "forms",
                    payload: json
                });

                setEventImg(json.secure_url);
                setUploadState(UploadState.UPLOADED);

                alert("Thank you!");
                setEventName('');
                setArabicEventName('');
                setEventImg('');
                setType('');
                setEventDescription('');
                setSheetLink('');
                setGroupLink('');
                setInputs([]);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("Error submitting form. Please try again.");
        }
    };



    var expanded = false;
    const showCheckboxes = (type) => {
        if (type === 'categories') {
            setExpandedCategories(!expandedCategories);
        }
    };

    const generateCheckbox = categories => {
        return categories.map(category => checkbox(category));
    };

    const checkbox = ({ type }) => {
        return (
            <label htmlFor={type}>
                <input
                    type="checkbox"
                    id={type}
                    value={type}
                    checked={inputs.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                />
                {type}
            </label>
        )
    }

    const handleCheckboxChange = (value) => {
        const updatedCategories = [...inputs];
        if (updatedCategories.includes(value)) {
            updatedCategories.splice(updatedCategories.indexOf(value), 1);
        } else {
            updatedCategories.push(value);
        }
        setInputs(updatedCategories);
    };










    return (
        <div className="Form">
            <div className="formBox">
                <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
                    <h2>Add a Form</h2>


                    <div className="InputRow">
                        <div className="InputField">
                            <input
                                placeholder=" &#xf005; &nbsp; Event Name"
                                type="text"
                                className={`input ${(eventName) ? 'valid' : 'invalid'}`}
                                onChange={(e) => { setEventName(e.target.value) }}
                                required
                            />
                        </div>

                        <div className="InputField">
                            <input
                                placeholder=" &#xf005; &nbsp; Event Arabic Name"
                                type="text"
                                className={`input ${(arabicEventName) ? 'valid' : 'invalid'}`}
                                onChange={(e) => { setArabicEventName(e.target.value) }}
                                required

                            />
                        </div>
                    </div>
                    <div className="InputRow">
                        <div className="InputField">
                            <input
                                placeholder=" &#xf0e0; &nbsp; Event Img"
                                type="file"
                                className={`input ${(eventImg) ? 'valid' : 'invalid'}`}
                                onChange={handleImageUpload}
                            />
                        </div>
                        {/* {selectedImage && (
                            <img src={selectedImage} alt="Selected" style={{ width: "300px", marginTop: "10px" }} />
                        )} */}

                        <div className="InputField">
                            <select
                                className={`input ${(type) ? 'valid' : 'invalid'}`}

                                onChange={(e) => setType(e.target.value)}
                                required

                            >
                                <option value="" disabled selected hidden>Choose a Committee</option>
                                <option value="Social Committee" >Social Committee</option>
                                <option value="Academic Committee" >Academic Committee</option>
                                <option value="Cultural Committee" >Cultural Committee</option>
                                <option value="Sports Committee" >Sports Committee</option>
                                <option value="Women's Affair Committee" >Women's Affair Committee</option>
                                {/* <option value="Found" >Bridging & Foundation</option>
                                <option value="Other" >Other</option> */}
                            </select>
                        </div>
                    </div>

                    <div className="InputRow">

                        <div className="InputField">
                            <textarea
                                rows="1"
                                className={`input ${(eventDescription) ? 'valid' : 'invalid'}`}
                                columns="5"
                                placeholder=" &#xf15b; &nbsp; Event Description"
                                onChange={(e) => setEventDescription(e.target.value)}
                                value={eventDescription}
                                required

                            />
                        </div>
                        <div className="InputField">
                            <input
                                placeholder=" &#xf1a0; &nbsp; Google Sheet Link"
                                type="text"
                                className={`input ${(sheetLink) ? 'valid' : 'invalid'}`}
                                onChange={(e) => { setSheetLink(e.target.value) }}
                                required

                            />
                        </div>
                    </div>


                    <div className="InputRow">
                        <div className="InputField">
                            <div className="multiselect">
                                <div className="selectBox" onClick={() => showCheckboxes('categories')}>
                                    <select>
                                        <option>Select Inputs</option>
                                    </select>
                                    <div className="overSelect"></div>
                                </div>
                                <div id="locationsCheckboxes" style={{ display: expandedCategories ? 'flex' : 'none', flexDirection: 'column' }}>
                                    {generateCheckbox([
                                        { type: "Full Name" },
                                        { type: "Matric" },
                                        { type: "Email" },
                                        { type: "Phone No." },
                                        { type: "Faculty" },
                                        { type: "Year" },
                                        { type: "Semester" },
                                        // Add more Malaysian cities as needed
                                    ])}
                                </div>
                            </div>
                        </div>
                        <div className="InputField">
                            <input
                                placeholder=" &#xf5fd; &nbsp; Group Link"
                                type="text"
                                className={`input ${(groupLink) ? 'valid' : 'invalid'}`}
                                onChange={(e) => { setGroupLink(e.target.value) }}
                                required

                            />
                        </div>
                    </div>

                    <button>Add Form</button>
                    {error && <div className="formError">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default FormCreator;