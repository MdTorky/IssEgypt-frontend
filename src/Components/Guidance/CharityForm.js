import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'
import InputLoader from '../Loader/InputLoader'
import LogoLoader from '../Loader/LogoLoader'
import './Guidance.css'
import { Icon } from '@iconify/react';
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react"
import { useFormsContext } from '../../hooks/useFormContext'
import AllFacultyCards from '../components/AllFacultiesCard'
import Select from 'react-select';
import SelectStyles from '../components/SelectStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faCloudArrowUp, faImage, faQrcode, faStar, faFile, faXmark, faMoneyBill, faPlus } from '@fortawesome/free-solid-svg-icons';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase'

const CharityForm = ({ language, languageData, api, darkMode }) => {
    const { courses = [], faculties, dispatch } = useFormsContext()
    const navigate = useNavigate();
    const languageText = languageData[language];
    const [loading, setLoading] = useState(false);
    const [facultyLoading, setFacultyLoading] = useState(true);
    const [courseLoading, setCourseLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('')
    const [messages, setMessages] = useState('')
    const [faculty, setFaculty] = useState("");
    const [sem, setSem] = useState('')
    const [course, setCourse] = useState()
    const [advice, setAdvice] = useState()
    const [industrial, setIndustrial] = useState()
    const [links, setLinks] = useState([{ type: "", link: "" }]);
    const [pdf, setPdf] = useState(null)
    const [selectedText, setSelectedText] = useState(null);
    const [fileUrl, setFileUrl] = useState()

    const [searchTerm, setSearchTerm] = useState('');
    const styles = SelectStyles(darkMode);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/course`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

                    return;
                }

                const data = await response.json();
                // const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort data alphabetically by 'name' field
                dispatch({
                    type: 'SET_ITEM',
                    collection: "courses",
                    payload: data,
                });
                setMessages(false);
                setCourseLoading(false);

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
                setMessages(true);
            } finally {
                // Set loading to false once the data is fetched (success or error)
            }
        };
        fetchData();
    }, [api, dispatch, courses]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/faculty`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    setError('Failed to fetch data');
                    setMessages(true);

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
                setMessages(false);
                setFacultyLoading(false);

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data');
                setMessages(true);
            } finally {
                // Set loading to false once the data is fetched (success or error)
            }
        };
        fetchData();
    }, [api, dispatch, faculties]);








    const courseFilter = courses
        .filter((course) => {
            const searchRegex = new RegExp(searchTerm, 'i');
            return (
                course.facultyId === faculty &&
                course.semester.includes(sem) &&
                (searchRegex.test(course.courseName) ||
                    searchRegex.test(course.semester))
            );
        })
        .sort((a, b) => a.courseName.localeCompare(b.courseName));



    const FilterCourse = courseFilter.map((course) => ({
        label: course.courseName,
        value: course.courseName
    }));

    const filteredFaculties = faculties.slice(0, 6).map((faculty) => {
        const id = faculty.facultyId;
        return {
            label: languageText[id],
            value: faculty.facultyId
        };
    });


    const training = [
        "SKEE 3925 Industrial Training",
        "Industrial Training (HW)",
        "Industrial Training",
        "SET* 3915 Industrial Training",
        "SBE* Industrial Training (HW)",

    ]

    const SemOptions = [
        { value: "Year 1, Sem 1 (1)", label: 'Semester 1' },
        { value: "Year 1, Sem 2 (2)", label: 'Semester 2' },
        { value: "Year 1, Sem 3 (Short)", label: 'Sem 3 Short Semester' },
        { value: "Year 2, Sem 1 (3)", label: 'Semester 3' },
        { value: "Year 2, Sem 2 (4)", label: 'Semester 4' },
        { value: "Year 2, Sem 3 (Short)", label: 'Sem 5 Short Semester' },
        { value: "Year 3, Sem 1 (5)", label: 'Semester 5' },
        { value: "Year 3, Sem 2 (6)", label: 'Semester 6' },
        { value: "Year 3, Sem 3 (Short)", label: 'Sem 7 Short Semester' },
        { value: "Year 4, Sem 1 (7)", label: 'Semester 7' },
        { value: "Year 4, Sem 2 (8)", label: 'Semester 8' },
        { value: "Elective", label: "Elective" },
        { value: "PRISM", label: "PRISM" },
    ];


    const LinkTypes = [
        {
            value: "Website",
            label: (
                <div className='SelectLinkType'>
                    <Icon icon="fluent-mdl2:website" className='IconSize' /> {languageText.Website}
                </div>
            )
        },
        {
            value: "Drive",
            label: (
                <div className='SelectLinkType'>
                    <Icon icon="logos:google-drive" className='IconSize' /> {languageText.Drive}
                </div>
            )
        },
        {
            value: "Youtube",
            label: (
                <div className='SelectLinkType'>
                    <Icon icon="logos:youtube-icon" className='IconSize' width="15px" /> {languageText.YoutubeVideo}
                </div>
            )
        },
        {
            value: "Article",
            label: (
                <div className='SelectLinkType'>
                    <Icon icon="ic:outline-article" className='IconSize' /> {languageText.Article}
                </div>
            )
        },
        {
            value: "Online Course",
            label: (
                <div className='SelectLinkType'>
                    <Icon icon="fluent:hat-graduation-12-filled" className='IconSize' /> {languageText.OnlineCourse}
                </div>
            )
        },
        {
            value: "General",
            label: (
                <div className='SelectLinkType'>
                    <Icon icon="ph:link-simple-bold" className='IconSize' /> {languageText.GeneralLink}
                </div>
            )
        },
        {
            value: "File",
            label: (
                <div className='SelectLinkType'>
                    <Icon icon="fa6-regular:file-pdf" className='IconSize' /> {languageText.File}
                </div>
            )
        },


    ]

    const handleAddLink = (e) => {
        e.preventDefault();
        setLinks([...links, { type: "", link: "" }]);
    };

    const handleLinkTypeChange = (index, value) => {
        const updatedLinks = [...links];
        updatedLinks[index].type = value;
        if (value !== "File") {
            updatedLinks[index].link = ""; // Reset link if type is not "File"
        }
        setLinks(updatedLinks);
    };

    // const handleFileInputChange = (index, e) => {
    //     const file = e.target.files[0];
    //     setUploadingFile(true);
    //     handleFileUpload(index, file);
    // };


    const handleFileInputChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadingFile(true);
            // Clear the uploaded file if a new file is selected
            const updatedLinks = [...links];
            updatedLinks[index].link = "";
            setLinks(updatedLinks);
            handleFileUpload(index, file);
        }
    };

    // const handleLinkInputChange = (index, e) => {
    //     const value = e.target.value;
    //     handleLinkChange(index, value);
    // };

    const handleLinkChange = (index, value) => {
        const updatedLinks = [...links];
        updatedLinks[index].link = value;
        setLinks(updatedLinks);
    };

    const handleRemoveLink = (index) => {
        const updatedLinks = [...links];
        updatedLinks.splice(index, 1);
        setLinks(updatedLinks);
    };

    const handleRemoveFile = (index) => {
        const updatedLinks = [...links];
        if (updatedLinks[index]) { // Check if the link at the given index exists
            updatedLinks[index].link = ""; // Clear the file link
            setLinks(updatedLinks);
        }
    };



    const handleFileChange = (index, file) => {
        const updatedLinks = [...links];
        updatedLinks[index].link = file;
        setLinks(updatedLinks);
    };

    const handleFileUpload = async (index, file) => {
        if (file) {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, 'files/' + fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);




            try {
                await uploadTask;
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                handleFileChange(index, downloadURL);
                setUploadingFile(false);;
            } catch (error) {
                console.error('Error uploading file:', error);
                // Handle error uploading file
            }
        }
    };







    const uploadFile = async (file, fileType, callback) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, 'files/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);





        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log(error)
                switch (error.code) {
                    case "storage/unauthorized":
                        console.log(error);
                        break;
                    case "storage/cancelled":
                        break;
                    case "storage/unknown":
                        break;
                    default: break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL)

                    setFileUrl(downloadURL)

                });
            }
        );

    }


    // useEffect(() => {
    //     if (fileUrl) {
    //         submitForm();
    //     }
    // }, [fileUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        // Upload files first
        const fileUploadPromises = links
            .filter(link => link.type === "File")
            .map(link => handleFileUpload(link.link));

        try {
            // Wait for all files to upload
            await Promise.all(fileUploadPromises);

            // After all files are uploaded, extract the URLs and submit the form
            const formattedLinks = links.map(link => ({
                type: link.type,
                url: link.type === "File" ? link.link : link.link // Use file URL if link type is "File"
            }));

            const charity = {
                faculty,
                semester: sem,
                course,
                advice,
                links: formattedLinks,
                industrial,
                file: fileUrl // Assuming `fileUrl` contains the URL of the uploaded file
            };

            // Submit the form with the extracted links
            const response = await fetch(`${api}/api/charity`, {
                method: 'POST',
                body: JSON.stringify(charity),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
            } else {
                setError(null);
                dispatch({
                    type: 'CREATE_FORM',
                    collection: "charities",
                    payload: json
                });
                toast.success(`${languageText.ImpactLeft}`, {
                    position: "bottom-center",
                    autoClose: 5000,
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
            navigate("/")
        } catch (error) {
            console.error('Error submitting charity:', error);
            setError('An error occurred while submitting the charity');
            setUpdating(false);
        }
    };




    return (
        <div className="Form Guidance">
            <div className="CharityText">
                <h2>عِلْمٍ يُنْتَفَعُ بِهِ</h2>
                <h3>Knowledge that can be benefited from</h3>
                <p><Icon icon="fa-solid:exclamation" /> {languageText.RegularReg}</p>
            </div>

            <div className="CharityPage">

                <div className="Instruction">
                    <div className="formBox">
                        <div className="InstructionText">
                            <h2>Instructions</h2>
                            <p>1. Select Your Faculty (Easy Right <Icon icon="mingcute:emoji-2-fill" />)</p>
                            <p>Intrcutions2</p>
                            <p>Intrcutions3</p>
                        </div>
                    </div>
                </div>

                {facultyLoading ? (
                    <div style={{ marginTop: "20px" }}><Loader /></div>
                ) : (
                    <div className="formBox">
                        {updating &&
                            <div>
                                <p className='Updating'>{languageText.Submitting}</p>
                                <Loader />
                            </div>
                        }
                        {!updating && (
                            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                                <h2>{languageText.KnowledgeCharity}</h2>


                                <div className="InputField AnimatedInput">
                                    <Select
                                        className={`CustomSelect ${(faculty) ? 'valid' : ''}`}
                                        placeholder={<><Icon icon="lucide:school" className="IconSize" /> {languageText.FacultyHelp}</>}
                                        // placeholder={languageText.FacultyHelp}

                                        options={filteredFaculties}
                                        isSearchable
                                        noOptionsMessage={() => languageText.NoFaculty}
                                        onChange={opt => {
                                            setFaculty(opt.value);
                                            setCourse(null);
                                            setAdvice(null);
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
                                </div>

                                {/* <select
                                    className={`input ${(faculty) ? 'valid' : ''}`}
                                    onChange={(e) => setFaculty(e.target.value)}
                                    required
                                >
                                    {faculties.map((faculty) => (
                                        <option value={faculty.facultyId}><AllFacultyCards languageText={languageText} facultyId={faculty.facultyId} /></option>
                                    ))}
                                </select> */}


                                <div className="InputField AnimatedInput2">
                                    <Select
                                        className={`CustomSelect ${(sem) ? 'valid' : ''}`}
                                        placeholder={<><Icon icon="lets-icons:date-fill" className="IconSize" /> {languageText.SemesterHelp}</>}

                                        options={SemOptions}
                                        isSearchable
                                        noOptionsMessage={() => languageText.NoSemester}
                                        onChange={opt => {
                                            setSem(opt.value);
                                            setCourse(null);
                                            setAdvice(null);
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
                                </div>

                                {/* <div className="InputField">
                                <input
                                    className="Search"
                                    placeholder={languageText.searchResponse}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div> */}
                                {faculty && sem && courseLoading ? (
                                    <div className={loading ? 'InputField animated-input' : 'InputField'}>
                                        <InputLoader /></div>) : (

                                    faculty && sem && FilterCourse.length > 0 && (
                                        <div className="InputField AnimatedInput">
                                            <Select
                                                className={`CustomSelect ${(course) ? 'valid' : ''}`}
                                                // placeholder={languageText.CourseHelp}
                                                placeholder={<><Icon icon="carbon:course" className="IconSize" /> {languageText.CourseHelp}</>}

                                                options={FilterCourse}
                                                isSearchable
                                                noOptionsMessage={() => languageText.NoCourse}
                                                onChange={opt => setCourse(opt.value)}
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
                                            {/* {course} */}
                                        </div>


                                    ))}
                                {FilterCourse.length === 0 && sem && faculty && !courseLoading &&
                                    <p className="CourseNotFound">{languageText.CourseNotFound}</p>
                                }


                                {course && faculty && sem && FilterCourse.length > 0 &&
                                    <div className="InputField AnimatedInput">
                                        <div className="InputLabelField">
                                            <textarea
                                                // type="text"
                                                className={`input ${(advice) ? 'valid' : ''}`}
                                                onChange={(e) => setAdvice(e.target.value)}
                                                required
                                                id="advice"
                                                name="courseName"
                                            />
                                            {!advice && <label for="advice" className={`LabelInput ${(advice) ? 'valid' : ''}`}><Icon icon="fluent-mdl2:insights" className="IconSize" /> {languageText.WriteAdvice}</label>}
                                        </div>
                                    </div>

                                }



                                {training.includes(course) && faculty && sem && FilterCourse.length > 0 && advice &&
                                    <div className="InputField AnimatedInput">
                                        <div className="InputLabelField">

                                            <input
                                                type="text"
                                                onChange={(e) => setIndustrial(e.target.value)}
                                                className={`input ${(industrial) ? 'valid' : ''}`}
                                                id="industrial"
                                            />
                                            {!industrial && <label for="industrial" className={`LabelInput ${(industrial) ? 'valid' : ''}`}><Icon icon="ic:baseline-work" className="IconSize" />{languageText.Industrial}</label>}
                                        </div>
                                    </div>

                                }
                                {course && advice && <p className="ExternalLink">{languageText.SecretLink} <Icon icon="fontisto:wink" className="IconSize" /></p>}


                                {course && advice && links.map((link, index) => (
                                    <div key={index} className="Links AnimatedInput">
                                        <div className="InputField AnimatedInput" >
                                            <Select
                                                className={`CustomSelect ${(link.type) ? 'valid' : ''}`}
                                                styles={styles}
                                                placeholder={<><Icon icon="mdi:google-downasaur" className="IconSize" /> {languageText.LinkType}</>}

                                                value={link.type.value}
                                                onChange={(opt) => handleLinkTypeChange(index, opt.value)}
                                                isSearchable
                                                options={LinkTypes}

                                                noOptionsMessage={() => languageText.NoLinkType}
                                                theme={theme => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: 'lightgray',
                                                        primary: 'var(--theme)',
                                                    },
                                                })}
                                            />

                                            {/* <select
                                            className={`input ${(link.type) ? 'valid' : ''}`}
                                            onChange={(e) => handleLinkTypeChange(index, e.target.value)}
                                            required
                                        >
                                            <option value="Google">Google</option>

                                        </select> */}
                                        </div>
                                        {/* {link.type} */}
                                        {link.type && advice && link.type != "File" &&
                                            <div className="InputField AnimatedInput">
                                                <div className="InputLabelField">

                                                    <input
                                                        type="text"
                                                        value={link.link}
                                                        onChange={(e) => handleLinkChange(index, e.target.value)}
                                                        className={`input ${(link.link) ? 'valid' : ''}`}
                                                        id={`link` + index}
                                                    />
                                                    {!link.link && <label for={`link` + index} className={`LabelInput ${(link.link) ? 'valid' : ''}`}><Icon icon="material-symbols:link" className="IconSize" />{languageText.PasteLink}</label>}
                                                </div>
                                            </div>
                                        }


                                        {link.type === "File" && advice &&

                                            <div className="InputField AnimatedInput">
                                                {uploadingFile ? ( // Conditional rendering based on uploading file state
                                                    <div style={{ width: '100%', margin: 'auto' }}>
                                                        <LogoLoader language={language} languageData={languageData} />
                                                    </div>
                                                ) : (
                                                    <div className="InputField AnimatedInput">
                                                        <label htmlFor={`file${index}`} className={`LabelInputImg ${(link.link) ? 'valid' : ''}`}>
                                                            <div style={{ gap: "8px", display: "flex", alignItems: "center" }}>
                                                                <Icon icon="tabler:file-type-pdf" /> {(link.link && languageText.FileUploaded) || languageText.UploadPDF}
                                                            </div>
                                                            {link.link ? (
                                                                <div className="XImgButton" onClick={handleRemoveFile}>
                                                                    <FontAwesomeIcon icon={faXmark} />
                                                                </div>
                                                            ) : (
                                                                <FontAwesomeIcon icon={faCloudArrowUp} />
                                                            )}
                                                        </label>
                                                        <input
                                                            type="file"
                                                            accept="application/pdf"
                                                            id={`file${index}`}
                                                            className={`input ${(link.link) ? 'valid' : ''}`}
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => handleFileInputChange(index, e)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        }

                                        <button className="icon DeleteLinkButton" onClick={() => handleRemoveLink(index)}>
                                            <span className="tooltip" >{languageText.RemoveLink}</span>
                                            <span><Icon icon="ic:twotone-link-off" /></span>
                                        </button>

                                    </div>

                                ))}

                                {course && advice &&
                                    < button className={`icon AddLinkButton`} onClick={handleAddLink}>
                                        <span className="tooltip" >{languageText.AddLink}</span>
                                        <span><Icon icon="material-symbols:add-link" /></span>
                                    </button>
                                }
















                                {faculty && course && advice && !uploadingFile && <button style={{ width: '50%', borderRadius: "10px" }}>{languageText.LeaveImpact}</button>}


                            </form>
                        )}


                    </div>
                )}
            </div>
        </div>
    );
}

export default CharityForm;