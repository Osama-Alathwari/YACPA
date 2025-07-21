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
import AddMember from '../components/members/AddMember';

// Subscription components
import ExpiringSubscriptions from '../components/subscriptions/ExpiringSubscriptions';
import ExpiredSubscriptions from '../components/subscriptions/ExpiredSubscriptions';
import SubscriptionRenewal from '../components/subscriptions/SubscriptionRenewal';
import NewPaymentComponent from '../components/payments/NewPayment';

// Payment components

// Report components

// Settings components
// import SystemSettings from '../components/settings/SystemSettings';
// import UserSettings from '../components/settings/UserSettings';
// import PermissionSettings from '../components/settings/PermissionSettings';

// User profile
import UserProfile from '../components/profile/UserProfile';
import MembersReportComponent from '../components/reports/MembersReport';

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                {/* Dashboard overview - default route */}
                <Route index element={<DashboardOverview />} />

                {/* Member routes */}
                <Route path="members">
                    <Route index element={<Navigate to="view" />} />
                    <Route path="add" element={<AddMember />} />
                    <Route path="view" element={<MembersList />} />
                    <Route path="view/:id" element={<MemberDetails />} />
                    <Route path="edit/:id" element={<AddMember />} />
                </Route>

                {/* Subscription routes */}
                <Route path="subscriptions">
                    <Route index element={<Navigate to="expiring" />} />
                    <Route path="expiring" element={<ExpiringSubscriptions />} />
                    <Route path="expired" element={<ExpiredSubscriptions />} />
                    <Route path="renew" element={<SubscriptionRenewal />} />
                    <Route path="renew/:id" element={<SubscriptionRenewal />} />
                </Route>

                {/* Payment routes */}
                <Route path="payments">
                    <Route index element={<Navigate to="history" />} />
                    <Route path="new" element={<NewPaymentComponent />} />
                    <Route path="history" element={<div>Payment History Component</div>} />
                </Route>

                {/* Report routes */}
                <Route path="reports">
                    <Route index element={<Navigate to="members" />} />
                    <Route path="members" element={<MembersReportComponent />} />
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
                <Route path="profile" element={<UserProfile />} />
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;