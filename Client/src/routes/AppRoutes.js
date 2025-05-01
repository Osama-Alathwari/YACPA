// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ContactUsPage from '../pages/ContactusPage';
import AboutUsPage from '../pages/AboutUsPage';


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;