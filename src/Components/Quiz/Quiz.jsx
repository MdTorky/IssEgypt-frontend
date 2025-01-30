import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const QuizPage = ({ api, languageText, language, darkMode }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        matricNumber: "",
        email: "",
        answers: [],
    });
    const navigate = useNavigate();


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Get current day based on the date
                const currentDay = new Date().getDate(); // This gives the day of the month
                const response = await fetch(`${api}/api/quiz/quiz`);
                if (!response.ok) {
                    throw new Error(`Error fetching questions: ${response.status}`);
                }
                const data = await response.json();
                setQuestions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [api]);

    const submitAnswers = async () => {
        setSubmitError(null)
        setError(null)
        if (!strictFullNameRegex.test(formData.fullName) || !emailRegex.test(formData.email)) {
            return setSubmitError(languageText.ValidNameEmail)
        } else {
            setSubmitting(true)
            try {
                const response = await fetch(`${api}/api/quiz/submit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    setSubmitting(false)
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to submit answers.");

                }

                toast.success(`${languageText.AnswersSubmittedSuccessfully}`, {
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
                navigate("/")
                setSubmitting(false)

            } catch (err) {
                setSubmitting(false)
                setError(err.message)
                // alert(`Error submitting answers: ${}`);
            }
        }
    };


    // const handleAnswerChange = (index, value) => {
    //     const updatedAnswers = [...formData.answers];
    //     updatedAnswers[index] = { questionId: questions[index]._id, answer: value };
    //     setFormData({ ...formData, answers: updatedAnswers });
    // };


    const handleAnswerChange = (index, value) => {
        setFormData((prevData) => {
            const updatedAnswers = [...prevData.answers];
            updatedAnswers[index] = { questionId: questions[index]._id, answer: value };
            return { ...prevData, answers: updatedAnswers };
        });
    };
    const today = new Date();

    const locale = language === "ar" ? "ar-SA" : "en-SA"; // Arabic for Saudi Arabia, English for Saudi Arabia
    const options = { day: "numeric", month: "long", calendar: "islamic-umalqura" };
    const formattedDate = today.toLocaleDateString(locale, options);

    // Basic
    const strictFullNameRegex = /^\b[A-Za-z]{2,}\b \b[A-Za-z]{2,}\b \b[A-Za-z]{2,}\b$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@graduate\.utm\.my$/;

    return (
        <div className="Quiz">
            {loading ? (<div><Loader /></div>) : (
                questions.length > 0 ? (
                    <div className="formBox">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitAnswers();
                            }}
                        >
                            <h2 className="QuizMainTitle">{formattedDate} <span style={{ color: !darkMode ? "var(--hover)" : "var(--bg)" }}>{languageText.Riddle}</span></h2>
                            <div className="QuizContainer">
                                <div className="OverallLeaderboardContainer" style={{ justifyContent: "center" }}>
                                    <h3 className="SubFormTitle">{languageText.PersonalDetails}</h3>

                                    <div className="InputField">
                                        <div className="InputLabelField">
                                            <input
                                                type="text"
                                                className={`input ${strictFullNameRegex.test(formData.fullName) ? 'valid' : 'invalid'}`}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                required
                                                id="fullname"
                                                name="fullname"
                                            />{!formData.fullName && <label for="fullname" className={`LabelInput ${(formData.fullName) ? 'valid' : ''}`}><Icon icon="bx:rename" /> {languageText.FullName}</label>}

                                        </div>
                                    </div>
                                    <div className="PasswordCheckBack" style={{ marginBottom: "15px" }}>
                                        <p className={`PasswordCheck ${strictFullNameRegex.test(formData.fullName) ? "PasswordCheckerValid" : ''}`}>
                                            {strictFullNameRegex.test(formData.fullName) ? <Icon icon="mingcute:check-2-fill" className="PasswordIcon" /> : <Icon icon="icon-park-twotone:error" className="PasswordIcon" />} {languageText.FullNameRegex}
                                        </p>
                                    </div>
                                    <div className="InputField" style={{ marginBottom: "15px" }}>
                                        <div className="InputLabelField">
                                            <input
                                                type="text"
                                                className={`input ${formData.matricNumber ? 'valid' : 'invalid'}`}
                                                onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                                                required
                                                id="matricNumber"
                                                name="matricNumber"
                                            />{!formData.matricNumber && <label for="matricNumber" className={`LabelInput ${(formData.matricNumber) ? 'valid' : ''}`}><Icon icon="famicons:id-card" /> {languageText.Matric}</label>}

                                        </div>
                                    </div>
                                    <div className="InputField">
                                        <div className="InputLabelField">
                                            <input
                                                type="text"
                                                className={`input ${emailRegex.test(formData.email) ? 'valid' : 'invalid'}`}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                id="email"
                                                name="email"
                                            />{!formData.email && <label for="email" className={`LabelInput ${(formData.email) ? 'valid' : ''}`}><Icon icon="entypo:email" /> {languageText.GraduateEmail}</label>}

                                        </div>
                                    </div>
                                    <div className="PasswordCheckBack" >
                                        <p className={`PasswordCheck ${emailRegex.test(formData.email) ? "PasswordCheckerValid" : ''}`}>
                                            {emailRegex.test(formData.email) ? <Icon icon="mingcute:check-2-fill" className="PasswordIcon" /> : <Icon icon="icon-park-twotone:error" className="PasswordIcon" />} {languageText.UTMEmailRegex}
                                        </p>
                                    </div>
                                </div>


                                <div className="OverallLeaderboardContainer">
                                    <h3 className="SubFormTitle">{languageText.TodaysRiddles}</h3>

                                    <div className="QuizQuestions">
                                        <p>Question <span className="QuizPoints">Points</span></p>
                                    </div>

                                    {questions.map((question, index) => (
                                        <div key={question._id} className="QuizQuestions">
                                            <p><p className="QuizQuestion">{languageText.QuestionAbb}{index + 1}: {question.questionText} </p><span className="QuizPoints">{question.points}</span></p>
                                            <div className="InputField" style={{ width: '100%' }}>
                                                <div className="InputLabelField">
                                                    <input
                                                        type="text"
                                                        className={`input ${formData.answers[index] ? 'valid' : 'invalid'}`}
                                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                        required
                                                        id={index}
                                                        name={index}
                                                    />
                                                    {!formData.answers[index] && (
                                                        <label htmlFor={index} className={`LabelInput ${formData.answers[index] ? 'valid' : ''}`}>
                                                            <Icon icon="ic:round-question-answer" /> {languageText.Answer + " " + (index + 1)}
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                            {!submitting && <button type="submit">
                                {languageText.SubmitAnswers}
                            </button>}
                            {submitting && (
                                <button type="button" disabled="">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 101" role="status" aria-hidden="true">
                                        <circle fill="var(--bg)" r="45" cy="50" cx="50"></circle>
                                    </svg>
                                    {languageText.Submitting}
                                </button>

                            )}
                            {submitError && <p className="formError" style={{ background: "var(--theme)" }}><Icon icon="ooui:error" />{submitError}</p>}
                            {error && <p className="formError" style={{ background: "var(--theme)" }}><Icon icon="ooui:error" />{error}</p>}
                        </form>
                    </div>
                ) : (
                    <p className="QuizNoData" >{languageText.NoRiddle}</p>
                )
            )}
        </div>
    );
};

export default QuizPage;
