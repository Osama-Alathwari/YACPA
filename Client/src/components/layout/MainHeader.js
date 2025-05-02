// src/components/layout/Header.js
import React from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import MainMenu from './MainMenu';
import LanguageSwitcher from '../common/LanguageSwitcher';
import logoPlaceholder from '../../assets/logo-placeholder.png';

const MainHeader = () => {
    const { t } = useTranslation();

    return (
        <header className="bg-white shadow-md sticky top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-3 px-4">
                <div className="flex items-center">
                    <img src={logoPlaceholder} alt={t('app.name')} className="h-14 mx-2" />
                    <h1 className="text-xl font-bold">{t('app.name')}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        label={t('navigation.login')}
                        icon="pi pi-sign-in"
                        className="p-button-outlined p-button-sm"
                        onClick={() => window.location.href = '/login'}
                        aria-label={t('navigation.login')}
                    />
                    <LanguageSwitcher />
                </div>
            </div>
            <div className="border-b border-gray-200">
                <div className="container mx-auto">
                    <MainMenu />
                </div>
            </div>
        </header>
    );
};

export default MainHeader;  