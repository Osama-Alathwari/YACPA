// src/components/common/NewsCard.js
import React from 'react';
import { Card } from 'primereact/card';

const NewsCard = ({ title, date, content }) => {
    return (
        <Card className="bg-[#dbeafe] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div>
                <div className="text-sm text-gray-500 mb-2">{date}</div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-600 mb-4">{content}</p>
                <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    قراءة المزيد
                    <i className="pi pi-arrow-left"></i>
                </a>
            </div>
        </Card>
    );
};

export default NewsCard;