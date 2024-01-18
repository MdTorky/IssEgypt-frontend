

import "./Form.css"
import { useState } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// require('dotenv').config();
// import
// import 'core-js/modules/es.promise';
// import 'core-js/modules/es.object.assign';
// import 'core-js/modules/es.array.includes';
// import 'core-js/modules/es.array.iterator';


const FormCreator = ({ language, languageData, api }) => {
    const { dispatch } = useFormsContext()


    const languageText = languageData[language];

    const [eventName, setEventName] = useState('');
    const [arabicEventName, setArabicEventName] = useState('');
    const [type, setType] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [sheetLink, setSheetLink] = useState('');
    const [groupLink, setGroupLink] = useState('');
    const [error, setError] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(false);
    const [inputs, setInputs] = useState([]);
    // const [eventImg, setEventImg] = useState('');
    const [img, setImg] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);



    const [selectedImage, setSelectedImage] = useState(null);


    // const handleImageUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setEventImg(file);


    //         setSelectedImage(URL.createObjectURL(file));
    //     }
    // };


    const uploadFile = async (type) => {
        const data = new FormData();
        data.append("file", type === 'image' ? img : '');
        data.append("upload_preset", type === 'image' ? 'images_preset' : '');

        try {
            let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
            console.log('Cloud Name:', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
            let resourceType = type === 'image' ? 'image' : 'video';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, data);
            const { secure_url } = res.data;
            console.log(secure_url);
            return secure_url;
        } catch (error) {
            console.error(error);
        }
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setUploadState(UploadState.UPLOADING);

    //     const formData = new FormData();
    //     formData.append("eventName", eventName);
    //     formData.append("arabicEventName", arabicEventName);
    //     formData.append("file", eventImg);
    //     formData.append("eventDescription", eventDescription);
    //     formData.append("sheetLink", sheetLink);
    //     formData.append("type", type);
    //     formData.append("inputs", JSON.stringify(inputs));
    //     formData.append("groupLink", groupLink);

    //     try {
    //         const response = await fetch(`${api}/api/forms`, {
    //             method: 'POST',
    //             body: formData,
    //         });

    //         if (!response.ok) {
    //             const json = await response.json();
    //             setError(json.error);
    //         } else {
    //             setError(null);
    //             const json = await response.json();
    //             dispatch({
    //                 type: 'CREATE_FORM',
    //                 collection: "forms",
    //                 payload: json
    //             });

    //             setEventImg(json.secure_url);
    //             setUploadState(UploadState.UPLOADED);

    //             alert("Thank you!");
    //             setEventName('');
    //             setArabicEventName('');
    //             setEventImg('');
    //             setType('');
    //             setEventDescription('');
    //             setSheetLink('');
    //             setGroupLink('');
    //             setInputs([]);
    //         }
    //     } catch (error) {
    //         console.error("Error submitting form:", error);
    //         setError("Error submitting form. Please try again.");
    //     }
    // };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         setLoading(true);

    //         const imgUrl = await uploadFile('image');

    //         await axios.post(`${api}/api/forms`, { imgUrl: imgUrl });

    //         setImg(null);

    //         console.log("File upload success!");
    //         setLoading(false);
    //         navigate("/")
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const imgUrl = await uploadFile('image');
        const form = { eventImg: imgUrl }

        const response = await fetch(`${api}/api/forms`, {
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
            setImg(null);
            console.log("File upload success!");
            navigate("/")
        }

    }










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
                            // required
                            />
                        </div>

                        <div className="InputField">
                            <input
                                placeholder=" &#xf005; &nbsp; Event Arabic Name"
                                type="text"
                                className={`input ${(arabicEventName) ? 'valid' : 'invalid'}`}
                                onChange={(e) => { setArabicEventName(e.target.value) }}
                            // required

                            />
                        </div>
                    </div>
                    <div className="InputRow">
                        <div className="InputField">
                            <input
                                placeholder=" &#xf0e0; &nbsp; Event Img"
                                type="file"
                                accept="image/*"
                                id="img"
                                className={`input ${(img) ? 'valid' : 'invalid'}`}
                                onChange={(e) => setImg((prev) => e.target.files[0])}
                            />
                        </div>
                        {/* {selectedImage && (
                            <img src={selectedImage} alt="Selected" style={{ width: "300px", marginTop: "10px" }} />
                        )} */}


                        <div className="InputField">
                            <select
                                className={`input ${(type) ? 'valid' : 'invalid'}`}

                                onChange={(e) => setType(e.target.value)}
                            // required

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
                            // required

                            />
                        </div>
                        <div className="InputField">
                            <input
                                placeholder=" &#xf1a0; &nbsp; Google Sheet Link"
                                type="text"
                                className={`input ${(sheetLink) ? 'valid' : 'invalid'}`}
                                onChange={(e) => { setSheetLink(e.target.value) }}
                            // required

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
                            // required

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