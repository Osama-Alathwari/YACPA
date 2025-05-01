// src/components/about/HeroSection.js
import React from 'react';

const HeroSection = () => {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">من نحن</h1>
                    <div className="h-1 w-24 bg-white mb-6"></div>
                    <p className="text-xl text-blue-100 max-w-3xl">
                        جمعية المحاسبين القانونيين هي مؤسسة مهنية رائدة تأسست عام 2000 بهدف تطوير مهنة المحاسبة،
                        وتعزيز مكانة المحاسبين المهنيين، ورفع مستوى الممارسات المحاسبية في اليمن.
                    </p>
                    <p className="text-xl text-blue-100 max-w-3xl mt-4">
                        نعمل على بناء كوادر محاسبية متميزة قادرة على مواكبة التطورات العالمية في المجال المحاسبي
                        وتطبيق أعلى معايير الجودة المهنية.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;