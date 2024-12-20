import { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import logo from '../../images/HorusToken.png'


const PurchaseForm = ({ languageText }) => {

    const [fullName, setFullName] = useState('')
    const [matric, setMatric] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [faculty, setFaculty] = useState('')
    const [semester, setSemester] = useState('')
    const [proof, setProof] = useState(null);
    const [selectedImageText, setSelectedImageText] = useState(null);

    const fullNameRegex = /^[a-zA-Z\s'-]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const matricRegex = /^[A-Za-z][2][0-4][A-Za-z]{2}\d{4}$/;
    const matricRegex = /^[A-Za-z](1[8-9]|2[0-5])[A-Za-z]{2}\d{4}$/;
    const combinedPhoneRegex = /^(\+?6?01\d{9}|01\d{8}|(\+?20)?1[0125]\d{8}|(\+?967)?[4567]\d{7}|(\+?234)?[789]\d{9}|(\+?966)?5[0-9]\d{7}|(\+?971)?5[024568]\d{7}|(\+?974)?[3567]\d{7}|(\+?965)?[569]\d{7}|(\+?968)?9[1-9]\d{6}|(\+?963)?9[0-9]\d{7})$/;
    return (
        <div className="CreatedForm">
            <div className="FormAll">
                <div className="FormLeft">
                    <img src={logo} alt="" />
                    <div className="FormLeftDetails FormDetailsProduct">
                        <div>
                            <h2>NAME</h2>
                            <p>Description</p>
                        </div>
                        <div className="FormLeftDetailsPrice">
                            <h2>12RM</h2>
                        </div>
                    </div>
                </div>

                <div className="FormCenter">
                    <p className="FormTitle">Purchase Form</p>
                    <div className="Hint">
                        <p>{languageText.valid}</p>
                        <p>{languageText.invalid}</p>
                    </div>

                    <div className="formBox PeopleForm">
                        <form action="" encType="multipart/form-data">
                            <div className="PersonalFields">
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(fullNameRegex.test(fullName)) ? 'valid' : 'invalid'}`}
                                            onChange={(e) => { setFullName(e.target.value) }}
                                            required
                                            id="fullName"
                                        />
                                        {!fullName && <label for="fullName" className={`LabelInput ${(fullName) ? 'valid' : 'invalid'}`}><Icon icon="bx:user" /> {languageText.FullName}</label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="text"
                                            className={`input ${(matricRegex.test(matric)) ? 'valid' : 'invalid'}`}
                                            onChange={(e) => { setMatric(e.target.value) }}
                                            required
                                            id="matric"
                                            style={{ textTransform: "uppercase" }}
                                        />
                                        {!matric && <label for="matric" className={`LabelInput ${(matric) ? 'valid' : 'invalid'}`}><Icon icon="stash:user-id" /> {languageText.Matric}</label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="email"
                                            className={`input ${(emailRegex.test(email)) ? 'valid' : 'invalid'}`}
                                            onChange={(e) => { setEmail(e.target.value) }}
                                            required
                                            id="email"
                                        />
                                        {!email && <label for="email" className={`LabelInput ${(email) ? 'valid' : 'invalid'}`}><Icon icon="entypo:email" /> {languageText.formEmail}</label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <div className="InputLabelField">
                                        <input
                                            type="number"
                                            className={`input ${(combinedPhoneRegex.test(phone)) ? 'valid' : 'invalid'}`}
                                            onChange={(e) => { setPhone(e.target.value) }}
                                            required
                                            id="phone"
                                        />
                                        {!phone && <label for="phone" className={`LabelInput ${(phone) ? 'valid' : 'invalid'}`}><Icon icon="fluent:phone-chat-16-filled" /> {languageText.formPhone}</label>}
                                    </div>
                                </div>
                                <div className="InputField">
                                    <select
                                        className={`input ${(faculty) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => setFaculty(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled selected hidden> {languageText.formFaculty}</option>
                                        <option value="Electrical" >{languageText.FKE}</option>
                                        <option value="Computing" >{languageText.FC}</option>
                                        <option value="Mechanical" >{languageText.FKM}</option>
                                        <option value="Civil" >{languageText.FKA}</option>
                                        <option value="Chemical" >{languageText.FKT}</option>
                                        <option value="Architecture" >{languageText.Arch}</option>
                                        <option value="Bridging" >{languageText.Found}</option>
                                        <option value="Other" >{languageText.Other}</option>
                                    </select>
                                </div>
                                <div className="InputField">
                                    <select
                                        className={`input ${(semester) ? 'valid' : 'invalid'}`}
                                        onChange={(e) => setSemester(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled selected hidden>{languageText.formSemester}</option>
                                        <option value="Bridging & Foundation" >{languageText.Found}</option>
                                        <option value="1" >1</option>
                                        <option value="2" >2</option>
                                        <option value="3" >3</option>
                                        <option value="4" >4</option>
                                        <option value="5" >5</option>
                                        <option value="6" >6</option>
                                        <option value="7" >7</option>
                                        <option value="8" >8</option>
                                        <option value="Masters" >{languageText.Masters}</option>
                                        <option value="PhD" >{languageText.PhD}</option>
                                        {/* <option value="2025" >2025</option> */}
                                    </select>
                                </div>
                            </div>
                            <><hr />
                                <div className="PersonalFields PaymentFields">
                                    <p>{languageText.payment}</p>
                                    <div className="QRPayment">
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "15px"
                                            }}>
                                            <img src={logo} className="QRCode" alt="" />
                                            {/* {form.paymentAmount && <p className="PaymentAmount"> {form.paymentAmount} {languageText.RM} </p>} */}
                                            <p className="PaymentAmount"></p>

                                        </div>
                                        <div className="InputField">
                                            <label for="proof" className={`LabelInputImg ${(proof) ? 'valid' : 'invalid'}`}>
                                                <div style={{ gap: "8px", display: "flex", alignItems: "center" }}><Icon icon="fluent:reciept-20-filled" />{selectedImageText || languageText.proof}</div>
                                                {(proof) ? <button className="XImgButton"
                                                // onClick={handleRemoveProofImage}
                                                >
                                                    <Icon icon="mdi:close-outline" />
                                                </button>
                                                    : <Icon icon="mingcute:upload-3-fill" />}
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="proof"
                                                style={{ display: 'none' }}
                                                required
                                                className={`input ${(proof) ? 'valid' : ''}`}
                                            // onChange={handleProofImgChange}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                            {proof && <p className="formError" style={{ background: "var(--theme)" }}><Icon icon="ooui:error" />{languageText.SubmitProof}</p>}
                            {!proof ? (
                                <button className="button" data-content={languageText.Submit}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svgIcon"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM135.1 217.4c-4.5 4.2-7.1 10.1-7.1 16.3c0 12.3 10 22.3 22.3 22.3H208v96c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V256h57.7c12.3 0 22.3-10 22.3-22.3c0-6.2-2.6-12.1-7.1-16.3L269.8 117.5c-3.8-3.5-8.7-5.5-13.8-5.5s-10.1 2-13.8 5.5L135.1 217.4z" /></svg>
                                </button>
                            ) : null}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchaseForm
