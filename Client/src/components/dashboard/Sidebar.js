// src/components/dashboard/Sidebar.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { PanelMenu } from 'primereact/panelmenu';
import { Divider } from 'primereact/divider';
import { useLanguage } from '../../contexts/LanguageContext';
import logoPlaceholder from '../../assets/logo-placeholder.png';

const Sidebar = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const location = useLocation();

    // Function to check if menu item is active
    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    // Create menu model for PanelMenu
    const menuItems = [
        {
            label: t('dashboard.overview'),
            icon: 'pi pi-home',
            className: isActive('/dashboard') && location.pathname === '/dashboard' ? 'active-menu-item' : '',
            command: () => window.location.href = '/dashboard',
        },
        {
            label: t('dashboard.members.title'),
            icon: 'pi pi-users',
            expanded: isActive('/dashboard/members'),
            className: isActive('/dashboard/members') ? 'active-menu-parent' : '',
            items: [
                {
                    label: t('dashboard.members.add'),
                    icon: 'pi pi-user-plus',
                    command: () => window.location.href = '/dashboard/members/add',
                    className: isActive('/dashboard/members/add') ? 'active-menu-item' : '',
                },
                {
                    label: t('dashboard.members.view'),
                    icon: 'pi pi-list',
                    command: () => window.location.href = '/dashboard/members/view',
                    className: isActive('/dashboard/members/view') ? 'active-menu-item' : '',
                },
                {
                    label: t('dashboard.members.search'),
                    icon: 'pi pi-search',
                    command: () => window.location.href = '/dashboard/members/search',
                    className: isActive('/dashboard/members/search') ? 'active-menu-item' : '',
                }
            ]
        },
        {
            label: t('dashboard.subscriptions.title'),
            icon: 'pi pi-calendar-plus',
            expanded: isActive('/dashboard/subscriptions'),
            className: isActive('/dashboard/subscriptions') ? 'active-menu-parent' : '',
            items: [
                {
                    label: t('dashboard.subscriptions.renew'),
                    icon: 'pi pi-sync',
                    command: () => window.location.href = '/dashboard/subscriptions/renew',
                    className: isActive('/dashboard/subscriptions/renew') ? 'active-menu-item' : '',
                },
                {
                    label: t('dashboard.subscriptions.expiring'),
                    icon: 'pi pi-clock',
                    command: () => window.location.href = '/dashboard/subscriptions/expiring',
                    className: isActive('/dashboard/subscriptions/expiring') ? 'active-menu-item' : '',
                },
                {
                    label: t('dashboard.subscriptions.expired'),
                    icon: 'pi pi-calendar-times',
                    command: () => window.location.href = '/dashboard/subscriptions/expired',
                    className: isActive('/dashboard/subscriptions/expired') ? 'active-menu-item' : '',
                }
            ]
        },
        {
            label: t('dashboard.payments.title'),
            icon: 'pi pi-wallet',
            expanded: isActive('/dashboard/payments'),
            className: isActive('/dashboard/payments') ? 'active-menu-parent' : '',
            items: [
                {
                    label: t('dashboard.payments.new'),
                    icon: 'pi pi-plus',
                    command: () => window.location.href = '/dashboard/payments/new',
                    className: isActive('/dashboard/payments/new') ? 'active-menu-item' : '',
                },
                {
                    label: t('dashboard.payments.history'),
                    icon: 'pi pi-history',
                    command: () => window.location.href = '/dashboard/payments/history',
                    className: isActive('/dashboard/payments/history') ? 'active-menu-item' : '',
                }
            ]
        },
        {
            label: t('dashboard.reports.title'),
            icon: 'pi pi-chart-bar',
            expanded: isActive('/dashboard/reports'),
            className: isActive('/dashboard/reports') ? 'active-menu-parent' : '',
            items: [
                {
                    label: t('dashboard.reports.members'),
                    icon: 'pi pi-users',
                    command: () => window.location.href = '/dashboard/reports/members',
                    className: isActive('/dashboard/reports/members') ? 'active-menu-item' : '',
                },
                {
                    label: t('dashboard.reports.payments'),
                    icon: 'pi pi-money-bill',
                    command: () => window.location.href = '/dashboard/reports/payments',
                    className: isActive('/dashboard/reports/payments') ? 'active-menu-item' : '',
                },
                {
                    label: t('dashboard.reports.subscriptions'),
                    icon: 'pi pi-calendar',
                    command: () => window.location.href = '/dashboard/reports/subscriptions',
                    className: isActive('/dashboard/reports/subscriptions') ? 'active-menu-item' : '',
                }
            ]
        },
        {
            label: t('dashboard.settings.title'),
            icon: 'pi pi-cog',
            expanded: isActive('/dashboard/settings'),
            className: isActive('/dashboard/settings') ? 'active-menu-parent' : '',
            items: [
                {
                    label: t('dashboard.settings.system'),
                    icon: 'pi pi-sliders-h',
                    command: () => window.location.href = '/dashboard/settings/system',
                    className: isActive('/dashboard/settings/system') ? 'active-menu-item' : '',
                },
                {
                    label: t('dashboard.settings.users'),
                    icon: 'pi pi-user-edit',
                    command: () => window.location.href = '/dashboard/settings/users',
                    className: isActive('/dashboard/settings/users') ? 'active-menu-item' : '',
                },
                {
                    label: t('dashboard.settings.permissions'),
                    icon: 'pi pi-lock',
                    command: () => window.location.href = '/dashboard/settings/permissions',
                    className: isActive('/dashboard/settings/permissions') ? 'active-menu-item' : '',
                }
            ]
        }
    ];

    return (
        <div className={`
            bg-white h-full shadow-lg overflow-y-auto
            ${isRtl ? 'border-l' : 'border-r'} border-gray-200
        `}>
            {/* Logo and association name */}
            <div className="p-6 flex items-center justify-center flex-col border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                    <img src={logoPlaceholder} alt={t('app.name')} className="h-10 object-contain" />
                </div>
                <h2 className="text-lg font-bold text-center text-gray-800 leading-tight">
                    {t('app.shortName')}
                </h2>
                <p className="text-xs text-gray-600 text-center mt-1">نظام إدارة الاشتراكات</p>
            </div>

            {/* Navigation */}
            <div className="p-3">
                <PanelMenu 
                    model={menuItems} 
                    className="sidebar-menu border-none bg-transparent" 
                />
            </div>

            <Divider className="my-2" />

            {/* User quick links */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
                <div className="text-xs font-medium text-gray-500 mb-3 px-2">الإعدادات الشخصية</div>
                <ul className="space-y-1">
                    <li>
                        <NavLink
                            to="/dashboard/profile"
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ${
                                    isActive ? 'bg-blue-50 text-blue-700 font-medium' : ''
                                }`
                            }
                        >
                            <i className={`pi pi-user ${isRtl ? 'ml-3' : 'mr-3'} text-sm`}></i>
                            <span className="text-sm">{t('navigation.profile')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/logout"
                            className="flex items-center px-3 py-2.5 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                        >
                            <i className={`pi pi-sign-out ${isRtl ? 'ml-3' : 'mr-3'} text-sm`}></i>
                            <span className="text-sm">{t('navigation.logout')}</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Version info */}
            <div className="p-3 text-center border-t border-gray-100">
                <p className="text-xs text-gray-400">النسخة 1.0.0</p>
            </div>
        </div>
    );
};

export default Sidebar;