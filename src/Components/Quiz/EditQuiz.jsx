import React, { useState } from 'react';
import Loader from '../Loader/Loader';
import { Icon } from '@iconify/react';

const ModifyPoints = ({ api, languageText }) => {
    const [date, setDate] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // const fetchUserAnswers = async () => {
    //     if (!date) return;
    //     setLoading(true);
    //     try {
    //         const response = await fetch(`${api}/api/quiz/answers?date=${date}`);
    //         const data = await response.json();
    //         setUsers(data);
    //     } catch (err) {
    //         console.error('Error fetching user answers:', err);
    //     }
    //     setLoading(false);
    // };


    const fetchUserAnswers = async () => {
        if (!date) return;
        setLoading(true);
        try {
            const response = await fetch(`${api}/api/quiz/answers?date=${date}`);
            const data = await response.json();

            // Ensure users is always an array
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching user answers:', err);
            setUsers([]); // Ensure empty state in case of an error
        }
        setLoading(false);
    };
    const updateUserPoints = async (userId, answers) => {
        try {
            const response = await fetch(`${api}/api/quiz/updatepoints`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, answers }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Points updated:', result);
                fetchUserAnswers();
            } else {
                console.error('Error updating points:', result.error);
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    const handlePointsChange = (userIdx, answerIdx, event) => {
        const value = event.target.value;
        const updatedUsers = [...users];
        updatedUsers[userIdx].answers[answerIdx].newPoints = value;
        setUsers(updatedUsers);
    };

    return (
        <div className="Quiz">
            <h2 className='QuizTitle'>{languageText.PointsManagement}</h2>
            <div className="formBox" style={{ margin: "10px auto" }}>
                <div className="OverallLeaderboardContainer">
                    <div className="WeeklyLeaderboardDatesContainer QuizEditDate">
                        <label className='WeeklyLeaderboardDate'>
                            {languageText.ChooseDate}
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </label>
                        <button onClick={fetchUserAnswers}>{languageText.LoadData}</button>


                    </div>
                    {loading ? (
                        <div><Loader /></div>
                    ) : (
                        <div className='BigEditPointsContainer' >
                            {users.length === 0 ? (
                                <p className='QuizNoData'><Icon icon="ic:baseline-update-disabled" /> {languageText.NoDateFound}</p>
                            ) : (
                                users.length > 0 && users.map((user, userIdx) => (
                                    <div key={user._id} className="EditPointsContainer">
                                        <div className="QuizUserInfo">
                                            <div className="QuizUserPoints">
                                                <h3>{user.name}</h3>
                                                <p>{user.points}</p>
                                            </div>
                                            <p>{user.matric}</p>
                                        </div>
                                        <table>
                                            {/* {user.answers.map((answer, answerIdx) => (
                                                <li key={answerIdx}>
                                                    <strong>Q:</strong> {answer.question} <br />
                                                    <strong>A:</strong> {answer.answer} <br />
                                                    <strong>P:</strong> {answer.points} <br />
                                                    <div className="points-controls">
                                                        <input
                                                            required
                                                            type="number"
                                                            placeholder="Enter points"
                                                            value={answer.newPoints || ''}
                                                            onChange={(e) => handlePointsChange(userIdx, answerIdx, e)}
                                                        />
                                                    </div>
                                                </li>
                                            ))} */}
                                            <thead>
                                                <tr className="TableHeading">
                                                    {user.answers.map((answer, answerIdx) => (
                                                        <th key={answerIdx}>{answer.question}</th>
                                                    ))}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr className="TableHeading TableItems">
                                                    {user.answers.map((answer, answerIdx) => (
                                                        <td key={answerIdx}>{answer.answer}</td>
                                                    ))}
                                                </tr>
                                                <tr className="TableHeading TableItems">
                                                    {user.answers.map((answer, answerIdx) => (
                                                        <td key={answerIdx}>{answer.points}</td>
                                                    ))}
                                                </tr>
                                                <tr className="TableHeading">
                                                    {user.answers.map((answer, answerIdx) => (
                                                        <td key={answerIdx}>

                                                            <input
                                                                required
                                                                type="number"
                                                                placeholder={languageText.EnterPoints}
                                                                value={answer.newPoints || ''}
                                                                onChange={(e) => handlePointsChange(userIdx, answerIdx, e)}
                                                                className="PointsInput"
                                                            />

                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button
                                            onClick={() =>
                                                updateUserPoints(user._id, user.answers.map(answer => ({
                                                    questionId: answer.questionId,
                                                    points: parseFloat(answer.newPoints || answer.points),
                                                })))
                                            }
                                            style={{ margin: "auto" }}
                                        >
                                            {languageText.SaveAllPoints}
                                        </button>

                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};

export default ModifyPoints;
