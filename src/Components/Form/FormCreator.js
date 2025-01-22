

import "./Form.css"
import { useState } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'











const FormCreator = ({ language, languageText, api, darkMode }) => {
    const { dispatch } = useFormsContext()
    const { user } = useAuthContext()



    const [eventName, setEventName] = useState('');
    const [arabicEventName, setArabicEventName] = useState('');
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
    const [customInputs, setCustomInputs] = useState([]);
    const [newCustomInput, setNewCustomInput] = useState('');
    const [selectInputs, setSelectInputs] = useState([]);
    const [newSelectInput, setNewSelectInput] = useState({
        label: '',
        options: [],
        isMultiSelect: false
    });
    const [currentOption, setCurrentOption] = useState('');
    const [selectError, setSelectError] = useState()

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
        e.stopPropagation();

        setImg(null);
        setSelectedImageText(null);
    }
    const handleRemoveQRImage = (e) => {
        e.preventDefault()
        e.stopPropagation();
        setPaymentQR(null);
        setSelectedQRImageText(null);
    };




    const uploadFile = async (type, file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", type === 'image' ? 'images_preset' : '');

        try {
            let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
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
            // eventImg: "fgagsgagsg",
            eventDescription,
            type: user?.committee,
            inputs,
            groupLink,
            paymentQR: paymentQRUrl,
            paymentAmount,
            customInputs,
            status: true,
            limit: formLimit,
            selectInputs
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
            <div className="CategoryInput" >

                <input
                    type="checkbox"
                    id={type}
                    value={type}
                    checked={inputs.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                />
                <label htmlFor={type}>{" " + type}</label>
            </div>
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



    const handleAddOption = () => {
        if (currentOption.trim() !== '') {
            setNewSelectInput(prev => ({
                ...prev,
                options: [...prev.options, currentOption.trim()]
            }));
            setCurrentOption('');
        }
    };
    const handleAddSelectInput = () => {
        // disabled={!newSelectInput.label || }
        if (!newSelectInput.label) {
            setSelectError(languageText.WriteALabel)
        }
        else if (newSelectInput.options.length === 0 || newSelectInput.options.length === 1) {
            setSelectError(languageText.WriteOption)

        }
        else if (newSelectInput.label.trim() !== '' && newSelectInput.options.length > 0) {
            setSelectInputs([...selectInputs, { ...newSelectInput }]);
            setNewSelectInput({
                label: '',
                options: [],
                isMultiSelect: false
            });
            setSelectError(null)

        }
    };

    const removeSelectInput = (index) => {
        const updatedInputs = [...selectInputs];
        updatedInputs.splice(index, 1);
        setSelectInputs(updatedInputs);
    };

    const removeOption = (optionIndex) => {
        setNewSelectInput(prev => ({
            ...prev,
            options: prev.options.filter((_, index) => index !== optionIndex)
        }));
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
                                        <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><Icon icon="mage:image-fill" />{selectedImageText || languageText.EventImg}</div>
                                        {(img)
                                            ? <button className="XImgButton" onClick={(e) => handleRemoveImage(e)}>
                                                <Icon icon="icon-park-outline:close-one" />
                                            </button>
                                            : <Icon icon="material-symbols:arrow-upload-progress-rounded" />}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="img"
                                        className={`input ${(img) ? 'valid' : ''}`}
                                        style={{ display: 'none' }}
                                        onChange={handleImgChange}
                                        required
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
                                        {!groupLink && <label for="GroupLink" className={`LabelInput ${(groupLink) ? 'valid' : ''}`}><Icon icon="ant-design:whats-app-outlined" /> {languageText.GroupLink}</label>}
                                    </div>
                                </div>
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
                                        {!eventDescription && <label for="EventDesc" className={`LabelInput ${(eventDescription) ? 'valid' : ''}`}><Icon icon="material-symbols:description" /> {languageText.EventDesc}</label>}

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
                                            <div id="locationsCheckboxes" style={{ display: expandedCategories ? 'flex' : 'none' }} className="CustomInputsContaner">
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
                                                    { type: "Select Input" },
                                                ])}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {inputs.includes("Form Limit") && (
                                <div className="SelectInputsEditor">
                                    <h3>{languageText.AddLimit}</h3>
                                    <div className="InputField" style={{ margin: 'auto' }}>
                                        <div className="InputLabelField">

                                            <input
                                                type="number"
                                                className={`input ${(formLimit) ? 'valid' : ''}`}
                                                onChange={(e) => { setFormLimit(e.target.value) }}
                                                required
                                                id="formLimit"

                                            />
                                            {!formLimit && <label for="formLimit" className={`LabelInput ${(formLimit) ? 'valid' : ''}`}><Icon icon="fluent:people-error-20-filled" /> {languageText.FormLimit}</label>}

                                        </div>
                                    </div>
                                </div>

                            )}
                            {inputs.includes("Payment") && (
                                <div className="SelectInputsEditor">
                                    <h3>{languageText.AddPayment}</h3>
                                    <div className="InputRow">

                                        <div className="InputField">

                                            <label for="QrImg" className={`LabelInputImg ${(paymentQR) ? 'valid' : ''}`}>
                                                <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><Icon icon="weui:qr-code-filled" />{selectedQRImageText || languageText.QrImage}</div>
                                                {(paymentQR) ? <button className="XImgButton" onClick={(e) => handleRemoveQRImage(e)}>
                                                    <Icon icon="icon-park-outline:close-one" />
                                                </button>
                                                    : <Icon icon="material-symbols:arrow-upload-progress-rounded" />}
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
                                                {!paymentAmount && <label for="PaymentAmount" className={`LabelInput ${(paymentAmount) ? 'valid' : ''}`}><Icon icon="tdesign:money-filled" /> {languageText.PaymentAmount}</label>}

                                            </div>
                                        </div>

                                    </div>
                                </div>


                            )}

                            {inputs.includes("Custom Inputs") && (
                                <div className="SelectInputsEditor">
                                    <h3>{languageText.AddCustomInput}</h3>
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
                                                    <Icon icon="tabler:input-spark" /> {languageText.CustomInput}
                                                </label>}
                                            </div>
                                            <button type="button" className="CustomInputButton" onClick={handleAddCustomInput}><Icon icon="subway:add" /></button>
                                        </div>
                                    </div>


                                    {customInputs.length > 0 && (
                                        <div className="AddedInputs">
                                            {customInputs.map((input, index) => (
                                                <div className="AddedInputsContainer" key={index}>
                                                    <div>{input}</div>
                                                    <button type="button" onClick={() => removeCustomInput(index)}>
                                                        <Icon icon="ic:round-delete" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {inputs.includes("Select Input") && (
                                <div className="SelectInputsEditor">
                                    <h3>{languageText.EditSelectInput}</h3>
                                    <div className="InputRow">
                                        <div className="InputLabelField">
                                            <input
                                                type="text"
                                                value={newSelectInput.label}
                                                className={`input ${newSelectInput.label ? 'valid' : ''}`}
                                                onChange={(e) => setNewSelectInput(prev => ({
                                                    ...prev,
                                                    label: e.target.value
                                                }))}
                                                id="SelectInputLabel"
                                            />
                                            {!newSelectInput.label && <label htmlFor="SelectInputLabel" className={`LabelInput ${newSelectInput.label ? 'valid' : ''}`}>
                                                <Icon icon="material-symbols:label-outline" /> {languageText.SelectLabel}
                                            </label>}
                                        </div>

                                        <div className="InputLabelField">
                                            <input
                                                type="text"
                                                value={currentOption}
                                                className={`input ${currentOption ? 'valid' : ''}`}
                                                onChange={(e) => setCurrentOption(e.target.value)}
                                                id="SelectInputOption"
                                            />
                                            {!currentOption && <label htmlFor="SelectInputOption" className={`LabelInput ${currentOption ? 'valid' : ''}`}>
                                                <Icon icon="famicons:list-outline" /> {languageText.AddOption}
                                            </label>}
                                            <button type="button" className="CustomInputButton" onClick={handleAddOption}>
                                                <Icon icon="ci:list-add" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="CategoryInput Multiselect" >
                                        <input
                                            type="checkbox"
                                            id="Multiselect"
                                            value="Multiselect"
                                            checked={newSelectInput.isMultiSelect}
                                            onChange={(e) => setNewSelectInput(prev => ({
                                                ...prev,
                                                isMultiSelect: e.target.checked
                                            }))}
                                        />
                                        <label htmlFor="Multiselect" style={{ fontWeight: "bold", color: "var(--theme)", marginTop: "15px" }}> {languageText.MultipleSelection}</label>
                                    </div>

                                    {newSelectInput.options.length > 0 && (
                                        <div className="AddedInputs">
                                            {newSelectInput.options.map((option, index) => (
                                                <div className="AddedInputsContainer" key={index}>
                                                    <div>{(index + 1) + ". " + option}</div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(index)}
                                                    >
                                                        <Icon icon="ic:round-delete" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        className="AddNewSelect"
                                        onClick={handleAddSelectInput}
                                    // disabled={!newSelectInput.label || newSelectInput.options.length === 0}
                                    >
                                        {languageText.AddSelectInput}
                                    </button>
                                    {selectError && <p className="formError" style={{ background: "var(--theme)" }}><Icon icon="ooui:error" />{selectError}</p>}

                                    {selectInputs.length > 0 && (
                                        <div className="AddedInputs">
                                            {selectInputs.map((input, index) => (
                                                <div className="AddedInputsContainer" key={index}>
                                                    <div className="CustomLabel">
                                                        <strong>{input.label}</strong> ({input.isMultiSelect ? languageText.MultiSelect : languageText.SingleSelect})
                                                        <div className="options-list">
                                                            {input.options.join(', ')}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSelectInput(index)}
                                                        className="CustomButton"
                                                    >
                                                        <Icon icon="ic:round-delete" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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