// src/components/about/OrganizationalStructure.js
import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

const OrganizationalStructure = () => {
    // Board members data
    const boardMembers = [
        {
            name: 'د. أحمد الهاشمي',
            position: 'رئيس مجلس الإدارة',
            bio: 'دكتوراه في المحاسبة، خبرة 25 عاماً في مجال المحاسبة والمراجعة، وأستاذ جامعي.',
            image: null // In production, replace with actual image path
        },
        {
            name: 'أ. محمد علي',
            position: 'نائب الرئيس',
            bio: 'ماجستير محاسبة، زمالة المحاسبين القانونيين الأمريكية، خبرة 15 عاماً في القطاع المصرفي.',
            image: null
        },
        {
            name: 'أ. سمية الحبشي',
            position: 'أمين الصندوق',
            bio: 'بكالوريوس محاسبة، زمالة المحاسبين البريطانية، خبرة 18 عاماً في المحاسبة والتدقيق.',
            image: null
        },
        {
            name: 'أ. عبدالله سالم',
            position: 'المدير التنفيذي',
            bio: 'ماجستير إدارة أعمال، خبرة 12 عاماً في إدارة المؤسسات المهنية والتطوير المؤسسي.',
            image: null
        }
    ];

    // Committees data
    const committees = [
        {
            name: 'لجنة التدريب والتطوير المهني',
            description: 'تختص بتطوير البرامج التدريبية وتنفيذها، وتقييم احتياجات الأعضاء التدريبية.',
            icon: 'pi pi-book'
        },
        {
            name: 'لجنة المعايير المهنية',
            description: 'تعمل على ترجمة وتطبيق المعايير المحاسبية الدولية وتقديم الإرشادات المهنية.',
            icon: 'pi pi-check-square'
        },
        {
            name: 'لجنة العضوية والانتساب',
            description: 'تدير عمليات قبول الأعضاء الجدد ومتابعة الالتزامات المترتبة على العضوية.',
            icon: 'pi pi-users'
        },
        {
            name: 'لجنة الأنشطة والفعاليات',
            description: 'تنظم المؤتمرات والندوات والفعاليات المهنية التي تساهم في نشر الوعي المحاسبي.',
            icon: 'pi pi-calendar'
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">الهيكل التنظيمي</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        يتكون الهيكل التنظيمي للجمعية من مجلس إدارة منتخب ولجان متخصصة تعمل بشكل تكاملي
                    </p>
                </div>

                {/* Board of Directors */}
                <div className="mb-16">
                    <h3 className="text-2xl font-semibold text-center mb-8">مجلس الإدارة</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {boardMembers.map((member, index) => (
                            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <i className="pi pi-user text-4xl text-gray-400"></i>
                                        )}
                                    </div>
                                    <h4 className="text-xl font-semibold mb-1">{member.name}</h4>
                                    <p className="text-blue-600 mb-4">{member.position}</p>
                                    <Divider />
                                    <p className="text-gray-600 mt-4">{member.bio}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Committees */}
                <div>
                    <h3 className="text-2xl font-semibold text-center mb-8">اللجان المتخصصة</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {committees.map((committee, index) => (
                            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0 ml-4">
                                        <i className={`${committee.icon} text-xl`}></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">{committee.name}</h4>
                                        <p className="text-gray-600">{committee.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Organizational Chart */}
                <div className="mt-16">
                    <h3 className="text-2xl font-semibold text-center mb-8">الهيكل التنظيمي</h3>

                    <div className="border-4 border-white shadow-lg rounded-lg overflow-hidden h-96 bg-gray-100">
                        {/* This is a placeholder for the organizational chart */}
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <i className="pi pi-sitemap text-5xl text-gray-400 mb-4"></i>
                                <p className="text-gray-600">مخطط الهيكل التنظيمي</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    في النسخة النهائية، يمكن إضافة مخطط تنظيمي تفاعلي أو صورة للهيكل التنظيمي الكامل
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrganizationalStructure;