// src/pages/HomePage.js
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Import all components from barrel export
import {
    MainHeader,
    Footer,
    HeroSection,
    BenefitsSection,
    StatisticsSection,
    NewsSection,
    CTASection
} from '../components';

const HomePage = () => {
    const { dir } = useLanguage();

    return (
        <div className="font-sans bg-gray-50 min-h-screen" dir={dir}>
            {/* Header */}
            <MainHeader />

            {/* Main Content */}
            <HeroSection />
            <BenefitsSection />
            <StatisticsSection />
            <NewsSection />
            <CTASection />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;