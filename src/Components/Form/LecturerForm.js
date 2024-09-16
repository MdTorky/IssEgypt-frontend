import { useState, useEffect } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'
import InputField from '../components/FormInputField';
import SelectStyles from '../components/SelectStyles';
import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';

const LecturerForm = ({ api, language, languageData, darkMode }) => {

  const languageText = languageData[language];
  const { lecturers, faculties, dispatch } = useFormsContext()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [lecturerName, setLecturerName] = useState("");
  const [lecturerImage, setLecturerImage] = useState("");
  const [lecturerPhone, setLecturerPhone] = useState("");
  const [lecturerEmail, setLecturerEmail] = useState("");
  const [lecturerJob, setLecturerJob] = useState("");
  const [lecturerFaculty, setLecturerFaculty] = useState("");
  const [lecturerOffice, setLecturerOffice] = useState("");
  const styles = SelectStyles(darkMode);
  const indicesToInclude = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api}/api/faculty`);
        if (!response.ok) {
          console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
          setError('Failed to fetch data');

          return;
        }

        const data = await response.json();
        const sortData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        // const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort data alphabetically by 'name' field
        dispatch({
          type: 'SET_ITEM',
          collection: "faculties",
          payload: sortData,
        });
        // setFacultyLoading(false);

      } catch (error) {
        console.error('An error occurred while fetching data:', error);
        setError('An error occurred while fetching data');
      } finally {
        // Set loading to false once the data is fetched (success or error)
      }
    };
    fetchData();
  }, [api, dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);


    const lecturer = {
      lecturerName,
      lecturerEmail,
      lecturerPhone,
      lecturerFaculty: "FKT",
      lecturerOffice,
      lecturerImage,
      lecturerJob
    }

    const response = await fetch(`${api}/api/lecturer`, {
      method: 'POST',
      body: JSON.stringify(lecturer),
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
        collection: "lecturers",
        payload: json
      })
      {
        toast.success(`${languageText.LecturerSubmitted}`, {
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
      }
      setUpdating(false);
      setLecturerName("")
      setLecturerPhone("")
      setLecturerFaculty("")
      setLecturerEmail("")
      setLecturerOffice("")
      setLecturerImage('')
      setLecturerJob('')
    }
  }

  const filteredFaculties = faculties
    .filter((_, index) => indicesToInclude.includes(index)) // Filter based on indicesToInclude array
    .map((faculty) => {
      const id = faculty.facultyId;
      return {
        label: languageText[id],
        value: faculty.facultyId
      };
    });


  return (
    <div className="Form">

      {loading ? (
        <div><Loader languageText={languageText.Submitting} darkMode={darkMode} /></div>
      ) : (
        <div className="formBox" style={updating ? { background: "transparent" } : {}}>
          {updating &&
            <div>
              <Loader languageText={languageText.Submitting} darkMode={darkMode} />
            </div>
          }
          {!updating && (
            <form action="" onSubmit={handleSubmit} encType="multipart/form-data">

              <h2>{languageText.LecturerForm}</h2>

              <InputField option={lecturerName} setOption={setLecturerName} languageText={languageText.LecturerName} icon={"bx:rename"} type={"text"} required={true} option2={"lecturerName"} />
              <InputField option={lecturerPhone} setOption={setLecturerPhone} languageText={languageText.LecturerPhone} icon={"bi:phone"} type={"number"} required={true} option2={"lecturerPhone"} />
              <InputField option={lecturerEmail} setOption={setLecturerEmail} languageText={languageText.LecturerEmail} icon={"eva:email-outline"} type={"email"} required={true} option2={"lecturerEmail"} />
              <InputField option={lecturerImage} setOption={setLecturerImage} languageText={languageText.LecturerImage} icon={"gg:profile"} type={"text"} required={false} option2={"lecturerImage"} />
              <InputField option={lecturerJob} setOption={setLecturerJob} languageText={languageText.LecturerJob} icon={"hugeicons:new-job"} type={"text"} required={false} option2={"lecturerJob"} />
              <InputField option={lecturerOffice} setOption={setLecturerOffice} languageText={languageText.LecturerOffice} icon={"mdi:office-chair"} type={"text"} required={false} option2={"lecturerOffice"} />

              {/* <div className="InputField">
                <Select
                  className={`CustomSelect ${(lecturerFaculty) ? 'valid' : ''}`}
                  placeholder={<><Icon icon="lucide:school" className="IconSize" /> {languageText.LecturerFaculty}</>}
                  options={filteredFaculties}
                  isSearchable={false}
                  noOptionsMessage={() => languageText.NoFaculty}
                  onChange={opt => {
                    setLecturerFaculty(opt.value);
                  }}
                  styles={styles}
                  theme={theme => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: 'lightgray',
                      primary: 'var(--theme)',
                    },
                  })}
                />
              </div> */}
              <button disabled={loading}>{languageText.Submit}</button>

            </form>
          )}
          {error && <div className="formError"><Icon icon="ooui:error" />{error}</div>}
        </div>
      )}
    </div>
  )
}

export default LecturerForm
