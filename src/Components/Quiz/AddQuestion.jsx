import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const AddQuestion = ({ api, languageText, darkMode, language }) => {
    const [questionInputs, setQuestionInputs] = useState([{ questionText: '', answer: '', points: '', }]);
    const [publicDate, setPublicDate] = useState('');
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        fetch(`${api}/api/quiz/questions`)  // This now fetches all questions
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => setQuestions(data))
            .catch((err) => console.error('Error fetching questions:', err));
    }, [api]);


    const handleAddQuestionInput = () => {
        setQuestionInputs([...questionInputs, { questionText: '', answer: '', points: '' }]);
    };
    const handleRemoveQuestion = (index) => {
        setQuestionInputs(questionInputs.filter((_, i) => i !== index));
    };


    // Handle input change
    const handleInputChange = (index, event) => {
        const newQuestionInputs = [...questionInputs];
        newQuestionInputs[index][event.target.name] = event.target.value;
        setQuestionInputs(newQuestionInputs);
    };

    const handlePublicDateChange = (event) => {
        setPublicDate(event.target.value); // Set the public date for all questions
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const questionsToAdd = questionInputs.map((input) => ({
            questionText: input.questionText,
            answer: input.answer,
            points: parseInt(input.points, 10),
            publicDate: publicDate,
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
        toast.success(`${languageText.QuestionsAdded}`, {
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
        navigate("/quizDashboard")



    };


    return (
        <div className="Form">
            <div className="formBox">

                <form onSubmit={handleSubmit}>
                    <h2>{languageText.AddQuestions}</h2>
                    {questionInputs.map((input, index) => (
                        <div className="OverallLeaderboardContainer" key={index}>
                            <div className="InputField">
                                <div className="InputLabelField">
                                    <input
                                        type="text"
                                        className={`input ${input.questionText ? 'valid' : ''}`}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                        value={input.questionText}
                                        id={`questionText${index}`}
                                        name="questionText"
                                    />
                                    {!input.questionText && (
                                        <label htmlFor={`questionText${index}`} className={`LabelInput ${input.questionText ? 'valid' : ''}`}>
                                            <Icon icon="gravity-ui:circle-question-dot" /> {languageText.Question}
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="InputField">
                                <div className="InputLabelField">
                                    <input
                                        type="text"
                                        className={`input ${input.answer ? 'valid' : ''}`}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                        value={input.answer}
                                        id={`answer${index}`}
                                        name="answer"
                                    />
                                    {!input.answer && (
                                        <label htmlFor={`answer${index}`} className={`LabelInput ${input.answer ? 'valid' : ''}`}>
                                            <Icon icon="ic:round-question-answer" /> {languageText.Answer}
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="InputField">
                                <div className="InputLabelField">
                                    <input
                                        type="number"
                                        className={`input ${input.points ? 'valid' : ''}`}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                        value={input.points}
                                        id={`points${index}`}
                                        name="points"
                                    />
                                    {!input.points && (
                                        <label htmlFor={`points${index}`} className={`LabelInput ${input.points ? 'valid' : ''}`}>
                                            <Icon icon="gg:edit-black-point" /> {languageText.Points}
                                        </label>
                                    )}
                                </div>
                            </div>

                            {index > 0 && (
                                <button type="button" onClick={() => handleRemoveQuestion(index)}>
                                    <Icon icon="solar:notification-remove-bold" />
                                    {languageText.RemoveQuestion}
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={handleAddQuestionInput}>
                        <Icon icon="ic:round-add-task" />
                        {languageText.AddAnotherQuestion}
                    </button>

                    <label className="WeeklyLeaderboardDate">
                        {languageText.ChooseQuestionDate}
                        <input
                            name="publicDate"
                            value={publicDate}
                            onChange={handlePublicDateChange}
                            placeholder="Public Date"
                            type="date"
                            required
                        />
                    </label>

                    <button type="submit">
                        {languageText.SubmitAllQuestions}
                    </button>
                </form>

            </div>
        </div>
    )
}

export default AddQuestion