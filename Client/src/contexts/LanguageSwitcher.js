// src/components/common/LanguageSwitcher.js
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { SelectButton } from 'primereact/selectbutton';

const LanguageSwitcher = ({ variant = 'buttons' }) => {
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.language;

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // Store language preference
        localStorage.setItem('i18nextLng', lang);
    };

    // Ensure direction is set on initial load
    useEffect(() => {
        document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLanguage;
    }, [currentLanguage]);

    // Option for dropdown/select style
    const options = [
        { label: 'العربية', value: 'ar' },
        { label: 'English', value: 'en' }
    ];

    // Determine if Arabic is active
    const isArabic = currentLanguage === 'ar';

    // Render based on variant prop
    if (variant === 'select') {
        return (
            <SelectButton
                value={currentLanguage}
                options={options}
                onChange={(e) => changeLanguage(e.value)}
                className="p-selectbutton-sm"
            />
        );
    }

    // Default button style
    return (
        <div className="inline-flex rounded-md shadow-sm" role="group">
            <Tooltip target=".language-button" position="bottom" />
            <Button
                icon="pi pi-globe"
                text
                rounded
                severity={isArabic ? "primary" : "secondary"}
                onClick={() => changeLanguage('ar')}
                className={`language-button border-r border-gray-200 ${isArabic ? 'bg-blue-50' : ''}`}
                data-pr-tooltip="العربية"
                aria-label="Arabic"
            >
                العربية
            </Button>
            <Button
                icon="pi pi-globe"
                text
                rounded
                severity={!isArabic ? "primary" : "secondary"}
                onClick={() => changeLanguage('en')}
                className={`language-button ${!isArabic ? 'bg-blue-50' : ''}`}
                data-pr-tooltip="English"
                aria-label="English"
            >
                English
            </Button>
        </div>
    );
};

export default LanguageSwitcher;