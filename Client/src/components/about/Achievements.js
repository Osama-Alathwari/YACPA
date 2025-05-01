// src/components/about/Achievements.js
import React from 'react';
import { Card } from 'primereact/card';

const Achievements = () => {
    // Achievements data
    const achievements = [
        {
            title: 'العضوية في الاتحاد الدولي للمحاسبين',
            description: 'حصلت الجمعية على العضوية الكاملة في الاتحاد الدولي للمحاسبين (IFAC)، مما يعزز مكانتها الدولية ويتيح لأعضائها الاستفادة من موارد الاتحاد.',
            icon: 'pi pi-globe',
            year: '2023'
        },
        {
            title: 'تدريب أكثر من 5000 محاسب',
            description: 'نجحت الجمعية في تقديم برامج تدريبية متخصصة لأكثر من 5000 محاسب في مختلف المجالات المحاسبية والتدقيق والضرائب والحوكمة.',
            icon: 'pi pi-users',
            year: '2022'
        },
        {
            title: 'ترجمة معايير التقارير المالية الدولية',
            description: 'أكملت الجمعية ترجمة معايير التقارير المالية الدولية (IFRS) إلى اللغة العربية وتوفيرها للمحاسبين والمهتمين في اليمن.',
            icon: 'pi pi-book',
            year: '2021'
        },
        {
            title: 'جائزة التميز المؤسسي',
            description: 'حصلت الجمعية على جائزة التميز المؤسسي من اتحاد المحاسبين العرب تقديراً لجهودها في تطوير مهنة المحاسبة في اليمن.',
            icon: 'pi pi-trophy',
            year: '2020'
        },
        {
            title: 'إطلاق برنامج الشهادة المهنية المعتمدة',
            description: 'أطلقت الجمعية برنامج الشهادة المهنية المعتمدة للمحاسبين بالتعاون مع جهات دولية، وتخرج منه أكثر من 500 محاسب مؤهل.',
            icon: 'pi pi-id-card',
            year: '2015'
        },
        {
            title: 'تأسيس مركز التدريب المتخصص',
            description: 'تأسيس مركز متخصص للتدريب المحاسبي مجهز بأحدث التقنيات التعليمية والوسائل التدريبية الحديثة.',
            icon: 'pi pi-desktop',
            year: '2012'
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">إنجازاتنا</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        نفخر بما حققناه من إنجازات على مدار السنوات الماضية في مجال تطوير مهنة المحاسبة
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0 ml-3">
                                        <i className={`${achievement.icon} text-xl`}></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{achievement.title}</h3>
                                        <span className="text-sm text-gray-500">{achievement.year}</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 flex-grow">{achievement.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Additional Achievements Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { value: '+5000', label: 'محاسب تم تدريبهم', icon: 'pi pi-users' },
                        { value: '25', label: 'دورة تدريبية سنوياً', icon: 'pi pi-calendar' },
                        { value: '15', label: 'شراكة دولية', icon: 'pi pi-globe' },
                        { value: '8', label: 'جوائز تميز', icon: 'pi pi-trophy' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className={`${stat.icon} text-blue-600`}></i>
                            </div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                            <div className="text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;