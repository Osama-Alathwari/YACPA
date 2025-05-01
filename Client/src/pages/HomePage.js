// src/pages/HomePage.js
import React, { useState } from 'react';

// Import all components from barrel export
import {
    MainHeader,
    Footer,
    HeroSection,
    BenefitsSection,
    StatisticsSection,
    NewsSection,
    // TestimonialsSection,
    CTASection
    // LoginDialog
} from '../components';

const HomePage = () => {
    // const [loginVisible, setLoginVisible] = useState(false);


    return (
        <div className="font-sans bg-gray-50 min-h-screen" dir="rtl">
            {/* Header */}
            <MainHeader />

            {/* Main Content */}

            {/* Hero Section */}
            <HeroSection />

            {/* Benefits Section */}
            <BenefitsSection />

            {/* Statistics Section */}
            <StatisticsSection />

            {/* News Section */}
            <NewsSection />



            {/* CTA Section */}
            <CTASection />

            {/* Footer */}
            <Footer />

            {/* Login Dialog */}
        </div>
    );
};

export default HomePage;