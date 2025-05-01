// src/components/homepage/HeroSection.js
import React from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import logoPlaceholder from '../../assets/logo-placeholder.png';

const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            {t('home.hero.title')}
                        </h1>
                        <p className="text-lg mb-6 text-blue-100">
                            {t('home.hero.subtitle')}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                label={t('home.hero.joinButton')}
                                className="p-button-lg"
                            />
                            <Button
                                label={t('home.hero.learnMoreButton')}
                                className="p-button-outlined p-button-lg p-button-secondary"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src={logoPlaceholder}
                            alt={t('app.name')}
                            className="rounded-lg shadow-lg max-w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;