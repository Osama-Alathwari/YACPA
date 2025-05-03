// src/pages/LogoutPage.js
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProgressSpinner } from 'primereact/progressspinner';

const LogoutPage = () => {
    const { logout } = useAuth();

    useEffect(() => {
        // Perform logout
        const performLogout = async () => {
            // Small delay for visual feedback that logout is happening
            await new Promise(resolve => setTimeout(resolve, 800));
            logout();
        };

        performLogout();
    }, [logout]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s" />
            <p className="mt-4 text-lg text-gray-600">Logging out...</p>

            {/* Redirect when logout completes */}
            <Navigate to="/login" replace />
        </div>
    );
};

export default LogoutPage;