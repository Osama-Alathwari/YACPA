// src/components/layout/Footer.js
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">{t('app.name')}</h3>
                        <p className="mb-4">
                            {t('about.mission.description')}
                        </p>
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
                        <h3 className="text-white text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-2">
                            <li><a onClick={() => navigate('/')} className="no-underline cursor-pointer hover:text-white">{t('navigation.home')}</a></li>
                            <li><a onClick={() => navigate('/about')} className="no-underline cursor-pointer hover:text-white">{t('navigation.about')}</a></li>
                            <li><a onClick={() => navigate('')} className="no-underline cursor-pointer hover:text-white">{t('navigation.membership')}</a></li>
                            <li><a onClick={() => navigate('')} className="no-underline cursor-pointer hover:text-white">{t('navigation.events')}</a></li>
                            <li><a onClick={() => navigate('')} className="no-underline cursor-pointer hover:text-white">{t('navigation.resources')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <i className="pi pi-map-marker mt-1"></i>
                                <span>{t('contact.info.address.value')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="pi pi-phone"></i>
                                <span>{t('contact.info.phone.value')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="pi pi-envelope"></i>
                                <span>{t('contact.info.email.value')}</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">{t('footer.newsletter.title')}</h3>
                        <p className="mb-4">{t('footer.newsletter.description')}</p>
                        <div className="flex">
                            <InputText placeholder={t('footer.newsletter.placeholder')} className="p-inputtext-sm w-full rounded-l-none" />
                            <Button icon="pi pi-send" className="p-button-sm p-button-secondary rounded-r-none" />
                        </div>
                    </div>
                </div>

                <Divider className="my-6 border-gray-700" />

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm mb-4 md:mb-0">
                        {t('footer.copyright')}
                    </div>
                    <div className="flex gap-4 text-sm">
                        <a href="#" className="no-underline hover:text-white">{t('footer.privacyPolicy')}</a>
                        <span>|</span>
                        <a href="#" className="no-underline hover:text-white">{t('footer.termsConditions')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;