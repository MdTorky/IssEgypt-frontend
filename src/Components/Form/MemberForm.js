import "./Form.css"
import { useState } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Loader from '../Loader/Loader'


const MemberForm = ({ language, languageText, api, darkMode }) => {
    const { dispatch } = useFormsContext()

    const [name, setName] = useState('');
    const [arabicName, setArabicName] = useState('');
    const [email, setEmail] = useState('');
    const [faculty, setFaculty] = useState('');
    const [type, setType] = useState('');
    const [committee, setCommittee] = useState('');
    const [phone, setPhone] = useState('');
    const [linkedIn, setLinkedIn] = useState('');
    const [memberId, setMemberId] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [img, setImg] = useState('');

    const [updating, setUpdating] = useState(false);


    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImg(file);
            // setSelectedImageText(file.name);
        }
    };

    const uploadFile = async (type, file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", type === 'image' ? 'members_preset' : '');

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



        const form = {
            name,
            arabicName,
            email,
            faculty,
            type,
            committee,
            img: imgUrl,
            phone,
            linkedIn,
            memberId,
        }

        // const formData = new FormData();
        // formData.append('name', name);
        // formData.append('arabicName', arabicName);
        // formData.append('email', email);
        // formData.append('faculty', faculty);
        // formData.append('type', type);
        // formData.append('committee', committee);
        // formData.append('file', img);
        // formData.append('phone', phone);
        // formData.append('linkedIn', linkedIn);
        // formData.append('memberId', memberId);


        try {
            // const response = await fetch(`${api}/api/member`, {
            //     method: 'POST',
            //     body: formData,
            //     access: 'public',
            // });
            const response = await fetch(`${api}/api/member`, {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
            }
            if (response.ok) {
                setError(null)

                dispatch({
                    type: 'CREATE_FORM',
                    collection: 'members',
                    payload: json,
                });
                toast.success(`${languageText.memberAdded}`, {
                    position: "bottom-center",
                    autoClose: 5000,
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
                // Reset form fields
                setName(null);
                setArabicName(null);
                setEmail(null);
                setFaculty(null);
                setType(null);
                setCommittee(null);
                setImg(null); // Reset the image state
                setPhone(null);
                setLinkedIn(null);
                setMemberId(null);
                setUpdating(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('An error occurred while submitting the form:', error);
            setError('An error occurred while submitting the form');
        }
    };

    const fullNameRegex = /^[a-zA-Z\s'-]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:(1[0-9])|(?:3[2-9]|4[2-9]|5[4-9]|6[2-9]|7[3-9]|8[2-9]|9[2-9]))\d{7,8}$/;

    return (
        <div className="Form">
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
                            <h2>{languageText.addMember}</h2>
                            <div className="InputRow">

                                <div className="InputField">
                                    <input
                                        placeholder={`\uf007  ${languageText.formName}`}
                                        type="text"
                                        className={`input ${fullNameRegex.test(name) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => { setName(e.target.value) }}
                                    />
                                </div>

                                <div className="InputField">
                                    <input
                                        placeholder={`\uf1ab  ${languageText.formNameArabic}`}
                                        type="text"
                                        className={`input ${(arabicName) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => { setArabicName(e.target.value) }}
                                    />
                                </div>
                            </div>
                            <div className="InputRow">
                                <div className="InputField">
                                    <input
                                        placeholder={`\uf0e0  ${languageText.formEmail}`}

                                        type="email"
                                        className={`input ${emailRegex.test(email) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                </div>

                                <div className="InputField">
                                    <select
                                        // className={`input ${(faculty) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => setFaculty(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled selected hidden>{languageText.formFaculty}</option>
                                        <option value="Electrical Engineering">Electrical Engineering</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Chemical Engineering">Chemical Engineering</option>
                                        <option value="Bridging & Foundation">Bridging & Foundation</option>
                                        <option value="Architecture">Architecture</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="InputRow">

                                <div className="InputField">
                                    <input
                                        placeholder={`\uf095  ${languageText.formPhone}`}
                                        type="number"
                                        className={`input ${phoneRegex.test(phone) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => { setPhone(e.target.value) }}
                                    />
                                </div>

                                <div className="InputField">
                                    <input
                                        placeholder={`\uf1ab  ${languageText.linkedin}`}

                                        type="text"
                                        className={`input ${(linkedIn) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => { setLinkedIn(e.target.value) }}
                                    />
                                </div>
                            </div>
                            <div className="InputRow">
                                <div className="InputField">
                                    <select
                                        // className={`input ${(committee) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => setCommittee(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled selected hidden>{languageText.formCommittee}</option>
                                        {/* <option value="ISS Egypt">President</option> */}
                                        {/* <option value="Vice">Vice President</option> */}
                                        {/* <option value="Secretary">General Secretary</option> */}
                                        {/* <option value="Treasurer">Treasurer</option> */}
                                        <option value="Academic">Academic Committee</option>
                                        {/* <option value="Bank">Knowledge Bank</option> */}
                                        <option value="Social">Social Committee</option>
                                        <option value="Culture">Culture Committee</option>
                                        <option value="Sports">Sports Committee</option>
                                        <option value="Media">Media Committee</option>
                                        <option value="Logistics">Logistics Committee</option>
                                        <option value="WomenAffairs">Women Affairs</option>
                                        <option value="PR">Public Relations</option>
                                        <option value="HR">Human Resources</option>
                                        {/* <option value="Reading">Reading Club</option> */}
                                    </select>

                                </div>


                                <div className="InputField">
                                    <select
                                        onChange={(e) => setType(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled selected hidden>{languageText.formRole}</option>
                                        {/* <option value="President">President</option> */}
                                        <option value="Member" hidden={
                                            committee === 'ISS Egypt' ||
                                                committee === 'Vice' ||
                                                committee === 'Secretary' ||
                                                committee === 'Treasurer' ||
                                                committee === 'PR'
                                                ? true : false}>Member</option>
                                    </select>
                                </div>
                            </div>

                            <div className="InputRow">
                                <div className="InputField">
                                    <input
                                        placeholder={`\uf03e  ${languageText.formImg}`}
                                        type="file"
                                        accept="image/*"
                                        id="img"

                                        className={`input ${(img) ? 'valid' : 'invalid'}`}
                                        onChange={handleImageUpload}

                                    />
                                </div>
                                <div className="InputField">
                                    <input

                                        placeholder={`\uf2c1  ${languageText.formId}`}

                                        type="number"
                                        className={`input ${(memberId) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => { setMemberId(e.target.value) }}
                                    />
                                </div>
                            </div>
                            <button>{languageText.addMember}</button>
                            {error && <div className="formError">{error}</div>}
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default MemberForm;