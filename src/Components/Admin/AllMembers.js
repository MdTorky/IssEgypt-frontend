import '../Members/Members.css'
import { useEffect, useState } from 'react'
import { useFormsContext } from '../../hooks/useFormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, Link } from 'react-router-dom';

import Loader from '../Loader/Loader'
import roleChecker from '../Members/MemberLoader'
import MemberCard from '../components/MemberCard';

const AllMembers = ({ language, languageData, api, darkMode }) => {


    const { members, dispatch } = useFormsContext()
    const languageText = languageData[language];


    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');

    const isEmpty = (obj) => {
        return Object.keys(obj).length == 0;
    };

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


    const filteredMembers = Array.isArray(members) ? members.filter(
        (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.arabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.type.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];


    const allMembers = (number) => {
        let members = filteredMembers; // Change const to let here


        switch (number) {
            case 1: members = filteredMembers.filter((member) => member.memberId >= 1 && member.memberId <= 4);
                break;
            case 2: members = filteredMembers.filter((member) => member.memberId >= 5 && member.memberId <= 16 && (member.type == "President" || member.type == "VicePresident"));
                break;
            case "Academic": members = filteredMembers.filter((member) => member.type == "Member" && member.committee == "Academic")
                break;
            case "Bank": members = filteredMembers.filter((member) => member.type == "Member" && member.committee == "Bank")
                break;
            case "Social": members = filteredMembers.filter((member) => member.type == "Member" && member.committee == "Social")
                break;
            case "Cultural": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Culture").sort((a, b) => a.name.localeCompare(b.name));

                break;
            case "Sports": members = filteredMembers.filter((member) => member.type == "Member" && member.committee == "Sports")
                break;
            case "Logistics": members = filteredMembers.filter((member) => member.type == "Member" && member.committee == "Logistics")
                break;
            case "Media": members = filteredMembers.filter((member) => member.type == "Member" && member.committee == "Media")
                break;
            case "Women": members = filteredMembers.filter((member) => member.type == "Member" && member.committee == "Women Affairs")
                break;
            case "Reading": members = filteredMembers.filter((member) => member.type == "Member" && member.committee == "Reading")
                break;
            default: break;
        }

        const sortedMembers = members.sort(
            (a, b) => a.memberId - b.memberId
        );

        const defaultMember = sortedMembers.map((sortedMember, index) => ({
            ...sortedMember,
            index,
        }));

        return defaultMember;
    }


    const loading2 = (number) => {
        return (
            <>
                {loading && (
                    <div><Loader /></div>
                )}
            </>
        );
    };


    const card = (text, number) => {
        const membersToShow = allMembers(number).filter((boardMember) =>
            boardMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            boardMember.arabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            boardMember.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            boardMember.type.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!membersToShow.length) {
            return null;
        }


        return (
            <div className="memberBox">
                <div className="memberBack">
                    <h2>{text}</h2>
                    <div className="people">
                        {loading ? (
                            <div><Loader /></div>
                        ) : (
                            <>
                                {membersToShow.map((boardMember) => (
                                    <div className="adminCard">
                                        <MemberCard api={api} member={boardMember} languageText={languageText} language={language} />

                                        <button
                                            className='deleteButton'
                                            onClick={() => { handleDelete({ member: boardMember }) }}
                                        ><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                ))}
                                {loading2(number)}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };



    const handleDelete = async ({ member }) => {
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

    return (
        <div className="Members">
            <div className="searchContainer">
                <input
                    className={`Search ${searchTerm && filteredMembers.length === 0 ? 'noMembers' : 'hasMembers'}`}
                    placeholder={`${languageText.search}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


            <h1>{languageText.meettheteam}</h1>
            <div className="allMembers">
                {card(languageText.board, 1)}
                {card(languageText.committeeP, 2)}
                {card(languageText.AcademicMembers, "Academic")}
                {card(languageText.BankMembers, "Bank")}
                {card(languageText.SocialMembers, "Social")}
                {card(languageText.CultureMembers, "Cultural")}
                {card(languageText.SportMembers, "Sports")}
                {card(languageText.MediaMembers, "Media")}
                {card(languageText.LogisticsMembers, "Logistics")}
                {card(languageText.WomenMembers, "Women")}
                {card(languageText.ReadingMembers, "Reading")}
                {loading && (
                    <div><Loader /></div>
                )}
            </div>
        </div >
    );
}

export default AllMembers;