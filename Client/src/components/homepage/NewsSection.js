// src/components/homepage/NewsSection.js
import React from 'react';
import { Button } from 'primereact/button';
import NewsCard from '../common/NewsCard';

const NewsSection = () => {
    // News data
    const news = [
        {
            title: 'مؤتمر المحاسبة السنوي 2025',
            date: '١٥ يونيو ٢٠٢٥',
            content: 'يسعدنا دعوتكم لحضور مؤتمر المحاسبة السنوي الذي سيقام في مركز المؤتمرات...',
        },
        {
            title: 'دورة تدريبية: المعايير المحاسبية الدولية',
            date: '١ يوليو ٢٠٢٥',
            content: 'تبدأ الدورة التدريبية الخاصة بالمعايير المحاسبية الدولية الشهر القادم...',
        },
        {
            title: 'افتتاح فرع جديد للجمعية',
            date: '١٠ مايو ٢٠٢٥',
            content: 'يسرنا الإعلان عن افتتاح فرع جديد للجمعية في المنطقة الشرقية...',
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">أحدث الأخبار</h2>
                    <Button label="جميع الأخبار" icon="pi pi-arrow-left" className="p-button-text" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <NewsCard
                            key={index}
                            title={item.title}
                            date={item.date}
                            content={item.content}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;