// src/components/dashboard/TopBar.js
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';

const TopBar = ({ toggleSidebar }) => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const userMenuRef = useRef(null);
    const notificationsMenuRef = useRef(null);

    // Mock user data - in a real app this would come from a user context or auth state
    const user = {
        name: 'أحمد محمد',
        role: 'مدير النظام',
        avatar: null
    };

    // User menu items
    const userMenuItems = [
        {
            label: t('navigation.profile'),
            icon: 'pi pi-user',
            command: () => window.location.href = '/dashboard/profile'
        },
        {
            label: t('navigation.settings'),
            icon: 'pi pi-cog',
            command: () => window.location.href = '/dashboard/profile/settings'
        },
        { separator: true },
        {
            label: t('navigation.logout'),
            icon: 'pi pi-sign-out',
            command: () => window.location.href = '/logout'
        }
    ];

    // Notification menu items - these would be dynamic in a real application
    const notificationItems = [
        {
            label: t('dashboard.notifications.subscription'),
            icon: 'pi pi-calendar',
            template: (item) => (
                <div className="p-menuitem-content p-2 border-b border-gray-200">
                    <div className="flex items-start">
                        <div className={`p-2 bg-blue-100 text-blue-600 rounded-full ${isRtl ? 'ml-3' : 'mr-3'}`}>
                            <i className={item.icon}></i>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-gray-500">10 {t('dashboard.notifications.membersExpiring')}</p>
                            <p className="text-xs text-gray-400 mt-1">2 {t('common.hoursAgo')}</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            label: t('dashboard.notifications.newMember'),
            icon: 'pi pi-user-plus',
            template: (item) => (
                <div className="p-menuitem-content p-2 border-b border-gray-200">
                    <div className="flex items-start">
                        <div className={`p-2 bg-green-100 text-green-600 rounded-full ${isRtl ? 'ml-3' : 'mr-3'}`}>
                            <i className={item.icon}></i>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-gray-500">{t('dashboard.notifications.newMemberJoined')}</p>
                            <p className="text-xs text-gray-400 mt-1">3 {t('common.hoursAgo')}</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            label: t('dashboard.notifications.payment'),
            icon: 'pi pi-money-bill',
            template: (item) => (
                <div className="p-menuitem-content p-2 border-b border-gray-200">
                    <div className="flex items-start">
                        <div className={`p-2 bg-yellow-100 text-yellow-600 rounded-full ${isRtl ? 'ml-3' : 'mr-3'}`}>
                            <i className={item.icon}></i>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-gray-500">{t('dashboard.notifications.newPaymentReceived')}</p>
                            <p className="text-xs text-gray-400 mt-1">5 {t('common.hoursAgo')}</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            template: () => (
                <div className="p-3 text-center">
                    <Button
                        label={t('dashboard.notifications.viewAll')}
                        className="p-button-text p-button-sm"
                        onClick={() => window.location.href = '/dashboard/notifications'}
                    />
                </div>
            )
        }
    ];

    return (
        <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between border-b border-gray-200">
            {/* Left section with toggle button and search */}
            <div className="flex items-center">
                {/* Sidebar toggle button - hidden on mobile as it appears in content */}
                <Button
                    icon="pi pi-bars"
                    onClick={toggleSidebar}
                    className="p-button-rounded p-button-text hidden md:inline-flex"
                    aria-label={t('dashboard.toggleSidebar')}
                />

                {/* Search box */}
                <div className={`relative ${isRtl ? 'mr-4' : 'ml-4'}`}>
                    <span className={`p-input-icon-${isRtl ? 'right' : 'left'}`}>
                        <i className="pi pi-search" />
                        <InputText
                            placeholder={t('common.search')}
                            className="p-inputtext-sm"
                        />
                    </span>
                </div>
            </div>

            {/* Right section with notifications, language switcher, and user menu */}
            <div className="flex items-center">
                {/* Notifications */}
                <div className="relative">
                    <Button
                        type="button"
                        icon="pi pi-bell"
                        className="p-button-rounded p-button-text relative"
                        onClick={(e) => notificationsMenuRef.current.toggle(e)}
                        aria-label={t('dashboard.notifications.title')}
                    />
                    <Badge value="3" severity="danger" className="absolute top-0 right-0"></Badge>

                    <Menu model={notificationItems} popup ref={notificationsMenuRef} className="w-80" />
                </div>

                {/* Language Switcher */}
                <div className="mx-3">
                    <LanguageSwitcher variant="select" />
                </div>

                {/* User Menu */}
                <div>
                    <Button
                        className="p-button-text flex items-center"
                        onClick={(e) => userMenuRef.current.toggle(e)}
                        aria-label={t('navigation.userMenu')}
                    >
                        <Avatar
                            icon="pi pi-user"
                            shape="circle"
                            className={`${isRtl ? 'ml-2' : 'mr-2'} bg-blue-100 text-blue-600`}
                            image={user.avatar}
                        />
                        <span className="font-medium hidden sm:inline-block">{user.name}</span>
                    </Button>

                    <Menu model={userMenuItems} popup ref={userMenuRef} />
                </div>
            </div>
        </header>
    );
};

export default TopBar;