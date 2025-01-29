import React, { useState, useEffect } from 'react';

const QuizDashboard = ({ api }) => {
    const [questions, setQuestions] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [filteredContestants, setFilteredContestants] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Fetch all questions on component mount
    useEffect(() => {
        fetch(`${api}/api/quiz/questions`)  // This now fetches all questions
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => setQuestions(data))
            .catch((err) => console.error('Error fetching questions:', err));
    }, [api]);

    useEffect(() => {
        fetch(`${api}/api/quiz/contestants`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => setContestants(data))
            .catch((err) => console.error('Error fetching contestants:', err));
    }, [api]);

    const addQuestion = (question) => {
        fetch(`${api}/api/quiz/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(() => {
                // Refresh questions after adding
                return fetch(`${api}/api/quiz/questions`)
                    .then((res) => res.json())
                    .then((data) => setQuestions(data));
            })
            .catch((err) => console.error('Error adding question:', err));
    };


    const handleDateRangeChange = () => {
        const filtered = contestants.filter((contestant) => {
            const submissionDate = new Date(contestant.submittedOn).setHours(0, 0, 0, 0); // Normalize to midnight
            const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
            const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

            if (start && end) {
                return submissionDate >= start && submissionDate <= end;
            } else if (start) {
                return submissionDate === start;
            } else if (end) {
                return submissionDate === end;
            }
            return true; // No filter applied
        });

        // Group contestants by matric number
        const groupedContestants = filtered.reduce((acc, contestant) => {
            const existing = acc.find((c) => c.matricNumber === contestant.matricNumber);
            if (existing) {
                // Merge answers
                contestant.answers.forEach((answer) => {
                    if (!existing.answers.find((a) => a.questionId === answer.questionId)) {
                        existing.answers.push(answer);
                    }
                });
            } else {
                acc.push({ ...contestant });
            }
            return acc;
        }, []);

        setFilteredContestants(groupedContestants);
    };












    const renderTotalPointsTable = () => {
        const matricPoints = {};

        contestants.forEach((contestant) => {
            if (matricPoints[contestant.matricNumber]) {
                matricPoints[contestant.matricNumber] += contestant.answers.reduce(
                    (total, ans) => total + (ans.points || 0), // Ensure points exist
                    0
                );
            } else {
                matricPoints[contestant.matricNumber] = contestant.answers.reduce(
                    (total, ans) => total + (ans.points || 0),
                    0
                );
            }
        });

        const matricEntries = Object.keys(matricPoints).map((matric) => ({
            matric,
            totalPoints: matricPoints[matric],
        }));

        return (
            <table className="border-collapse border border-gray-500 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-400 p-2">Matric</th>
                        <th className="border border-gray-400 p-2">Total Points</th>
                    </tr>
                </thead>
                <tbody>
                    {matricEntries.map((entry) => (
                        <tr key={entry.matric}>
                            <td className="border border-gray-400 p-2">{entry.matric}</td>
                            <td className="border border-gray-400 p-2">{entry.totalPoints}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };










    const renderQuestionsAndAnswersTable = () => {
        const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

        const filteredQuestions = questions.filter((question) => {
            const questionDate = new Date(question.publicDate).setHours(0, 0, 0, 0);

            if (start && end) {
                return questionDate >= start && questionDate <= end;
            } else if (start) {
                return questionDate === start;
            } else if (end) {
                return questionDate === end;
            }
            return true; // No filter applied
        });

        return (
            <table className="border-collapse border border-gray-500 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-400 p-2">Name</th>
                        <th className="border border-gray-400 p-2">Matric</th>
                        <th className="border border-gray-400 p-2">Email</th>
                        {filteredQuestions.map((question) => (
                            <th key={question._id} className="border border-gray-400 p-2">
                                {question.questionText}
                            </th>
                        ))}
                        <th className="border border-gray-400 p-2">Total Points</th>
                        {/* <th className="border border-gray-400 p-2">Correct Answer</th> */}
                    </tr>
                </thead>
                <tbody>
                    {filteredContestants.map((contestant) => (
                        <tr key={contestant.matricNumber}>
                            <td className="border border-gray-400 p-2">{contestant.fullName}</td>
                            <td className="border border-gray-400 p-2">{contestant.matricNumber}</td>
                            <td className="border border-gray-400 p-2">{contestant.email}</td>
                            {filteredQuestions.map((question) => {
                                const ans = contestant.answers.find(
                                    (a) => a.questionId === question._id
                                );
                                return (
                                    <td key={question._id} className="border border-gray-400 p-2">
                                        {ans ? ans.answer : "No Answer"}
                                    </td>
                                );
                            })}
                            <td className="border border-gray-400 p-2">
                                {contestant.answers.reduce(
                                    (total, ans) => total + (ans.points || 0),
                                    0
                                )}
                            </td>
                            {/* <td>
                                {filteredQuestions.map((question) => (
                                    <td key={question._id} className="border border-gray-400 p-2">
                                        {question.answer}
                                    </td>
                                ))}
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };






    return (
        <div className="Form">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="my-4">
                <h2 className="text-xl">Add a Question</h2>
                {/* Form for adding questions */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        addQuestion({
                            questionText: formData.get('questionText'),
                            answer: formData.get('answer'),
                            points: parseInt(formData.get('points'), 10),
                            publicDate: formData.get('publicDate'),
                        });
                    }}
                >
                    <input name="questionText" placeholder="Question" className="border p-2 mr-2" required />
                    <input name="answer" placeholder="Answer" className="border p-2 mr-2" required />
                    <input name="points" placeholder="Points" type="number" className="border p-2 mr-2" required />
                    <input name="publicDate" placeholder="Public Date" type="date" className="border p-2 mr-2" required />
                    <button type="submit" className="bg-blue-500 text-white p-2">Add</button>
                </form>
            </div>
            <div className="my-4">
                <h2 className="text-xl">Select Date Range</h2>
                <div>
                    <label>
                        Start Date:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 mx-2"
                        />
                    </label>
                    <label>
                        End Date:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 mx-2"
                        />
                    </label>
                    <button
                        onClick={handleDateRangeChange}
                        className="bg-blue-500 text-white p-2 ml-2"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {/* Render both tables */}
            <div className="my-4">
                <h2 className="text-xl">Total Points</h2>
                {renderTotalPointsTable()}
            </div>

            <div className="my-4">
                <h2 className="text-xl">Questions and Answers for Selected Date</h2>
                {renderQuestionsAndAnswersTable()}
            </div>
        </div>
    );
};

export default QuizDashboard;
