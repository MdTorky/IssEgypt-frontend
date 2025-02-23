import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
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
import BookForm from './Components/Book/BookForm';
import Library from './Components/Book/Library';
import BookingForm from './Components/Book/BookingForm';
import LecturerForm from './Components/Form/LecturerForm';
import Gallery from './Components/Gallery/Gallery';
import Lecturers from './Components/Lecturer/Lecturers';
import Shop from './Components/Shop/Shop';
import Product from './Components/Shop/Product';
import PurchaseForm from './Components/Shop/PurchaseForm';
import Reference from './Components/Shop/Reference';
import ProductsData from './Components/Admin/ProductsData';
import GalleryEdit from './Components/Gallery/GalleryEdit';
import EditInternship from './Components/Internships/EditInternship';
import QuizDashboard from './Components/Quiz/QuizDashboard';
import QuizPage from './Components/Quiz/Quiz';
import ModifyPoints from './Components/Quiz/EditQuiz';
import AddQuestion from './Components/Quiz/AddQuestion';
import AiTools from './Components/AiTools/AiTools';
function App() {
  const api = process.env.REACT_APP_API_KEY;
  // const api = "http://localhost:4000";
  const { darkMode, setDarkMode } = useDarkMode(); // Initialize to false
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const { user } = useAuthContext()


  const { isRTL, language } = useLanguage();
  const languageText = languageData[language];


  function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    // var reveals2 = document.querySelectorAll(".reveal2");
    // var reveals3 = document.querySelectorAll(".reveal3");

    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight; var
        elementTop = reveals[i].getBoundingClientRect().top; var elementVisible = 150; if (elementTop < windowHeight -
          elementVisible) { reveals[i].classList.add("active"); } else { reveals[i].classList.remove("active"); }
    }
  }
  window.addEventListener("scroll", reveal);
  useEffect(() => {
    document.body.className = `${language === 'ar' ? 'arabic' : 'english'} ${darkMode ? 'dark-mode' : ''}`;
  }, [language, darkMode]);



  return (
    <Router>
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
              <Route exact path="/" element={<Home language={language} languageText={languageText} api={api} />} />
              <Route path="/gallery" element={<Gallery language={language} languageText={languageText} api={api} />} />
              <Route exact path="/terms&Conditions" element={<Terms />} />
              <Route path="/services" element={<Services language={language} languageText={languageText} api={api} />} />
              <Route path="/members" element={<Members darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/premiumMembers" element={<BestMembers languageText={languageText} language={language} api={api} />} />
              <Route path="/members/:memberId" element={<MemberDetails language={language} languageText={languageText} api={api} />} />
              <Route path="/residences" element={<Residences languageText={languageText} />} />
              <Route path="/attractions" element={<Attractions languageText={languageText} />} />
              <Route path="/aitools" element={<AiTools languageText={languageText} language={language} />} />
              <Route path="/transportation" element={<Transportation language={language} languageText={languageText} />} />
              <Route path="/openAccount" element={<BankAccount language={language} languageText={languageText} />} />
              <Route path="/clubs" element={<Clubs language={language} languageText={languageText} />} />
              <Route path="/courses" element={<Courses darkMode={darkMode} language={language} languageText={languageText} />} />
              <Route path="/suggestionForm" element={<SuggestionForm darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/allSuggestions/admin" element={<Suggestions darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/internForm/admin" element={<InternshipForm darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/internships" element={<Internships languageText={languageText} api={api} />} />
              <Route path="/form/:id" element={<CreateForm darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/charity" element={<CharityForm darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/coursesTips" element={<CoursesTips darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/tokens" element={<TokensDisplay darkMode={darkMode} languageText={languageText} api={api} />} />
              <Route path="/library" element={<Library darkMode={darkMode} languageText={languageText} api={api} />} />
              <Route path="/bookingForm/:id" element={<BookingForm darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/bookForm" element={<BookForm darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/addLecturer" element={<LecturerForm darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/lecturers" element={<Lecturers darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/shop" element={<Shop language={language} languageText={languageText} api={api} />} />
              <Route path="/product/:productId" element={<Product language={language} languageText={languageText} api={api} />} />
              <Route path="/purchase/:productId" element={<PurchaseForm darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/reference/:referenceNumber" element={<Reference language={language} languageText={languageText} api={api} />} />
              <Route path="/fawazirRamadan" element={<QuizPage language={language} languageText={languageText} api={api} darkMode={darkMode} />} />
              <Route path="/productData" element={<ProductsData darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/quizDashboard" element={user ? <QuizDashboard language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              <Route path="/editquiz" element={user ? <ModifyPoints language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              <Route path="/addQuestion" element={user ? <AddQuestion language={language} languageText={languageText} api={api} darkMode={darkMode} /> : <Navigate to='/login' />} />

              {/* Admin */}
              {/* <Route path="/allMembers/admin" element={<AllMembers darkMode={darkMode} language={language} languageText={languageText} api={api} />} /> */}
              <Route path="/adminDashboard" element={user ? <Admin darkMode={darkMode} language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              <Route path="/memberForm/admin" element={<MemberForm darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/formCreator/admin" element={user ? <FormCreator darkMode={darkMode} language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              <Route path="/formEditor/:committee/:formId" element={user ? <FormEditor darkMode={darkMode} language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              <Route path="/formData/:committee/:formId" element={user ? <FormData darkMode={darkMode} language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              <Route path="/memberEditor/:committee/:memberId" element={user ? <MemberEditor darkMode={darkMode} language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              <Route path="/charityEditor" element={<CharityEditor darkMode={darkMode} language={language} languageText={languageText} api={api} />} />
              <Route path="/tokensShowcase" element={user ? <TokensShowcase darkMode={darkMode} language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              <Route path="/galleryedit/:id" element={user ? <GalleryEdit darkMode={darkMode} language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              <Route path="/internedit/:id" element={user ? <EditInternship darkMode={darkMode} language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} />
              {/* <Route path="/productData" element={user ? <ProductsData darkMode={darkMode} language={language} languageText={languageText} api={api} /> : <Navigate to='/login' />} /> */}

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

              <Route path="/login" element={!user ? <Login darkMode={darkMode} language={language}
                languageData={languageData} api={api} /> :
                <Navigate to='/adminDashboard' />} />

              <Route path="*" element={<NotFound darkMode={darkMode} language={language}
                languageData={languageData} />} />
              <Route path="/underConstruction" element={<UnderCons darkMode={darkMode} language={language}
                languageData={languageData} />} />
            </Routes>
          </div>
          <Menu language={language} languageData={languageData} api={api} />
        </div>
        <Footer language={language} languageText={languageText} />
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;