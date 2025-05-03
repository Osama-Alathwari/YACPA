// src/components/layout/MainMenu.js
import React, { useMemo } from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MainMenu = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Menubar items with navigation commands
    const menuItems = useMemo(() => [
        {
            label: t('navigation.home'),
            icon: 'pi pi-fw pi-home',
            command: () => navigate('/') // Use navigate function from useNavigate
        },
        {
            label: t('navigation.about'),
            icon: 'pi pi-fw pi-users',
            command: () => navigate('/about') // Use navigate function from useNavigate
        },
        {
            label: t('navigation.membership'),
            icon: 'pi pi-fw pi-id-card',
            command: () => navigate('/membership')
        },
        {
            label: t('navigation.events'),
            icon: 'pi pi-fw pi-calendar',
            command: () => navigate('/events')
        },
        {
            label: t('navigation.resources'),
            icon: 'pi pi-fw pi-book',
            command: () => navigate('/resources')
        },
        {
            label: t('navigation.contact'),
            icon: 'pi pi-fw pi-envelope',
            command: () => navigate('/contact')
        },
    ], [t, navigate]);

    return <Menubar model={menuItems} className="border-none" />;
};

export default MainMenu;