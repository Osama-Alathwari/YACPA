// src/components/dashboard/DashboardLayout.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const DashboardLayout = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarVisible(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    // Close sidebar on mobile when clicking outside
    const handleOverlayClick = () => {
        if (isMobile && sidebarVisible) {
            setSidebarVisible(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Top Bar */}
            <TopBar toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Overlay */}
                {isMobile && sidebarVisible && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={handleOverlayClick}
                    />
                )}

                {/* Sidebar */}
                <div
                    className={`
                        transition-all duration-300 ease-in-out z-50
                        ${isMobile 
                            ? `fixed top-16 ${isRtl ? 'right-0' : 'left-0'} h-full w-64 ${sidebarVisible ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full'}`
                            : `${sidebarVisible ? 'w-64' : 'w-0'}`
                        }
                    `}
                >
                    {sidebarVisible && (
                        <div className="w-64 h-full">
                            <Sidebar />
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 md:p-6 min-h-full">
                        {/* Mobile menu toggle button - visible on small screens */}
                        <div className="block md:hidden mb-4">
                            <Button
                                icon={sidebarVisible ? "pi pi-times" : "pi pi-bars"}
                                onClick={toggleSidebar}
                                className="dashboard-btn dashboard-btn-primary"
                                aria-label={t('dashboard.toggleSidebar')}
                            />
                        </div>

                        {/* Page Content */}
                        <div className="dashboard-content">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;