

import "./Form.css"
import { useState } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'

// import 'core-js/modules/es.promise';
// import 'core-js/modules/es.object.assign';
// import 'core-js/modules/es.array.includes';
// import 'core-js/modules/es.array.iterator';




// const InputField = ({ type, value, setValue, id, icon, onChange, text }) => {
//     return (
//         <div className="InputField">
//             <div className="InputLabelField">
//                 <input
//                     type={type}
//                     className={`input ${(value) ? 'valid' : 'invalid'}`}
//                     value={value}
//                     onChange={(e) => { setValue(e.target.value) }}
//                     required
//                     id={id}
//                 />
//                 <label htmlFor={id} className={`LabelInput ${(value) ? 'valid' : 'invalid'}`}>
//                     {icon && <FontAwesomeIcon icon={icon} />}
//                     {text && text}
//                 </label>
//             </div>
//         </div>
//     );
// }











const FormCreator = ({ language, languageData, api, darkMode }) => {
    const { dispatch } = useFormsContext()
    const { user } = useAuthContext()


    const languageText = languageData[language];

    const [eventName, setEventName] = useState('');
    const [arabicEventName, setArabicEventName] = useState('');
    // const [type, setType] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [groupLink, setGroupLink] = useState('');
    const [error, setError] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [formLimit, setFormLimit] = useState('');
    const [img, setImg] = useState(null);
    const [paymentQR, setPaymentQR] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);


    const [selectedImageText, setSelectedImageText] = useState(null);
    const [selectedQRImageText, setSelectedQRImageText] = useState(null);

    // const [customInputs, setCustomInputs] = useState([]); // New state for custom inputs
    // const [customInput, setCustomInput] = useState('');



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

    const handleImgChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImg(file);
            setSelectedImageText(file.name);
        }
    };
    const handleQRImgChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setPaymentQR(file);
            setSelectedQRImageText(file.name);
        }
    };


    const handleRemoveImage = (e) => {
        e.preventDefault()
        setImg(null);
        setSelectedImageText(null);
    }
    const handleRemoveQRImage = () => {
        setPaymentQR(null);
        setSelectedQRImageText(null);
    };




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




    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const imgUrl = await uploadFile('image', img);
        let paymentQRUrl = null;
        if (paymentQR) {
            paymentQRUrl = await uploadFile('image', paymentQR);
        }
        const form = {
            eventName,
            arabicEventName,
            eventImg: imgUrl,
            eventDescription,
            type: user?.committee,
            inputs,
            groupLink,
            paymentQR: paymentQRUrl, // Updated to use payment QR URL
            paymentAmount,
            customInputs,
            status: true,
            limit: formLimit
        }

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
            // setEventName('')
            // setArabicEventName('')
            // setEventDescription('')
            // // setEventType('');
            // setGroupLink('');
            // setImg(null);

            // console.log("File upload success!");
            // navigate("/formCreator/admin")

            // Swal.fire({
            //     title: "Form added successfully",
            //     showDenyButton: true,
            //     confirmButtonText: "Open Form",
            //     denyButtonText: `Edit Form`
            // }).then((result) => {
            //     if (result.isConfirmed) {

            //         navigate(`/ISSForm/${json._id}`);
            //     } else if (result.isDenied) {
            //         navigate(`/formEditor/${type}/${json._id}`);

            //     }
            // });
            {
                toast.success(`${languageText.formCreated}`, {
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
            navigate("/adminDashboard")
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
        <div className="Form"
            style={{ marginBottom: "20%" }}>
            {loading ? (
                <div><Loader /></div>
            ) : (
                <div className="formBox">
                    {updating &&
                        <div>
                            <p className='Updating'>{languageText.Creating}</p>
                            <Loader />
                        </div>
                    }
                    {!updating && (
                        <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
                            <h2>{languageText.CreateForm}</h2>


                            <div className="InputRow">
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(eventName) ? 'valid' : ''}`}
                                            onChange={(e) => { setEventName(e.target.value) }}
                                            required
                                            id="EventName"
                                        />
                                        {!eventName && <label for="EventName" className={`LabelInput ${(eventName) ? 'valid' : ''}`}><Icon icon="carbon:event" /> {languageText.EventName}</label>}
                                    </div>
                                </div>

                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            // placeholder=" &#xf005; &nbsp; Event Arabic Name"
                                            type="text"
                                            className={`input ${(arabicEventName) ? 'valid' : ''}`}
                                            onChange={(e) => { setArabicEventName(e.target.value) }}
                                            required
                                            id="EventArabicName"
                                        />
                                        {!arabicEventName && <label for="EventArabicName" className={`LabelInput ${(arabicEventName) ? 'valid' : ''}`}><Icon icon="carbon:event" /> {languageText.EventArabicName}</label>}
                                    </div>
                                </div>
                            </div>
                            <div className="InputRow">
                                <div className="InputField">

                                    <label for="img" className={`LabelInputImg ${(img) ? 'valid' : ''}`}>
                                        <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><FontAwesomeIcon icon={faImage} />{selectedImageText || languageText.EventImg}</div>
                                        {(img)
                                            ? <button className="XImgButton" onClick={handleRemoveImage}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                            : <FontAwesomeIcon icon={faCloudArrowUp} />}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="img"
                                        className={`input ${(img) ? 'valid' : ''}`}
                                        style={{ display: 'none' }}
                                        onChange={handleImgChange}
                                    />
                                </div>

                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            // placeholder=" &#xf5fd; &nbsp; Group Link"
                                            type="text"
                                            className={`input ${(groupLink) ? 'valid' : ''}`}
                                            onChange={(e) => { setGroupLink(e.target.value) }}
                                            id="GroupLink"
                                            style={{ height: 'fit-content', }}
                                        />
                                        {!groupLink && <label for="GroupLink" className={`LabelInput ${(groupLink) ? 'valid' : ''}`}><FontAwesomeIcon icon={faWhatsapp} /> {languageText.GroupLink}</label>}
                                    </div>
                                </div>

                                {/* <div className="InputField">
                            <select
                                className={`input ${(type) ? 'valid' : ''}`}

                                onChange={(e) => setType(e.target.value)}
                                required

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
                        </div> */}
                            </div>

                            <div className="InputRow">

                                <div className="InputField eventDescription">
                                    <div className="InputLabelField">

                                        <textarea
                                            rows="1"
                                            className={`input ${(eventDescription) ? 'valid' : ''}`}
                                            columns="20"
                                            onChange={(e) => setEventDescription(e.target.value)}
                                            value={eventDescription}
                                            required
                                            id="EventDesc"

                                        />
                                        {!eventDescription && <label for="EventDesc" className={`LabelInput ${(eventDescription) ? 'valid' : ''}`}><FontAwesomeIcon icon={faFile} /> {languageText.EventDesc}</label>}

                                    </div>
                                </div>

                                {/* <div className="InputField">
                            <input
                                placeholder=" &#xf1a0; &nbsp; Google Sheet Link"
                                type="text"
                                className={`input ${(sheetLink) ? 'valid' : ''}`}
                                onChange={(e) => { setSheetLink(e.target.value) }}
                            // required

                            />
                        </div> */}
                                {/* </div> */}


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
                                                    { type: "Form Limit" },
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

                                </div>
                            </div>
                            {inputs.includes("Payment") && (
                                <div className="InputRow">

                                    <div className="InputField">

                                        <label for="QrImg" className={`LabelInputImg ${(paymentQR) ? 'valid' : ''}`}>
                                            <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><FontAwesomeIcon icon={faQrcode} />{selectedQRImageText || languageText.QrImage}</div>
                                            {(paymentQR) ? <button className="XImgButton" onClick={handleRemoveQRImage}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                                : <FontAwesomeIcon icon={faCloudArrowUp} />}
                                        </label>
                                        <input
                                            placeholder=" &#xf0e0; &nbsp; QR Img"
                                            type="file"
                                            accept="image/*"
                                            id="QrImg"
                                            style={{ display: 'none' }}
                                            required
                                            className={`input ${(paymentQR) ? 'valid' : ''}`}
                                            onChange={handleQRImgChange}
                                        />
                                    </div>

                                    <div className="InputField">
                                        <div className="InputLabelField">

                                            <input
                                                // placeholder=" &#xf0d6; &nbsp; Payment Amount"
                                                type="number"
                                                className={`input ${(paymentAmount) ? 'valid' : ''}`}
                                                onChange={(e) => { setPaymentAmount(e.target.value) }}
                                                required
                                                id="PaymentAmount"

                                            />
                                            {!paymentAmount && <label for="PaymentAmount" className={`LabelInput ${(paymentAmount) ? 'valid' : ''}`}><FontAwesomeIcon icon={faMoneyBill} /> {languageText.PaymentAmount}</label>}

                                        </div>
                                    </div>

                                </div>


                            )}

                            {inputs.includes("Form Limit") && (
                                <div className="InputField">
                                    <div className="InputLabelField">

                                        <input
                                            // placeholder=" &#xf0d6; &nbsp; Payment Amount"
                                            type="number"
                                            className={`input ${(formLimit) ? 'valid' : ''}`}
                                            onChange={(e) => { setFormLimit(e.target.value) }}
                                            required
                                            id="formLimit"

                                        />
                                        {!formLimit && <label for="formLimit" className={`LabelInput ${(formLimit) ? 'valid' : ''}`}><Icon icon="fluent:people-error-20-filled" /> {languageText.FormLimit}</label>}

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
                            {customInputs.length > 0 && (
                                <div className="CustomInputs">
                                    {customInputs.map((input, index) => (
                                        <div className="CustomInputRow" key={index}>
                                            <div className="CustomLabel">{input}</div>
                                            <button type="button" onClick={() => removeCustomInput(index)} className="CustomButton">
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}



                            <button>{languageText.AddForm}</button>
                            {error && <div className="formError">{error}</div>}
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default FormCreator;