// src/components/about/Timeline.js
import React from 'react';
import { Timeline as PrimeTimeline } from 'primereact/timeline';
import { Card } from 'primereact/card';

const Timeline = () => {
    // Timeline events data
    const events = [
        {
            year: '2000',
            title: 'تأسيس الجمعية',
            description: 'تأسست جمعية المحاسبين القانونيين اليمنيين كمؤسسة مهنية غير ربحية بموجب القرار الوزاري رقم 50 لسنة 2000.',
            icon: 'pi pi-flag',
            color: '#4F46E5'
        },
        {
            year: '2003',
            title: 'إطلاق المقر الرئيسي',
            description: 'افتتاح المقر الرئيسي للجمعية في مدينة عدن وبدء البرامج التدريبية الأولى.',
            icon: 'pi pi-home',
            color: '#3B82F6'
        },
        {
            year: '2007',
            title: 'الاعتراف الدولي',
            description: 'حصلت الجمعية على اعتراف الاتحاد الدولي للمحاسبين (IFAC) كعضو منتسب.',
            icon: 'pi pi-globe',
            color: '#2563EB'
        },
        {
            year: '2010',
            title: 'افتتاح الفروع',
            description: 'توسعت الجمعية بافتتاح فروع في صنعاء والمكلا لتوسيع نطاق خدماتها.',
            icon: 'pi pi-sitemap',
            color: '#1D4ED8'
        },
        {
            year: '2015',
            title: 'إطلاق برنامج الشهادة المهنية',
            description: 'تم إطلاق برنامج الشهادة المهنية المعتمدة للمحاسبين بالتعاون مع مؤسسات دولية.',
            icon: 'pi pi-id-card',
            color: '#1E40AF'
        },
        {
            year: '2020',
            title: 'التحول الرقمي',
            description: 'إطلاق المنصة الرقمية للجمعية وبرامج التدريب عن بعد لمواكبة المتغيرات العالمية.',
            icon: 'pi pi-desktop',
            color: '#1E3A8A'
        },
        {
            year: '2023',
            title: 'العضوية الكاملة في IFAC',
            description: 'حصلت الجمعية على العضوية الكاملة في الاتحاد الدولي للمحاسبين، تتويجاً لجهودها في تطوير المهنة.',
            icon: 'pi pi-star',
            color: '#172554'
        }
    ];

    // Custom template for timeline items
    const customizedMarker = (item) => {
        return (
            <span className="flex w-10 h-10 rounded-full border-2 border-white items-center justify-center" style={{ backgroundColor: item.color }}>
                <i className={`${item.icon} text-white text-lg`}></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row items-start">
                    <div className="sm:w-24 mb-4 sm:mb-0">
                        <span className="text-2xl font-bold text-blue-600">{item.year}</span>
                    </div>
                    <div className="sm:flex-1">
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">مسيرتنا عبر السنين</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        تعرف على أبرز المحطات في تاريخ جمعية المحاسبين القانونيين
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <PrimeTimeline
                        value={events}
                        align="alternate"
                        className="customized-timeline"
                        marker={customizedMarker}
                        content={customizedContent}
                    />
                </div>
            </div>
        </section>
    );
};

export default Timeline;