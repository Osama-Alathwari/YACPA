// src/components/homepage/HeroSection.js
import React from 'react';
import { Button } from 'primereact/button';
import logoPlaceholder from '../../assets/logo-placeholder.png';

const HeroSection = () => {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">مرحباً بكم في جمعية المحاسبين القانونيين</h1>
                        <p className="text-lg mb-6 text-blue-100">منصة تجمع المحاسبين المحترفين وتدعم التطوير المهني المستمر</p>
                        <div className="flex flex-wrap gap-3">
                            <Button label="انضم إلينا الآن" className="p-button-lg" />
                            <Button label="تعرف علينا أكثر" className="p-button-outlined p-button-lg p-button-secondary" />
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src={logoPlaceholder}
                            alt="صورة توضيحية"
                            className="rounded-lg shadow-lg max-w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;