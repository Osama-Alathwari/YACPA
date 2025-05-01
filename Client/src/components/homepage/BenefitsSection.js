// src/components/homepage/BenefitsSection.js
import React from 'react';
import BenefitCard from '../common/BenefitCard';

const BenefitsSection = () => {
    // Benefits data
    const benefits = [
        {
            title: 'فرص النمو المهني',
            description: 'دورات تدريبية وورش عمل تساعدك على تطوير مهاراتك المهنية',
            icon: 'pi pi-chart-line',
        },
        {
            title: 'التواصل المهني',
            description: 'تواصل مع محاسبين محترفين وتبادل الخبرات والمعرفة',
            icon: 'pi pi-users',
        },
        {
            title: 'الوصول إلى الموارد',
            description: 'مكتبة موارد متخصصة ومحتوى حصري للأعضاء',
            icon: 'pi pi-book',
        },
        {
            title: 'اعتماد مهني',
            description: 'الحصول على اعتمادات مهنية معترف بها في مجال المحاسبة',
            icon: 'pi pi-verified',
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">مميزات العضوية</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">استفد من مجموعة متنوعة من المزايا الحصرية التي تدعم مسيرتك المهنية وتطور مهاراتك في مجال المحاسبة</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <BenefitCard
                            key={index}
                            title={benefit.title}
                            description={benefit.description}
                            icon={benefit.icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;