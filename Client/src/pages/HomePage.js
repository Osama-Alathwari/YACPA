// src/pages/HomePage.js
import React from 'react';

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

    return (
        <div className="font-sans bg-gray-50 min-h-screen" >
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