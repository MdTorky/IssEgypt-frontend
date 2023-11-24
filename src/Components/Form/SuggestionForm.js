import "./Form.css"
import { useState } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { } from '@fortawesome/free-solid-svg-icons';

const SuggestionForm = ({ language, languageData, api }) => {
    const { dispatch } = useFormsContext()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [matric, setMatric] = useState('');
    const [faculty, setFaculty] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = { name, email, matric, faculty, suggestion }

        const response = await fetch(`${api}/api/forms`, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            setError(null)

            dispatch({
                type: 'CREATE_FORM',
                collection: "forms",
                payload: json
            })
            alert("thankYou")
            setName('')
            setEmail('')
            setMatric('')
            setFaculty('')
            setSuggestion('')
        }

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullNameRegex = /^[a-zA-Z\s'-]{2,}$/;

    const matricRegex = /^[A-Za-z][2][0-4][A-Za-z]{2}\d{4}$/;


    return (
        <div className="Form">
            <div className="formBox">
                <form action="" onSubmit={handleSubmit}>
                    <h2>Add a Suggestion</h2>



                    <div className="InputField">
                        <input
                            placeholder=" &#xf007; &nbsp; Full Name"
                            type="text"
                            className={`input ${fullNameRegex.test(name) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setName(e.target.value) }}
                        />
                    </div>



                    <div className="InputField">
                        <input
                            placeholder=" &#xf0e0; &nbsp; Email"
                            type="email"
                            className={`input ${emailRegex.test(email) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </div>


                    <div className="InputField">
                        <input
                            placeholder=" &#xf2c1; &nbsp; Matric Number"
                            type="text"
                            className={`input ${matricRegex.test(matric) ? 'valid' : 'invalid'}`}
                            onChange={(e) => { setMatric(e.target.value) }}
                        />

                    </div>
                    <div className="InputField">
                        <select
                            className={`input ${(faculty) ? 'valid' : 'invalid'}`}

                            onChange={(e) => setFaculty(e.target.value)}
                            required

                        >
                            <option value="" disabled selected hidden>Choose a Faculty</option>
                            <option value="FKE" >Electrical Engineering</option>
                            <option value="FC" >Computer Science</option>
                            <option value="FKA" >Civil Engineering</option>
                            <option value="FKM" >Mechanical Engineering</option>
                            <option value="FKT" >Chemical Engineering</option>
                            <option value="Found" >Bridging & Foundation</option>
                            <option value="Other" >Other</option>
                        </select>

                    </div>
                    <div className="InputField">
                        <textarea
                            rows="3"
                            className={`input ${(suggestion) ? 'valid' : 'invalid'}`}
                            columns="5"
                            placeholder="Suggestion"
                            onChange={(e) => setSuggestion(e.target.value)}
                            value={suggestion}
                            required

                        />
                    </div>

                    <button>Add Suggestion</button>
                    {error && <div className="formError">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default SuggestionForm;