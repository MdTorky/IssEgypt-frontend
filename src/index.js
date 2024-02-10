import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './darkMode.css';
import App from './App';
import { LanguageProvider } from './language';
import { DarkModeProvider } from './DarkModeContext';
import { FormsContextProvider } from './context/formContext';
import { AuthContextProvider } from './context/authContext';
// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   RouterProvider,
//   Route,
// } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //   <App />
  <React.StrictMode>
    <AuthContextProvider>
      <FormsContextProvider>
        <DarkModeProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </DarkModeProvider>
      </FormsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>

  // document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

