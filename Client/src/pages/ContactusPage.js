// src/pages/ContactUsPage.js
import React, { useState } from 'react';
import { MainHeader, Footer } from '../components';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const ContactUsPage = () => {
    // Get translation and language context
    const { t } = useTranslation();
    const { isRtl } = useLanguage();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: null,
        message: ''
    });

    // Toast reference for showing success/error messages
    const toast = React.useRef(null);

    // Validation state
    const [submitted, setSubmitted] = useState(false);

    // Inquiry subject options
    const subjectOptions = [
        { label: t('contact.form.subjects.general'), value: 'general' },
        { label: t('contact.form.subjects.membership'), value: 'membership' },
        { label: t('contact.form.subjects.events'), value: 'events' },
        { label: t('contact.form.subjects.complaints'), value: 'complaints' },
        { label: t('contact.form.subjects.other'), value: 'other' }
    ];

    // FAQ data
    const faqItems = [
        {
            header: t('contact.faq.join.question'),
            content: t('contact.faq.join.answer')
        },
        {
            header: t('contact.faq.fees.question'),
            content: t('contact.faq.fees.answer')
        },
        {
            header: t('contact.faq.renewal.question'),
            content: t('contact.faq.renewal.answer')
        },
        {
            header: t('contact.faq.documents.question'),
            content: t('contact.faq.documents.answer')
        },
        {
            header: t('contact.faq.events.question'),
            content: t('contact.faq.events.answer')
        }
    ];

    // Branch locations data
    const branches = [
        {
            name: t('contact.branches.main.name'),
            address: t('contact.branches.main.address'),
            phone: t('contact.branches.main.phone'),
            hours: t('contact.branches.main.hours')
        },
        {
            name: t('contact.branches.sanaa.name'),
            address: t('contact.branches.sanaa.address'),
            phone: t('contact.branches.sanaa.phone'),
            hours: t('contact.branches.sanaa.hours')
        },
        {
            name: t('contact.branches.mukalla.name'),
            address: t('contact.branches.mukalla.address'),
            phone: t('contact.branches.mukalla.phone'),
            hours: t('contact.branches.mukalla.hours')
        }
    ];

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle dropdown changes
    const handleDropdownChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            subject: e.value
        }));
    };

    // Form validation
    const validateForm = () => {
        return formData.name.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.subject !== null &&
            formData.message.trim() !== '';
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (validateForm()) {
            // Here you would typically send the form data to your backend
            console.log('Form submitted:', formData);

            // Show success message
            toast.current.show({
                severity: 'success',
                summary: t('contact.form.success.summary'),
                detail: t('contact.form.success.detail'),
                life: 3000
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: null,
                message: ''
            });
            setSubmitted(false);
        } else {
            // Show error message
            toast.current.show({
                severity: 'error',
                summary: t('contact.form.error.summary'),
                detail: t('contact.form.error.detail'),
                life: 3000
            });
        }
    };

    return (
        <div className="font-sans bg-gray-50 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Toast for notifications */}
            <Toast ref={toast} position="top-center" />

            {/* Header */}
            <MainHeader />

            {/* Page Title Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">{t('contact.title')}</h1>
                    <p className="text-blue-100">{t('contact.subtitle')}</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-md">
                                <h2 className="text-2xl font-bold mb-6">{t('contact.form.title')}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-field">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className={`w-full ${submitted && !formData.name ? 'p-invalid' : ''}`}
                                                />
                                                <label htmlFor="name">{t('contact.form.name')} *</label>
                                            </span>
                                            {submitted && !formData.name && <small className="p-error">{t('common.required')}</small>}
                                        </div>

                                        <div className="p-field">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={`w-full ${submitted && !formData.email ? 'p-invalid' : ''}`}
                                                />
                                                <label htmlFor="email">{t('contact.form.email')} *</label>
                                            </span>
                                            {submitted && !formData.email && <small className="p-error">{t('common.required')}</small>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-field">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full"
                                                />
                                                <label htmlFor="phone">{t('contact.form.phone')}</label>
                                            </span>
                                        </div>

                                        <div className="p-field">
                                            <span className="p-float-label">
                                                <Dropdown
                                                    id="subject"
                                                    value={formData.subject}
                                                    options={subjectOptions}
                                                    onChange={handleDropdownChange}
                                                    className={`w-full ${submitted && !formData.subject ? 'p-invalid' : ''}`}
                                                />
                                                <label htmlFor="subject">{t('contact.form.subject')} *</label>
                                            </span>
                                            {submitted && !formData.subject && <small className="p-error">{t('common.required')}</small>}
                                        </div>
                                    </div>

                                    <div className="p-field">
                                        <span className="p-float-label">
                                            <InputTextarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={5}
                                                autoResize
                                                className={`w-full ${submitted && !formData.message ? 'p-invalid' : ''}`}
                                            />
                                            <label htmlFor="message">{t('contact.form.message')} *</label>
                                        </span>
                                        {submitted && !formData.message && <small className="p-error">{t('common.required')}</small>}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            label={t('contact.form.submit')}
                                            icon="pi pi-send"
                                            className="p-button-primary"
                                            iconPos={isRtl ? "right" : "left"}
                                        />
                                    </div>
                                </form>
                            </Card>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <Card className="shadow-md mb-6">
                                <h2 className="text-2xl font-bold mb-4">{t('contact.info.title')}</h2>
                                <div className="space-y-4">
                                    <div className={`flex items-start ${isRtl ? 'space-x-reverse' : ''} space-x-4`}>
                                        <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0">
                                            <i className="pi pi-map-marker text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{t('contact.info.address.title')}</h3>
                                            <p className="text-gray-600">{t('contact.info.address.value')}</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-start ${isRtl ? 'space-x-reverse' : ''} space-x-4`}>
                                        <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0">
                                            <i className="pi pi-phone text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{t('contact.info.phone.title')}</h3>
                                            <p className="text-gray-600">{t('contact.info.phone.value')}</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-start ${isRtl ? 'space-x-reverse' : ''} space-x-4`}>
                                        <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0">
                                            <i className="pi pi-envelope text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{t('contact.info.email.title')}</h3>
                                            <p className="text-gray-600">{t('contact.info.email.value')}</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-start ${isRtl ? 'space-x-reverse' : ''} space-x-4`}>
                                        <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0">
                                            <i className="pi pi-clock text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{t('contact.info.hours.title')}</h3>
                                            <p className="text-gray-600">{t('contact.info.hours.weekdays')}</p>
                                            <p className="text-gray-600">{t('contact.info.hours.weekend')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold text-lg mb-2">{t('contact.info.social.title')}</h3>
                                    <div className={`flex ${isRtl ? 'space-x-reverse' : ''} space-x-4`}>
                                        <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                            <i className="pi pi-facebook"></i>
                                        </a>
                                        <a href="#" className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition-colors">
                                            <i className="pi pi-twitter"></i>
                                        </a>
                                        <a href="#" className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800 transition-colors">
                                            <i className="pi pi-linkedin"></i>
                                        </a>
                                        <a href="#" className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors">
                                            <i className="pi pi-instagram"></i>
                                        </a>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-8 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold">{t('contact.map.title')}</h2>
                        <p className="text-gray-600">{t('contact.map.subtitle')}</p>
                    </div>

                    <div className="border-4 border-white shadow-lg rounded-lg overflow-hidden h-96">
                        {/* This is a placeholder for a real map. In a production environment, you would integrate with Google Maps or similar service */}
                        <div className="bg-gray-200 h-full flex items-center justify-center">
                            <div className="text-center">
                                <i className="pi pi-map text-5xl text-gray-400 mb-4"></i>
                                <p className="text-gray-600">{t('contact.map.placeholder')}</p>
                                <p className="text-sm text-gray-500">{t('contact.map.integration')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Branches Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold">{t('contact.branches.title')}</h2>
                        <p className="text-gray-600">{t('contact.branches.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {branches.map((branch, index) => (
                            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold mb-3">{branch.name}</h3>
                                <div className="space-y-2 text-gray-600">
                                    <div className={`flex items-start ${isRtl ? 'space-x-reverse' : ''} space-x-2`}>
                                        <i className="pi pi-map-marker mt-1 text-blue-600"></i>
                                        <span>{branch.address}</span>
                                    </div>
                                    <div className={`flex items-start ${isRtl ? 'space-x-reverse' : ''} space-x-2`}>
                                        <i className="pi pi-phone mt-1 text-blue-600"></i>
                                        <span>{branch.phone}</span>
                                    </div>
                                    <div className={`flex items-start ${isRtl ? 'space-x-reverse' : ''} space-x-2`}>
                                        <i className="pi pi-clock mt-1 text-blue-600"></i>
                                        <span>{branch.hours}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold">{t('contact.faq.title')}</h2>
                        <p className="text-gray-600">{t('contact.faq.subtitle')}</p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Accordion multiple>
                            {faqItems.map((item, index) => (
                                <AccordionTab key={index} header={item.header}>
                                    <p className="text-gray-600">{item.content}</p>
                                </AccordionTab>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ContactUsPage;