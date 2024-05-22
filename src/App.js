import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, BrowserRouter as Router, Navigate, Link } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext'
import Home from './Components/Home/Home';
import Menu from './Components/Menu/Menu';
import Services from './Components/Services/Services';
import Members from './Components/Members/Members';
import NavBar from './Components/NavBar/NavBar';
import Residences from './Components/Residences/Residences';
import Footer from './Components/Footer/Footer';
import img1 from './images/logo.png';
import { useDarkMode } from './context/DarkModeContext';
import Attractions from './Components/Attractions/Attractions';
import Transportation from './Components/Transportation/Transportation';
import BankAccount from './Components/BankAccount/BankAccount';
import Internships from './Components/Internships/Internships';
import Clubs from './Components/Clubs/Clubs';
import NotFound from './Components/NotFound/NotFound';
import Courses from './Components/Courses/Courses';
import SuggestionForm from './Components/Form/SuggestionForm';
import Suggestions from './Components/Answers/Suggestions';
import MemberForm from './Components/Form/MemberForm';
import MemberDetails from './Components/Members/MemberDetails'
import AllMembers from './Components/Admin/AllMembers'
import InternshipForm from './Components/Form/InternshipForm';
import FormCreator from './Components/Form/FormCreator';
import CreateForm from './Components/Form/CreatedForms';
import Admin from './Components/Admin/Admin';
import FormEditor from './Components/Admin/FormEditor';
import FormData from './Components/Admin/FormData';
import UnderCons from './Components/NotFound/UnderCons';
import MemberEditor from './Components/Admin/MemberEditor';
import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';
import CharityForm from './Components/Guidance/CharityForm';
import CharityEditor from './Components/Admin/CharityEditor';
import CoursesTips from './Components/Guidance/CoursesTips';
import PointsForm from './Components/KnowledgeBank/PointsForm';
import TokensDisplay from './Components/KnowledgeBank/TokensDisplay';
import TokensShowcase from './Components/Admin/TokensShowcase';
import Terms from './Components/Footer/Terms';

