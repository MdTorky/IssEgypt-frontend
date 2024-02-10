// import '../Form/Form.css'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faPlus, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@iconify/react';
import { useLogin } from '../../hooks/useLogin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ language, languageData, api, darkMode }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const languageText = languageData[language]
    const { login, error, isLoading } = useLogin(api)

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password)
        {
            toast.success(`${languageText.loginSuccess}`, {
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
    }

    return (
        <div className="Form" style={{ marginBottom: '20%' }}>

            <div className="formBox">
                <form autocomplete="off" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <h2>{languageText.Login}</h2>

                    <div className="InputField">
                        <div className="InputLabelField">
                            <input
                                type="email"
                                className={`input ${(email) ? 'valid' : ''}`}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                // required
                                autocomplete="off"
                                id="email"
                            />
                            {!email && <label for="email" className={`LabelInput ${(email) ? 'valid' : ''}`}><Icon icon="eva:email-outline" /> {languageText.Email}</label>}
                        </div>
                    </div>
                    <div className="InputField">
                        <div className="InputLabelField">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`input ${(password) ? 'valid' : ''} 
                                `}
                                // ${showPassword ? "inputPass" : ''}
                                onChange={(e) => { setPassword(e.target.value) }}
                                // required
                                value={password}

                                id="password"
                            />
                            {!password && <label for="password" className={`LabelInput ${(password) ? 'valid' : ''}`}><Icon icon="mdi:password" /> {languageText.Password}</label>}
                        </div>
                        <span className={`TogglePass ${showPassword ? "Pass" : ''}`} onClick={handleTogglePassword}>
                            {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>

                    <button disabled={isLoading}>{languageText.Login}</button>
                </form>
            </div>
            {error && <div className="formError"><Icon icon="ooui:error" />{error}</div>}

        </div>
    );
}

export default Login;