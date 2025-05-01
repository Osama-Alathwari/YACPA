// src/components/layout/Header.js
import React from 'react';
import { Button } from 'primereact/button';
// import { Menubar } from 'primereact/menubar';
import MainMenu from './MainMenu';
import logoPlaceholder from '../../assets/logo-placeholder.png';

const MainHeader = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-3 px-4">
                <div className="flex items-center">
                    <img src={logoPlaceholder} alt="شعار الجمعية" className="h-14 ml-2" />
                    <h1 className="text-xl font-bold">جمعية المحاسبين القانونيين</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        label="تسجيل الدخول"
                        icon="pi pi-sign-in"
                        className="p-button-outlined p-button-sm"

                    />
                    <div className="flex items-center gap-2">
                        <span className="font-medium">العربية</span>
                        <span>|</span>
                        <a href="#" className="text-gray-500 hover:text-blue-600">English</a>
                    </div>
                </div>
            </div>
            <div className="border-b border-gray-200">
                <div className="container mx-auto ">
                    <MainMenu />
                </div>
            </div>
        </header>
    );
};

export default MainHeader;