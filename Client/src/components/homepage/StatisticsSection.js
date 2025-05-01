// src/components/homepage/StatisticsSection.js
import React from 'react';

const StatisticsSection = () => {
    // Statistics data
    const statistics = [
        { value: '+5000', label: 'عضو نشط' },
        { value: '25', label: 'سنة خبرة' },
        { value: '120', label: 'فعالية سنوية' },
        { value: '15', label: 'فرع حول المملكة' },
    ];

    return (
        <section className="py-16 bg-blue-900 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {statistics.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{stat.value}</div>
                            <div className="text-blue-200">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatisticsSection;