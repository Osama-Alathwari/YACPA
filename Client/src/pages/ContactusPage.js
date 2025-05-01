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

const ContactUsPage = () => {
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
        { label: 'استفسار عام', value: 'general' },
        { label: 'العضوية والاشتراكات', value: 'membership' },
        { label: 'الفعاليات والدورات', value: 'events' },
        { label: 'الشكاوى والاقتراحات', value: 'complaints' },
        { label: 'أخرى', value: 'other' }
    ];

    // FAQ data
    const faqItems = [
        {
            header: 'كيف يمكنني الانضمام إلى الجمعية؟',
            content: 'يمكنك الانضمام إلى الجمعية من خلال تعبئة نموذج العضوية في صفحة "العضوية" وتقديم المستندات المطلوبة مع دفع رسوم الانتساب والاشتراك السنوي.'
        },
        {
            header: 'ما هي رسوم العضوية؟',
            content: 'تتكون رسوم العضوية من رسوم انتساب لمرة واحدة بقيمة XXX ريال، بالإضافة إلى اشتراك سنوي بقيمة XXX ريال. عند الانضمام لأول مرة، يتم دفع رسوم الانتساب بالإضافة إلى اشتراك لمدة سنتين.'
        },
        {
            header: 'كيف يمكنني تجديد العضوية؟',
            content: 'يمكنك تجديد العضوية من خلال تسجيل الدخول إلى حسابك في الموقع والانتقال إلى صفحة "تجديد العضوية" أو من خلال زيارة مقر الجمعية.'
        },
        {
            header: 'ما هي المستندات المطلوبة للعضوية؟',
            content: 'المستندات المطلوبة تشمل: صورة شخصية، صورة من الهوية، صورة من المؤهل العلمي معتمدة، صورة من الترخيص المهني إن وجد، وصورة من التوقيع والختم المعتمد.'
        },
        {
            header: 'هل يمكنني حضور فعاليات الجمعية دون أن أكون عضواً؟',
            content: 'نعم، بعض الفعاليات متاحة للعموم، بينما تكون بعض الفعاليات والدورات التدريبية حصرية للأعضاء أو بأسعار مخفضة لهم.'
        }
    ];

    // Branch locations data
    const branches = [
        {
            name: 'المقر الرئيسي - عدن',
            address: 'عدن، الجمهورية اليمنية، كريتر مقابل فور شباب',
            phone: '777 777 777 967+',
            hours: 'الأحد - الخميس: 8:00 ص - 2:00 م'
        },
        {
            name: 'فرع صنعاء',
            address: 'صنعاء، شارع الزبيري، بجوار وزارة المالية',
            phone: '777 888 777 967+',
            hours: 'الأحد - الخميس: 8:00 ص - 2:00 م'
        },
        {
            name: 'فرع المكلا',
            address: 'المكلا، حضرموت، شارع الرياض، مبنى السعيد',
            phone: '777 999 777 967+',
            hours: 'الأحد - الخميس: 8:00 ص - 2:00 م'
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
                summary: 'تم الإرسال بنجاح',
                detail: 'سنقوم بالرد على استفسارك في أقرب وقت ممكن',
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
                summary: 'خطأ في النموذج',
                detail: 'يرجى تعبئة جميع الحقول المطلوبة',
                life: 3000
            });
        }
    };

    return (
        <div className="font-sans bg-gray-50 min-h-screen" dir="rtl">
            {/* Toast for notifications */}
            <Toast ref={toast} position="top-center" />

            {/* Header */}
            <MainHeader />

            {/* Page Title Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">اتصل بنا</h1>
                    <p className="text-blue-100">نحن هنا للإجابة على جميع استفساراتك ومساعدتك في كل ما تحتاج</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-md">
                                <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
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
                                                <label htmlFor="name">الاسم الكامل *</label>
                                            </span>
                                            {submitted && !formData.name && <small className="p-error">الاسم مطلوب</small>}
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
                                                <label htmlFor="email">البريد الإلكتروني *</label>
                                            </span>
                                            {submitted && !formData.email && <small className="p-error">البريد الإلكتروني مطلوب</small>}
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
                                                <label htmlFor="phone">رقم الهاتف</label>
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
                                                <label htmlFor="subject">موضوع الاستفسار *</label>
                                            </span>
                                            {submitted && !formData.subject && <small className="p-error">موضوع الاستفسار مطلوب</small>}
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
                                            <label htmlFor="message">الرسالة *</label>
                                        </span>
                                        {submitted && !formData.message && <small className="p-error">الرسالة مطلوبة</small>}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            label="إرسال الرسالة"
                                            icon="pi pi-send"
                                            className="p-button-primary"
                                        />
                                    </div>
                                </form>
                            </Card>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <Card className="shadow-md mb-6">
                                <h2 className="text-2xl font-bold mb-4">معلومات الاتصال</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4 space-x-reverse">
                                        <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0">
                                            <i className="pi pi-map-marker text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">العنوان</h3>
                                            <p className="text-gray-600">عدن، الجمهورية اليمنية، كريتر مقابل فور شباب</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 space-x-reverse">
                                        <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0">
                                            <i className="pi pi-phone text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">الهاتف</h3>
                                            <p className="text-gray-600">777 777 777 967+</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 space-x-reverse">
                                        <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0">
                                            <i className="pi pi-envelope text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">البريد الإلكتروني</h3>
                                            <p className="text-gray-600">info@accountants-association.org</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 space-x-reverse">
                                        <div className="bg-blue-100 text-blue-600 rounded-full p-3 flex-shrink-0">
                                            <i className="pi pi-clock text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">ساعات العمل</h3>
                                            <p className="text-gray-600">الأحد - الخميس: 8:00 ص - 2:00 م</p>
                                            <p className="text-gray-600">الجمعة - السبت: مغلق</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold text-lg mb-2">تابعنا على</h3>
                                    <div className="flex space-x-4 space-x-reverse">
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
                        <h2 className="text-2xl font-bold">موقعنا</h2>
                        <p className="text-gray-600">يمكنك زيارتنا في المقر الرئيسي أو أحد فروعنا</p>
                    </div>

                    <div className="border-4 border-white shadow-lg rounded-lg overflow-hidden h-96">
                        {/* This is a placeholder for a real map. In a production environment, you would integrate with Google Maps or similar service */}
                        <div className="bg-gray-200 h-full flex items-center justify-center">
                            <div className="text-center">
                                <i className="pi pi-map text-5xl text-gray-400 mb-4"></i>
                                <p className="text-gray-600">خريطة الموقع ستظهر هنا</p>
                                <p className="text-sm text-gray-500">يتطلب ذلك تكامل مع خدمة خرائط مثل Google Maps</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Branches Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold">فروعنا</h2>
                        <p className="text-gray-600">يمكنك زيارة أقرب فرع إليك للحصول على خدماتنا</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {branches.map((branch, index) => (
                            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold mb-3">{branch.name}</h3>
                                <div className="space-y-2 text-gray-600">
                                    <div className="flex items-start space-x-2 space-x-reverse">
                                        <i className="pi pi-map-marker mt-1 text-blue-600"></i>
                                        <span>{branch.address}</span>
                                    </div>
                                    <div className="flex items-start space-x-2 space-x-reverse">
                                        <i className="pi pi-phone mt-1 text-blue-600"></i>
                                        <span>{branch.phone}</span>
                                    </div>
                                    <div className="flex items-start space-x-2 space-x-reverse">
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
                        <h2 className="text-2xl font-bold">الأسئلة الشائعة</h2>
                        <p className="text-gray-600">إجابات على الاستفسارات الشائعة حول العضوية والخدمات</p>
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