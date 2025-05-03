// src/components/dashboard/StatCard.js
import React from 'react';
import { Card } from 'primereact/card';
import { useLanguage } from '../../contexts/LanguageContext';

const StatCard = ({ title, value, prefix = '', icon, change, period, color = 'blue' }) => {
    const { isRtl } = useLanguage();

    // Map color to background and text colors
    const colorMap = {
        blue: {
            bg: 'bg-blue-100',
            text: 'text-blue-600',
            iconBg: 'bg-blue-200',
            trend: change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        },
        green: {
            bg: 'bg-green-100',
            text: 'text-green-600',
            iconBg: 'bg-green-200',
            trend: change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        },
        yellow: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-600',
            iconBg: 'bg-yellow-200',
            trend: change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        },
        purple: {
            bg: 'bg-purple-100',
            text: 'text-purple-600',
            iconBg: 'bg-purple-200',
            trend: change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        },
        red: {
            bg: 'bg-red-100',
            text: 'text-red-600',
            iconBg: 'bg-red-200',
            trend: change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        }
    };

    const colors = colorMap[color];

    return (
        <Card className={`${colors.bg} border-none shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
                    <div className="text-2xl font-bold mb-2">
                        {prefix}{value}
                    </div>
                    <div className="flex items-center text-xs">
                        <span className={colors.trend}>{change}</span>
                        <span className="text-gray-500 mx-1">{period}</span>
                    </div>
                </div>

                <div className={`${colors.iconBg} ${colors.text} p-3 rounded-full`}>
                    <i className={`${icon} text-xl`}></i>
                </div>
            </div>
        </Card>
    );
};

export default StatCard;