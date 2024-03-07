// import React, { createContext, useContext, useState } from 'react';

// const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//     const [language, setLanguage] = useState('en');

//     const toggleLanguage = () => {
//         setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'ar' : 'en'));
//     };

//     return (
//         <LanguageContext.Provider value={{ language, toggleLanguage }}>
//             {children}
//         </LanguageContext.Provider>
//     );
// };

// export const useLanguage = () => {
//     return useContext(LanguageContext);
// };



// languageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const storedLanguage = localStorage.getItem('language');
        return storedLanguage || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
    };

    const isRTL = language === 'ar';

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};
