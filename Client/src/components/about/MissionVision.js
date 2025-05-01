// src/components/about/MissionVision.js
import React from 'react';
import { Card } from 'primereact/card';

const MissionVision = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">رسالتنا ورؤيتنا</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        نسعى لتحقيق التميز المهني من خلال رؤية واضحة وأهداف محددة
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Mission Card */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-center mb-4">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-flag text-blue-600 text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">رسالتنا</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            تطوير مهنة المحاسبة في اليمن من خلال تقديم برامج تدريبية عالية الجودة،
                            ونشر الوعي المهني، وتمكين المحاسبين من تطبيق أفضل الممارسات المحاسبية
                            وفقاً للمعايير الدولية.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            نعمل على تعزيز مكانة المحاسب ودوره في تنمية الاقتصاد الوطني، وبناء شراكات
                            فعالة مع المؤسسات المهنية المحلية والدولية.
                        </p>
                    </Card>

                    {/* Vision Card */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-center mb-4">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-eye text-blue-600 text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">رؤيتنا</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            أن تكون جمعية المحاسبين القانونيين المرجع الأول لمهنة المحاسبة في اليمن، وأن
                            نكون روّاداً في تطوير الممارسات المحاسبية وتأهيل كوادر محاسبية متميزة قادرة على
                            المنافسة إقليمياً ودولياً.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            نسعى لتحقيق بيئة مهنية داعمة للإبداع والابتكار، تساهم في تعزيز الشفافية والنزاهة
                            في القطاعين العام والخاص، وترفع من جودة التقارير المالية في المؤسسات اليمنية.
                        </p>
                    </Card>
                </div>

                {/* Values Section */}
                <div className="mt-16">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-semibold mb-4">قيمنا</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'المهنية', icon: 'pi pi-briefcase', description: 'الالتزام بأعلى معايير الأداء المهني والتميز في تقديم الخدمات' },
                            { title: 'النزاهة', icon: 'pi pi-shield', description: 'العمل بشفافية وأمانة في جميع التعاملات، وتعزيز الثقة المتبادلة' },
                            { title: 'الابتكار', icon: 'pi pi-palette', description: 'تبني أفكار جديدة وتطوير حلول إبداعية لمواجهة التحديات المهنية' },
                            { title: 'التعاون', icon: 'pi pi-users', description: 'بناء شراكات فعالة وتعزيز العمل المشترك لتحقيق الأهداف المشتركة' }
                        ].map((value, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className={`${value.icon} text-blue-600`}></i>
                                </div>
                                <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionVision;