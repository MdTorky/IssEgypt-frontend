// FormEditor.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext'
import Loader from '../Loader/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import "../Form/Form.css"

const FormEditor = ({ language, languageData, api, darkMode }) => {
    const { forms = [], dispatch } = useFormsContext();
    const { type, formId } = useParams();
    const [form, setForm] = useState(null);
    const languageText = languageData[language];
    const [loading, setLoading] = useState(true);
    const [selectedImageText, setSelectedImageText] = useState(null);
    const [selectedQRImageText, setSelectedQRImageText] = useState(null);

    const [img, setImg] = useState(null);
    const [paymentQR, setPaymentQR] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch form data based on type and formId
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/forms/${formId}`);
                if (!response.ok) {
                    console.error(`Error fetching form data. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'GET_ITEM',
                    collection: "forms",
                    payload: data,
                });
                setForm(data);
                setInputs(data.inputs)
                if (!form.customInputs) {
                    setCustomInputs([]);
                } else {
                    setCustomInputs(form.customInputs);
                }
            } catch (error) {
                console.error('An error occurred while fetching form data:', error);
            } finally {
                // Set loading to false once the data is fetched (success or error)
                setLoading(false);
            }
        };

        fetchData();
    }, [api, formId, dispatch]);




    const uploadFile = async (type, file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", type === 'image' ? 'images_preset' : '');

        try {
            let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
            // console.log('Cloud Name:', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
            let resourceType = type === 'image' ? 'image' : 'video';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, data);
            const { secure_url } = res.data;
            console.log(secure_url);
            return secure_url;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }



    const handleUpdate = async (e) => {
        e.preventDefault();


        let imgUrl = form.eventImg
        if (img) {
            imgUrl = await uploadFile('image', form.eventImg)
        }
        let paymentQRUrl = null;

        if (form.paymentQR) {
            if (paymentQR) {
                paymentQRUrl = await uploadFile('image', paymentQR);
            }
            else {
                paymentQRUrl = form.paymentQR
            }
        }
        else {
            if (paymentQR) {
                paymentQRUrl = await uploadFile('image', paymentQR);
            }
        }



        try {
            const formToUpdate = forms.find((form) => form._id === formId);

            // Ensure the form was found
            if (!formToUpdate) {
                console.error('Form not found in state');
                console.log('forms array:', forms);
                console.log('formId:', formId);
                return;
            }


            const response = await fetch(`${api}/api/forms/${formId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventName: form.eventName,
                    arabicEventName: form.arabicEventName,
                    eventImg: imgUrl,
                    type: form.type,
                    eventDescription: form.eventDescription,
                    inputs: inputs,
                    groupLink: form.groupLink,
                    paymentQR: paymentQRUrl,
                    paymentAmount: form.paymentAmount,
                    customInputs: [...form.customInputs, ...customInputs],
                }),
            });

            console.log('API Response:', response);

            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }

            // Assuming the API response contains the updated form data
            const updatedFormData = await response.json();
            console.log('Updated Form Data:', updatedFormData);
            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'forms',
                payload: { id: formId, changes: updatedFormData },
            });

            {
                toast.success(`${languageText.formEdited}`, {
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
            navigate(-1);


        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };




    const handleImgChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setForm((prevForm) => ({
                ...prevForm,
                eventImg: file,
            }));
            setSelectedImageText(file.name);
            setImg(file)
        }
    };

    const handleQRImgChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setForm((prevForm) => ({
                ...prevForm,
                paymentQR: file,
            }));
            setSelectedQRImageText(file.name);
            setPaymentQR(file)
        }
    };


    const handleRemoveImage = () => {
        setForm((prevForm) => ({
            ...prevForm,
            eventImg: null,
        }));
        setSelectedImageText(null);
    }

    const handleRemoveQRImage = () => {
        setForm((prevForm) => ({
            ...prevForm,
            paymentQR: null,
        }));
        setSelectedQRImageText(null);
    }



    const [inputs, setInputs] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState(false);

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



    const [customInputs, setCustomInputs] = useState([]);
    const [newCustomInput, setNewCustomInput] = useState('');

    const handleAddCustomInput = () => {
        if (newCustomInput.trim() !== '') {
            setCustomInputs([...customInputs, newCustomInput.trim()]);
            setNewCustomInput('');
        }
    };

    const removeCustomInput = (index) => {
        const updatedInputs = [...customInputs];
        updatedInputs.splice(index, 1);
        setCustomInputs(updatedInputs);
    };

    const handleRemoveCustomInput = (index) => {
        // Check if the custom input is from the database or newly added
        if (index < form.customInputs.length) {
            // Remove the existing custom input from the database
            const updatedForm = { ...form };
            updatedForm.customInputs.splice(index, 1);
            setForm(updatedForm);
        } else {
            // Remove the newly added custom input
            const updatedCustomInputs = [...customInputs];
            updatedCustomInputs.splice(index - form.customInputs.length, 1);
            setCustomInputs(updatedCustomInputs);
        }
    };



    return (
        <div className='Form'>
            {loading ? (
                <div><Loader /></div>
            ) : (
                <div className='formBox'>
                    <form onSubmit={handleUpdate}>
                        <h2>Edit Form</h2>

                        <div className="InputRow">
                            <div className="InputField">
                                <div className="InputLabelField">
                                    <input
                                        type="text"
                                        className={`input ${(form.eventName) ? 'valid' : ''}`}
                                        required
                                        value={form.eventName}
                                        id="EventName"
                                        name="eventName"
                                        onChange={handleInputChange}
                                        style={{
                                            direction: "ltr"
                                        }}

                                    />
                                    {!form.eventName && <label htmlFor="EventName" className={`LabelInput ${(form.eventName) ? 'valid' : ''}`}><FontAwesomeIcon icon={faStar} /> {languageText.EventName}</label>}
                                </div>
                            </div>

                            <div className="InputField">
                                <div className="InputLabelField">
                                    <input
                                        // placeholder=" &#xf005; &nbsp; Event Arabic Name"
                                        type="text"
                                        className={`input ${(form.arabicEventName) ? 'valid' : ''}`}
                                        onChange={handleInputChange}
                                        required
                                        value={form.arabicEventName}
                                        id="EventArabicName"
                                        name="arabicEventName"
                                        style={{
                                            direction: "rtl"
                                        }}
                                    />
                                    {!form.arabicEventName && <label for="EventArabicName" className={`LabelInput ${(form.arabicEventName) ? 'valid' : ''}`}><FontAwesomeIcon icon={faStar} /> {languageText.EventArabicName}</label>}
                                </div>
                            </div>
                        </div>

                        <div className="InputRow">
                            <div className="InputField">

                                <label for="img" className={`LabelInputImg ${(form.eventImg) ? 'valid' : ''}`}>
                                    <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><FontAwesomeIcon icon={faImage} />{selectedImageText || languageText.EventImg}</div>
                                    {(form.eventImg)
                                        ? <button className="XImgButton" onClick={handleRemoveImage}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                        : <FontAwesomeIcon icon={faCloudArrowUp} />}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="img"
                                    className={`input ${(form.eventImg) ? 'valid' : ''}`}
                                    style={{ display: 'none' }}
                                    onChange={handleImgChange}
                                // value={form.eventImg}
                                />
                            </div>


                            <div className="InputField">
                                <select
                                    className={`input ${(form.type) ? 'valid' : ''}`}
                                    value={form.type}
                                    onChange={handleInputChange}
                                    required
                                    name="type"
                                >
                                    <option value="" disabled selected hidden>{languageText.ChooseCommittee}</option>
                                    <option value="Social" >{languageText.SocialCommittee}</option>
                                    <option value="Academic" >{languageText.AcademicCommittee}</option>
                                    <option value="Bank" >{languageText.BankCommittee}</option>
                                    <option value="Culture" >{languageText.CultureCommittee}</option>
                                    <option value="Sports" >{languageText.SportCommittee}</option>
                                    <option value="Women Affairs" >{languageText.WomenCommittee}</option>
                                    <option value="Reading" >{languageText.ReadingClub}</option>
                                </select>
                            </div>
                        </div>

                        <div className="InputField eventDescription">
                            <div className="InputLabelField">

                                <textarea
                                    rows="1"
                                    className={`input ${(form.eventDescription) ? 'valid' : ''}`}
                                    columns="20"
                                    onChange={handleInputChange}
                                    value={form.eventDescription}
                                    required
                                    id="EventDesc"
                                    name="eventDescription"

                                />
                                {!form.eventDescription && <label for="EventDesc" className={`LabelInput ${(form.eventDescription) ? 'valid' : ''}`}><FontAwesomeIcon icon={faFile} /> {languageText.EventDesc}</label>}

                            </div>
                        </div>
                        <div className="InputRow">
                            <div className="InputField">
                                <div className="multiselect">
                                    <div className="selectBox" onClick={() => showCheckboxes('categories')}>
                                        <select>
                                            <option>{languageText.SelectInputs}</option>
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
                                            { type: "Picture" },
                                            { type: "Payment" },
                                            { type: "Custom Inputs" },
                                        ])}
                                    </div>
                                </div>
                            </div>

                            <div className="InputField">
                                <div className="InputLabelField">
                                    <input
                                        // placeholder=" &#xf5fd; &nbsp; Group Link"
                                        type="text"
                                        className={`input ${(form.groupLink) ? 'valid' : ''}`}
                                        onChange={handleInputChange}
                                        id="GroupLink"
                                        value={form.groupLink}
                                        style={{ height: 'fit-content', }}
                                        name="groupLink"
                                    />
                                    {!form.groupLink && <label for="GroupLink" className={`LabelInput ${(form.groupLink) ? 'valid' : ''}`}><FontAwesomeIcon icon={faWhatsapp} /> {languageText.GroupLink}</label>}
                                </div>
                            </div>
                        </div>

                        {inputs.includes("Payment") && (
                            <div className="InputRow">

                                <div className="InputField">

                                    <label for="QrImg" className={`LabelInputImg ${(form.paymentQR) ? 'valid' : ''}`}>
                                        <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><FontAwesomeIcon icon={faQrcode} />{selectedQRImageText || languageText.QrImage}</div>
                                        {(form.paymentQR) ? <button className="XImgButton" onClick={handleRemoveQRImage}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                            : <FontAwesomeIcon icon={faCloudArrowUp} />}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="QrImg"
                                        style={{ display: 'none' }}
                                        className={`input ${(form.paymentQR) ? 'valid' : ''}`}
                                        onChange={handleQRImgChange}
                                    />
                                </div>

                                <div className="InputField">
                                    <div className="InputLabelField">

                                        <input
                                            // placeholder=" &#xf0d6; &nbsp; Payment Amount"
                                            type="number"
                                            className={`input ${(form.paymentAmount) ? 'valid' : ''}`}
                                            onChange={handleInputChange}
                                            // required
                                            value={form.paymentAmount}
                                            id="PaymentAmount"
                                            name='paymentAmount'
                                        />
                                        {!form.paymentAmount && <label for="PaymentAmount" className={`LabelInput ${(form.paymentAmount) ? 'valid' : ''}`}><FontAwesomeIcon icon={faMoneyBill} /> {languageText.PaymentAmount}</label>}

                                    </div>
                                </div>

                            </div>
                        )}

                        {inputs.includes("Custom Inputs") && (
                            <div className="InputRow">
                                <div className="InputField eventDescription">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            value={newCustomInput}
                                            className={`input ${(newCustomInput) ? 'valid' : ''}`}
                                            onChange={(e) => setNewCustomInput(e.target.value)}
                                            id="CustomInputs"

                                        />
                                        {!newCustomInput && <label for="CustomInputs" className={`LabelInput ${(newCustomInput) ? 'valid' : ''}`}>
                                            <FontAwesomeIcon icon={faPlus} /> {languageText.CustomInput}
                                        </label>}
                                    </div>
                                    <button type="button" className="CustomInputButton" onClick={handleAddCustomInput}><FontAwesomeIcon icon={faPlus} /></button>
                                </div>
                            </div>
                        )}

                        {inputs.includes("Custom Inputs") && form.customInputs.length > 0 && (
                            <div className="CustomInputs">
                                {form.customInputs.map((input, index) => (
                                    <div className="InputRow" key={index}>
                                        <div className="CustomLabel">{input}</div>
                                        <button type="button" onClick={() => handleRemoveCustomInput(index)}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                ))}
                                {customInputs.map((input, index) => (
                                    <div className="InputRow" key={index}>
                                        <div className="CustomLabel">{input}</div>
                                        <button type="button" onClick={() => handleRemoveCustomInput(index + form.customInputs.length)}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="submit">Update</button>
                    </form>

                </div>
            )}
        </div>
    );
};

export default FormEditor;
