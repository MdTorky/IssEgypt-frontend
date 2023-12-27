import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './Components/Home/Home';
import Menu from './Components/Menu/Menu';
import Services from './Components/Services/Services';
import Members from './Components/Members/Members';
import NavBar from './Components/NavBar/NavBar';
import Residences from './Components/Residences/Residences';
import Footer from './Components/Footer/Footer';
import img1 from './images/logo.png';
import languageData from './language.json';
import { useDarkMode } from './DarkModeContext';
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

function App() {
  const api = "https://iss-egypt-backend.vercel.app";
  // const api = "http://localhost:4000";
  // Initialize the language state with the default language (e.g., "en")
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const { darkMode, setDarkMode } = useDarkMode(); // Initialize to false

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };


  // Function to toggle the language
  const toggleLanguage = () => {
    // Toggle the language and save it to localStorage
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };


  function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    var reveals2 = document.querySelectorAll(".reveal2");
    var reveals3 = document.querySelectorAll(".reveal3");

    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

  window.addEventListener("scroll", reveal);

  // Set the document body class based on the selected language and dark mode
  useEffect(() => {
    document.body.className = `${language === 'ar' ? 'arabic' : 'english'} ${darkMode ? 'dark-mode' : ''}`;
  }, [language, darkMode]);

  return (
    <Router>
      <div className={`App ${language === 'ar' ? 'arabic' : ''}`}>
        <div className="logo">
          <img src={img1} alt="" />
        </div>
        <div className="appContainer">
          <NavBar
            language={language}
            toggleLanguage={toggleLanguage}
            languageData={languageData}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
          <div className={`routes ${language === 'ar' ? 'arabic' : ''}`}>
            <Routes>
              <Route exact path="/" element={<Home language={language} languageData={languageData} api={api} />} />
              <Route path="/services" element={<Services language={language} languageData={languageData} />} />
              <Route path="/members" element={<Members darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/allMembers/admin" element={<AllMembers darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
              <Route path="/memberForm/admin" element={<MemberForm darkMode={darkMode} language={language} languageData={languageData} api={api} />} />
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

              <Route path="*" element={<NotFound darkMode={darkMode} language={language} languageData={languageData} />} />
              {/* <Route path="/groups" element={<Groups language={language} languageData={languageData} />} /> */}

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
