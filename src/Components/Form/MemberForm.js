import "./Form.css"
import { useState } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCommentSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MemberForm = ({ language, languageData, api, darkMode }) => {
    const { dispatch } = useFormsContext()
    const languageText = languageData[language]

    const [name, setName] = useState('');
    const [arabicName, setArabicName] = useState('');
    const [email, setEmail] = useState('');
    const [faculty, setFaculty] = useState('');
    const [type, setType] = useState('');
    const [committee, setCommittee] = useState('');
    const [img, setImg] = useState('');
    const [phone, setPhone] = useState('');
    const [linkedIn, setLinkedIn] = useState('');
    const [memberId, setMemberId] = useState('');
    const [error, setError] = useState(null);



    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const member = { name, arabicName, email, faculty, type, committee, img, phone, linkedIn, memberId }

    //     const response = await fetch(`${api}/api/member`, {
    //         method: 'POST',
    //         body: JSON.stringify(member),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })

    //     const json = await response.json()

    //     if (!response.ok) {
    //         setError(json.error)
    //     }

    //     if (response.ok) {
    //         setError(null)

    //         dispatch({
    //             type: 'CREATE_FORM',
    //             collection: "members",
    //             payload: json
    //         })
    //         alert("Member added successfully")
    //         setName('')
    //         setArabicName('')
    //         setEmail('')
    //         setFaculty('')
    //         setType('')
    //         setCommittee('')
    //         setImg('')
    //         setPhone('')
    //         setLinkedIn('')
    //         setMemberId('')
    //     }

    // }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Set the image file to the state
            setImg(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('arabicName', arabicName);
        formData.append('email', email);
        formData.append('faculty', faculty);
        formData.append('type', type);
        formData.append('committee', committee);
        formData.append('file', img);
        formData.append('phone', phone);
        formData.append('linkedIn', linkedIn);
        formData.append('memberId', memberId);


        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const response = await fetch(`${api}/api/member`, {
                method: 'POST',
                body: formData,
                access: 'public',
            });

            if (!response.ok) {
                const json = await response.json();
                setError(json.error);
            } else {
                setError(null);

                const json = await response.json();
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
            <div className="formBox">
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
                                <option value="ISS Egypt">President</option>
                                <option value="Vice">Vice President</option>
                                <option value="Secretary">General Secretary</option>
                                <option value="Treasurer">Treasurer</option>
                                <option value="Academic">Academic Committee</option>
                                <option value="Bank">Knowledge Bank</option>
                                <option value="Social">Social Committee</option>
                                <option value="Culture">Culture Committee</option>
                                <option value="Sports">Sports Committee</option>
                                <option value="Media">Media Committee</option>
                                <option value="Logistics">Logistics Committee</option>
                                <option value="Women Affairs">Women Affairs</option>
                                <option value="PR">Public Relations</option>
                                <option value="Reading">Reading Club</option>
                            </select>

                        </div>


                        <div className="InputField">
                            <select
                                // className={`input ${(type) ? 'valid' : 'invalid'}`}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="" disabled selected hidden>{languageText.formRole}</option>
                                <option value="President">President</option>
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

                    {/* <div className="InputField">
                        <input
                            type="text"
                            accept="image/*"
                            onChange={(e) => setImg(e)}
                            id="img"
                            className="input"
                        />
                    </div> */}
                    {/* <div className="InputField">
                        <input
                            placeholder={`\uf03e  ${languageText.formImg}`}
                            type="text"
                            className={`input ${(img) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setImg(e.target.value) }}
                        />
                    </div> */}
                    <div className="InputField">
                        <input
                            placeholder={`\uf03e  ${languageText.formImg}`}
                            type="file"
                            className={`input ${(img) ? 'valid' : 'invalid'}`}
                            // onChange={(e) => { setImg(e.target.value) }}
                            onChange={(e) => handleImageUpload(e)}
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
                    <button>{languageText.addMember}</button>
                    {error && <div className="formError">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default MemberForm;