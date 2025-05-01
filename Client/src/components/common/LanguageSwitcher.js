// src/components/common/LanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const toggleLanguage = () => {
        const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
        changeLanguage(newLanguage);
    };

    return (
        <div className="flex items-center gap-2">
            <span className={`font-medium ${currentLanguage === 'ar' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600 cursor-pointer'}`}
                onClick={currentLanguage !== 'ar' ? toggleLanguage : undefined}>
                العربية
            </span>
            <span>|</span>
            <span className={`font-medium ${currentLanguage === 'en' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600 cursor-pointer'}`}
                onClick={currentLanguage !== 'en' ? toggleLanguage : undefined}>
                English
            </span>
        </div>
    );
};

export default LanguageSwitcher;