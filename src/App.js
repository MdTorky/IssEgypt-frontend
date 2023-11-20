import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './Components/Home/Home';
import Menu from './Components/Menu/Menu';
import Services from './Components/Services/Services';
import NavBar from './Components/NavBar/NavBar';
import Residences from './Components/Residences/Residences';
import Footer from './Components/Footer/Footer';
import img1 from './images/logo.png';
import languageData from './language.json';
import { useDarkMode } from './DarkModeContext';
import Attractions from './Components/Attractions/Attractions';
import Transportation from './Components/Transportation/Transportation';
import BankAccount from './Components/BankAccount/BankAccount';
import Groups from './Components/Groups/Groups';
import Clubs from './Components/Clubs/Clubs';
import NotFound from './Components/NotFound/NotFound';
import Courses from './Components/Courses/Courses';

function App() {
  // Initialize the language state with the default language (e.g., "en")
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const { darkMode, setDarkMode } = useDarkMode(); // Initialize to false

  const toggleDarkMode = () => {
    // Toggle the dark mode state and it will automatically be saved to local storage
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
              <Route exact path="/" element={<Home language={language} languageData={languageData} />} />
              <Route path="/services" element={<Services language={language} languageData={languageData} />} />
              <Route path="/residences" element={<Residences language={language} languageData={languageData} />} />
              <Route path="/attractions" element={<Attractions language={language} languageData={languageData} />} />
              <Route path="/transportation" element={<Transportation language={language} languageData={languageData} />} />
              <Route path="/openAccount" element={<BankAccount language={language} languageData={languageData} />} />
              <Route path="/clubs" element={<Clubs language={language} languageData={languageData} />} />
              <Route path="/courses" element={<Courses darkMode={darkMode} language={language} languageData={languageData} />} />
              <Route path="*" element={<NotFound darkMode={darkMode} language={language} languageData={languageData} />} />
              {/* <Route path="/groups" element={<Groups language={language} languageData={languageData} />} /> */}

            </Routes>
          </div>
          <Menu language={language} languageData={languageData} />
        </div>
        <Footer language={language} languageData={languageData} />
      </div>
    </Router>
  );
}

export default App;
