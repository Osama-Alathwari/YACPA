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
import AddMember from '../components/members/AddMember'; // ← New import

// Subscription components
import ExpiringSubscriptions from '../components/subscriptions/ExpiringSubscriptions';

// Payment components

// Report components

// Settings components
// import SystemSettings from '../components/settings/SystemSettings';
// import UserSettings from '../components/settings/UserSettings';
// import PermissionSettings from '../components/settings/PermissionSettings';

// User profile
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
                    <Route path="add" element={<AddMember />} />        {/* ← New route */}
                    <Route path="view" element={<MembersList />} />
                    <Route path="view/:id" element={<MemberDetails />} />
                    <Route path="edit/:id" element={<AddMember />} />    {/* ← Can reuse for editing */}
                    <Route path="search" element={<MembersList />} />
                </Route>

                {/* Subscription routes */}
                <Route path="subscriptions">
                    <Route index element={<Navigate to="expiring" />} />
                    <Route path="expiring" element={<ExpiringSubscriptions />} />
                    <Route path="renew" element={<div>Renewal Component</div>} />
                    <Route path="renew/:id" element={<div>Member Renewal Component</div>} />
                    <Route path="expired" element={<div>Expired Subscriptions Component</div>} />
                </Route>

                {/* Payment routes */}
                <Route path="payments">
                    <Route index element={<Navigate to="history" />} />
                    <Route path="new" element={<div>New Payment Component</div>} />
                    <Route path="history" element={<div>Payment History Component</div>} />
                </Route>

                {/* Report routes */}
                <Route path="reports">
                    <Route index element={<Navigate to="members" />} />
                    <Route path="members" element={<div>Members Report Component</div>} />
                    <Route path="payments" element={<div>Payments Report Component</div>} />
                    <Route path="subscriptions" element={<div>Subscriptions Report Component</div>} />
                </Route>

                {/* Settings routes */}
                <Route path="settings">
                    <Route index element={<Navigate to="system" />} />
                    <Route path="system" element={<div>System Settings Component</div>} />
                    <Route path="users" element={<div>User Settings Component</div>} />
                    <Route path="permissions" element={<div>Permission Settings Component</div>} />
                </Route>

                {/* Profile route */}
                <Route path="profile" element={<div>User Profile Component</div>} />
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;