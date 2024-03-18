import { useEffect, useState } from "react";
import './Form.css';
import { useFormsContext } from '../../hooks/useFormContext'
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faUser, faIdCard, faEnvelope, faPhone, faReceipt, faTrash, faLayerGroup, faCamera } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import InputLogo from '../../images/input_logo.ico'
import Swal from '@sweetalert2/theme-borderless'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Loader from '../Loader/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@iconify/react';

const CreateForm = ({ language, languageData, api, darkMode }) => {
    const { type, formName } = useParams();
    const formId = decodeURIComponent(formName);
    // console.log(formId);
    const navigate = useNavigate();

    const { ISSForm = [], forms = [], dispatch } = useFormsContext();
    const languageText = languageData[language];
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(true)
    const [fullName, setFullName] = useState('')
    const [matric, setMatric] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [faculty, setFaculty] = useState('')
    const [year, setYear] = useState('')
    const [semester, setSemester] = useState('')
    const [picture, setPicture] = useState(null)
    const [proof, setProof] = useState(null);
    const [customInputs, setCustomInputs] = useState([]);
    const [selectedImageText, setSelectedImageText] = useState(null);
    const [selectedPictureText, setSelectedPictureText] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false)


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [formId]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/issForms`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'SET_ITEM',
                    collection: 'ISSForm',
                    payload: data,
                });
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api, dispatch, formId]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/forms`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                // const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort data alphabetically by 'name' field
                dispatch({
                    type: 'SET_ITEM',
                    collection: "forms",
                    payload: data,
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
    }, [api, dispatch, formId]);


    const filter = forms.filter((form) => form.eventName === formId);


    useEffect(() => {
        const issResponses = ISSForm.filter((issForm) => issForm.eventID === filter[0]._id).length;

        if (filter && issResponses >= filter[0]?.limit) {
            handleStatusChange(filter[0]); // Pass the selected form to the function
        }
    }, []);



    const handleStatusChange = async (selectedForm) => {
        try {



            const response = await fetch(`${api}/api/forms/${selectedForm._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: false }),

            });


            console.log('API Response:', response);

            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }


            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'forms',
                payload: { id: selectedForm._id, changes: { status: false } },
            });


        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };

    const fullNameRegex = /^[a-zA-Z\s'-]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const matricRegex = /^[A-Za-z][2][0-4][A-Za-z]{2}\d{4}$/;
    const matricRegex = /^[A-Za-z](1[8-9]|2[0-5])[A-Za-z]{2}\d{4}$/;
    const combinedPhoneRegex = /^(\+?6?01\d{9}|01\d{8}|(\+?20)?1[0125]\d{8}|(\+?967)?[4567]\d{7}|(\+?234)?[789]\d{9}|(\+?966)?5[0-9]\d{7}|(\+?971)?5[024568]\d{7}|(\+?974)?[3567]\d{7}|(\+?965)?[569]\d{7}|(\+?968)?9[1-9]\d{6}|(\+?963)?9[0-9]\d{7})$/;



    const handleProofImgChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProof(file);
            setSelectedImageText(file.name);
        }
    };


    const handleRemoveProofImage = () => {
        setProof(null);
        setSelectedImageText(null);
    };




    const handlePictureImgChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setPicture(file);
            setSelectedPictureText(file.name);
        }
    };


    const handleRemovePictureImage = () => {
        setPicture(null);
        setSelectedPictureText(null);
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


        let proofUrl = null;
        if (proof) {
            proofUrl = await uploadFile('image', proof);
        }
        let pictureUrl = null;
        if (picture) {
            pictureUrl = await uploadFile('image', picture);
        }


        const form = {
            type: type,
            eventName: filter[0].eventName,
            eventID: filter[0]._id,
            fullName,
            matric,
            email,
            phone,// Updated to use payment QR URL
            faculty,
            year,
            semester,
            picture: pictureUrl,
            proof: proofUrl,
            customInputs

        }

        const response = await fetch(`${api}/api/issForms`, {
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
                collection: "issForms",
                payload: json
            })
            {
                toast.success(`${languageText.formSubmitted}`, {
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
            navigate("/")

        }

    }

    const handleGroupClick = (e, groupLink) => {
        e.preventDefault();
        setButtonClicked(true)
        window.open(groupLink)
    }






    // Example usage

    return (
        filter && filter.length > 0 ? (

            <div className="CreatedForm">
                {loading ? (
                    <div className="LoaderDiv"><Loader /></div>
                ) : (
                    updating ? (
                        <div className="LoaderDiv">
                            <p className='Updating'>{languageText.Submitting}</p>
                            <Loader />
                        </div>
                    ) : (
                        filter.map((form) => (
                            form.status === true ? (
                                <div className="FormAll">
                                    {console.log(form.status)}

                                    <div className="FormLeft">
                                        <img src={form.eventImg} alt="" />
                                        <div className="FormLeftDetails">
                                            {language === 'en' ? <h2>{form.eventName}</h2> : <h2>{form.arabicEventName}</h2>}
                                            <p>{form.eventDescription}</p>
                                        </div>
                                    </div>
                                    <div className="FormCenter">
                                        <p className="FormTitle">{languageText.FillForm}</p>
                                        <div className="Hint">
                                            <p>{languageText.valid}</p>
                                            <p>{languageText.invalid}</p>
                                        </div>
                                        <div className="formBox PeopleForm">
                                            <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
                                                <div className="PersonalFields">
                                                    {form.inputs.includes("Full Name") && (
                                                        <div className="InputField">
                                                            <div className="InputLabelField">
                                                                <input
                                                                    type="text"
                                                                    className={`input ${(fullNameRegex.test(fullName)) ? 'valid' : 'invalid'}`}
                                                                    onChange={(e) => { setFullName(e.target.value) }}
                                                                    required
                                                                    id="fullName"
                                                                />
                                                                {!fullName && <label for="fullName" className={`LabelInput ${(fullName) ? 'valid' : 'invalid'}`}><FontAwesomeIcon icon={faUser} /> {languageText.FullName}</label>}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {form.inputs.includes("Matric") && (
                                                        <div className="InputField">
                                                            <div className="InputLabelField">
                                                                <input
                                                                    type="text"
                                                                    className={`input ${(matricRegex.test(matric)) ? 'valid' : 'invalid'}`}
                                                                    onChange={(e) => { setMatric(e.target.value) }}
                                                                    required
                                                                    id="matric"
                                                                    style={{ textTransform: "uppercase" }}
                                                                />
                                                                {!matric && <label for="matric" className={`LabelInput ${(matric) ? 'valid' : 'invalid'}`}><FontAwesomeIcon icon={faIdCard} /> {languageText.Matric}</label>}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {form.inputs.includes("Email") && (
                                                        <div className="InputField">
                                                            <div className="InputLabelField">
                                                                <input
                                                                    type="email"
                                                                    className={`input ${(emailRegex.test(email)) ? 'valid' : 'invalid'}`}
                                                                    onChange={(e) => { setEmail(e.target.value) }}
                                                                    required
                                                                    id="email"
                                                                />
                                                                {!email && <label for="email" className={`LabelInput ${(email) ? 'valid' : 'invalid'}`}><FontAwesomeIcon icon={faEnvelope} /> {languageText.formEmail}</label>}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {form.inputs.includes("Phone No.") && (
                                                        <div className="InputField">
                                                            <div className="InputLabelField">
                                                                <input
                                                                    type="number"
                                                                    className={`input ${(combinedPhoneRegex.test(phone)) ? 'valid' : 'invalid'}`}
                                                                    onChange={(e) => { setPhone(e.target.value) }}
                                                                    required
                                                                    id="phone"
                                                                />
                                                                {!phone && <label for="phone" className={`LabelInput ${(phone) ? 'valid' : 'invalid'}`}><FontAwesomeIcon icon={faPhone} /> {languageText.formPhone}</label>}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {form.inputs.includes("Faculty") && (
                                                        <div className="InputField">
                                                            <select
                                                                className={`input ${(faculty) ? 'valid' : 'invalid'}`}
                                                                onChange={(e) => setFaculty(e.target.value)}
                                                                required
                                                            >
                                                                <option value="" disabled selected hidden> {languageText.formFaculty}</option>
                                                                <option value="Electrical" >{languageText.FKE}</option>
                                                                <option value="Computing" >{languageText.FC}</option>
                                                                <option value="Mechanical" >{languageText.FKM}</option>
                                                                <option value="Civil" >{languageText.FKA}</option>
                                                                <option value="Chemical" >{languageText.FKT}</option>
                                                                <option value="Bridging" >{languageText.Found}</option>
                                                                <option value="Other" >{languageText.Other}</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                    {form.inputs.includes("Year") && (
                                                        <div className="InputField">
                                                            <select
                                                                className={`input ${(year) ? 'valid' : 'invalid'}`}
                                                                onChange={(e) => setYear(e.target.value)}
                                                                required
                                                            >
                                                                <option value="" disabled selected hidden>{languageText.formYear}</option>
                                                                <option value="2019" >2019</option>
                                                                <option value="2020" >2020</option>
                                                                <option value="2021" >2021</option>
                                                                <option value="2022" >2022</option>
                                                                <option value="2023" >2023</option>
                                                                <option value="2024" >2024</option>
                                                                {/* <option value="2025" >2025</option> */}
                                                            </select>
                                                        </div>
                                                    )}
                                                    {form.inputs.includes("Semester") && (
                                                        <div className="InputField">
                                                            <select
                                                                className={`input ${(semester) ? 'valid' : 'invalid'}`}
                                                                onChange={(e) => setSemester(e.target.value)}
                                                                required
                                                            >
                                                                <option value="" disabled selected hidden>{languageText.formSemester}</option>
                                                                <option value="Bridging & Foundation" >{languageText.Found}</option>
                                                                <option value="1" >1</option>
                                                                <option value="2" >2</option>
                                                                <option value="3" >3</option>
                                                                <option value="4" >4</option>
                                                                <option value="5" >5</option>
                                                                <option value="6" >6</option>
                                                                <option value="7" >7</option>
                                                                <option value="8" >8</option>
                                                                <option value="Masters" >{languageText.Masters}</option>
                                                                <option value="PhD" >{languageText.PhD}</option>
                                                                {/* <option value="2025" >2025</option> */}
                                                            </select>
                                                        </div>
                                                    )}
                                                    {form.inputs.includes("Picture") && (
                                                        <div className="InputField">
                                                            <label for="picture" className={`LabelInputImg ${(picture) ? 'valid' : 'invalid'}`}>
                                                                <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><FontAwesomeIcon icon={faCamera} />{selectedImageText || languageText.picture}</div>
                                                                {(picture) ? <button className="XImgButton" onClick={handleRemovePictureImage}>
                                                                    <FontAwesomeIcon icon={faXmark} />
                                                                </button>
                                                                    : <FontAwesomeIcon icon={faCloudArrowUp} />}
                                                            </label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id="picture"
                                                                style={{ display: 'none' }}
                                                                required
                                                                className={`input ${(picture) ? 'valid' : ''}`}
                                                                onChange={handlePictureImgChange}

                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {form.inputs.includes("Custom Inputs") && form.customInputs != "" && (
                                                    <><hr />
                                                        <div className="PersonalFields">
                                                            {form.customInputs.map((customInput, index) => (

                                                                <div className="InputField " key={index}>
                                                                    <div className="InputLabelField ">
                                                                        <input
                                                                            type="text"
                                                                            // onChange={(e) => { setCustomInputs(e.target.value) }}
                                                                            onChange={(e) => {
                                                                                setCustomInputs((prevInputs) => {
                                                                                    const newInputs = [...prevInputs];
                                                                                    newInputs[index] = e.target.value;
                                                                                    return newInputs;
                                                                                })
                                                                            }}
                                                                            className={`input CustomInput ${(customInputs[index]) ? 'valid' : 'invalid'}`}
                                                                            required
                                                                            id={`${customInput}_${index}`}
                                                                        />
                                                                        {!customInputs[index] && <label htmlFor={`${customInput}_${index}`} className={`LabelInput CustomLabelInput ${(customInputs[index]) ? 'valid' : 'invalid'}`}>
                                                                            <img src={InputLogo} className="InputLogo" alt="" /> {customInput}
                                                                        </label>}

                                                                    </div>
                                                                </div>


                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {form.inputs.includes("Payment") && form.paymentQR && (
                                                    <><hr />
                                                        <div className="PersonalFields PaymentFields">
                                                            <p>{languageText.payment}</p>
                                                            <div className="QRPayment">
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        gap: "15px"
                                                                    }}>
                                                                    <img src={form.paymentQR} className="QRCode" alt="" />
                                                                    {/* {form.paymentAmount && <p className="PaymentAmount"> {form.paymentAmount} {languageText.RM} </p>} */}
                                                                    <p className="PaymentAmount"> {form.paymentAmount} {languageText.RM} </p>

                                                                </div>
                                                                <div className="InputField">
                                                                    <label for="proof" className={`LabelInputImg ${(proof) ? 'valid' : 'invalid'}`}>
                                                                        <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><FontAwesomeIcon icon={faReceipt} />{selectedImageText || languageText.proof}</div>
                                                                        {(proof) ? <button className="XImgButton" onClick={handleRemoveProofImage}>
                                                                            <FontAwesomeIcon icon={faXmark} />
                                                                        </button>
                                                                            : <FontAwesomeIcon icon={faCloudArrowUp} />}
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        id="proof"
                                                                        style={{ display: 'none' }}
                                                                        required
                                                                        className={`input ${(proof) ? 'valid' : ''}`}
                                                                        onChange={handleProofImgChange}

                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* <div className="PaymentAmount">
                                            </div> */}
                                                        </div>
                                                    </>
                                                )}
                                                {/* {form.groupLink && <p className="JoinGroup">{languageText.joinGroup}</p>} */}
                                                {form.groupLink && <p className="formError"><Icon icon="ooui:error" />{languageText.joinGroup}</p>}
                                                {form.groupLink && (
                                                    <Link
                                                        className="GroupLink"
                                                        // to={}
                                                        onClick={(e) => { handleGroupClick(e, form.groupLink) }}
                                                        target="_blank">
                                                        {languageText.GroupLink}
                                                    </Link>
                                                )}

                                                {(buttonClicked || !form.groupLink) && <button className="button" data-content={languageText.Submit}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svgIcon"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM135.1 217.4c-4.5 4.2-7.1 10.1-7.1 16.3c0 12.3 10 22.3 22.3 22.3H208v96c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V256h57.7c12.3 0 22.3-10 22.3-22.3c0-6.2-2.6-12.1-7.1-16.3L269.8 117.5c-3.8-3.5-8.7-5.5-13.8-5.5s-10.1 2-13.8 5.5L135.1 217.4z" /></svg>
                                                </button>}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="CreatedForm NothingHere">
                                    {language === "en" ? <h2 style={{ margin: "0" }}>Sorry...</h2> : <h2 style={{ margin: "0" }}>معذرة...</h2>}
                                    {language === "en" ?

                                        <div>The form was either  <span className="NothingColor"> DELETED <FontAwesomeIcon icon={faTrash} /> </span> or <span className="NothingColor"> reached its limit <FontAwesomeIcon icon={faLayerGroup} /></span></div>
                                        :
                                        <div>
                                            <span className="NothingColor">تم حذف <FontAwesomeIcon icon={faTrash} /> </span>
                                            النموذج أو
                                            <span className="NothingColor"> وصل إلى الحد الأقصى <FontAwesomeIcon icon={faLayerGroup} /> </span>
                                        </div>}
                                </div>
                            )


                        ))
                    ))}



            </div >

        ) : (
            <div className="CreatedForm">
                <div className="LoaderDiv"><Loader /></div>
            </div>

        ));

}

export default CreateForm;

