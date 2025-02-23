import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import './Quiz.css'
import { Icon } from '@iconify/react';
import dPlus from '../../images/3d/Plus.png';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const QuizDashboard = ({ api, languageText }) => {
    const [questions, setQuestions] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [QuestionLoading, setQuestionLoading] = useState(false)
    const [UserLoading, setUserLoading] = useState(false)
    const [showQuestions, setShowQuestions] = useState(false)
    const [error, setError] = useState('')

    const handleShowQuestion = () => {
        if (showQuestions === true) {
            setShowQuestions(false)
        } else {
            setShowQuestions(true)
        }
    }

    // Fetch all questions on component mount
    useEffect(() => {
        setQuestionLoading(true)
        fetch(`${api}/api/quiz/questions`)  // This now fetches all questions
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                setQuestionLoading(false)
                return res.json();

            })
            .then((data) => setQuestions(data))
            .catch((err) => {
                console.error('Error fetching questions:', err);
                setQuestionLoading(false)
            });

        setUserLoading(true)
        fetch(`${api}/api/quiz/contestants`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                setUserLoading(false)

                return res.json();
            })
            .then((data) => {
                // const sortedUsers = data.sort((a, b) => new Date(a.points) - new Date(b.points));
                setAggregatedUsers(data);
                setUserLoading(false);
            })
            // .then((data) => setAggregatedUsers(data))
            .catch((err) => {
                console.error("Error fetching aggregated users:", err);
                setUserLoading(false)
            });
    }, [api]);

    const [aggregatedUsers, setAggregatedUsers] = useState([]);





    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange({ ...dateRange, [name]: value });
    };
    const fetchFilteredUsers = () => {
        const { startDate, endDate } = dateRange;
        setError(null)
        if (!startDate || !endDate) {
            setError(languageText.SelectStartEndDate)
            return;
        }

        // Fetch both filtered users and questions for the selected date range
        Promise.all([
            fetch(`${api}/api/quiz/contestantsbydate?startDate=${startDate}&endDate=${endDate}`).then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            }),
            fetch(`${api}/api/quiz/questionsbydate?startDate=${startDate}&endDate=${endDate}`).then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            }),
        ])
            .then(([users, questions]) => {
                // Sort users by submission time (earliest first)
                const sortedUsers = users.sort((a, b) => new Date(a.submittedOn) - new Date(b.submittedOn));
                setFilteredUsers(sortedUsers);
                setQuestions(questions); // Update questions for the selected range
            })
            .catch((err) => console.error('Error fetching filtered data:', err));
    };




    const leaderboardRef = useRef(null);
    const weeklyleaderboardRef = useRef(null);

    const handleScreenshot = () => {
        if (leaderboardRef.current) {
            html2canvas(leaderboardRef.current, {
                scale: 2, // Higher resolution
                useCORS: true, // Helps with external styles
                logging: false, // Reduce console logs
                backgroundColor: null, // Makes background transparent
            }).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'Overall Leaderboard.png';
                link.click();
            }).catch((err) => {
                console.error('Screenshot failed:', err);
            });
        }
    };

    const handleWeeklyScreenshot = () => {

        const tableElement = document.querySelector('.TableOverflow');

        // Backup original styles
        const originalOverflow = tableElement.style.overflow;
        const originalWidth = tableElement.style.width;

        // Expand the table to show full content
        tableElement.style.overflowX = 'visible';
        tableElement.style.width = 'auto';
        if (weeklyleaderboardRef.current) {
            html2canvas(weeklyleaderboardRef.current, {
                scale: 2, // Higher resolution
                useCORS: true, // Helps with external styles
                logging: false, // Reduce console logs
                backgroundColor: null, // Makes background transparent
            }).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'Weekly Leaderboard.png';
                link.click();
                // Restore original styles
                tableElement.style.overflowX = originalOverflow;
                tableElement.style.width = originalWidth;
            }).catch((err) => {
                console.error('Screenshot failed:', err);
            });
        }
    }

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [sortedUsers, setSortedUsers] = useState(aggregatedUsers);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...aggregatedUsers].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setAggregatedUsers(sortedData);

    };


    const handleExportToExcel = () => {
        if (aggregatedUsers.length === 0) {
            alert(languageText.NoUserAnswer);
            return;
        }

        // Prepare data for Excel
        const data = aggregatedUsers.map(user => ({
            MatricNumber: user.matricNumber.toUpperCase(),
            FullName: user.fullName,
            TotalPoints: user.totalPoints
        }));

        // Create worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leaderboard");

        // Convert to Excel file and trigger download
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "Overall Leaderboard.xlsx");
    };


    return (
        <div className="Quiz">
            <h1 className="QuizTitle">{languageText.RamadanQuizDashboard}</h1>
            <div className="OverallLeaderboard" style={{ margin: "10px auto" }}>
                <Link to="/addQuestion" className="AddQuestionContainer">
                    <img src={dPlus} alt="" />
                    <div className='AddQuestionTextContainer'>
                        <p>{languageText.Addasmuchquestions}</p>
                        <h3>{languageText.AddQuestions}</h3>
                    </div>
                </Link>
            </div>
            <div className="OverallLeaderboard" style={{ margin: "10px auto 20px auto" }}>
                <Link className="QuizButton" to="/editquiz">
                    <Icon icon="hugeicons:file-edit" className='QuizButtonIcon' />{languageText.EditPoints}</Link>
                <Link className="QuizButton" to="/fawazirRamadan">
                    <Icon icon="material-symbols:quiz" className='QuizButtonIcon QuizButtonIcon2' />{languageText.QuizLink}</Link>
            </div>
            <div className="QuizTables">
                <div style={{ position: "relative" }}>
                    <div className="OverallLeaderboard" ref={leaderboardRef}>
                        <div className="OverallLeaderboardContainer">
                            <h2>{languageText.OverallLeaderboard}</h2>
                            {(QuestionLoading || UserLoading) ? (
                                <div><Loader /></div>
                            ) : (
                                <table >
                                    <thead>
                                        <tr className="TableHeading">
                                            <th onClick={() => handleSort("matricNumber")} style={{ cursor: "pointer" }}>
                                                {languageText.Matric} {sortConfig.key === "matricNumber" ? (sortConfig.direction === "asc" ? <Icon icon="tabler:arrow-big-up-line" /> : <Icon icon="tabler:arrow-big-down-line" />) : ""}
                                            </th>
                                            <th onClick={() => handleSort("fullName")} style={{ cursor: "pointer" }}>
                                                {languageText.FullName} {sortConfig.key === "fullName" ? (sortConfig.direction === "asc" ? <Icon icon="tabler:arrow-big-up-line" /> : <Icon icon="tabler:arrow-big-down-line" />) : ""}
                                            </th>
                                            <th onClick={() => handleSort("totalPoints")} style={{ cursor: "pointer" }}>
                                                {languageText.TotalPoints} {sortConfig.key === "totalPoints" ? (sortConfig.direction === "asc" ? <Icon icon="tabler:arrow-big-up-line" /> : <Icon icon="tabler:arrow-big-down-line" />) : ""}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {aggregatedUsers.length > 0 ? aggregatedUsers.map((user) => (
                                            <tr className="TableHeading TableItems" key={user.matricNumber}>
                                                <td style={{ textTransform: "uppercase" }}>{user.matricNumber}</td>
                                                <td className='QuizTableName'>{user.fullName}</td>
                                                <td ><span className='QuizTablePoints'>{user.totalPoints}</span></td>
                                            </tr>
                                        )) : (
                                            <div className='QuizNoData'><Icon icon="tabler:user-off" />{languageText.NoUserAnswer}</div>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                    </div>


                    <button className=" ScreenShot" onClick={handleScreenshot}>
                        <Icon icon="fluent:screenshot-16-filled" className="svgIcon" />
                    </button>
                    <button className="DownloadExcel" onClick={handleExportToExcel}>
                        <Icon icon="vscode-icons:file-type-excel" className="svgIcon" /> {languageText.DownloadExcel}
                    </button>
                </div>


                <div className='OverallLeaderboard'>
                    <div className="OverallLeaderboardContainer">
                        <div className="WeeklyLeaderboardDatesContainer">
                            <div className="WeeklyLeaderboardDates">
                                <label className='WeeklyLeaderboardDate'>
                                    {languageText.StartDate}
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={dateRange.startDate}
                                        onChange={handleDateChange}
                                        className="border p-2 mx-2"
                                        required
                                    />
                                </label>
                                <label className='WeeklyLeaderboardDate'>
                                    {languageText.EndDate}
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={dateRange.endDate}
                                        onChange={handleDateChange}
                                        className="border p-2 mx-2"
                                        required
                                    />
                                </label>
                            </div>
                            <button
                                onClick={fetchFilteredUsers}
                            >
                                {languageText.Filter}
                            </button>

                            {error && <p className="formError" style={{ background: "var(--theme)" }}><Icon icon="ooui:error" />{error}</p>}

                        </div>

                        <hr className="WeeklyLine" />

                        <div style={{ position: "relative" }}>
                            <div className="WeeklyLeaderboardContainer" ref={weeklyleaderboardRef}>
                                <h2>{languageText.WeeklyLeaderboard}</h2>
                                <div className='TableOverflow'>
                                    <table >
                                        <thead>
                                            <tr className="TableHeading">
                                                <th>{languageText.Matric}</th>
                                                <th>{languageText.FullName}</th>
                                                <th>{languageText.TotalPoints}</th>
                                                {showQuestions && filteredUsers.length > 0 ? (questions.map((q, idx) => (<th className='TableAnswers' key={idx}>{q.questionText} <span className="TableAnswer">{q.answer} </span><span className="TableAnswer TablePoint">{q.points} {q.points === 1 ? languageText.Point : languageText.Points} </span></th>
                                                ))) : (<></>)}

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((user) => (
                                                    <tr key={user._id} className="TableHeading TableItems">
                                                        <td>{user._id}</td>
                                                        <td className='QuizTableName'>{user.fullName}</td>
                                                        <td><span className='QuizTablePoints'>{user.totalPoints}</span></td>

                                                        {showQuestions && questions.map((q, idx) => {
                                                            const userAnswers = Array.isArray(user.answers) ? user.answers : [];
                                                            const userAnswer = userAnswers.find((a) => a.questionId.toString() === q._id.toString()); // Ensure to compare ObjectIds correctly

                                                            return (
                                                                <td key={idx}>
                                                                    {userAnswer ? userAnswer.answer : languageText.NoAnswerProvided}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className='QuizNoData'>
                                                        <Icon icon="icon-park-solid:database-fail" /> {languageText.NoDataforDate}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                            <button className="ScreenShot ScreenShot2" onClick={handleWeeklyScreenshot}>
                                <Icon icon="fluent:screenshot-16-filled" className="svgIcon" />
                            </button>
                            <button className={`ShowQuestions ${showQuestions ? "HideQuestions" : ""}`} onClick={handleShowQuestion}>
                                {!showQuestions ? (<><Icon icon="bx:show-alt" /> {languageText.ShowQuestionsAnswers}</>) : (<><Icon icon="bx:hide" /> {languageText.HideQuestionsAnswers}</>)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default QuizDashboard;