import { useLanguage } from './context/language';
import languageData from './language.json';
import BestMembers from './Components/Members/BestMembers';
import DeansForm from './Components/Form/DeansForm';
import BookForm from './Components/Book/BookForm';
import Library from './Components/Book/Library';
import BookingForm from './Components/Book/BookingForm';
import WebApplicationsSecurity from './Components/Form/WebApplicationsSecurity101';
import Magazine from './Components/Book/Magazine';
import LecturerForm from './Components/Form/LecturerForm';
function App() {
  const api = process.env.REACT_APP_API_KEY;
  // const api = "http://localhost:4000";
  // Initialize the language state with the default language (e.g., "en")
  // const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const { darkMode, setDarkMode } = useDarkMode(); // Initialize to false
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const { user } = useAuthContext()

  // Function to toggle the language
  // const toggleLanguage = () => {
  // const newLanguage = language === 'ar' ? 'en' : 'ar';
  // setLanguage(newLanguage);
  // localStorage.setItem('selectedLanguage', newLanguage);
  // };

  const { isRTL, language } = useLanguage();
  const languageText = languageData[language];


  function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    var reveals2 = document.querySelectorAll(".reveal2");
    var reveals3 = document.querySelectorAll(".reveal3");

    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight; var
        elementTop = reveals[i].getBoundingClientRect().top; var elementVisible = 150; if (elementTop < windowHeight -
          elementVisible) { reveals[i].classList.add("active"); } else { reveals[i].classList.remove("active"); }
    }
  }
  window.addEventListener("scroll", reveal); // Set the document body class based on the selected language and dark
  useEffect(() => {
    document.body.className = `${language === 'ar' ? 'arabic' : 'english'} ${darkMode ? 'dark-mode' : ''}`;
  }, [language, darkMode]);


  // useEffect(() => {
  // // Get the current count from local storage
  // const count = localStorage.getItem('visitorCount');
  // // Update the count in state
  // setVisitorCount(parseInt(count) || 0);
  // // Increment the count and store it back in local storage
  // localStorage.setItem('visitorCount', parseInt(count) + 1);
  // }, []);

  return (
    <Router>
      {/* <div className={`App ${language==='ar' ? 'arabic' : '' }`}> */}
      <div className={`App ${isRTL ? 'arabic' : ''}`}>
        <div className="logo">
          <Link className="logoImg" to='/'><img src={img1} alt="" /></Link>
        </div>
        <div className="appContainer">
          <NavBar // language={language} // toggleLanguage={toggleLanguage} // languageData={languageData}
            darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <div className={`routes ${language === 'ar' ? 'arabic' : ''}`}>
            <Routes>


              {/* All Pages */}
              <Route exact path="/" element={<Home language={language} languageData={languageData} api={api} />} />
              <Route exact path="/terms&Conditions" element={<Terms />} />
              <Route path="/services" element={<Services language={language} languageData={languageData} darkMode={darkMode} />} />
              <Route path="/members" element={<Members darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/premiumMembers" element={<BestMembers languageText={languageText} language={language} api={api} />} />
              <Route path="/members/:memberId" element={<MemberDetails darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/residences" element={<Residences language={language} languageData={languageData} />} />
              <Route path="/attractions" element={<Attractions language={language} languageData={languageData} />} />
              <Route path="/transportation" element={<Transportation language={language} languageData={languageData} />} />
              <Route path="/openAccount" element={<BankAccount language={language} languageData={languageData} />} />
              <Route path="/clubs" element={<Clubs language={language} languageData={languageData} />} />
              <Route path="/courses" element={<Courses darkMode={darkMode} language={language} languageData={languageData} />} />
              <Route path="/suggestionForm" element={<SuggestionForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/allSuggestions/admin" element={<Suggestions darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/internForm/admin" element={<InternshipForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/internships" element={<Internships darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/:formName" element={<CreateForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/charity" element={<CharityForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/coursesTips" element={<CoursesTips darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/tokens" element={<TokensDisplay darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/library" element={<Library darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/bookingForm/:id" element={<BookingForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/MediaCommittee" element={<DeansForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/WebApplicationsSecurity101" element={<WebApplicationsSecurity darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/bookForm" element={<BookForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/magazine" element={<Magazine darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/addLecturer" element={<LecturerForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />

              {/* Admin */}
              <Route path="/adminDashboard" element={user ? <Admin darkMode={darkMode} language={language} languageData={languageData} api={api} /> : <Navigate to='/login' />} />
              <Route path="/memberForm/admin" element={<MemberForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/allMembers/admin" element={<AllMembers darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/formCreator/admin" element={user ? <FormCreator darkMode={darkMode} language={language} languageData={languageData} api={api} /> : <Navigate to='/login' />} />
              <Route path="/formEditor/:committee/:formId" element={user ? <FormEditor darkMode={darkMode} language={language} languageData={languageData} api={api} /> : <Navigate to='/login' />} />
              <Route path="/formData/:committee/:formId" element={user ? <FormData darkMode={darkMode} language={language} languageData={languageData} api={api} /> : <Navigate to='/login' />} />
              <Route path="/memberEditor/:committee/:memberId" element={user ? <MemberEditor darkMode={darkMode} language={language} languageData={languageData} api={api} /> : <Navigate to='/login' />} />
              <Route path="/charityEditor" element={<CharityEditor darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/tokensShowcase" element={user ? <TokensShowcase darkMode={darkMode} language={language} languageData={languageData} api={api} /> : <Navigate to='/login' />} />
              {/*
                            <Route path="/tokensShowcase" element={<TokensShowcase darkMode={darkMode}
                                language={language} languageData={languageData} api={api} />} /> */}


              {/* KnowledgeBank */}
              <Route path="/tokensForm" element={user ? <PointsForm darkMode={darkMode}
                language={language} languageData={languageData} api={api} /> :
                <Navigate to='/login' />} />


              {/* Auth */}
              <Route path="/register/admin" element={<Register darkMode={darkMode}
                language={language} languageData={languageData} api={api} />} />
              {/* <Route path="/register/admin" element={!user ? <Register darkMode={darkMode}
                language={language} languageData={languageData} api={api} /> :
                <Navigate to='/adminDashboard' />} /> */}
              <Route path="/login" element={!user ? <Login darkMode={darkMode} language={language}
                languageData={languageData} api={api} /> :
                <Navigate to='/adminDashboard' />} />

              <Route path="*" element={<NotFound darkMode={darkMode} language={language}
                languageData={languageData} />} />
              <Route path="/underConstruction" element={<UnderCons darkMode={darkMode} language={language}
                languageData={languageData} />} />
              {/*
                            <Route path="/groups" element={<Groups language={language} languageData={languageData} />}
                            /> */}

            </Routes>
          </div>
          <Menu language={language} languageData={languageData} api={api} />
        </div>
        <Footer language={language} languageData={languageData} />
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;