import React, { useEffect, useState } from 'react';
import { useFormsContext } from '../../hooks/useFormContext';
import MemberCard from '../components/MemberCard';

const OtherMember = ({ api, languageText, tag, language }) => {
    const { members, dispatch } = useFormsContext();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/member`);
                if (!response.ok) {
                    console.error(`Error fetching members. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);
                    return;
                }

                const data = await response.json();
                console.log('OtherMember API response:', data);
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
                setLoading(false);
            }
        };
        fetchData();
    }, [api, dispatch]);

    const filteredMembers = Array.isArray(members)
        ? members.filter((member) => member.committee.includes(tag))
        : [];

    return (
        <div className="allMembers">
            <div>
                {filteredMembers.map((boardMember) => (
                    <div key={boardMember.id}>{boardMember.name}</div>
                ))}
                {loading && <p>Loading...</p>}
            </div>
        </div>
    );
};


export default OtherMember;
