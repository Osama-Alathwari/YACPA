// src/components/common/BenefitCard.js
import React from 'react';

const BenefitCard = ({ title, description, icon }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 text-blue-600 rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                <i className={`${icon} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
            <p className="text-gray-600 text-center">{description}</p>
        </div>
    );
};

export default BenefitCard;