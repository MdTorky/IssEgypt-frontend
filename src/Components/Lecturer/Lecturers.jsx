import { useState, useEffect } from "react";
import { useFormsContext } from "../../hooks/useFormContext";
import { Icon } from "@iconify/react";
import Loader from "../Loader/Loader";
import "./lecturer.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";

const Lecturers = ({ darkMode, language, languageData, api }) => {
  const languageText = languageData[language];
  const [loading, setLoading] = useState(false);
  const { lecturers, dispatch } = useFormsContext();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/api/lecturer`);
        if (!response.ok) {
          console.error(
            `Error fetching suggestions. Status: ${response.status}, ${response.statusText}`
          );
          return;
        }

        const data = await response.json();
        // const sortedData = data.sort((a, b) => a.lecturerName.localeCompare(b.lecturerName)); // Sort data alphabetically by 'name' field

        dispatch({
          type: "SET_ITEM",
          collection: "lecturers",
          // payload: sortedData,
          payload: data,
        });

        setLoading(false);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };
    fetchData();
  }, [api, dispatch]);

  const filteredLecturers = lecturers.filter((lecturer) => {
    const searchRegex = new RegExp(searchTerm, "i");
    return searchRegex.test(lecturer.lecturerName);
  });

  const LecturerCard = ({ lecturer }) => {
    return (
      <div className="lecturerCard">
        <img src={lecturer.lecturerImage} alt="" />
        <div className="lecturerText">
          <p>{lecturer.lecturerName}</p>
          <div className="lecturerSocial">

            {lecturer.lecturerPhone &&
              <button className="icon" onClick={() => { window.open(`http://wa.me/${lecturer.lecturerPhone}`, "_blank"); }}>
                <span className="tooltip">{languageText.Group}</span>
                <span>
                  <Icon icon="ic:baseline-whatsapp" />
                </span>
              </button>
            }

            {lecturer.lecturerEmail &&
              <button
                className="icon"
                onClick={() => {
                  window.open(`mailto:${lecturer.lecturerEmail}`, "_blank");
                }}
              >
                <span className="tooltip">{languageText.Email}</span>
                <span>
                  <Icon icon="ic:baseline-email" />
                </span>
              </button>
            }
            {lecturer.lecturerJob &&
              <button
                className="icon"
                onClick={() => {
                  window.open(lecturer.lecturerJob, "_blank");
                }}
              >
                <span className="tooltip">{languageText.Website}</span>
                <span>
                  <Icon icon="dashicons:admin-site" />
                </span>
              </button>
            }
            {lecturer.lecturerOffice &&

              <button
                className="icon"
                onClick={() => {
                  window.open(lecturer.website, "_blank");
                }}
              >
                <span className="tooltip">{languageText.Office}</span>
                <span>
                  {" "}
                  <Icon icon="hugeicons:office" />
                </span>
              </button>
            }

          </div>
        </div>
      </div>
    );
  };

  const allLecturers = (number) => {
    let lecturers = filteredLecturers; // Change const to let here

    switch (number) {
      case 1:
        lecturers = filteredLecturers.filter(
          (lecturers) => lecturers.lecturerFaculty === "FKE"
        );
        break;
      case 2:
        lecturers = filteredLecturers.filter(
          (lecturers) => lecturers.lecturerFaculty === "FC"
        );
        break;
      case 3:
        lecturers = filteredLecturers.filter(
          (lecturers) => lecturers.lecturerFaculty === "FKM"
        );
        break;
      case 4:
        lecturers = filteredLecturers.filter(
          (lecturers) => lecturers.lecturerFaculty === "FKA"
        );
        break;
      case 5:
        lecturers = filteredLecturers.filter(
          (lecturers) => lecturers.lecturerFaculty === "FKT"
        );
        break;
      case 6:
        lecturers = filteredLecturers.filter(
          (lecturers) => lecturers.lecturerFaculty === "Other"
        );
        break;
      default:
        break;
    }
    return lecturers;
  };

  const lecturerCard = (text, number) => {
    const lecturersToShow = allLecturers(number).filter((lecturer) => {
      const matchesSearch =
        lecturer.lecturerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        lecturer.lecturerFaculty
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        lecturer.lecturerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      // const matchesCategories = (
      //   selectedCategories.length === 0 ||
      //   (intern.categories && intern.categories.some((category) => selectedCategories.includes(category)))
      // );

      // const matchesLocations = (
      //   selectedLocations.length === 0 ||
      //   (intern.location && intern.location.some((location) => selectedLocations.includes(location)))
      // );
      return matchesSearch;
    });

    if (!lecturersToShow.length) {
      return null;
    }
    return (
      <div className="lecturerOuterBox">
        <div className="lecturerInnerBox">
          <h2>{text}</h2>
          <div className="lecturerCards">
            {lecturersToShow.map((lecturer) => (
              <LecturerCard lecturer={lecturer} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="lecturers">
      <h1 className="title">{languageText.Lecturers}</h1>
      <div className="lecturerSearchContainer">
        <input
          className={`Search ${searchTerm && filteredLecturers.length === 0
            ? "noMembers"
            : "hasMembers"
            }`}
          placeholder={`${languageText.SearchLecturer}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <div>
          <Loader languageText={languageText.Submitting} darkMode={darkMode} />
        </div>
      ) : (
        <div className="scroll">
          <div className="sectionBox">
            <>
              {lecturerCard(languageText.FKE, 1)}
              {lecturerCard(languageText.FC, 2)}
              {lecturerCard(languageText.FKM, 3)}
              {lecturerCard(languageText.FKA, 4)}
              {lecturerCard(languageText.FKT, 5)}
            </>
          </div>
        </div>
      )}

    </div>
  );
};

export default Lecturers;
