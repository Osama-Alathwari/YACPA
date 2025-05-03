// src/components/dashboard/DashboardLayout.js
import React, { useState } from 'react';
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

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="flex flex-col h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Top Bar */}
            <TopBar toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 overflow-hidden">

                <div
                    className={`transition-all duration-300 ease-in-out ${sidebarVisible ? 'w-64' : 'w-0'
                        }`}
                >
                    {sidebarVisible && <Sidebar />}
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto bg-gray-50 p-6">
                    {/* Mobile menu toggle button - visible on small screens */}
                    <div className="block md:hidden mb-4">
                        <Button
                            icon={sidebarVisible ? "pi pi-times" : "pi pi-bars"}
                            onClick={toggleSidebar}
                            className="p-button-rounded p-button-text"
                            aria-label={t('dashboard.toggleSidebar')}
                        />
                    </div>

                    {/* Render nested routes using Outlet */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;