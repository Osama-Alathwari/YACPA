// src/components/common/TestimonialCard.js
import React from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';

const TestimonialCard = ({ name, role, content, image }) => {
    return (
        <Card className="border border-gray-200 shadow-sm h-full mx-2 my-3 bg-white">
            <div className="flex flex-col items-center text-center">
                <Avatar
                    icon="pi pi-user"
                    size="large"
                    className="mb-3 bg-blue-100 text-blue-600"
                    style={{ width: '4rem', height: '4rem' }}
                    image={image}
                />
                <h3 className="text-lg font-semibold mb-1">{name}</h3>
                <p className="text-sm text-gray-600 mb-4">{role}</p>
                <i className="pi pi-quote-right text-2xl text-blue-300 mb-2"></i>
                <p className="italic text-gray-700">{content}</p>
            </div>
        </Card>
    );
};

export default TestimonialCard;