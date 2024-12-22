import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext';
import { Icon } from '@iconify/react';
import logo from '../../images/HorusToken.png'
import Loader from "../Loader/Loader";
import React from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const PurchaseForm = ({ languageText, api, language, darkMode }) => {

    const [fullName, setFullName] = useState('')
    const [matric, setMatric] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [faculty, setFaculty] = useState('')
    const [address, setAddress] = useState('')
    const [proof, setProof] = useState(null);
    const [selectedImageText, setSelectedImageText] = useState(null);
    const { transactions = [], dispatch } = useFormsContext();
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState(null);
    const [quantity, setQuantity] = useState(null);

    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        const savedSize = localStorage.getItem('selectedSize');
        if (savedSize) {
            setSize(savedSize); // Set the size from localStorage
        }

        const savedQuantity = localStorage.getItem('selectedQuantity');
        if (savedQuantity) {
            setQuantity(savedQuantity);
        }
    }, []);

    const fullNameRegex = /^[a-zA-Z\s'-]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const matricRegex = /^[A-Za-z][2][0-4][A-Za-z]{2}\d{4}$/;
    const matricRegex = /^[A-Za-z](1[8-9]|2[0-5])[A-Za-z]{2}\d{4}$/;
    const combinedPhoneRegex = /^(\+?6?01\d{9}|01\d{8}|(\+?20)?1[0125]\d{8}|(\+?967)?[4567]\d{7}|(\+?234)?[789]\d{9}|(\+?966)?5[0-9]\d{7}|(\+?971)?5[024568]\d{7}|(\+?974)?[3567]\d{7}|(\+?965)?[569]\d{7}|(\+?968)?9[1-9]\d{6}|(\+?963)?9[0-9]\d{7})$/;



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${api}/api/product/${productId}`);
                if (!response.ok) {
                    console.error(
                        `Error fetching suggestions. Status: ${response.status}, ${response.statusText}`
                    );
                    return;
                }

                const data = await response.json();

                dispatch({
                    type: "GET_ITEM",
                    collection: "products",
                    payload: data,
                });
                setProduct(data)
                setLoading(false);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchData();
    }, [api, dispatch]);



    const handleProofImgChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProof(file);
            setSelectedImageText(file.name);
        }
    };


    const handleRemoveProofImage = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setProof(null);
        setSelectedImageText(null);
    };


    const uploadFile = async (type, file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", type === 'image' ? 'shop_preset' : '');

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


        const form = {
            productId: product._id,
            buyerName: fullName,
            buyerMatric: matric,
            buyerEmail: email,
            buyerPhone: phone,// Updated to use payment QR URL
            buyerFaculty: faculty,
            buyerAddress: address,
            productQuantity: quantity,
            productSize: size,
            proof: proofUrl,

        }

        const response = await fetch(`${api}/api/transaction`, {
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
                collection: "transactions",
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

    return (
        <div className="CreatedForm">
            {loading ? (
                <div className="LoaderDiv"><Loader /></div>
            ) : updating ? (
                <div className="LoaderDiv">
                    <p className='Updating'>{languageText.Submitting}</p>
                    <Loader />
                </div>
            ) : (
                <div className="FormAll">
                    <div className="FormLeft ProductForm">
                        <img src={product.pImage} alt="" />
                        <h3 className="">{size}</h3>
                        <div className="FormLeftDetails FormDetailsProduct">
                            <div>
                                <h2>{language === "en" ? product.pTitle : product.pArabicTitle}</h2>
                                <p>{language === "en" ? product.pDescription : product.pArabicDescription}</p>
                            </div>
                            <div className="FormLeftDetailsPrice">
                                <p>{languageText.Quantity}: {quantity}</p>
                                <h2>{quantity * product.pPrice} {languageText.RM}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="FormCenter">
                        <p className="FormTitle">Purchase Form</p>
                        <div className="Hint">
                            <p>{languageText.valid}</p>
                            <p>{languageText.invalid}</p>
                        </div>

                        <div className="formBox PeopleForm">
                            <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="PersonalFields">
                                    <div className="InputField">
                                        <div className="InputLabelField">
                                            <input
                                                type="text"
                                                className={`input ${(fullNameRegex.test(fullName)) ? 'valid' : 'invalid'}`}
                                                onChange={(e) => { setFullName(e.target.value) }}
                                                required
                                                id="fullName"
                                            />
                                            {!fullName && <label htmlFor="fullName" className={`LabelInput ${(fullName) ? 'valid' : 'invalid'}`}><Icon icon="bx:user" /> {languageText.FullName}</label>}
                                        </div>
                                    </div>
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
                                            {!matric && <label htmlFor="matric" className={`LabelInput ${(matric) ? 'valid' : 'invalid'}`}><Icon icon="stash:user-id" /> {languageText.Matric}</label>}
                                        </div>
                                    </div>
                                    <div className="InputField">
                                        <div className="InputLabelField">
                                            <input
                                                type="email"
                                                className={`input ${(emailRegex.test(email)) ? 'valid' : 'invalid'}`}
                                                onChange={(e) => { setEmail(e.target.value) }}
                                                required
                                                id="email"
                                            />
                                            {!email && <label htmlFor="email" className={`LabelInput ${(email) ? 'valid' : 'invalid'}`}><Icon icon="entypo:email" /> {languageText.formEmail}</label>}
                                        </div>
                                    </div>
                                    <div className="InputField">
                                        <div className="InputLabelField">
                                            <input
                                                type="number"
                                                className={`input ${(combinedPhoneRegex.test(phone)) ? 'valid' : 'invalid'}`}
                                                onChange={(e) => { setPhone(e.target.value) }}
                                                required
                                                id="phone"
                                            />
                                            {!phone && <label htmlFor="phone" className={`LabelInput ${(phone) ? 'valid' : 'invalid'}`}><Icon icon="fluent:phone-chat-16-filled" /> {languageText.formPhone}</label>}
                                        </div>
                                    </div>
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
                                            <option value="Architecture" >{languageText.Arch}</option>
                                            <option value="Bridging" >{languageText.Found}</option>
                                            <option value="Other" >{languageText.Other}</option>
                                        </select>
                                    </div>
                                    <div className="InputField">
                                        <select
                                            className={`input ${(address) ? 'valid' : 'invalid'}`}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled selected hidden>{languageText.formAddress}</option>
                                            <option value="Melawis" >Melawis</option>
                                            <option value="Melana" >Melana</option>
                                            <option value="Desa" >Desa</option>
                                            <option value="Garden" >Garden</option>
                                            <option value="D'Summit" >D'Summit</option>
                                            <option value="Flora" >Flora</option>
                                            <option value="Other" >{languageText.Other}</option>
                                            {/* <option value="8" >8</option>
                                            <option value="Masters" >{languageText.Masters}</option>
                                            <option value="PhD" >{languageText.PhD}</option> */}
                                        </select>
                                    </div>
                                </div>
                                <hr />
                                <div className="PersonalFields PaymentFields">
                                    <p>{languageText.payment} - PNG</p>
                                    <div className="QRPayment">
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                            <img src={logo} className="QRCode" alt="" />
                                            <p className="PaymentAmount"></p>
                                        </div>
                                        <div className="InputField">
                                            <label htmlFor="proof" className={`LabelInputImg ${(proof) ? 'valid' : 'invalid'}`}>
                                                <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><Icon icon="fluent:reciept-20-filled" />{selectedImageText || languageText.proof}</div>
                                                {(proof) ? <button className="XImgButton" onClick={handleRemoveProofImage}>
                                                    <Icon icon="mdi:close-outline" />
                                                </button> : <Icon icon="mingcute:upload-3-fill" />}
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
                                </div>
                                {!proof && <p className="formError" style={{ background: "var(--theme)" }}><Icon icon="ooui:error" />{languageText.UploadProof}</p>}
                                {proof ? (
                                    <button className="button" data-content={languageText.Submit}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svgIcon"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM135.1 217.4c-4.5 4.2-7.1 10.1-7.1 16.3c0 12.3 10 22.3 22.3 22.3H208v96c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V256h57.7c12.3 0 22.3-10 22.3-22.3c0-6.2-2.6-12.1-7.1-16.3L269.8 117.5c-3.8-3.5-8.7-5.5-13.8-5.5s-10.1 2-13.8 5.5L135.1 217.4z" /></svg>
                                    </button>
                                ) : null}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>



    )
}

export default PurchaseForm
