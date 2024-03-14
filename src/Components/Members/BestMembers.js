import './Members.css'
import { useEffect, useState } from 'react'
import { useFormsContext } from '../../hooks/useFormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

import Loader from '../Loader/Loader'
import MemberCard from '../components/MemberCard';

const BestMembers = ({ api, languageText, language }) => {

    const { members, dispatch } = useFormsContext()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');

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
                dispatch({
                    type: 'SET_ITEM',
                    collection: 'members',
                    payload: data
                });
                setMessages(false)
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


    // const filteredMembers = Array.isArray(members) ? members.filter(
    //     (member) =>
    //         member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         member.arabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         member.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         member.type.toLowerCase().includes(searchTerm.toLowerCase())
    // ) : [];


    const filteredData = members.filter((member) => member.type == 'BestMember').sort((a, b) => a.memberId - b.memberId);

    return (
        <div className="Members">
            {/* {loading} */}
            {/* <div className="searchContainer">
                <input
                    className={`Search ${searchTerm && filteredMembers.length === 0 ? 'noMembers' : 'hasMembers'}`}
                    placeholder={`${languageText.search}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div> */}

            <h1 className="PremiumMembersText">{languageText.premiumMembers}</h1>
            <hr className='PremiumMembersTextLine' />
            <div className="memberBox">
                <div className="memberBack">
                    <div className="people">
                        {filteredData.map((member) => (
                            <MemberCard key={member.index} api={api} member={member} languageText={languageText} language={language} />
                        ))}
                        {/* <h3>Members</h3>
                <div className="PremiumMembers">
                    <div className="PremiumMember">
                        {filteredData.map((member) => (
                            <img src={member.img} alt="" />
                        ))}
                    </div>
                    <div className="PremiumMembersDetails">

                        {filteredData.map((member) => (

                            <div>
                                <h4>{member.name}</h4>
                                <p>{member.type}</p>
                                <hr className='PremiumMembersTextLine' />
                                <div className="PremiumMemberSocial">
                                    <button>a</button>
                                    <button>a</button>
                                    <button>a</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BestMembers;