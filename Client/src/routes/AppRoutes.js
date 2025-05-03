// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ContactUsPage from '../pages/ContactusPage';
import AboutUsPage from '../pages/AboutUsPage';
import LoginPage from '../pages/LoginPage';
import DashboardLayout from '../components/dashboard/DashboardLayout';


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardLayout />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;