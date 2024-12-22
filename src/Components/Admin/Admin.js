import './Admin.css'
import { useParams, Link, Navigate } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext'
import { useEffect, useState } from "react";
import logo from '../../images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCommentDots, faStar, faUser, faEnvelope, faPen, faTrash, faEye, faBolt, faFileExcel, faPlus } from '@fortawesome/free-solid-svg-icons';
import roleChecker from '../Members/MemberLoader'
import Loader from '../Loader/Loader'
import { faWpforms, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import FacultyCard from '../components/FacultyCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@iconify/react';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from "react-router-dom";
import HorusTokenDay from '../../images/HorusToken.svg'
import HorusTokenDark from '../../images/HorusTokenDark.svg'

const Admin = ({ language, languageData, api, darkMode }) => {
    // const { committee } = useParams();
    const { members, forms = [], dispatch } = useFormsContext()
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState(true);
    const languageText = languageData[language];
    const { user } = useAuthContext()
    const navigate = useNavigate();
    const [memberCommittee, setMemberCommittee] = useState("")





    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/member`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                console.log(data);
                dispatch({
                    type: 'SET_ITEM',
                    collection: 'members',
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
    }, [api, dispatch]);



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
    }, [api, dispatch]);







    const [formCommittee, setFormCommittee] = useState(user?.committee)

    const adminFilter = members.filter((member) => member.committee === formCommittee);
    const adminFilter2 = members.filter((member) => member.committee === user?.committee);
    const presidentFilter = adminFilter2.find((member) => member.type === 'President' || member.type === 'VicePresident' || member.type === 'Admin');
    const normalMember = adminFilter.filter((member) => member.type === 'Member' || member.type === 'VicePresident' || member.type === 'BestMember').sort((a, b) => a.name.localeCompare(b.name));


    const formsFilter = forms.filter((form) => form.type === formCommittee);
    const membersCount = normalMember.filter((member) => member.committee === formCommittee).length;
    const formsCount = forms.filter((form) => form.type === formCommittee).length;



    const Members = (member) => {
        return (
            <tr className={`TableHeading TableItems ${member.type === "BestMember" ? "TableItemsBest" : ""}`}>
                {/* { && <Icon icon="openmoji:star" />} */}
                <td>
                    <img src={member.img} alt="" />

                </td>
                <td className="NameStyle"
                >
                    {language === "en" ? member?.name : member?.arabicName}
                </td>
                <td>
                    <div className="icons TableIcons">

                        <button className="icon whatsApp" onClick={() => { window.open(`http://wa.me/${member.phone}`, "_blank") }}>
                            <span class="tooltip" >{languageText.Group}</span>
                            <span><FontAwesomeIcon icon={faWhatsapp} /></span>
                        </button>
                        <button className="icon" onClick={() => { window.open(`mailto:${member.email}`, "_blank") }}>
                            <span class="tooltip" >{languageText.Email}</span>
                            <span><FontAwesomeIcon icon={faEnvelope} /></span>
                        </button>
                        {member.linkedIn && <button className="icon linkedIn" onClick={() => { window.open(`${member.linkedIn}`, "_blank") }}>
                            <span class="tooltip" >{languageText.linkedin}</span>
                            <span><FontAwesomeIcon icon={faLinkedin} /></span>
                        </button>}
                    </div>
                </td>
                <td className='FacultyStyle'
                >
                    <FacultyCard languageText={languageText} faculty={member.faculty} /></td>
                <td>
                    <div className="icons TableIcons">

                        <Link className="icon" to={`/memberEditor/${member.committee}/${member._id}`}>
                            <span class="tooltip" >{languageText.Edit}</span>
                            <span><FontAwesomeIcon icon={faPen} /></span>
                        </Link>
                        {(user.committee === "Secretary" || user.committee === "Admin") && <button className="icon Delete" onClick={() => { handleMemberDelete({ member: member }) }}>
                            <span class="tooltip Delete" >{languageText.delete}</span>
                            <span><FontAwesomeIcon icon={faTrash} /></span>
                        </button>}
                        <button className="icon Star" onClick={() => { handleChangeMemberType({ member: member }) }}>
                            <span class="tooltip Delete" >{member.type === "BestMember" ? languageText.demote : languageText.promote} </span>
                            {/* <span><FontAwesomeIcon icon={faTrash} /></span> */}

                            <span>{member.type != "BestMember" ? <Icon icon="openmoji:star" /> : <Icon icon="line-md:star-filled" />}</span>
                        </button>
                    </div>
                </td>
            </tr>
        )
    }


    const handleChangeMemberType = async ({ member }) => {
        try {


            let memberType = null;
            if (member.type === "Member") {
                memberType = "BestMember";
            } else {
                memberType = "Member";
            }
            const response = await fetch(`${api}/api/member/${member._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: memberType }),

            });



            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }


            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'members',
                payload: { id: member._id, changes: { type: memberType } },
            });

            {
                toast.success(`${languageText.statusChanged}`, {
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

        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };



    const handleStatusChange = async (selectedForm) => {
        try {


            // Find the form in the state based on formId
            const formToUpdate = forms.find((form) => form._id === form._id);

            // Ensure the form was found
            if (!formToUpdate) {
                console.error('Form not found in state');
                return;
            }

            let state = null;
            if (selectedForm.status === true) {
                state = false;
            } else {
                state = true;
            }
            const response = await fetch(`${api}/api/forms/${selectedForm._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: state }),

            });


            console.log('API Response:', response);

            if (!response.ok) {
                console.error(`Error updating form status. Status: ${response.status}, ${response.statusText}`);
                return;
            }


            dispatch({
                type: 'UPDATE_ITEM',
                collection: 'forms',
                payload: { id: selectedForm._id, changes: { status: state } },
            });

            {
                toast.success(`${languageText.statusChanged}`, {
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

        } catch (error) {
            console.error('An error occurred while updating form status:', error);
        }
    };



    const copyLink = (link) => {
        navigator.clipboard.writeText(link);
        toast.success(`${languageText.linkCopied}`, {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: darkMode ? 'dark' : 'colored',
            style: {
                fontFamily: language === 'ar' ? 'Noto Kufi Arabic, sans-serif' : 'Poppins, sans-serif',
            },
        });
    };






    const handleFormDelete = async ({ forms }) => {
        try {
            const response = await fetch(`${api}/api/forms/${forms._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error(`Error deleting suggestion. Status: ${response.status}, ${response.statusText}`);
                return;
            }

            const responseDelete = await fetch(`${api}/api/issForms/${forms._id}`, {
                method: 'DELETE',
            });

            if (!responseDelete.ok) {
                console.error(`Error deleting form responses. Status: ${responseDelete.status}, ${responseDelete.statusText}`);
                return;
            }

            if (response.ok) {
                const json = await response.json();
                dispatch({
                    type: 'DELETE_ITEM',
                    collection: "forms",
                    payload: json
                });
                {
                    toast.success(`${languageText.formDeleted}`, {
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

            if (responseDelete.ok) {
                const json = await response.json();
                dispatch({
                    type: 'DELETE_ITEM',
                    collection: "ISSForm",
                    payload: json
                });
            }

        } catch (error) {
            console.error('An error occurred while deleting data:', error);
        }
    };



    const handleMemberDelete = async ({ member }) => {
        try {
            const response = await fetch(`${api}/api/member/${member._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error(`Error deleting suggestion. Status: ${response.status}, ${response.statusText}`);
                return;
            }
            if (response.ok) {
                const json = await response.json();
                dispatch({
                    type: 'DELETE_ITEM',
                    collection: "members",
                    payload: json
                });
                {
                    toast.success(`${languageText.memberDeleted}`, {
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

        } catch (error) {
            console.error('An error occurred while deleting data:', error);
        }
    };



    const Forms = (form) => {

        return (
            // <tr className={`TableHeading TableItems`}>
            <tr className={`TableHeading TableItems`} onClick={(e) => {
                copyLink(`issegypt.vercel.app/${encodeURIComponent(form.eventName)}`)
            }}>
                <td>

                    <img src={form.eventImg} alt="" className='EventImg' />
                </td>
                <td className='NameStyle'>
                    {language === "en" ? form?.eventName : form?.arabicEventName}
                </td>
                <td ><div className={`${form.status === true ? 'True' : "False"}`}>STATUS</div></td>
                <td>
                    <div className="icons TableIcons">


                        {/* <Link className="icon" to={`/ISSform/${form._id}`} */}
                        <Link className="icon" to={`/${encodeURIComponent(form.eventName)}`}
                            onClick={(e) => {
                                e.stopPropagation(); // Stop the propagation of the click event
                            }}>
                            <span class="tooltip" >{languageText.view}</span>
                            <span><FontAwesomeIcon icon={faEye} /></span>
                        </Link>
                        <Link className="icon" to={`/formData/${form.type}/${form._id}`}
                            onClick={(e) => {
                                e.stopPropagation(); // Stop the propagation of the click event
                            }}>
                            <span class="tooltip" >{languageText.data}</span>
                            <span><FontAwesomeIcon icon={faFileExcel} /></span>
                        </Link>
                        <Link className="icon" to={`/formEditor/${form.type}/${form._id}`}
                            onClick={(e) => {
                                e.stopPropagation(); // Stop the propagation of the click event
                            }}>
                            <span class="tooltip" >{languageText.Edit}</span>
                            <span><FontAwesomeIcon icon={faPen} /></span>
                        </Link>
                        <button className="icon Status" onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(form)
                        }}>
                            <span class="tooltip Delete" >{languageText.changeStatus}</span>
                            <span><FontAwesomeIcon icon={faBolt} /></span>
                        </button>
                        <button className="icon Delete" onClick={(e) => { e.stopPropagation(); handleFormDelete({ forms: form }) }}>
                            <span class="tooltip Delete" >{languageText.delete}</span>
                            <span><FontAwesomeIcon icon={faTrash} /></span>
                        </button>
                    </div>

                </td>
            </tr>
        )
    }

    const { logout } = useLogout()

    const handleClick = () => {
        logout()
    }

    // if (user && user.type === "admin") {
    return (
        <div className="Admin">
            {loading ? (
                <div><Loader /></div>
            ) : (
                <>
                    <div className="DashboardTop">

                        <div className="PresidentBox">
                            <div className="PresidentBoxLeft">
                                <>
                                    {language === "en" ? <h2>{presidentFilter?.name}</h2> : <h2>{presidentFilter?.arabicName}</h2>}
                                    <p>{roleChecker({ languageText: languageText, committee: presidentFilter?.committee, role: presidentFilter?.type })}</p>
                                </>
                                <div className="ProfileButtons">
                                    {/* <Link className="ProfileButton" to="/underConstruction">{languageText.viewProfile}</Link> */}
                                    <Link className="ProfileButton" to={`/memberEditor/${user?.committee}/${presidentFilter?._id}`}>{languageText.editProfile}</Link>
                                    {/* <button className="ProfileButton Logout" to="/"><Icon icon="solar:logout-outline" /></button> */}
                                    <button className="icon Logout" onClick={handleClick}>
                                        <span class="tooltip Delete" >{languageText.Logout}</span>
                                        <span><Icon icon="uiw:logout" /></span>
                                    </button>
                                </div>
                            </div>
                            <img src={presidentFilter?.img} alt="" />
                        </div>
                        <div className="Statistics">

                            {membersCount > 0 &&
                                <div className="StatisticsBox">
                                    <div className="MembersBox">
                                        <div className="MembersBoxLeft">
                                            <p>{languageText.NoMembers}</p>
                                            <p>{membersCount}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faUser} className='StatisticsIcon' />
                                    </div>
                                </div>}
                            <div className="StatisticsBox">
                                <div className="MembersBox">
                                    <div className="MembersBoxLeft">
                                        <p>{languageText.NoForms}</p>
                                        <p>{formsCount}</p>
                                    </div>
                                    <FontAwesomeIcon icon={faWpforms} className='StatisticsIcon' />
                                </div>
                            </div>

                        </div>
                        {user.committee === "Academic" &&
                            <div className="BankLinks">
                                <Link to='/tokensForm' className='BankLink'><img src={!darkMode ? HorusTokenDay : HorusTokenDark} />{languageText.AddToken}</Link>
                                <Link to='/tokensShowcase' className='BankLink'><img src={!darkMode ? HorusTokenDay : HorusTokenDark} />{languageText.ManageTokens}</Link>
                            </div>
                        }

                        {(user.committee === "Secretary" || user.committee === "Admin") &&
                            <div className="BankLinks">
                                <p>{languageText.formCommittee}</p>
                                <select className={`input ${(formCommittee) ? 'valid' : ''}`} onChange={e => (setFormCommittee(e.target.value))}>
                                    <option value={user?.committee}>{user?.committee}</option>
                                    {user?.committee === "Admin" && <option value="ISS Egypt">President</option>}
                                    {user?.committee === "Admin" && <option value="Vice">Vice-President</option>}
                                    {user?.committee === "Admin" && <option value="Secretary">Secretary</option>}
                                    {user?.committee === "Admin" && <option value="Treasurer">Treasurer</option>}
                                    <option value="Social">Social</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Culture">Culture</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Women Affairs">Women Affairs</option>
                                    <option value="Media">Media</option>
                                    <option value="HR">HR</option>
                                    <option value="PR">PR</option>
                                    <option value="Reading">Reading</option>
                                </select>
                                <Link to="/productData" className='ProductsDataButton'>Products Data</Link>
                            </div>
                        }
                    </div>

                    <div className="DashboardBottom">

                        {membersCount > 0 &&
                            <div className="Members">
                                <h2>{languageText.members}</h2>
                                <table>
                                    <tr className="TableHeading">
                                        <th></th>
                                        <th>{languageText.FullName}</th>
                                        <th>{languageText.Contact}</th>
                                        <th>{languageText.Faculty}</th>
                                        <th>{languageText.Action}</th>
                                    </tr>
                                </table>

                                {normalMember.map((member) => (
                                    <div>
                                        {Members(member)}
                                    </div>
                                ))}
                            </div>}
                        <div className="Members">

                            <Link to="/formCreator/admin" className='AddFormButton'><FontAwesomeIcon icon={faPlus} /> {languageText.createForm}</Link>
                            <Link to="/formCreator/admin" className='AddFormButtonPhone'><FontAwesomeIcon icon={faPlus} /> {languageText.createForm}</Link>

                            <h2>{languageText.forms}</h2>
                            {/* <h2>{user?.type}</h2> */}

                            <table>
                                <tr className="TableHeading">
                                    <th></th>
                                    <th>{languageText.eventName}</th>
                                    <th>{languageText.Status}</th>
                                    <th>{languageText.Action}</th>
                                </tr>
                            </table>

                            {formsFilter.map((form) => (
                                <div>
                                    {Forms(form)}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )
            }
        </div >
    );


}


export default Admin;