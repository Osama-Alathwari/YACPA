// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // load translations using http (default public/locales/{lng}/translation.json)
    .use(Backend)
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next
    .use(initReactI18next)
    // init i18next
    .init({
        fallbackLng: 'ar',
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        // Set the language direction based on the current language
        react: {
            useSuspense: true,
        },

        // Language detection options
        detection: {
            // order and from where user language should be detected
            order: ['querystring', 'cookie', 'localStorage', 'navigator'],

            // keys or params to lookup language from
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',

            // cache user language on
            caches: ['localStorage', 'cookie'],
        },
    });

// Export a function to change language and handle RTL
export const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';

    // Store the language preference
    localStorage.setItem('i18nextLng', lng);
};

// Initialize RTL direction based on the saved language
const currentLng = localStorage.getItem('i18nextLng') || 'ar';
document.body.dir = currentLng === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = currentLng;

export default i18n;