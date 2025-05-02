// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Ripple } from 'primereact/ripple';
import LoginForm from '../components/auth/LoginForm';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import AnimatedLoginBackground from '../components/auth/AnimatedLoginBackground';
import logoPlaceholder from '../assets/logo-placeholder.png';

const LoginPage = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    useEffect(() => {
        // Set document direction based on language
        document.body.dir = isRtl ? 'rtl' : 'ltr';

        // Ensure body has proper styling for full-page background
        document.body.classList.add('overflow-hidden');

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isRtl]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            {/* Animated Background */}
            <AnimatedLoginBackground />

            {/* Content */}
            <Card className="w-full max-w-md shadow-2xl relative z-10 backdrop-blur-sm bg-white/90">
                <div className="flex flex-col items-center mb-6 relative">
                    {/* Language Switcher */}
                    <div className="absolute top-0 right-0 p-ripple">
                        <Ripple />
                        <LanguageSwitcher variant="select" />
                    </div>

                    {/* Association Logo */}
                    <div className="h-24 w-24 rounded-full bg-white p-2 shadow-md mb-4 flex items-center justify-center">
                        <img
                            src={logoPlaceholder}
                            alt={t('app.name')}
                            className="h-16 object-contain"
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-blue-800 text-center">
                        {t('app.name')}
                    </h1>
                    <p className="text-gray-600 text-center mt-1 max-w-xs">
                        {t('auth.login.welcome')}
                    </p>
                </div>

                <LoginForm />

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>
                        {t('auth.login.noAccount')}
                        <a href="#" className="text-blue-600 hover:underline mx-1 font-medium">
                            {t('auth.login.register')}
                        </a>
                    </p>
                    <a href="#" className="text-blue-600 hover:underline block mt-2 font-medium">
                        {t('auth.login.forgotPassword')}
                    </a>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;