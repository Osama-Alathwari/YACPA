// src/components/about/Partners.js
import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

const Partners = () => {
    // Local partners data
    const localPartners = [
        {
            name: 'وزارة المالية',
            logo: null, // Replace with actual logo in production
            description: 'شراكة استراتيجية في مجال تطوير المعايير المحاسبية الحكومية وتدريب الكوادر المالية.'
        },
        {
            name: 'الجهاز المركزي للرقابة والمحاسبة',
            logo: null,
            description: 'تعاون في مجال تطوير مهارات مراجعي الحسابات وتطبيق معايير المراجعة الدولية.'
        },
        {
            name: 'جامعة عدن',
            logo: null,
            description: 'شراكة أكاديمية لتطوير المناهج التعليمية وتنفيذ برامج التدريب المشتركة.'
        },
        {
            name: 'جمعية المراجعين والمحاسبين اليمنيين',
            logo: null,
            description: 'تعاون مهني لتنظيم الفعاليات والمؤتمرات المشتركة وتبادل الخبرات.'
        }
    ];

    // International partners data
    const internationalPartners = [
        {
            name: 'الاتحاد الدولي للمحاسبين (IFAC)',
            logo: null,
            description: 'عضوية كاملة في الاتحاد الدولي للمحاسبين، المنظمة العالمية الرائدة لمهنة المحاسبة.'
        },
        {
            name: 'المجمع العربي للمحاسبين القانونيين',
            logo: null,
            description: 'شراكة في مجال التدريب وتبادل الخبرات وتنظيم الفعاليات المهنية المشتركة.'
        },
        {
            name: 'جمعية المحاسبين القانونيين المعتمدين (ACCA)',
            logo: null,
            description: 'شراكة في برامج التأهيل المهني وتبادل الموارد التعليمية والتدريبية.'
        },
        {
            name: 'معهد المحاسبين القانونيين في إنجلترا وويلز (ICAEW)',
            logo: null,
            description: 'اتفاقية تعاون لتقديم برامج مهنية مشتركة وتبادل الخبرات التدريبية.'
        }
    ];

    // Partner card renderer
    const renderPartnerCard = (partner, index) => (
        <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center mb-4">
                {partner.logo ? (
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-16 object-contain mb-4"
                    />
                ) : (
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <i className="pi pi-building text-2xl text-gray-400"></i>
                    </div>
                )}
                <h3 className="text-xl font-semibold text-center">{partner.name}</h3>
            </div>
            <Divider />
            <p className="text-gray-600 text-center">{partner.description}</p>
        </Card>
    );

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">شركاؤنا وعضوياتنا</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        نعمل مع شبكة من الشركاء المحليين والدوليين لتطوير مهنة المحاسبة وتبادل الخبرات
                    </p>
                </div>

                {/* Local Partners */}
                <div className="mb-16">
                    <h3 className="text-2xl font-semibold text-center mb-8">شركاؤنا المحليون</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {localPartners.map(renderPartnerCard)}
                    </div>
                </div>

                {/* International Partners */}
                <div>
                    <h3 className="text-2xl font-semibold text-center mb-8">شركاؤنا الدوليون والعضويات</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {internationalPartners.map(renderPartnerCard)}
                    </div>
                </div>

                {/* Call to action */}
                <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">هل ترغب في التعاون معنا؟</h3>
                    <p className="text-gray-600 mb-6">
                        نرحب بالتعاون مع المؤسسات المهنية والتعليمية والحكومية والخاصة لتطوير مهنة المحاسبة
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors">
                        تواصل معنا
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Partners;