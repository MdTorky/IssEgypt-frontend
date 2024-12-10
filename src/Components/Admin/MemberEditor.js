import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext'
import Loader from '../Loader/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faPlus, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';

import "../Form/Form.css"

const MemberEditor = ({ language, languageData, api, darkMode }) => {
    const { members = [], dispatch } = useFormsContext();
    const { committee, memberId } = useParams();
    const [member, setMember] = useState(null);
    const languageText = languageData[language];
    const [loading, setLoading] = useState(true);
    const [img, setImg] = useState(null);
    const [selectedImageText, setSelectedImageText] = useState(null);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext()


    useEffect(() => {
        // Fetch form data based on type and formId
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/member/${memberId}`);
                if (!response.ok) {
                    console.error(`Error fetching form data. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'GET_ITEM',
                    collection: "members",
                    payload: data,
                });
                setMember(data);
                console.log(data)
            } catch (error) {
                console.error('An error occurred while fetching form data:', error);
            } finally {
                // Set loading to false once the data is fetched (success or error)
                setLoading(false);
            }
        };

        fetchData();
    }, [api, memberId, dispatch]);









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



    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        let imgUrl = member.img
        if (img) {
            imgUrl = await uploadFile('image', member.img)
        }

        try {
            const formToUpdate = members.find((member) => member._id === memberId);

            // Ensure the form was found
            if (!formToUpdate) {
                console.error('Members not found in state');
                console.log('members array:', members);
                console.log('memberId:', members);
                return;
            }


            const response = await fetch(`${api}/api/member/${memberId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: member.name,
                    arabicName: member.arabicName,
                    email: member.email,
                    faculty: member.faculty,
                    phone: member.phone,
                    linkedIn: member.linkedIn,
                    img: imgUrl,
                    committee: member.committee
                }),
            });

            console.log('API Response:', response);

            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }

            // Assuming the API response contains the updated form data
            const updatedMemberData = await response.json();
            console.log('Updated Form Data:', updatedMemberData);
            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'members',
                payload: { id: memberId, changes: updatedMemberData },
            });

            {
                toast.success(`${languageText.memberEdited}`, {
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
        setMember((prevMember) => ({
            ...prevMember,
            [name]: value,
        }));
    };


    const handleImgChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setMember((prevMember) => ({
                ...prevMember,
                img: file,
            }));
            setSelectedImageText(file.name);
            setImg(file)
        }
    };



    const handleRemoveImage = () => {
        setMember((prevMember) => ({
            ...prevMember,
            img: null,
        }));
        setSelectedImageText(null);
    }

    return (
        <div className='Form'>
            {loading ? (
                <div><Loader /></div>
            ) : (
                <div className="formBox">
                    {updating &&
                        <div>
                            <p className='Updating'>{languageText.Updating}</p>
                            <Loader />
                        </div>
                    }
                    {!updating && (
                        <form onSubmit={handleUpdate}>
                            <h2>{languageText.editMember}</h2>

                            <img src={member.img} className="MemberEditorImg" />

                            <div className="InputRow">
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(member.name) ? 'valid' : ''}`}
                                            required
                                            value={member.name}
                                            id="name"
                                            name="name"
                                            onChange={handleInputChange}
                                            style={{
                                                direction: "ltr"
                                            }}

                                        />
                                        {!member.name && <label htmlFor="name" className={`LabelInput ${(member.name) ? 'valid' : ''}`}><FontAwesomeIcon icon={faStar} /> {languageText.FullName}</label>}
                                    </div>
                                </div>


                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(member.arabicName) ? 'valid' : ''}`}
                                            onChange={handleInputChange}
                                            required
                                            value={member.arabicName}
                                            id="arabicName"
                                            name="arabicName"
                                            style={{
                                                direction: "rtl"
                                            }}
                                        />
                                        {!member.arabicName && <label for="arabicName" className={`LabelInput ${(member.arabicName) ? 'valid' : ''}`}><FontAwesomeIcon icon={faStar} /> {languageText.FullName}</label>}
                                    </div>
                                </div>
                            </div>

                            <div className="InputRow">

                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="email"
                                            className={`input ${(member.email) ? 'valid' : ''}`}
                                            onChange={handleInputChange}
                                            required
                                            value={member.email}
                                            id="email"
                                            name="email"
                                        />
                                        {!member.email && <label for="email" className={`LabelInput ${(member.email) ? 'valid' : ''}`}><FontAwesomeIcon icon={faEnvelope} /> {languageText.Email}</label>}
                                    </div>
                                </div>


                                <div className="InputField">
                                    <select
                                        className={`input ${(member.faculty) ? 'valid' : ''}`}
                                        value={member.faculty}
                                        onChange={handleInputChange}
                                        required
                                        name="faculty"
                                    >
                                        <option value="" disabled selected hidden>{languageText.ChooseFaculty}</option>
                                        <option value="Electrical Engineering" >{languageText.FKE}</option>
                                        <option value="Computer Science" >{languageText.FC}</option>
                                        <option value="Mechanical Engineering" >{languageText.FKM}</option>
                                        <option value="Civil Engineering" >{languageText.FKA}</option>
                                        <option value="Chemical Engineering" >{languageText.FKT}</option>
                                        <option value="Bridging & Foundation" >{languageText.Found}</option>
                                        <option value="Other" >{languageText.Other}</option>
                                    </select>
                                </div>



                            </div>
                            <div className="InputRow">
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="number"
                                            className={`input ${(member.phone) ? 'valid' : ''}`}
                                            onChange={handleInputChange}
                                            required
                                            value={member.phone}
                                            id="phone"
                                            name="phone"
                                        />
                                        {!member.phone && <label for="phone" className={`LabelInput ${(member.phone) ? 'valid' : ''}`}><FontAwesomeIcon icon={faPhone} /> {languageText.Phone}</label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(member.linkedIn) ? 'valid' : ''}`}
                                            onChange={handleInputChange}
                                            value={member.linkedIn}
                                            id="linkedIn"
                                            name="linkedIn"
                                        />
                                        {!member.linkedIn && <label for="linkedIn" className={`LabelInput ${(member.linkedIn) ? 'valid' : ''}`}><FontAwesomeIcon icon={faLinkedin} /> {languageText.linkedin}</label>}
                                    </div>
                                </div>
                            </div>
                            {(user.committee === "Admin" || user.committee === "Secretary") &&



                                <div className="InputRow">


                                    <div className="InputField">
                                        <select
                                            className={`input ${(member.committee) ? 'valid' : ''}`}
                                            value={member.committee}
                                            onChange={handleInputChange}
                                            required
                                            name="committee"
                                        >
                                            <option value="" disabled selected hidden>{languageText.ChooseFaculty}</option>
                                            {user.committee === "Admin" && <option value="Admin" >Admin</option>}
                                            {(user.committee === "ISS Egypt" || user.committee === "Admin") && <option value="ISS Egypt" >{languageText.President}</option>}
                                            {(user.committee === "Vice" || user.committee === "Admin") && <option value="Vice" >{languageText.VicePresident}</option>}
                                            {(user.committee === "Secretary" || user.committee === "Admin") && <option value="Secretary" >{languageText.Secretary}</option>}
                                            {(user.committee === "Treasurer" || user.committee === "Admin") && <option value="Treasurer" >{languageText.Treasurer}</option>}
                                            <option value="Social" >{languageText.SocialCommittee}</option>
                                            <option value="Academic" >{languageText.AcademicCommittee}</option>
                                            <option value="Culture" >{languageText.CultureCommittee}</option>
                                            <option value="Sports" >{languageText.SportCommittee}</option>
                                            <option value="Media" >{languageText.MediaCommittee}</option>
                                            <option value="Women Affairs" >{languageText.WomenCommittee}</option>
                                            <option value="PR" >{languageText.PRCommittee}</option>
                                            <option value="HR" >{languageText.HRCommittee}</option>
                                            <option value="Reading" >{languageText.ReadingClub}</option>

                                        </select>
                                    </div>



                                    <div className="InputField">

                                        <label for="img" className={`LabelInputImg ${(member.img) ? 'valid' : ''}`}>
                                            <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><FontAwesomeIcon icon={faImage} />{selectedImageText || languageText.Picture}</div>
                                            {(member.img)
                                                ? <button className="XImgButton" onClick={handleRemoveImage}>
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                                : <FontAwesomeIcon icon={faCloudArrowUp} />}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="img"
                                            className={`input ${(member.eventImg) ? 'valid' : ''}`}
                                            style={{ display: 'none' }}
                                            onChange={handleImgChange}
                                        />
                                    </div>
                                </div>
                            }
                            <button type="submit">{languageText.Update}</button>

                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default MemberEditor;