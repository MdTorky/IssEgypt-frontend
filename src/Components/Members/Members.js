import './Members.css'
import { useEffect, useState } from 'react'
import { useFormsContext } from '../../hooks/useFormContext'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

import Loader from '../Loader/Loader'
import MemberCard from '../components/MemberCard';
import UserType from '../Auth/UserType';

const Members = ({ language, languageText, api, darkMode }) => {
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
        let members = filteredMembers;


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
        const defaultMember = members.map((member, index) => ({
            ...member,
            index,
        }));

        return defaultMember;
    }


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

                        <>
                            {membersToShow.map((boardMember) => (
                                <div className="adminCard">
                                    <MemberCard key={boardMember.index} api={api} member={boardMember} languageText={languageText} language={language} />
                                    {UserType() && <button
                                        className='deleteButton'
                                        onClick={() => handleDelete({ member: boardMember })}
                                    ><Icon icon="material-symbols:delete-rounded" /></button>}
                                    {UserType() && <Link to={`/memberEditor/${boardMember.committee}/${boardMember._id}`}
                                        className='editButton'
                                    ><Icon icon="flowbite:user-edit-solid" /></Link>}
                                </div>



                            ))}
                        </>
                    </div>
                </div>
            </div>
        );
    };




    const handleDelete = async ({ member }) => {
        const confirmation = window.confirm(`Are you sure you want to delete ${member.name}?`);
        if (!confirmation) return;

        try {
            const response = await fetch(`${api}/api/member/${member._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error(`Error deleting member. Status: ${response.status}, ${response.statusText}`);
                return;
            }

            const json = await response.json();
            dispatch({
                type: 'DELETE_ITEM',
                collection: "members",
                payload: json,
            });

            toast.success(`${languageText.memberDeleted}`, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: darkMode ? "dark" : "colored",
                style: {
                    fontFamily: language === 'ar' ? 'Noto Kufi Arabic, sans-serif' : 'Poppins, sans-serif',
                },
            });
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

            {/* <Link to="/premiumMembers" className="bestMembersButton" data-content={languageText.premiumMembers}></Link> */}
            <Link to="/underConstruction" className="bestMembersButton" data-content={languageText.premiumMembers}></Link>


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
                {/* {card(languageText.ReadingMembers, "Reading")} */}
                {/* {card("Best Members", "BestMembers")} */}
                {loading && (
                    <div><Loader /></div>
                )}
            </div>
        </div >
    );
}

export default Members;