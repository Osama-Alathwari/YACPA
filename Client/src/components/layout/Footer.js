// src/components/layout/Footer.js
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">جمعية المحاسبين القانونيين</h3>
                        <p className="mb-4">نحن ملتزمون بتطوير مهنة المحاسبة وتوفير الدعم المهني لأعضائنا.</p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="pi pi-facebook text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="pi pi-twitter text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="pi pi-linkedin text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="pi pi-instagram text-xl"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">روابط سريعة</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="no-underline hover:text-white">الرئيسية</a></li>
                            <li><a href="#" className="no-underline hover:text-white">من نحن</a></li>
                            <li><a href="#" className="no-underline hover:text-white">العضوية</a></li>
                            <li><a href="#" className="no-underline hover:text-white">الفعاليات</a></li>
                            <li><a href="#" className="no-underline hover:text-white">الموارد</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">اتصل بنا</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <i className="pi pi-map-marker mt-1"></i>
                                <span>عدن، الجمهورية اليمنية، كريتر مقابل فور شباب</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="pi pi-phone "></i>
                                <span>777 777 777 967+</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="pi pi-envelope"></i>
                                <span>info@accountants-association.org</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">النشرة الإخبارية</h3>
                        <p className="mb-4">اشترك في نشرتنا الإخبارية للحصول على آخر الأخبار والفعاليات</p>
                        <div className="flex">
                            <InputText placeholder="بريدك الإلكتروني" className="p-inputtext-sm w-full rounded-l-none" />
                            <Button icon="pi pi-send" className="p-button-sm p-button-secondary rounded-r-none" />
                        </div>
                    </div>
                </div>

                <Divider className="my-6 border-gray-700" />

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm mb-4 md:mb-0">
                        © 2025 جمعية المحاسبين القانونيين. جميع الحقوق محفوظة.
                    </div>
                    <div className="flex gap-4 text-sm">
                        <a href="#" className="no-underline hover:text-white">سياسة الخصوصية</a>
                        <span>|</span>
                        <a href="#" className="no-underline hover:text-white">الشروط والأحكام</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;