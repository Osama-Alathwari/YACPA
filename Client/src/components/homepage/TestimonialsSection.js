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
    ];

    // Render testimonial template
    const testimonialTemplate = (item) => {
        return (
            <TestimonialCard
                name={item.name}
                role={item.role}
                content={item.content}
                image={item.image}
            />
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
                                breakpoint: '1024px',
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
                        circular
                        autoplayInterval={3000}
                        className="testimonial-carousel"
                    >
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-item">
                                {testimonialTemplate(testimonial)}
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
export default TestimonialsSection;