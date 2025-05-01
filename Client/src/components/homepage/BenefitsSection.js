// src/components/homepage/BenefitsSection.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import BenefitCard from '../common/BenefitCard';

const BenefitsSection = () => {
    const { t } = useTranslation();

    // Benefits data
    const benefits = [
        {
            title: t('home.benefits.professionalGrowth.title'),
            description: t('home.benefits.professionalGrowth.description'),
            icon: 'pi pi-chart-line',
        },
        {
            title: t('home.benefits.networking.title'),
            description: t('home.benefits.networking.description'),
            icon: 'pi pi-users',
        },
        {
            title: t('home.benefits.resources.title'),
            description: t('home.benefits.resources.description'),
            icon: 'pi pi-book',
        },
        {
            title: t('home.benefits.certification.title'),
            description: t('home.benefits.certification.description'),
            icon: 'pi pi-verified',
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{t('home.benefits.title')}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">{t('home.benefits.subtitle')}</p>
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