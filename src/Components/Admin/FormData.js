import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormsContext } from '../../hooks/useFormContext'
import Loader from '../Loader/Loader'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { utils } from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Icon } from '@iconify/react';

import './FormData.css'

const FormData = ({ language, languageText, api, darkMode }) => {

    const { ISSForm = [], forms = [], dispatch } = useFormsContext();
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/issForms`);
                if (!response.ok) {
                    console.error(`Error fetching suggestions. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'SET_ITEM',
                    collection: 'ISSForm',
                    payload: data,
                });
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api, dispatch, formId]);


    useEffect(() => {
        // Fetch form data based on type and formId
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/api/forms/${formId}`);
                if (!response.ok) {
                    console.error(`Error fetching form data. Status: ${response.status}, ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                dispatch({
                    type: 'GET_ITEM',
                    collection: "forms",
                    payload: data,
                });
                setForm(data);


            } catch (error) {
                console.error('An error occurred while fetching form data:', error);
            } finally {
                // Set loading to false once the data is fetched (success or error)
                setLoading(false);
            }
        };

        fetchData();
    }, [api, formId, dispatch]);



    const handleHeaderClick = (header) => {
        const columnData = filteredData.map((formData) => {
            switch (header) {
                case "Full Name":
                    return formData.fullName;
                case "Matric":
                    return formData.matric;
                case "Email":
                    return formData.email;
                case "Phone No.":
                    return formData.phone;
                case "Faculty":
                    return formData.faculty;
                case "Year":
                    return formData.year;
                case "Semester":
                    return formData.semester;
                case "Custom Inputs":
                    return formData.customInputs ? formData.customInputs.join(', ') : '';
                default: // Handle dynamic Select Input headers
                    return formData.selectInputs?.[header]
                        ? Array.isArray(formData.selectInputs[header])
                            ? formData.selectInputs[header].join(', ')
                            : formData.selectInputs[header]
                        : '';

            }
        });

        const columnDataText = columnData.join('\n');
        navigator.clipboard.writeText(columnDataText);
        // toast.success(`${header} column data copied to clipboard`);
        {
            toast.success(`${header} Data Copied Successfully`, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: darkMode ? "dark" : "colored",
                style: {
                    fontFamily:
                        'Poppins, sans-serif',
                },
            });
        }
    };














    const filteredData = ISSForm.filter((form) => {
        const searchRegex = new RegExp(searchTerm, 'i');
        return (
            form.eventID === formId &&
            (searchRegex.test(form.fullName) ||
                searchRegex.test(form.matric) ||
                searchRegex.test(form.email) ||
                searchRegex.test(form.phone))
        );
    });


    const filterLength = ISSForm.filter((form) => form.eventID === formId).length






    const handleDownloadExcel = () => {
        if (!filteredData || filteredData.length === 0) {
            toast.warning("No data to download", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: darkMode ? "dark" : "colored",
                style: {
                    fontFamily: 'Poppins, sans-serif',
                },
            });
            return;
        }

        if (!form || !form.inputs) {
            toast.error("Form data is not available", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: darkMode ? "dark" : "colored",
                style: {
                    fontFamily: 'Poppins, sans-serif',
                },
            });
            return;
        }

        // Serialize data with Select Inputs included
        const serializedData = filteredData.map(formData => {
            const selectInputData = {};

            if (form.selectInputs) {
                form.selectInputs.forEach(selectInput => {
                    const label = selectInput.label;
                    const value = formData?.selectInputs?.[label];

                    selectInputData[label] = Array.isArray(value) ? value.join(', ') : value || '';
                });
            }

            return {
                ...formData,
                customInputs: JSON.stringify(formData.customInputs), // Include custom inputs as a JSON string
                ...selectInputData, // Spread selectInput data into the serialized object
            };
        });

        // Create Excel file
        const worksheet = utils.json_to_sheet(serializedData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Responses');

        try {
            XLSX.writeFile(workbook, `${form?.eventName} Responses.xlsx`);
        } catch (error) {
            console.error('Error while writing Excel file:', error);
        }
    };




    const handleDownloadAllProofPictures = () => {
        if (!filteredData || filteredData.length === 0) {
            toast.warning("No data to download", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: darkMode ? "dark" : "colored",
                style: {
                    fontFamily: 'Poppins, sans-serif',
                },
            });
            return;
        }

        const proofPictures = filteredData.map(formData => formData.proof);
        downloadZip(proofPictures, `${form.eventName} Payment Proof Pictures.zip`);
    };


    const handleDownloadAllPictures = () => {
        if (!filteredData || filteredData.length === 0) {
            toast.warning("No data to download", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: darkMode ? "dark" : "colored",
                style: {
                    fontFamily: 'Poppins, sans-serif',
                },
            });
            return;
        }

        const pictures = filteredData.map(formData => formData.picture);
        downloadZip(pictures, `${form.eventName} Pictures.zip`);
    };


    const downloadZip = async (files, zipFileName) => {
        const zip = new JSZip();
        const promises = [];

        files.forEach((file, index) => {
            const fileName = `file${index + 1}`;
            promises.push(
                axios.get(file, { responseType: 'arraybuffer' })
                    .then(response => zip.file(`${fileName}.jpg`, response.data))
            );
        });

        Promise.all(promises)
            .then(() => zip.generateAsync({ type: 'blob' }))
            .then((content) => {
                saveAs(content, zipFileName);
            })
            .catch(error => console.error('Error creating zip file:', error));
    };

    return (
        <div className="FormData">
            {loading ? (
                <div><Loader /></div>
            ) : (
                <div className='FormDataBack'>
                    <h2 className="EventName">{language === "en" ? form?.eventName + " " + languageText.response : languageText.response + " " + form?.arabicEventName} </h2>

                    <div className="FormResponses">
                        <div className="FormResponsesLeft">
                            <p>{languageText.NoResponses}</p>
                            <p>{filterLength}</p>
                        </div>
                        <Icon icon="fluent:person-feedback-48-filled" className='FormResponsesIcon' />
                    </div>
                    <div className="SearchForms">
                        <input
                            className={`Search ${searchTerm && filteredData.length === 0 ? 'noMembers' : 'hasMembers'}`}
                            placeholder={`${languageText.searchResponse}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />


                    </div>
                    <p className="HeaderCopy">{languageText.Header}</p>
                    <div className="ButtonsContainer">
                        {filterLength > 0 && <button className="DownloadButton Excel" onClick={handleDownloadExcel}>
                            <Icon icon="file-icons:microsoft-excel" /> {languageText.Excel}
                        </button>}
                        {form?.inputs.includes("Picture") && filterLength > 0 && <button className="DownloadButton Pictures" onClick={handleDownloadAllPictures}>
                            <Icon icon="mage:image-fill" /> {languageText.dPictures}
                        </button>}
                        {form?.inputs.includes("Payment") && filterLength > 0 && <button className="DownloadButton Proof" onClick={handleDownloadAllProofPictures}>
                            <Icon icon="hugeicons:zip-02" />  {languageText.dProof}
                        </button>}
                    </div>
                    <div className="OverFlow">{languageText.ScrollHorizontal}</div>
                    <div className="ResponseBack">
                        {form && form?.inputs && (
                            <table>
                                <tr className="ResponseHeader">
                                    {form.inputs.includes("Picture") && (<th></th>)}
                                    {form.inputs.includes("Full Name") && (<th onClick={() => handleHeaderClick("Full Name")}>{languageText.FullName}</th>)}
                                    {form.inputs.includes("Matric") && (<th onClick={() => handleHeaderClick("Matric")}>{languageText.Matric}</th>)}
                                    {form.inputs.includes("Email") && (<th onClick={() => handleHeaderClick("Email")}>{languageText.Email}</th>)}
                                    {form.inputs.includes("Phone No.") && (<th onClick={() => handleHeaderClick("Phone No.")}>{languageText.Phone}</th>)}
                                    {form.inputs.includes("Faculty") && (<th onClick={() => handleHeaderClick("Faculty")}>{languageText.Faculty}</th>)}
                                    {form.inputs.includes("Year") && (<th onClick={() => handleHeaderClick("Year")}>{languageText.Year}</th>)}
                                    {form.inputs.includes("Semester") && (<th onClick={() => handleHeaderClick("Semester")}>{languageText.Semester}</th>)}
                                    {form.inputs.includes("Custom Inputs") && form.customInputs != "" && (
                                        form.customInputs.map((customInput, index) => (
                                            <th onClick={() => handleHeaderClick("Custom Inputs")} >{form.customInputs[index]}</th>
                                        )))}
                                    {form.inputs.includes("Select Input") && form?.selectInputs && form.selectInputs.map((selectInput, index) => (
                                        <th key={index} onClick={() => handleHeaderClick(selectInput.label)}>
                                            {selectInput.label}
                                        </th>
                                    ))}
                                    {form?.inputs.includes("Payment") && (
                                        <th>{languageText.Proof}</th>
                                    )}
                                </tr>
                                {form && form?.inputs && (
                                    filteredData.map((formData) => (
                                        <tr className="ResponseHeader ResponseContent" key={formData._id}>
                                            {form.inputs.includes("Picture") && (<td
                                                style={{
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => { window.open(formData.picture, "_blank") }}><img src={formData.picture} alt="" /></td>)}

                                            {/* {form.inputs.includes("Picture") && (
                                                <td style={{ cursor: "pointer" }}>
                                                    {formData.picture &&
                                                        (formData.picture.endsWith(".jpg") ||
                                                            formData.picture.endsWith(".jpeg") ||
                                                            formData.picture.endsWith(".png") ||
                                                            formData.picture.endsWith(".gif") ? (
                                                            <img
                                                                src={formData.picture}
                                                                alt="Uploaded Image"
                                                                style={{ width: "100px", height: "100px" }} // Adjust size if needed
                                                                onClick={() => window.open(formData.picture, "_blank")}
                                                            />
                                                        ) : formData.picture.endsWith(".pdf") ? (
                                                            <a href={formData.picture} target="_blank" rel="noopener noreferrer">
                                                                View PDF
                                                            </a>
                                                        ) : (
                                                            <span>Unsupported File Format</span>
                                                        ))}
                                                </td>
                                            )} */}
                                            {form.inputs.includes("Full Name") && (<td>{formData.fullName}</td>)}
                                            {form.inputs.includes("Matric") && (<td style={{ textTransform: "uppercase" }}>{formData.matric}</td>)}
                                            {form.inputs.includes("Email") && (<td style={{ fontSize: "0.5em" }}>{formData.email}</td>)}
                                            {form.inputs.includes("Phone No.") && (<td>{formData.phone}</td>)}
                                            {form.inputs.includes("Faculty") && (<td>{formData.faculty}</td>)}
                                            {form.inputs.includes("Year") && (<td>{formData.year}</td>)}
                                            {form.inputs.includes("Semester") && (<td>{formData.semester}</td>)}
                                            {form.inputs.includes("Custom Inputs") && form.customInputs != "" && (
                                                formData.customInputs.map((customInput, index) => (
                                                    <td>{formData.customInputs[index]}</td>
                                                ))

                                            )}
                                            {form.inputs.includes("Select Input") && form?.selectInputs && form.selectInputs.map((selectInput, index) => (
                                                <td key={index}>
                                                    {Array.isArray(formData?.selectInputs?.[selectInput.label])
                                                        ? formData.selectInputs[selectInput.label].join(', ')
                                                        : formData.selectInputs[selectInput.label] || '-'}
                                                </td>
                                            ))}
                                            {form.inputs.includes("Payment") && (<td
                                                style={{
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => { window.open(formData.proof, "_blank") }}><img src={formData.proof} alt="" /></td>)}
                                        </tr>
                                    ))
                                )}
                            </table>
                        )}

                    </div>

                </div>
            )
            }
        </div >
    );
};

export default FormData;