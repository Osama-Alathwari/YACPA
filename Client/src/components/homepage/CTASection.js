// src/components/homepage/CTASection.js
import React from 'react';
import { Button } from 'primereact/button';

const CTASection = () => {
    return (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">انضم إلينا اليوم</h2>
                <p className="text-xl mb-8 max-w-3xl mx-auto">كن جزءاً من مجتمع المحاسبين المحترفين واستفد من عضويتك في تطوير مسيرتك المهنية</p>
                <Button label="طلب العضوية" icon="pi pi-user-plus" className="p-button-lg p-button-outlined" />
            </div>
        </section>
    );
};

export default CTASection;