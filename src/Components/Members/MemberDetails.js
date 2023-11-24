import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MemberDetails.css';
import { useFormsContext } from '../../hooks/useFormContext';
import roleChecker from '../Members/MemberLoader'
import FacultyCard from '../components/FacultyCard';
import CommitteeLoader from '../components/CommitteeLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'animate.css';

const MemberDetails = ({ language, languageData, api, darkMode }) => {
    const { memberId } = useParams();
    const { members, dispatch } = useFormsContext();
    const languageText = languageData[language];

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [memberId]);

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
    }, [api, dispatch, memberId]);


    const social = (member) => {
        return (
            <div className="icons">

                <button className="icon whatsApp" onClick={() => { window.open(`http://wa.me/${member.phone}`, "_blank") }}>
                    <span class="tooltip" >{languageText.Group}</span>
                    <span><FontAwesomeIcon icon={faWhatsapp} /></span>
                </button>
                <button className="icon" onClick={() => { window.open(`mailto:${member.email}`, "_blank") }}>
                    <span class="tooltip" >{languageText.Email}</span>
                    <span><FontAwesomeIcon icon={faEnvelope} /></span>
                </button>
                <button className="icon linkedIn" onClick={() => { handleLinkedInClick(member.linkedIn) }}>
                    <span class="tooltip" >{languageText.linkedin}</span>
                    <span><FontAwesomeIcon icon={faLinkedin} /></span>
                </button>
            </div>
        )
    }

    const memberCard = (member) => {
        return (
            <Link to={`/members/${member._id}`}
                key={member._id}
                className='mLink'
            >
                <div className="normMemberCard">
                    <div className="presidentImg">
                        <img src={`${api}/${member.img}`} alt="" />
                    </div>
                    <div className="presidentInfo MemberInfo">
                        {language === "ar" ? <p className='presidentName'>{member.arabicName}</p> : <p className='presidentName'>{member.name}</p>}
                        {social(member)}
                    </div>
                </div>
            </Link>
        )
    }
    const filter = members.filter((member) => member._id === memberId);
    const coi = filter[0]?.committee || '';
    const filteredCommittee = members.filter((member) => member.committee === filter[0]?.committee && member._id != filter[0]?._id);
    const president = filteredCommittee.find((member) => member.type === 'President');
    const normMember = filteredCommittee.filter((member) => member.type === 'Member');



    const handleLinkedInClick = (member) => {
        if (member) {
            window.open(member);
        } else {
            Swal.fire({
                title: languageText.noLinkedIn,
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster',
                },
                confirmButtonText: 'OK', // Custom text for the "OK" button
                confirmButtonColor: 'var(--theme)', // Custom color for the "OK" button
            });
        }
    };


    return (
        <div className="MemberDetails">
            <h1>{languageText.MemberDetails}</h1>
            <div className="allMembersBackground">
                <div className="MainMember">
                    {filter.map((member) => (
                        <div className="MemberCard">
                            <div className="MemberID">
                                <div className="backId">
                                    {/* Content inside .backId */}
                                </div>
                                <div className="idImg">
                                    <img src={`${api}/${member.img}`} alt="" />
                                </div>

                                {language === "ar" ? <p className='idName'>{member.arabicName}</p> : <p className='idName'>{member.name}</p>}
                            </div>
                            <div className="text">
                                <p className="role">{roleChecker({ languageText: languageText, committee: member.committee, role: member.type })}</p>
                                <p className="faculty"><FacultyCard languageText={languageText} faculty={member.faculty} /></p>
                                {social(member)}
                            </div>

                        </div>
                    ))}

                </div>
                {normMember.length > 0 && (
                    <div className="OtherMembers">
                        <h3>{CommitteeLoader({ languageText: languageText, committee: coi })}</h3>
                        <div className="allRightMembers">
                            <div className="PresidentMember">
                                {president && (
                                    <div className='president' key={president._id}>
                                        <Link to={`/members/${president._id}`}
                                            key={president._id}
                                            className='mLink'
                                        >
                                            <div className="presidentCard">
                                                <div className="presidentImg">
                                                    <img src={`${api}/${president.img}`} alt="" />
                                                </div>
                                                <div className="presidentInfo">
                                                    {language === "ar" ? <p className='presidentName'>{president.arabicName}</p> : <p className='presidentName'>{president.name}</p>}
                                                    <p className='role'>{roleChecker({ languageText: languageText, committee: president.committee, role: president.type })}</p>
                                                    {social(president)}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                                <hr />
                            </div>

                            <div className="memberB">
                                {normMember.map((member) => (
                                    <>
                                        {memberCard(member)}
                                    </>
                                ))}
                            </div>
                        </div>
                    </div >
                )}
            </div >
        </div >
    );
};


export default MemberDetails;
