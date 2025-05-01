// src/components/layout/MainMenu.js
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
    const navigate = useNavigate();

    // Menubar items with navigation commands
    const menuItems = [
        {
            label: 'الرئيسية',
            icon: 'pi pi-fw pi-home',
            command: () => navigate('/')
        },
        {
            label: 'من نحن',
            icon: 'pi pi-fw pi-users',
            command: () => navigate('/about') // This will need to be created
        },
        {
            label: 'العضوية',
            icon: 'pi pi-fw pi-id-card',
            command: () => navigate('/membership') // This will need to be created
        },
        {
            label: 'الفعاليات',
            icon: 'pi pi-fw pi-calendar',
            command: () => navigate('/events') // This will need to be created
        },
        {
            label: 'الموارد',
            icon: 'pi pi-fw pi-book',
            command: () => navigate('/resources') // This will need to be created
        },
        {
            label: 'اتصل بنا',
            icon: 'pi pi-fw pi-envelope',
            command: () => navigate('/contact')
        },
    ];

    return <Menubar model={menuItems} className="border-none" />;
};

export default MainMenu;