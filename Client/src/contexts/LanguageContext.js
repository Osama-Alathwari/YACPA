
// src/contexts/LanguageContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

// Create the context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'ar');
    const [dir, setDir] = useState(i18n.language === 'ar' ? 'rtl' : 'ltr');

    // Toggle between Arabic and English
    const toggleLanguage = () => {
        const newLanguage = language === 'ar' ? 'en' : 'ar';
        setLanguage(newLanguage);
        changeLanguage(newLanguage);
    };

    // Set specific language
    const setAppLanguage = (lang) => {
        if (lang === 'ar' || lang === 'en') {
            setLanguage(lang);
            changeLanguage(lang);
        } else {
            console.warn(`Unsupported language: ${lang}. Using default.`);
        }
    };

    // Update direction when language changes
    useEffect(() => {
        setDir(language === 'ar' ? 'rtl' : 'ltr');
    }, [language]);

    // Values to be provided to consumers
    const value = {
        language,
        dir,
        isRtl: dir === 'rtl',
        toggleLanguage,
        setLanguage: setAppLanguage
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;