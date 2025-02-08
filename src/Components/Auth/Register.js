// import '../Form/Form.css'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faPlus, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@iconify/react';
import { useRegister } from '../../hooks/useRegister';
import { motion } from "framer-motion";
const Register = ({ language, languageData, api }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [committee, setCommittee] = useState('')
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const type = "admin"
    // const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const languageText = languageData[language]
    const { register, error, isLoading } = useRegister(api)


    const handleSubmit = async (e) => {
        e.preventDefault();


        await register(email, password, committee, type)

    }

    const letterRegex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
    const charRegex = /^.{8,}$/;

    const digitRegex = /.*\d.*/;
    const specialRegex = /[!@#$%&*_+\-=[\];':"\\|,./?]/;

    const moveButton = () => {
        if (!email || !charRegex.test(password) || !letterRegex.test(password) || !digitRegex.test(password) || !specialRegex.test(password)) {
            const randomX = Math.floor(Math.random() * 400) - 100; // Random -100 to +100px
            const randomY = Math.floor(Math.random() * 200) - 50;  // Random -50 to +50px
            setPosition({ x: randomX, y: randomY });
        }
    };


    return (
        <div className="Form" style={{ marginBottom: '20%' }}>

            <div className="formBox">
                <form action="" autocomplete="off" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <h2>{languageText.Register}</h2>

                    <div className="InputField">
                        <div className="InputLabelField">
                            <input
                                type="email"
                                className={`input ${(email) ? 'valid' : ''}`}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
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
                                required
                                autocomplete="off"
                                id="password"
                            />
                            {!password && <label for="password" className={`LabelInput ${(password) ? 'valid' : ''}`}><Icon icon="mdi:password" /> {languageText.Password}</label>}
                        </div>
                        <span className={`TogglePass ${showPassword ? "Pass" : ''}`} onClick={handleTogglePassword}>
                            {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>

                    </div>

                    <div className="PasswordCheckBack">
                        <p className={`PasswordCheck ${charRegex.test(password) ? "PasswordCheckerValid" : ''}`}>
                            {charRegex.test(password) ? <Icon icon="mingcute:check-2-fill" className="PasswordIcon" /> : <Icon icon="icon-park-twotone:error" className="PasswordIcon" />} {languageText.CharRegex}
                        </p>
                        <p className={`PasswordCheck ${letterRegex.test(password) ? "PasswordCheckerValid" : ''}`}>
                            {letterRegex.test(password) ? <Icon icon="mingcute:check-2-fill" className="PasswordIcon" /> : <Icon icon="icon-park-twotone:error" className="PasswordIcon" />} {languageText.LetterRegex}
                        </p>
                        <p className={`PasswordCheck ${digitRegex.test(password) ? "PasswordCheckerValid" : ''}`}>
                            {digitRegex.test(password) ? <Icon icon="mingcute:check-2-fill" className="PasswordIcon" /> : <Icon icon="icon-park-twotone:error" className="PasswordIcon" />} {languageText.DigitRegex}
                        </p>
                        <p className={`PasswordCheck ${specialRegex.test(password) ? "PasswordCheckerValid" : ''}`}>
                            {specialRegex.test(password) ? <Icon icon="mingcute:check-2-fill" className="PasswordIcon" /> : <Icon icon="icon-park-twotone:error" className="PasswordIcon" />} {languageText.SpecialRegex}
                        </p>
                    </div>
                    <div className="InputField">
                        <select
                            className={`input ${(committee) ? 'valid' : ''}`}

                            onChange={(e) => setCommittee(e.target.value)}
                        // required

                        >
                            <option value="" disabled selected hidden>{languageText.ChooseRole}</option>
                            <option value="ISS Egypt" >{languageText.President}</option>
                            <option value="Vice" >{languageText.VicePresident}</option>
                            <option value="Treasurer" >{languageText.Treasurer}</option>
                            <option value="Secretary" >{languageText.Secretary}</option>
                            <option value="Social" >{languageText.SocialPresident}</option>
                            <option value="Academic" >{languageText.AcademicPresident}</option>
                            {/* <option value="Bank" >{languageText.BankPresident}</option> */}
                            <option value="Culture" >{languageText.CulturePresident}</option>
                            <option value="Sports" >{languageText.SportPresident}</option>
                            <option value="Media" >{languageText.MediaPresident}</option>
                            <option value="WomenAffairs" >{languageText.WomenPresident}</option>
                            {/* <option value="Reading" >{languageText.ReadingPresident}</option> */}
                            <option value="PR" >{languageText.PublicRelation}</option>
                            <option value="HR" >{languageText.HR}</option>
                        </select>
                    </div>

                    <motion.button disabled={isLoading}
                        onMouseEnter={moveButton}
                        animate={{
                            x: position.x,
                            y: position.y,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >{languageText.Register}</motion.button>
                </form>
            </div>
            {error && <div className="formError"><Icon icon="ooui:error" />{error}</div>}
        </div>
    );
}

export default Register;