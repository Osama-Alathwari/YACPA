// src/pages/AboutUsPage.js
import React from 'react';
import { MainHeader, Footer } from '../components';
import {
    HeroSection,
    MissionVision,
    Timeline, //The third one is the backend endpoint that the frontend will communicate with.
    OrganizationalStructure,
    Achievements,
    Partners
} from '../components/about';

const AboutUsPage = () => {
    return (
        <div className="font-sans bg-gray-50 min-h-screen" dir="rtl">
            {/* Header */}
            <MainHeader />

            {/* Hero Section */}
            <HeroSection />

            {/* Mission and Vision */}
            <MissionVision />

            {/* History Timeline */}
            <Timeline />

            {/* Organizational Structure */}
            <OrganizationalStructure />

            {/* Achievements */}
            <Achievements />

            {/* Partners and Affiliations */}
            <Partners />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AboutUsPage;