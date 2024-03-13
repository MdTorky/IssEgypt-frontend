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

const Members = ({ language, languageData, api, darkMode }) => {
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




    // const handleDelete = async ({ member }) => {
    //     try {
    //         const response = await fetch(`${api}/api/member/${member._id}`, {
    //             method: 'DELETE',
    //         });

    //         if (!response.ok) {
    //             console.error(`Error deleting suggestion. Status: ${response.status}, ${response.statusText}`);
    //             return;
    //         }
    //         if (response.ok) {
    //             const json = await response.json();
    //             dispatch({
    //                 type: 'DELETE_ITEM',
    //                 collection: "members",
    //                 payload: json
    //             });
    //             {
    //                 toast.success(`${languageText.suggestionDelete}`, {
    //                     position: "bottom-center",
    //                     autoClose: 5000,
    //                     hideProgressBar: true,
    //                     closeOnClick: true,
    //                     pauseOnHover: true,
    //                     draggable: true,
    //                     progress: undefined,
    //                     theme: darkMode ? "dark" : "colored",
    //                     style: {
    //                         fontFamily: language === 'ar' ?
    //                             'Noto Kufi Arabic, sans-serif' :
    //                             'Poppins, sans-serif',
    //                     },
    //                 });
    //             }

    //         }

    //     } catch (error) {
    //         console.error('An error occurred while deleting data:', error);
    //     }
    // };


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
            case 1: members = filteredMembers.filter((member) => member.memberId >= 1 && member.memberId <= 4).sort(
                (a, b) => a.memberId - b.memberId
            );
                break;
            case 2: members = filteredMembers.filter((member) => member.memberId >= 5 && member.memberId <= 16 && (member.type == "President" || member.type == "VicePresident")).sort(
                (a, b) => a.memberId - b.memberId
            );
                break;
            case "Academic": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Academic").sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Bank": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Bank").sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Social": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Social").sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Cultural": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Culture").sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Sports": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Sports").sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Logistics": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Logistics").sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Media": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Media").sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Women": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Women Affairs").sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Reading": members = filteredMembers.filter((member) => (member.type == "Member" || member.type == "BestMember") && member.committee == "Reading").sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "BestMembers": members = filteredMembers.filter((member) => member.type == "BestMember").sort((a, b) => a.name.localeCompare(b.name));
                break;
            default: break;
        }

        // const sortedMembers = members.sort(
        //     (a, b) => a.memberId - b.memberId
        // );

        // const sortedMembers = members.sort((a, b) => a.name.localeCompare(b.name));
        const sortedMembers = members

        const defaultMember = members.map((member, index) => ({
            ...member,
            index,
        }));

        return defaultMember;
    }

    // const BestMember = filteredMembers.filter((member) => member.type === "BestMember").sort((a, b) => a.name.localeCompare(b.name));


    // const boardMembers = filteredMembers.filter((member) => member.memberId >= 1 && member.memberId <= 4);

    // const SortMembers = (members) => {
    //     const sortedMembers = members.sort(
    //         (a, b) => a.memberId - b.memberId
    //     );

    //     return sortedMembers
    // }

    // const Members = (members) => {
    //     const defaultMember = members.map((member, index) => ({
    //         ...member,
    //         index,
    //     }))

    //     return defaultMember
    // }

    // <div key={boardMember._id} className="memberCard">
    //     <div
    //         key={boardMember._id}
    //         className={`memberImg ${boardMember.index % 2 === 0 ? 'even' : 'odd'
    //             }`}>
    //         <img src={`${api}/${boardMember.img}`} alt="" />
    //     </div>
    //     {language == 'ar' ? <p>{boardMember.arabicName}</p> : <p>{boardMember.name}</p>}
    //     <div
    //         key={boardMember._id}
    //         className={`memberInfo ${boardMember.index % 2 === 0 ? 'even' : 'odd'
    //             }`}>
    //         <p className="role">{roleChecker({ languageText: languageText, committee: boardMember.committee, role: boardMember.type })}</p>
    //     </div>
    // </div>

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
                    <h2 className={`${text === "Best Members" ? "BestMemberText" : ""} `}>{text}</h2>
                    <div className="people">
                        {/* {loading ? (
                            <div><Loader /></div>
                        ) : (
                           
                        )} */}

                        <>
                            {membersToShow.map((boardMember) => (
                                <MemberCard key={boardMember.index} api={api} member={boardMember} languageText={languageText} language={language} />
                            ))}
                        </>
                    </div>
                </div>
            </div>
        );
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

            {/* <div className="bestMembersButton"> */}
            <Link to="/underConstruction" className="bestMembersButton" data-content={languageText.premiumMembers}></Link>
            {/* </div> */}


            <h1>{languageText.meettheteam}</h1>
            <div className="allMembers">
                {card(languageText.board, 1)}
                {card(languageText.committeeP, 2)}
                {card(languageText.AcademicMembers, "Academic")}
                {card(languageText.BankMembers, "Bank")}
                {card(languageText.SocialMembers, "Social")}
                {card(languageText.CultureMembers, "Cultural")}
                {card(languageText.SportMembers, "Sports")}
                {/* {card(languageText.MediaMembers, "Media")} */}
                {card(languageText.LogisticsMembers, "Logistics")}
                {card(languageText.WomenMembers, "Women")}
                {card(languageText.ReadingMembers, "Reading")}
                {/* {card("Best Members", "BestMembers")} */}
                {loading && (
                    <div><Loader /></div>
                )}
            </div>
        </div >
    );
}

export default Members;