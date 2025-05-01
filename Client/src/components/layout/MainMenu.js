// src/components/layout/MainMenu.js
import React from 'react';
import { Menubar } from 'primereact/menubar';

const MainMenu = () => {
    // Menubar items
    const menuItems = [
        {
            label: 'الرئيسية',
            icon: 'pi pi-fw pi-home',
        },
        {
            label: 'من نحن',
            icon: 'pi pi-fw pi-users',
        },
        {
            label: 'العضوية',
            icon: 'pi pi-fw pi-id-card',
        },
        {
            label: 'الفعاليات',
            icon: 'pi pi-fw pi-calendar',
        },
        {
            label: 'الموارد',
            icon: 'pi pi-fw pi-book',
        },
        {
            label: 'اتصل بنا',
            icon: 'pi pi-fw pi-envelope',
        },
    ];

    return <Menubar model={menuItems} className="border-none" />;
};

export default MainMenu;