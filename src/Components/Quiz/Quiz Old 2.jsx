import React, { useState, useEffect } from 'react';

const QuizDashboard = ({ api }) => {
    const [questions, setQuestions] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [questionInputs, setQuestionInputs] = useState([{ questionText: '', answer: '', points: '', publicDate: '' }]);
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



    const handleAddQuestionInput = () => {
        setQuestionInputs([...questionInputs, { questionText: '', answer: '', points: '', publicDate: '' }]);
    };

    // Handle input change
    const handleInputChange = (index, event) => {
        const newQuestionInputs = [...questionInputs];
        newQuestionInputs[index][event.target.name] = event.target.value;
        setQuestionInputs(newQuestionInputs);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Map over question inputs and prepare for submission
        const questionsToAdd = questionInputs.map((input) => ({
            questionText: input.questionText,
            answer: input.answer,
            points: parseInt(input.points, 10),
            publicDate: input.publicDate,
        }));

        fetch(`${api}/api/quiz/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questions: questionsToAdd }),
        })
            .then((res) => res.json())
            .then(() => {
                // Refresh questions after adding
                fetch(`${api}/api/quiz/questions`)
                    .then((res) => res.json())
                    .then((data) => setQuestions(data));
            })
            .catch((err) => console.error('Error adding questions:', err));
    };


    const handleDateRangeChange = () => {
        const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

        // Filter contestants based on date
        const filtered = contestants.filter((contestant) => {
            const submissionDate = new Date(contestant.submittedOn).setHours(0, 0, 0, 0);
            if (start && end) {
                return submissionDate >= start && submissionDate <= end;
            } else if (start) {
                return submissionDate === start;
            } else if (end) {
                return submissionDate === end;
            }
            return true; // No filter applied
        });

        // Group contestants by matric number, merge answers
        const groupedContestants = filtered.reduce((acc, contestant) => {
            const existing = acc.find((c) => c.matricNumber === contestant.matricNumber);
            if (existing) {
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

        // Ensure total points are recalculated after date filtering
        filteredContestants.forEach((contestant) => {
            const totalPoints = contestant.answers.reduce(
                (total, ans) => total + (ans.points || 0), 0
            );
            matricPoints[contestant.matricNumber] = totalPoints;
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

        // Filter questions by date
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
                                {question.questionText}{" " + question.points}
                            </th>
                        ))}
                        <th className="border border-gray-400 p-2">Total Points</th>
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
                                        {ans && typeof ans === 'object' ? ans.answer : "No Answer"}
                                    </td>
                                );
                            })}
                            <td className="border border-gray-400 p-2">
                                {contestant.answers.reduce((total, ans) => total + (ans.points || 0), 0)}
                            </td>
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
                <form onSubmit={handleSubmit}>
                    {questionInputs.map((input, index) => (
                        <div key={index} className="my-2">
                            <input
                                name="questionText"
                                value={input.questionText}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Question"
                                className="border p-2 mr-2"
                                required
                            />
                            <input
                                name="answer"
                                value={input.answer}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Answer"
                                className="border p-2 mr-2"
                                required
                            />
                            <input
                                name="points"
                                value={input.points}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Points"
                                type="number"
                                className="border p-2 mr-2"
                                required
                            />
                            <input
                                name="publicDate"
                                value={input.publicDate}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Public Date"
                                type="date"
                                className="border p-2 mr-2"
                                required
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddQuestionInput} className="bg-green-500 text-white p-2 mb-2">
                        Add Another Question
                    </button>
                    <button type="submit" className="bg-blue-500 text-white p-2">
                        Submit All Questions
                    </button>
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
