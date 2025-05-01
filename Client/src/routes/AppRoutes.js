// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ContactUsPage from '../pages/ContactusPage';
// Import other pages as they're created

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;