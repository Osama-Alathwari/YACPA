// src/routes/DashboardRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Dashboard layout
import DashboardLayout from '../components/dashboard/DashboardLayout';

// Dashboard pages
import DashboardOverview from '../components/dashboard/DashboardOverview';

// Member components
import MembersList from '../components/members/MembersList';
import MemberDetails from '../components/members/MemberDetails';

// Subscription components

// Payment components

// Report components

// Settings components
// import SystemSettings from '../components/settings/SystemSettings';
// import UserSettings from '../components/settings/UserSettings';
// import PermissionSettings from '../components/settings/PermissionSettings';

// // User profile
// import UserProfile from '../components/profile/UserProfile';

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                {/* Dashboard overview - default route */}
                <Route index element={<DashboardOverview />} />

                {/* Member routes */}
                <Route path="members">
                    <Route index element={<Navigate to="view" />} />
                    <Route path="view" element={<MembersList />} />
                    <Route path="view/:id" element={<MemberDetails />} />
                    <Route path="search" element={<MembersList />} />
                </Route>

                {/* Subscription routes */}

                {/* Payment routes */}


                {/* Report routes */}


                {/* Settings routes */}

            </Route>
        </Routes>
    );
};

export default DashboardRoutes;