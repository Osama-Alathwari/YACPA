// src/components/dashboard/TopBar.js
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const TopBar = ({ toggleSidebar }) => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const { user } = useAuth();
    const userMenuRef = useRef(null);
    const notificationsMenuRef = useRef(null);
    const [searchValue, setSearchValue] = useState('');

    // User menu items
    const userMenuItems = [
        {
            label: t('navigation.profile'),
            icon: 'pi pi-user',
            command: () => window.location.href = '/dashboard/profile'
        },
        {
            label: t('dashboard.settings.title'),
            icon: 'pi pi-cog',
            command: () => window.location.href = '/dashboard/settings'
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
            template: () => (
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <h6 className="font-semibold text-gray-800">{t('dashboard.notifications.title')}</h6>
                        <Badge value="3" severity="info" size="small" />
                    </div>
                </div>
            )
        },
        {
            template: () => (
                <div className="notification-item border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start p-3">
                        <div className={`notification-icon bg-blue-100 text-blue-600 ${isRtl ? 'ml-3' : 'mr-3'}`}>
                            <i className="pi pi-calendar text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {t('dashboard.subscriptions.expiring')}
                            </p>
                            <p className="text-xs text-gray-600">
                                10 عضو لديهم اشتراكات تنتهي خلال 30 يوماً
                            </p>
                            <p className="text-xs text-gray-400 mt-1">منذ ساعتين</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            template: () => (
                <div className="notification-item border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start p-3">
                        <div className={`notification-icon bg-green-100 text-green-600 ${isRtl ? 'ml-3' : 'mr-3'}`}>
                            <i className="pi pi-user-plus text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                عضو جديد
                            </p>
                            <p className="text-xs text-gray-600">
                                انضم محمد أحمد إلى الجمعية
                            </p>
                            <p className="text-xs text-gray-400 mt-1">منذ 3 ساعات</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            template: () => (
                <div className="notification-item hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start p-3">
                        <div className={`notification-icon bg-yellow-100 text-yellow-600 ${isRtl ? 'ml-3' : 'mr-3'}`}>
                            <i className="pi pi-money-bill text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                دفعة جديدة
                            </p>
                            <p className="text-xs text-gray-600">
                                تم استلام دفعة تجديد اشتراك
                            </p>
                            <p className="text-xs text-gray-400 mt-1">منذ 5 ساعات</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            template: () => (
                <div className="p-3 text-center border-t border-gray-200 bg-gray-50">
                    <Button
                        label={t('dashboard.notifications.viewAll')}
                        className="p-button-text p-button-sm w-full"
                        onClick={() => window.location.href = '/dashboard/notifications'}
                    />
                </div>
            )
        }
    ];

    return (
        <header className="dashboard-topbar bg-white shadow-sm py-3 px-4 md:px-6 flex items-center justify-between border-b border-gray-200 sticky top-0 z-30">
            {/* Left section with toggle button and search */}
            <div className="flex items-center flex-1">
                {/* Sidebar toggle button - hidden on mobile as it appears in content */}
                <Button
                    icon="pi pi-bars"
                    onClick={toggleSidebar}
                    className="p-button-rounded p-button-text hidden md:inline-flex dashboard-focus-visible"
                    aria-label={t('dashboard.toggleSidebar')}
                    data-pr-tooltip={t('dashboard.toggleSidebar')}
                    data-pr-position="bottom"
                />
                <Tooltip target="[data-pr-tooltip]" />

                {/* Search box */}
                <div className={`relative max-w-md w-full ${isRtl ? 'mr-4' : 'ml-4'}`}>
                    <span className={`p-input-icon-${isRtl ? 'right' : 'left'}`}>
                        <i className="pi pi-search text-gray-400" />
                        <InputText
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={t('common.search')}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                        />
                    </span>
                </div>
            </div>

            {/* Right section with notifications, language switcher, and user menu */}
            <div className="flex items-center space-x-4">
                {/* Quick Actions */}
                <div className="hidden lg:flex items-center space-x-2">
                    <Button
                        icon="pi pi-user-plus"
                        className="p-button-rounded p-button-outlined p-button-sm dashboard-focus-visible"
                        onClick={() => window.location.href = '/dashboard/members/add'}
                        data-pr-tooltip={t('dashboard.members.add')}
                        data-pr-position="bottom"
                    />
                    <Button
                        icon="pi pi-sync"
                        className="p-button-rounded p-button-outlined p-button-sm dashboard-focus-visible"
                        onClick={() => window.location.href = '/dashboard/subscriptions/renew'}
                        data-pr-tooltip={t('dashboard.subscriptions.renew')}
                        data-pr-position="bottom"
                    />
                </div>

                {/* Notifications */}
                <div className="relative">
                    <Button
                        type="button"
                        icon="pi pi-bell"
                        className="p-button-rounded p-button-text relative dashboard-focus-visible"
                        onClick={(e) => notificationsMenuRef.current.toggle(e)}
                        aria-label={t('dashboard.notifications.title')}
                        data-pr-tooltip={t('dashboard.notifications.title')}
                        data-pr-position="bottom"
                    />
                    <Badge 
                        value="3" 
                        severity="danger" 
                        className="notification-badge absolute -top-1 -right-1 min-w-5 h-5 text-xs"
                    />

                    <Menu 
                        model={notificationItems} 
                        popup 
                        ref={notificationsMenuRef} 
                        className="dashboard-notifications w-80 max-w-sm" 
                        appendTo="self"
                    />
                </div>

                {/* Language Switcher */}
                <div className="hidden sm:block">
                    <LanguageSwitcher variant="select" />
                </div>

                {/* User Menu */}
                <div className="relative">
                    <Button
                        className="p-button-text flex items-center space-x-2 dashboard-focus-visible"
                        onClick={(e) => userMenuRef.current.toggle(e)}
                        aria-label={t('navigation.userMenu')}
                    >
                        <Avatar
                            icon="pi pi-user"
                            shape="circle"
                            className={`${isRtl ? 'ml-2' : 'mr-2'} bg-blue-100 text-blue-600 w-8 h-8`}
                            image={user?.avatar}
                        />
                        <div className="hidden sm:block text-right">
                            <div className="font-medium text-gray-900 text-sm">{user?.name || 'مستخدم'}</div>
                            <div className="text-xs text-gray-500">{user?.role || 'مدير'}</div>
                        </div>
                        <i className="pi pi-chevron-down text-xs text-gray-400"></i>
                    </Button>

                    <Menu 
                        model={userMenuItems} 
                        popup 
                        ref={userMenuRef} 
                        className="mt-2 min-w-48"
                        appendTo="self"
                    />
                </div>
            </div>
        </header>
    );
};

export default TopBar;