// src/components/homepage/NewsSection.js
import React from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import NewsCard from '../common/NewsCard';

const NewsSection = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    // News data - could be fetched from an API in a real implementation
    const news = [
        {
            title: isRtl ? 'مؤتمر المحاسبة السنوي 2025' : 'Annual Accounting Conference 2025',
            date: isRtl ? '١٥ يونيو ٢٠٢٥' : 'June 15, 2025',
            content: isRtl
                ? 'يسعدنا دعوتكم لحضور مؤتمر المحاسبة السنوي الذي سيقام في مركز المؤتمرات...'
                : 'We are pleased to invite you to attend the annual accounting conference to be held at the Conference Center...',
        },
        {
            title: isRtl ? 'دورة تدريبية: المعايير المحاسبية الدولية' : 'Training Course: International Accounting Standards',
            date: isRtl ? '١ يوليو ٢٠٢٥' : 'July 1, 2025',
            content: isRtl
                ? 'تبدأ الدورة التدريبية الخاصة بالمعايير المحاسبية الدولية الشهر القادم...'
                : 'The training course on international accounting standards begins next month...',
        },
        {
            title: isRtl ? 'افتتاح فرع جديد للجمعية' : 'Opening of a New Association Branch',
            date: isRtl ? '١٠ مايو ٢٠٢٥' : 'May 10, 2025',
            content: isRtl
                ? 'يسرنا الإعلان عن افتتاح فرع جديد للجمعية في المنطقة الشرقية...'
                : 'We are pleased to announce the opening of a new branch of the association in the Eastern Region...',
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">{t('home.news.title')}</h2>
                    <Button
                        label={t('home.news.viewAll')}
                        icon={isRtl ? "pi pi-arrow-left" : "pi pi-arrow-right"}
                        iconPos={isRtl ? "left" : "right"}
                        className="p-button-text"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <NewsCard
                            key={index}
                            title={item.title}
                            date={item.date}
                            content={item.content}
                            readMoreText={t('home.news.readMore')}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;