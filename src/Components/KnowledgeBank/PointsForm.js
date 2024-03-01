import { useState } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/HorusLoader'
import InputField from '../components/FormInputField';
import HorusToken from '../../images/HorusToken.png'
import HorusTokenDay from '../../images/HorusToken.svg'
import './KnowledgeBank.css'

const PointsForm = ({ language, languageData, api, darkMode }) => {
    const { dispatch } = useFormsContext()
    const { user } = useAuthContext()
    const languageText = languageData[language];
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [matric, setMatric] = useState("");
    const [phone, setPhone] = useState("");
    const [point, setPoint] = useState("");




    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const token = {
            name,
            matric,
            phone,
            points: point,
            status: true
        }

        const response = await fetch(`${api}/api/point`, {
            method: 'POST',
            body: JSON.stringify(token),
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
                collection: "points",
                payload: json
            })
            {
                toast.success(
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={HorusTokenDay} className="HorusLogo" alt="" />
                        {languageText.TokensAdded}
                    </div>
                    , {
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
            setName("")
            setPhone("")
            setMatric("")
            setPoint("")
            navigate("/tokensForm")
        }

    }


    return (
        <div className="Form">
            {loading ? (
                <div><Loader languageText={languageText.Submitting} darkMode={darkMode} /></div>
            ) : (
                <div className="formBox" style={updating ? { background: "transparent" } : {}}>
                    {updating &&
                        <div>
                            {/* <p className='Updating'>{languageText.Submitting}</p> */}
                            <Loader languageText={languageText.Submitting} darkMode={darkMode} />
                        </div>
                    }
                    {!updating && (
                        <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
                            <h2>{languageText.TokensForm}</h2>
                            {/* <img src={HorusTokenDay} className="HorusLogo" alt="" /> */}

                            <InputField option={name} setOption={setName} languageText={languageText.FullName} icon={"wpf:name"} type={"text"} required={true} option2={"name"} />
                            <InputField option={matric} setOption={setMatric} languageText={languageText.Matric} icon={"fa-solid:id-badge"} type={"text"} required={true} option2={"matric"} />
                            <InputField option={phone} setOption={setPhone} languageText={languageText.Phone} icon={"line-md:phone-call"} type={"text"} required={false} option2={"phone"} />
                            <div className="InputField">
                                <div className="InputLabelField">
                                    <input
                                        type="number"
                                        className={`input ${(point) ? 'valid' : ''}`}
                                        onChange={(e) => { setPoint(e.target.value) }}
                                        required
                                        id='point'
                                    />
                                    {!point && <label htmlFor='point' className={`LabelInput ${(point) ? 'valid' : ''}`}>
                                        {/* <img src={HorusToken} className="InputLogo" alt="" /> */}
                                        <img src={HorusTokenDay} className="InputLogo"></img>
                                        {languageText.Token}</label>
                                    }
                                </div>
                            </div>
                            <button disabled={loading}>{languageText.Submit}</button>
                        </form>
                    )}
                    {error && <div className="formError"><Icon icon="ooui:error" />{error}</div>}
                </div>
            )}
        </div>
    );
}

export default PointsForm;