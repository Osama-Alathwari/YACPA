// src/components/common/NewsCard.js
import React from 'react';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';

const NewsCard = ({ title, date, content, readMoreText }) => {
    const { i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    // If readMoreText is not provided, use default text from translation
    const readMore = readMoreText || (isRtl ? 'قراءة المزيد' : 'Read More');

    return (
        <Card className="bg-[#dbeafe] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div>
                <div className="text-sm text-gray-500 mb-2">{date}</div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-600 mb-4">{content}</p>
                <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    {readMore}
                    <i className={`pi ${isRtl ? 'pi-arrow-left' : 'pi-arrow-right'}`}></i>
                </a>
            </div>
        </Card>
    );
};

export default NewsCard;