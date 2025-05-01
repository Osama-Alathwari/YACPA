// src/components/homepage/TestimonialsSection.js
import React from 'react';
import { Carousel } from 'primereact/carousel';
import TestimonialCard from '../common/TestimonialCard';

const TestimonialsSection = () => {
    // Testimonials data
    const testimonials = [
        {
            name: 'أحمد محمد',
            role: 'محاسب قانوني',
            content: 'ساعدتني الجمعية في تطوير مهاراتي المهنية والحصول على فرص عمل مميزة.',
            image: null,
        },
        {
            name: 'سارة أحمد',
            role: 'مدير مالي',
            content: 'الدورات التدريبية التي توفرها الجمعية كانت نقطة تحول في مسيرتي المهنية.',
            image: null,
        },
        {
            name: 'محمد علي',
            role: 'مراجع حسابات',
            content: 'أفضل استثمار قمت به في حياتي المهنية هو الانضمام إلى هذه الجمعية.',
            image: null,
        },
        {
            name: 'محمد علي',
            role: 'مراجع حسابات',
            content: 'أفضل استثمار قمت به في حياتي المهنية هو الانضمام إلى هذه الجمعية.',
            image: null,
        },
        {
            name: 'محمد علي',
            role: 'مراجع حسابات',
            content: 'أفضل استثمار قمت به في حياتي المهنية هو الانضمام إلى هذه الجمعية.',
            image: null,
        },
        {
            name: 'محمد علي',
            role: 'مراجع حسابات',
            content: 'أفضل استثمار قمت به في حياتي المهنية هو الانضمام إلى هذه الجمعية.',
            image: null,
        },
    ];

    // Render testimonial template - this needs to be a function that returns JSX
    const testimonialTemplate = (item) => {
        return (
            <div className="p-2">
                <TestimonialCard
                    name={item.name}
                    role={item.role}
                    content={item.content}
                    image={item.image}
                />
            </div>
        );
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">شهادات الأعضاء</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">اطلع على تجارب أعضائنا مع الجمعية وكيف ساهمت في تطوير مسيرتهم المهنية</p>
                </div>

                <div className="mt-8">
                    <Carousel
                        value={testimonials}
                        numVisible={3}
                        numScroll={1}
                        responsiveOptions={[
                            {
                                breakpoint: '1020px',
                                numVisible: 3,
                                numScroll: 1
                            },
                            {
                                breakpoint: '768px',
                                numVisible: 2,
                                numScroll: 1
                            },
                            {
                                breakpoint: '560px',
                                numVisible: 1,
                                numScroll: 1
                            }
                        ]}

                        autoplayInterval={500}
                        itemTemplate={testimonialTemplate}
                        className="testimonial-carousel"
                    />
                </div>
            </div>
        </section>
    );
}
export default TestimonialsSection;