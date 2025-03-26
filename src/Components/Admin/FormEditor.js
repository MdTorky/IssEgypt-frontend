// FormEditor.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext'
import Loader from '../Loader/Loader'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';


import "../Form/Form.css"

const FormEditor = ({ language, languageText, api, darkMode }) => {
    const { forms = [], dispatch } = useFormsContext();
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageText, setSelectedImageText] = useState(null);
    const [selectedQRImageText, setSelectedQRImageText] = useState(null);
    const [selectInputs, setSelectInputs] = useState([]);
    // const [sendEmail, setSendEmail] = useState(false)

    const [img, setImg] = useState(null);
    const [paymentQR, setPaymentQR] = useState(null);

    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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
        setUpdating(true);


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
                    sendEmail: inputs.includes("Send Email"),
                    eventDescription: form.eventDescription,
                    inputs: inputs,
                    groupLink: form.groupLink,
                    paymentQR: paymentQRUrl,
                    paymentAmount: form.paymentAmount,
                    customInputs: [...form.customInputs, ...customInputs],
                    limit: form.limit,
                    selectInputs: selectInputs,
                }),
            });


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
            setUpdating(false);
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


    const handleRemoveImage = (e) => {
        e.stopPropagation();
        e.preventDefault()
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



    const [customInputs, setCustomInputs] = useState([]);
    const [newCustomInput, setNewCustomInput] = useState('');

    const handleAddCustomInput = () => {
        if (newCustomInput.trim() !== '') {
            setCustomInputs([...customInputs, newCustomInput.trim()]);
            setNewCustomInput('');
        }
    };

    const handleRemoveCustomInput = (index) => {
        if (index < form.customInputs.length) {
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

    useEffect(() => {
        if (form?.selectInputs) {
            setSelectInputs(form.selectInputs);
        }
    }, [form]);

    return (
        <div className='Form'>
            {loading ? (
                <div><Loader /></div>
            ) : (
                <div className='formBox'>
                    {updating &&
                        <div>
                            <p className='Updating'>{languageText.Updating}</p>
                            <Loader />
                        </div>
                    }
                    {!updating && (
                        <form onSubmit={handleUpdate}>
                            <h2>{languageText.editForm}</h2>

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
                                        {!form.eventName && <label htmlFor="EventName" className={`LabelInput ${(form.eventName) ? 'valid' : ''}`}><Icon icon="carbon:event" /> {languageText.EventName}</label>}
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
                                        {!form.arabicEventName && <label for="EventArabicName" className={`LabelInput ${(form.arabicEventName) ? 'valid' : ''}`}><Icon icon="carbon:event" />{languageText.EventArabicName}</label>}
                                    </div>
                                </div>
                            </div>

                            <div className="InputRow">
                                <div className="InputField">

                                    <label for="img" className={`LabelInputImg ${(form.eventImg) ? 'valid' : ''}`}>
                                        <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><Icon icon="mage:image-fill" />{selectedImageText || languageText.EventImg}</div>
                                        {(form.eventImg)
                                            ? <button className="XImgButton" onClick={(e) => handleRemoveImage(e)}>
                                                <Icon icon="icon-park-outline:close-one" />
                                            </button>
                                            : <Icon icon="material-symbols:arrow-upload-progress-rounded" />}
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
                                        {!form.groupLink && <label for="GroupLink" className={`LabelInput ${(form.groupLink) ? 'valid' : ''}`}><Icon icon="ant-design:whats-app-outlined" /> {languageText.GroupLink}</label>}
                                    </div>
                                </div>
                            </div>
                            <div className="InputRow">
                                <div className="InputField">
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
                                        {!form.eventDescription && <label for="EventDesc" className={`LabelInput ${(form.eventDescription) ? 'valid' : ''}`}><Icon icon="material-symbols:description" /> {languageText.EventDesc}</label>}

                                    </div>
                                </div>
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
                                                { type: "Send Email" },
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



                            {inputs.includes("Form Limit") && (
                                <div className="SelectInputsEditor">
                                    <h3>{languageText.EditLimit}</h3>
                                    <div className="InputField" style={{ margin: 'auto' }}>
                                        <div className="InputLabelField">

                                            <input
                                                // placeholder=" &#xf0d6; &nbsp; Payment Amount"
                                                type="number"
                                                className={`input ${(form.limit) ? 'valid' : ''}`}
                                                onChange={handleInputChange}
                                                id="limit"
                                                name="limit"
                                                required
                                                value={form.limit}

                                            />
                                            {!form.limit && <label for="limit" className={`LabelInput ${(form.limit) ? 'valid' : ''}`}><Icon icon="fluent:people-error-20-filled" /> {languageText.FormLimit}</label>}

                                        </div>
                                    </div>
                                </div>
                            )}

                            {inputs.includes("Payment") && (
                                <div className="SelectInputsEditor">
                                    <h3>{languageText.EditPayment}</h3>
                                    <div className="InputRow">

                                        <div className="InputField">

                                            <label for="QrImg" className={`LabelInputImg ${(form.paymentQR) ? 'valid' : ''}`}>
                                                <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><Icon icon="weui:qr-code-filled" />{selectedQRImageText || languageText.QrImage}</div>
                                                {(form.paymentQR) ? <button className="XImgButton" onClick={handleRemoveQRImage}>
                                                    <Icon icon="icon-park-outline:close-one" />
                                                </button>
                                                    : <Icon icon="material-symbols:arrow-upload-progress-rounded" />}
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
                                                {!form.paymentAmount && <label for="PaymentAmount" className={`LabelInput ${(form.paymentAmount) ? 'valid' : ''}`}><Icon icon="tdesign:money-filled" /> {languageText.PaymentAmount}</label>}

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {inputs.includes("Custom Inputs") && (
                                <div className="SelectInputsEditor">
                                    <h3>{languageText.EditCustomInput}</h3>
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
                                                    <Icon icon="tabler:input-spark" />{languageText.CustomInput}
                                                </label>}
                                            </div>
                                            <button type="button" className="CustomInputButton" onClick={handleAddCustomInput}><Icon icon="subway:add" /></button>
                                        </div>
                                    </div>


                                    {inputs.includes("Custom Inputs") && (
                                        <div className="AddedInputs">
                                            {form.customInputs.map((input, index) => (
                                                <div className="AddedInputsContainer" key={index}>
                                                    <div className="CustomLabel">{input}</div>
                                                    <button type="button" onClick={() => handleRemoveCustomInput(index)} className="CustomButton">
                                                        <Icon icon="ic:round-delete" />
                                                    </button>
                                                </div>
                                            ))}
                                            {customInputs.map((input, index) => (
                                                <div className="AddedInputsContainer" key={index}>
                                                    <div className="CustomLabel">{input}</div>
                                                    <button type="button" onClick={() => handleRemoveCustomInput(index + form.customInputs.length)} className="CustomButton">
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
                                    {selectInputs.map((selectInput, index) => (
                                        <>
                                            <div key={index} className="SelectInputEditor">
                                                {/* <input
                                                    type="text"
                                                    value={selectInput.label}
                                                    onChange={(e) => {
                                                        const updatedInputs = [...selectInputs];
                                                        updatedInputs[index].label = e.target.value;
                                                        setSelectInputs(updatedInputs);
                                                    }}
                                                    placeholder="Label"
                                                /> */}
                                                <div className="InputField">
                                                    <div className="InputLabelField">
                                                        <input
                                                            type="text"
                                                            className={`input ${(selectInput.label) ? 'valid' : ''}`}
                                                            onChange={(e) => {
                                                                const updatedInputs = [...selectInputs];
                                                                updatedInputs[index].label = e.target.value;
                                                                setSelectInputs(updatedInputs);
                                                            }}
                                                            value={selectInput.label}
                                                            id={selectInput.label}
                                                            name={selectInput.label}
                                                        />
                                                        {!selectInput.label && <label for={selectInput.label} className={`LabelInput ${(selectInput.label) ? 'valid' : ''}`}><Icon icon="material-symbols:label-outline" /> {languageText.SelectLabel}</label>}

                                                    </div>
                                                </div>
                                                <div className="OptionsEditor">
                                                    {selectInput.options.map((option, optionIndex) => (
                                                        <div key={optionIndex} className="InputField">
                                                            <div className="InputLabelField">
                                                                <input
                                                                    type="text"
                                                                    className={`input ${(option) ? 'valid' : ''}`}
                                                                    onChange={(e) => {
                                                                        const updatedInputs = [...selectInputs];
                                                                        updatedInputs[index].options[optionIndex] = e.target.value;
                                                                        setSelectInputs(updatedInputs);
                                                                    }}
                                                                    value={option}
                                                                    id={option}
                                                                    name={option}
                                                                />
                                                                {!option && <label for={option} className={`LabelInput ${(option) ? 'valid' : ''}`}><Icon icon="famicons:list-outline" />{languageText.Option + " " + (optionIndex + 1)}</label>}
                                                            </div>
                                                            <button type="button" className="CustomInputButton"
                                                                onClick={() => {
                                                                    const updatedInputs = [...selectInputs];
                                                                    updatedInputs[index].options.splice(optionIndex, 1);
                                                                    setSelectInputs(updatedInputs);
                                                                }}
                                                            ><Icon icon="ic:round-delete" /></button>

                                                        </div>
                                                        // <div key={optionIndex} className="OptionRow">
                                                        //     <input
                                                        //         type="text"
                                                        //         value={option}
                                                        //         onChange={(e) => {
                                                        //             const updatedInputs = [...selectInputs];
                                                        //             updatedInputs[index].options[optionIndex] = e.target.value;
                                                        //             setSelectInputs(updatedInputs);
                                                        //         }}
                                                        //         placeholder="Option"
                                                        //     />
                                                        //     <button
                                                        //         type="button"
                                                        //         onClick={() => {
                                                        //             const updatedInputs = [...selectInputs];
                                                        //             updatedInputs[index].options.splice(optionIndex, 1);
                                                        //             setSelectInputs(updatedInputs);
                                                        //         }}
                                                        //     >
                                                        //         X
                                                        //     </button>
                                                        // </div>
                                                    ))}
                                                </div>

                                            </div>
                                            <div className="SelectInputButtons">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedInputs = [...selectInputs];
                                                        updatedInputs[index].options.push('');
                                                        setSelectInputs(updatedInputs);
                                                    }}>
                                                    <Icon icon="ci:list-add" /> {languageText.AddOption}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedInputs = [...selectInputs];
                                                        updatedInputs.splice(index, 1);
                                                        setSelectInputs(updatedInputs);
                                                    }}
                                                >
                                                    <Icon icon="mdi:coins-remove-outline" /> {languageText.RemoveSelect}
                                                </button>
                                            </div>

                                            <div className="CategoryInput Multiselect" >
                                                <input
                                                    type="checkbox"
                                                    id={index + "" + "Multiselect"}
                                                    value="Multiselect"
                                                    checked={selectInput.isMultiSelect}

                                                    onChange={(e) => {
                                                        const updatedInputs = [...selectInputs];
                                                        updatedInputs[index].isMultiSelect = e.target.checked;
                                                        setSelectInputs(updatedInputs);
                                                    }}
                                                />
                                                <label htmlFor={index + "" + "Multiselect"} style={{ fontWeight: "bold", color: "var(--theme)" }}> {languageText.MultipleSelection}</label>
                                            </div>

                                        </>
                                    ))}
                                    <button
                                        type="button"
                                        className='AddNewSelect'
                                        onClick={() => setSelectInputs([...selectInputs, { label: '', options: [], isMultiSelect: false }])}>
                                        <Icon icon="material-symbols:add-task" /> {languageText.AddNewSelectInput}
                                    </button>
                                </div>
                            )}


                            <button type="submit">{languageText.Update}</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default FormEditor;
