// src/components/subscriptions/SubscriptionRenewal.js
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Avatar } from 'primereact/avatar';
import { Panel } from 'primereact/panel';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useLanguage } from '../../contexts/LanguageContext';
import apiService from '../../services/apiService';

const SubscriptionRenewal = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const { id } = useParams(); // Get member ID from URL if provided
    const toast = useRef(null);
    const [membersData, setMembersData] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        memberId: '',
        memberName: '',
        subscriptionPeriod: 1, // Default 1 year
        paymentDate: new Date(),
        paymentMethod: null,
        referenceNumber: '',
        amount: 150, // Default renewal amount per year
        totalAmount: 150,
        notes: '',
        attachment: null
    });

    // Selected member state
    const [selectedMember, setSelectedMember] = useState(null);
    const [filteredMembers, setFilteredMembers] = useState([]);

    // UI state
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);


    // Handle URL parameter for direct member renewal
    useEffect(() => {
        if (id) {
            // Find member by ID and auto-select
            const member = membersData.find(m => m.id === id);
            if (member) {
                handleMemberSelect(member);
                toast.current?.show({
                    severity: 'info',
                    summary: 'تم تحديد العضو',
                    detail: `تم تحديد العضو ${member.name} للتجديد`,
                    life: 3000
                });
            }
        }
        loadMembersForRenewal();
    }, [id]);
    const paymentMethods = [
        { label: t('common.cash'), value: 'cash' },
        { label: t('common.bankTransfer'), value: 'bank_transfer' },
    ];

    // Subscription period options
    const subscriptionPeriods = [
        { label: '1 ' + t('common.year'), value: 1 },
        { label: '2 ' + t('common.years'), value: 2 },
        { label: '3 ' + t('common.years'), value: 3 },
        { label: '5 ' + t('common.years'), value: 5 }
    ];

    const loadMembersForRenewal = async () => {
        try {
            setLoading(true);
            const response = await apiService.getMembersForRenewal();
            if (response.success) {
                setMembersData(response.data);
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'خطأ',
                detail: 'فشل في تحميل بيانات الأعضاء',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle member search
    const searchMember = (event) => {
        let _filteredMembers;

        if (!event.query.trim().length) {
            _filteredMembers = [...membersData];
        } else {
            _filteredMembers = membersData.filter((member) => {
                return member.name.toLowerCase().includes(event.query.toLowerCase()) ||
                    member.id.toString().includes(event.query) ||
                    (member.business && member.business.toLowerCase().includes(event.query.toLowerCase()));
            });
        }

        setFilteredMembers(_filteredMembers);
    };

    // Member autocomplete template
    const memberItemTemplate = (member) => {
        const daysUntilExpiry = member.subscriptionEnd ?
            Math.ceil((new Date(member.subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
        const statusSeverity = daysUntilExpiry <= 30 ? 'danger' :
            daysUntilExpiry <= 60 ? 'warning' : 'success';

        return (
            <div className="member-search-item flex items-center gap-3">
                <Avatar
                    image={member.profileImage ? `${process.env.REACT_APP_API_BASE_URL}/${member.profileImage}` : null}
                    icon={!member.profileImage ? "pi pi-user" : null}
                    className="member-avatar"
                    size="normal"
                />
                <div className="member-info flex-1">
                    <div className="member-name">{member.name}</div>
                    <div className="member-details text-gray-600">
                        {member.business && <span>المنشأة: {member.business}</span>}
                    </div>
                    <div className="member-subscription flex items-center gap-2">
                        <Tag
                            value={member.status === 'active' ? 'نشط' :
                                member.status === 'expired' ? 'منتهي' : 'غير نشط'}
                            severity={statusSeverity}
                            rounded
                        />
                        {member.subscriptionEnd && (
                            <span className="text-xs text-gray-500">
                                ينتهي: {new Date(member.subscriptionEnd).toLocaleDateString('ar-SA')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prevData => {
            const newData = { ...prevData, [field]: value };

            // Calculate total amount when subscription period changes
            if (field === 'subscriptionPeriod') {
                newData.totalAmount = newData.amount * value;
            }

            return newData;
        });
    };

    // Handle member selection
    const handleMemberSelect = (member) => {
        setSelectedMember(member);
        setFormData(prev => ({
            ...prev,
            memberId: member.id,
            memberName: member.name
        }));

        toast.current?.show({
            severity: 'info',
            summary: 'تم تحديد العضو',
            detail: `تم تحديد العضو ${member.name} للتجديد`,
            life: 3000
        });
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.files[0];
        setFormData(prevData => ({
            ...prevData,
            attachment: file
        }));

        toast.current?.show({
            severity: 'success',
            summary: t('common.fileUploaded'),
            detail: file.name,
            life: 3000
        });
    };

    // Form validation
    const validateForm = () => {
        return selectedMember &&
            formData.paymentDate &&
            formData.paymentMethod &&
            formData.referenceNumber.trim() !== '' &&
            formData.totalAmount > 0;
    };

    // Calculate new subscription end date
    const calculateNewEndDate = () => {
        if (!selectedMember) return '';

        const currentEnd = new Date(selectedMember.subscriptionEnd);
        const newEnd = new Date(currentEnd);
        newEnd.setFullYear(currentEnd.getFullYear() + formData.subscriptionPeriod);

        return newEnd.toISOString().split('T')[0];
    };

    // Handle form submission
    const handleSubmit = async () => {
        setSubmitted(true);

        // Validation
        if (!selectedMember || !formData.subscriptionPeriod || !formData.paymentMethod || !formData.amount) {
            toast.current?.show({
                severity: 'warn',
                summary: 'بيانات ناقصة',
                detail: 'يرجى ملء جميع الحقول المطلوبة',
                life: 3000
            });
            return;
        }

        try {
            setLoading(true);

            const renewalData = {
                memberId: selectedMember.id,
                subscriptionPeriod: formData.subscriptionPeriod,
                paymentMethod: formData.paymentMethod,
                amount: formData.totalAmount,
                referenceNumber: formData.referenceNumber,
                referenceDate: formData.paymentDate,
                notes: formData.notes
            };

            const response = await apiService.renewSubscription(renewalData);

            if (response.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'نجح التجديد',
                    detail: response.message,
                    life: 5000
                });

                // Reset form
                setSelectedMember(null);
                setFormData({
                    memberId: '',
                    memberName: '',
                    subscriptionPeriod: 1,
                    paymentDate: new Date(),
                    paymentMethod: null,
                    referenceNumber: '',
                    amount: 150,
                    totalAmount: 150,
                    notes: '',
                    attachment: null
                });
                setSubmitted(false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل في تجديد الاشتراك';
            toast.current?.show({
                severity: 'error',
                summary: 'خطأ في التجديد',
                detail: errorMessage,
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    // Confirm renewal
    const confirmRenewal = () => {
        confirmDialog({
            message: `هل أنت متأكد من تجديد اشتراك ${selectedMember.name} لمدة ${formData.subscriptionPeriod} ${formData.subscriptionPeriod === 1 ? 'سنة' : 'سنوات'} بمبلغ $${formData.totalAmount}؟`,
            header: 'تأكيد التجديد',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'تأكيد',
            rejectLabel: 'إلغاء',
            acceptClassName: 'p-button-success',
            accept: processRenewal,
            reject: () => {
                setShowConfirmation(false);
            }
        });
    };

    // Process renewal
    const processRenewal = async () => {
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            toast.current?.show({
                severity: 'success',
                summary: t('dashboard.subscriptions.renewalSuccess'),
                detail: `تم تجديد اشتراك ${selectedMember.name} بنجاح. الاشتراك الجديد ينتهي في ${calculateNewEndDate()}`,
                life: 5000
            });

            // Reset form
            setFormData({
                memberId: '',
                memberName: '',
                subscriptionPeriod: 1,
                paymentDate: new Date(),
                paymentMethod: null,
                referenceNumber: '',
                amount: 150,
                totalAmount: 150,
                notes: '',
                attachment: null
            });
            setSelectedMember(null);
            setSubmitted(false);
            setShowConfirmation(false);

        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('common.error'),
                detail: 'حدث خطأ أثناء تجديد الاشتراك',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            memberId: '',
            memberName: '',
            subscriptionPeriod: 1,
            paymentDate: new Date(),
            paymentMethod: null,
            referenceNumber: '',
            amount: 150,
            totalAmount: 150,
            notes: '',
            attachment: null
        });
        setSelectedMember(null);
        setSubmitted(false);
    };

    return (
        <div className="subscription-renewal-screen" dir={isRtl ? 'rtl' : 'ltr'}>
            <Toast ref={toast} position="top-center" />
            <ConfirmDialog />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t('dashboard.subscriptions.renew')}</h1>
                        <p className="text-gray-600 mt-1">
                            تجديد اشتراك عضو موجود في الجمعية
                        </p>
                    </div>
                    <Button
                        icon="pi pi-arrow-left"
                        onClick={() => window.history.back()}
                        className="p-button-text"
                        label={t('common.back')}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    {/* Member Selection */}
                    <Card className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">البحث عن العضو</h3>

                        <div className="p-field mb-4">
                            <label className="block font-medium mb-2">
                                البحث عن العضو *
                            </label>
                            <AutoComplete
                                value={selectedMember}
                                suggestions={filteredMembers}
                                completeMethod={searchMember}
                                field="name"
                                itemTemplate={memberItemTemplate}
                                placeholder="ابحث باسم العضو أو رقمه أو اسم المنشأة"
                                onSelect={(e) => handleMemberSelect(e.value)}
                                className={`w-full ${submitted && !selectedMember ? 'p-invalid' : ''}`}
                                dropdown
                                emptyMessage="لا توجد نتائج"
                            />
                            {submitted && !selectedMember && (
                                <small className="p-error">يرجى اختيار عضو</small>
                            )}
                        </div>

                        {/* Selected Member Details */}
                        {selectedMember && (
                            <Panel header="تفاصيل العضو المختار" className="mt-4">
                                <div className="flex items-start gap-4">
                                    <Avatar
                                        icon="pi pi-user"
                                        size="xlarge"
                                        className="bg-blue-100 text-blue-600"
                                        image={selectedMember.profileImage}
                                    />
                                    <div className="flex-grow">
                                        <h4 className="text-lg font-semibold">{selectedMember.name}</h4>
                                        <p className="text-gray-600 mb-2">{selectedMember.business}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">رقم العضو:</span> {selectedMember.id}
                                            </div>
                                            <div>
                                                <span className="font-medium">البريد الإلكتروني:</span> {selectedMember.email}
                                            </div>
                                            <div>
                                                <span className="font-medium">الهاتف:</span> {selectedMember.phone}
                                            </div>
                                            <div>
                                                <span className="font-medium">انتهاء الاشتراك الحالي:</span>
                                                <span className="text-red-600 font-medium mr-2">{selectedMember.subscriptionEnd}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        )}
                    </Card>

                    {/* Subscription & Payment Details */}
                    <Card className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">تفاصيل التجديد والدفع</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Subscription Period */}
                            <div className="p-field">
                                <label className="block font-medium mb-2">
                                    مدة التجديد *
                                </label>
                                <Dropdown
                                    value={formData.subscriptionPeriod}
                                    options={subscriptionPeriods}
                                    onChange={(e) => handleInputChange('subscriptionPeriod', e.value)}
                                    className="w-full"
                                    placeholder="اختر مدة التجديد"
                                />
                            </div>

                            {/* Payment Date */}
                            <div className="p-field">
                                <label className="block font-medium mb-2">
                                    تاريخ الدفع *
                                </label>
                                <Calendar
                                    value={formData.paymentDate}
                                    onChange={(e) => handleInputChange('paymentDate', e.value)}
                                    className={`w-full ${submitted && !formData.paymentDate ? 'p-invalid' : ''}`}
                                    dateFormat="yy-mm-dd"
                                    placeholder={t('common.selectDate')}
                                    showIcon
                                />
                                {submitted && !formData.paymentDate && (
                                    <small className="p-error">{t('common.required')}</small>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="p-field">
                                <label className="block font-medium mb-2">
                                    طريقة الدفع *
                                </label>
                                <Dropdown
                                    value={formData.paymentMethod}
                                    options={paymentMethods}
                                    onChange={(e) => handleInputChange('paymentMethod', e.value)}
                                    className={`w-full ${submitted && !formData.paymentMethod ? 'p-invalid' : ''}`}
                                    placeholder="اختر طريقة الدفع"
                                />
                                {submitted && !formData.paymentMethod && (
                                    <small className="p-error">{t('common.required')}</small>
                                )}
                            </div>

                            {/* Reference Number */}
                            <div className="p-field">
                                <label className="block font-medium mb-2">
                                    رقم المرجع/الإيصال *
                                </label>
                                <InputText
                                    value={formData.referenceNumber}
                                    onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                                    className={`w-full ${submitted && !formData.referenceNumber ? 'p-invalid' : ''}`}
                                    placeholder="REF123456"
                                />
                                {submitted && !formData.referenceNumber && (
                                    <small className="p-error">{t('common.required')}</small>
                                )}
                            </div>

                            {/* Amount per Year */}
                            <div className="p-field">
                                <label className="block font-medium mb-2">
                                    رسوم الاشتراك السنوي
                                </label>
                                <InputNumber
                                    value={formData.amount}
                                    onValueChange={(e) => handleInputChange('amount', e.value)}
                                    mode="currency"
                                    currency="USD"
                                    locale="en-US"
                                    className="w-full"
                                />
                            </div>

                            {/* Total Amount */}
                            <div className="p-field">
                                <label className="block font-medium mb-2">
                                    المبلغ الإجمالي
                                </label>
                                <InputNumber
                                    value={formData.totalAmount}
                                    mode="currency"
                                    currency="USD"
                                    locale="en-US"
                                    className="w-full"
                                    disabled
                                />
                            </div>

                            {/* Notes */}
                            <div className="p-field md:col-span-2">
                                <label className="block font-medium mb-2">
                                    ملاحظات
                                </label>
                                <InputTextarea
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    className="w-full"
                                    rows={3}
                                    placeholder="ملاحظات إضافية حول التجديد..."
                                />
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="mt-6">
                            <label className="block font-medium mb-2">
                                مرفق إيصال الدفع
                            </label>
                            <FileUpload
                                mode="basic"
                                accept="image/*,.pdf"
                                maxFileSize={3000000}
                                chooseLabel={formData.attachment ? 'تغيير الملف' : 'اختيار ملف'}
                                onSelect={handleFileUpload}
                                className="w-full"
                            />
                            {formData.attachment && (
                                <div className="mt-2 text-sm text-green-600">
                                    <i className="pi pi-check mr-2"></i>
                                    {formData.attachment.name}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                        <div className="flex justify-between items-center">
                            <Button
                                label="إعادة تعيين"
                                icon="pi pi-refresh"
                                onClick={resetForm}
                                className="p-button-outlined"
                                disabled={loading}
                            />

                            <div className="flex gap-2">
                                <Button
                                    label="معاينة"
                                    icon="pi pi-eye"
                                    onClick={() => setShowConfirmation(true)}
                                    className="p-button-info"
                                    disabled={!validateForm() || loading}
                                />
                                <Button
                                    label="تجديد الاشتراك"
                                    icon="pi pi-check"
                                    onClick={handleSubmit}
                                    className="p-button-success"
                                    loading={loading}
                                    disabled={!validateForm()}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Summary Panel */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <h3 className="text-lg font-semibold mb-4">ملخص التجديد</h3>

                        {selectedMember ? (
                            <>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">العضو:</span>
                                        <span className="font-medium">{selectedMember.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">رقم العضو:</span>
                                        <span className="font-medium">{selectedMember.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">الاشتراك الحالي ينتهي:</span>
                                        <span className="text-red-600 font-medium">{selectedMember.subscriptionEnd}</span>
                                    </div>
                                    {formData.subscriptionPeriod && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">الاشتراك الجديد ينتهي:</span>
                                            <span className="text-green-600 font-medium">{calculateNewEndDate()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">مدة التجديد:</span>
                                        <span className="font-medium">{formData.subscriptionPeriod} {formData.subscriptionPeriod === 1 ? 'سنة' : 'سنوات'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">رسوم سنوية:</span>
                                        <span className="font-medium">${formData.amount}</span>
                                    </div>
                                    <Divider />
                                    <div className="flex justify-between text-lg">
                                        <span className="font-semibold">المبلغ الإجمالي:</span>
                                        <span className="font-bold text-blue-600">${formData.totalAmount}</span>
                                    </div>
                                </div>

                                {formData.paymentMethod && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <div className="text-sm">
                                            <div className="font-medium text-blue-800 mb-1">تفاصيل الدفع:</div>
                                            <div className="text-blue-700">
                                                طريقة الدفع: {paymentMethods.find(p => p.value === formData.paymentMethod)?.label}
                                            </div>
                                            {formData.referenceNumber && (
                                                <div className="text-blue-700">
                                                    رقم المرجع: {formData.referenceNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <i className="pi pi-search text-3xl mb-3 block"></i>
                                <p>يرجى البحث عن عضو لبدء عملية التجديد</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmation && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">تأكيد تجديد الاشتراك</h3>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                                <span>العضو:</span>
                                <span className="font-medium">{selectedMember.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>رقم العضو:</span>
                                <span className="font-medium">{selectedMember.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>مدة التجديد:</span>
                                <span className="font-medium">{formData.subscriptionPeriod} {formData.subscriptionPeriod === 1 ? 'سنة' : 'سنوات'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>المبلغ الإجمالي:</span>
                                <span className="font-bold text-green-600">${formData.totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>الاشتراك الجديد ينتهي:</span>
                                <span className="font-medium text-green-600">{calculateNewEndDate()}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                label="إلغاء"
                                icon="pi pi-times"
                                onClick={() => setShowConfirmation(false)}
                                className="p-button-outlined"
                                disabled={loading}
                            />
                            <Button
                                label="تأكيد التجديد"
                                icon="pi pi-check"
                                onClick={confirmRenewal}
                                className="p-button-success"
                                loading={loading}
                            />
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SubscriptionRenewal;