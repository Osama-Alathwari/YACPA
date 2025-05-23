import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Avatar } from 'primereact/avatar';
import { Panel } from 'primereact/panel';
import { Checkbox } from 'primereact/checkbox';

const AddMemberScreen = () => {
    const { t } = useTranslation();
    const toast = useRef(null);
    
    // Form progress tracking
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    
    // Form state
    const [formData, setFormData] = useState({
        // Personal Information
        fullNameArabic: '',
        fullNameEnglish: '',
        surname: '',
        idType: null,
        idNumber: '',
        qualification: null,
        profileImage: null,
        idImage: null,
        
        // Business Information
        businessName: '',
        businessType: null,
        headOfficeAddress: '',
        localBranchAddress: '',
        licenseNumber: '',
        licenseIssueDate: null,
        licenseImage: null,
        
        // Contact Information
        phone1: '',
        phone2: '',
        mobile: '',
        whatsapp: '',
        email: '',
        
        // Attachments
        degreeImage: null,
        signatureImage: null,
        
        // Payment Information
        registrationFee: 200,
        subscriptionFee: 150,
        totalAmount: 500, // registration + 2 years subscription
        paymentMethod: null,
        referenceNumber: '',
        referenceDate: null,
        paymentReceipt: null,
        notes: ''
    });
    
    // Validation state
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Dropdown options
    const idTypes = [
        { label: t('member.personalInfo.nationalId'), value: 'national_id' },
        { label: t('member.personalInfo.passport'), value: 'passport' },
        { label: t('member.personalInfo.residencyCard'), value: 'residency_card' }
    ];
    
    const qualifications = [
        { label: t('member.personalInfo.bachelor'), value: 'bachelor' },
        { label: t('member.personalInfo.master'), value: 'master' },
        { label: t('member.personalInfo.doctorate'), value: 'doctorate' },
        { label: t('member.personalInfo.diploma'), value: 'diploma' }
    ];
    
    const businessTypes = [
        { label: t('member.businessInfo.company'), value: 'company' },
        { label: t('member.businessInfo.individual'), value: 'individual' }
    ];
    
    const paymentMethods = [
        { label: t('common.cash'), value: 'cash' },
        { label: t('common.bankTransfer'), value: 'bank_transfer' },
        { label: t('common.check'), value: 'check' }
    ];
    
    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    // Handle file uploads
    const handleFileUpload = (field, file) => {
        setFormData(prev => ({
            ...prev,
            [field]: file
        }));
        
        toast.current?.show({
            severity: 'success',
            summary: t('common.fileUploaded'),
            detail: `${file.name} ${t('common.uploadedSuccessfully')}`,
            life: 3000
        });
    };
    
    // Validation functions
    const validateStep1 = () => {
        return formData.fullNameArabic && formData.fullNameEnglish && 
               formData.idType && formData.idNumber && formData.qualification;
    };
    
    const validateStep2 = () => {
        return formData.businessName && formData.businessType && 
               formData.headOfficeAddress && formData.licenseNumber;
    };
    
    const validateStep3 = () => {
        return formData.phone1 && formData.email;
    };
    
    const validateStep4 = () => {
        return formData.paymentMethod && formData.referenceNumber && formData.referenceDate;
    };
    
    // Navigation between steps
    const nextStep = () => {
        let isValid = false;
        
        switch(currentStep) {
            case 1: isValid = validateStep1(); break;
            case 2: isValid = validateStep2(); break;
            case 3: isValid = validateStep3(); break;
            case 4: isValid = validateStep4(); break;
            default: isValid = true;
        }
        
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        } else {
            setSubmitted(true);
            toast.current?.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('common.fillRequiredFields'),
                life: 3000
            });
        }
    };
    
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };
    
    // Handle form submission
    const handleSubmit = async () => {
        if (!validateStep4()) {
            setSubmitted(true);
            return;
        }
        
        setLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            toast.current?.show({
                severity: 'success',
                summary: t('dashboard.members.addSuccess'),
                detail: t('dashboard.members.memberAddedSuccessfully'),
                life: 5000
            });
            
            // Reset form or redirect
            setFormData({
                fullNameArabic: '',
                fullNameEnglish: '',
                surname: '',
                idType: null,
                idNumber: '',
                qualification: null,
                profileImage: null,
                idImage: null,
                businessName: '',
                businessType: null,
                headOfficeAddress: '',
                localBranchAddress: '',
                licenseNumber: '',
                licenseIssueDate: null,
                licenseImage: null,
                phone1: '',
                phone2: '',
                mobile: '',
                whatsapp: '',
                email: '',
                degreeImage: null,
                signatureImage: null,
                registrationFee: 200,
                subscriptionFee: 150,
                totalAmount: 500,
                paymentMethod: null,
                referenceNumber: '',
                referenceDate: null,
                paymentReceipt: null,
                notes: ''
            });
            setCurrentStep(1);
            setSubmitted(false);
            
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('dashboard.members.addError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };
    
    // Step 1: Personal Information
    const renderStep1 = () => (
        <Card className="mb-4">
            <h3 className="text-xl font-semibold mb-4">{t('member.personalInfo.title')}</h3>
            
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                    {formData.profileImage ? (
                        <Avatar
                            image={URL.createObjectURL(formData.profileImage)}
                            size="xlarge"
                            shape="circle"
                            className="w-24 h-24"
                        />
                    ) : (
                        <Avatar
                            icon="pi pi-user"
                            size="xlarge"
                            shape="circle"
                            className="w-24 h-24 bg-gray-200"
                        />
                    )}
                </div>
                <FileUpload
                    mode="basic"
                    accept="image/*"
                    maxFileSize={1000000}
                    chooseLabel={t('member.personalInfo.uploadProfileImage')}
                    className="p-button-outlined"
                    onSelect={(e) => handleFileUpload('profileImage', e.files[0])}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name in Arabic */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.personalInfo.fullNameArabic')} *
                    </label>
                    <InputText
                        value={formData.fullNameArabic}
                        onChange={(e) => handleInputChange('fullNameArabic', e.target.value)}
                        className={`w-full ${submitted && !formData.fullNameArabic ? 'p-invalid' : ''}`}
                        placeholder="الاسم الثلاثي باللغة العربية"
                    />
                    {submitted && !formData.fullNameArabic && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* Full Name in English */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.personalInfo.fullNameEnglish')} *
                    </label>
                    <InputText
                        value={formData.fullNameEnglish}
                        onChange={(e) => handleInputChange('fullNameEnglish', e.target.value)}
                        className={`w-full ${submitted && !formData.fullNameEnglish ? 'p-invalid' : ''}`}
                        placeholder="Full Name in English"
                    />
                    {submitted && !formData.fullNameEnglish && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* Surname */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.personalInfo.surname')}
                    </label>
                    <InputText
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        className="w-full"
                        placeholder={t('member.personalInfo.surnamePlaceholder')}
                    />
                </div>
                
                {/* ID Type */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.personalInfo.idType')} *
                    </label>
                    <Dropdown
                        value={formData.idType}
                        options={idTypes}
                        onChange={(e) => handleInputChange('idType', e.value)}
                        className={`w-full ${submitted && !formData.idType ? 'p-invalid' : ''}`}
                        placeholder={t('common.selectOption')}
                    />
                    {submitted && !formData.idType && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* ID Number */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.personalInfo.idNumber')} *
                    </label>
                    <InputText
                        value={formData.idNumber}
                        onChange={(e) => handleInputChange('idNumber', e.target.value)}
                        className={`w-full ${submitted && !formData.idNumber ? 'p-invalid' : ''}`}
                        placeholder={t('member.personalInfo.idNumberPlaceholder')}
                    />
                    {submitted && !formData.idNumber && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* Qualification */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.personalInfo.qualification')} *
                    </label>
                    <Dropdown
                        value={formData.qualification}
                        options={qualifications}
                        onChange={(e) => handleInputChange('qualification', e.value)}
                        className={`w-full ${submitted && !formData.qualification ? 'p-invalid' : ''}`}
                        placeholder={t('common.selectOption')}
                    />
                    {submitted && !formData.qualification && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
            </div>
            
            {/* ID Image Upload */}
            <div className="mt-6">
                <label className="block font-medium mb-2">
                    {t('member.personalInfo.idImage')} *
                </label>
                <FileUpload
                    mode="basic"
                    accept="image/*"
                    maxFileSize={2000000}
                    chooseLabel={formData.idImage ? t('common.changeFile') : t('common.chooseFile')}
                    className={`${submitted && !formData.idImage ? 'p-invalid' : ''}`}
                    onSelect={(e) => handleFileUpload('idImage', e.files[0])}
                />
                {formData.idImage && (
                    <div className="mt-2 text-sm text-green-600">
                        <i className="pi pi-check mr-2"></i>
                        {formData.idImage.name}
                    </div>
                )}
                {submitted && !formData.idImage && (
                    <small className="p-error">{t('common.required')}</small>
                )}
            </div>
        </Card>
    );
    
    // Step 2: Business Information
    const renderStep2 = () => (
        <Card className="mb-4">
            <h3 className="text-xl font-semibold mb-4">{t('member.businessInfo.title')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Business Name */}
                <div className="p-field md:col-span-2">
                    <label className="block font-medium mb-2">
                        {t('member.businessInfo.businessName')} *
                    </label>
                    <InputText
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className={`w-full ${submitted && !formData.businessName ? 'p-invalid' : ''}`}
                        placeholder={t('member.businessInfo.businessNamePlaceholder')}
                    />
                    {submitted && !formData.businessName && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* Business Type */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.businessInfo.businessType')} *
                    </label>
                    <Dropdown
                        value={formData.businessType}
                        options={businessTypes}
                        onChange={(e) => handleInputChange('businessType', e.value)}
                        className={`w-full ${submitted && !formData.businessType ? 'p-invalid' : ''}`}
                        placeholder={t('common.selectOption')}
                    />
                    {submitted && !formData.businessType && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* License Number */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.businessInfo.licenseNumber')} *
                    </label>
                    <InputText
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        className={`w-full ${submitted && !formData.licenseNumber ? 'p-invalid' : ''}`}
                        placeholder={t('member.businessInfo.licenseNumberPlaceholder')}
                    />
                    {submitted && !formData.licenseNumber && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* License Issue Date */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.businessInfo.licenseIssueDate')}
                    </label>
                    <Calendar
                        value={formData.licenseIssueDate}
                        onChange={(e) => handleInputChange('licenseIssueDate', e.value)}
                        className="w-full"
                        dateFormat="yy-mm-dd"
                        placeholder={t('common.selectDate')}
                        showIcon
                    />
                </div>
                
                {/* Head Office Address */}
                <div className="p-field md:col-span-2">
                    <label className="block font-medium mb-2">
                        {t('member.businessInfo.headOfficeAddress')} *
                    </label>
                    <InputTextarea
                        value={formData.headOfficeAddress}
                        onChange={(e) => handleInputChange('headOfficeAddress', e.target.value)}
                        className={`w-full ${submitted && !formData.headOfficeAddress ? 'p-invalid' : ''}`}
                        rows={3}
                        placeholder={t('member.businessInfo.headOfficeAddressPlaceholder')}
                    />
                    {submitted && !formData.headOfficeAddress && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* Local Branch Address */}
                <div className="p-field md:col-span-2">
                    <label className="block font-medium mb-2">
                        {t('member.businessInfo.localBranchAddress')}
                    </label>
                    <InputTextarea
                        value={formData.localBranchAddress}
                        onChange={(e) => handleInputChange('localBranchAddress', e.target.value)}
                        className="w-full"
                        rows={3}
                        placeholder={t('member.businessInfo.localBranchAddressPlaceholder')}
                    />
                </div>
            </div>
            
            {/* License Image Upload */}
            <div className="mt-6">
                <label className="block font-medium mb-2">
                    {t('member.attachments.licenseImage')}
                </label>
                <FileUpload
                    mode="basic"
                    accept="image/*,.pdf"
                    maxFileSize={3000000}
                    chooseLabel={formData.licenseImage ? t('common.changeFile') : t('common.chooseFile')}
                    onSelect={(e) => handleFileUpload('licenseImage', e.files[0])}
                />
                {formData.licenseImage && (
                    <div className="mt-2 text-sm text-green-600">
                        <i className="pi pi-check mr-2"></i>
                        {formData.licenseImage.name}
                    </div>
                )}
            </div>
        </Card>
    );
    
    // Step 3: Contact Information & Attachments
    const renderStep3 = () => (
        <>
            <Card className="mb-4">
                <h3 className="text-xl font-semibold mb-4">{t('member.contactInfo.title')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone 1 */}
                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            {t('member.contactInfo.phone1')} *
                        </label>
                        <InputText
                            value={formData.phone1}
                            onChange={(e) => handleInputChange('phone1', e.target.value)}
                            className={`w-full ${submitted && !formData.phone1 ? 'p-invalid' : ''}`}
                            placeholder="+967 777 123 456"
                        />
                        {submitted && !formData.phone1 && (
                            <small className="p-error">{t('common.required')}</small>
                        )}
                    </div>
                    
                    {/* Phone 2 */}
                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            {t('member.contactInfo.phone2')}
                        </label>
                        <InputText
                            value={formData.phone2}
                            onChange={(e) => handleInputChange('phone2', e.target.value)}
                            className="w-full"
                            placeholder="+967 777 123 457"
                        />
                    </div>
                    
                    {/* Mobile */}
                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            {t('member.contactInfo.mobile')}
                        </label>
                        <InputText
                            value={formData.mobile}
                            onChange={(e) => handleInputChange('mobile', e.target.value)}
                            className="w-full"
                            placeholder="+967 733 123 456"
                        />
                    </div>
                    
                    {/* WhatsApp */}
                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            {t('member.contactInfo.whatsapp')}
                        </label>
                        <InputText
                            value={formData.whatsapp}
                            onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                            className="w-full"
                            placeholder="+967 733 123 456"
                        />
                    </div>
                    
                    {/* Email */}
                    <div className="p-field md:col-span-2">
                        <label className="block font-medium mb-2">
                            {t('member.contactInfo.email')} *
                        </label>
                        <InputText
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full ${submitted && !formData.email ? 'p-invalid' : ''}`}
                            placeholder="example@domain.com"
                            type="email"
                        />
                        {submitted && !formData.email && (
                            <small className="p-error">{t('common.required')}</small>
                        )}
                    </div>
                </div>
            </Card>
            
            <Card className="mb-4">
                <h3 className="text-xl font-semibold mb-4">{t('member.attachments.title')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Degree Certificate */}
                    <div>
                        <label className="block font-medium mb-2">
                            {t('member.attachments.degreeImage')}
                        </label>
                        <FileUpload
                            mode="basic"
                            accept="image/*,.pdf"
                            maxFileSize={3000000}
                            chooseLabel={formData.degreeImage ? t('common.changeFile') : t('common.chooseFile')}
                            onSelect={(e) => handleFileUpload('degreeImage', e.files[0])}
                        />
                        {formData.degreeImage && (
                            <div className="mt-2 text-sm text-green-600">
                                <i className="pi pi-check mr-2"></i>
                                {formData.degreeImage.name}
                            </div>
                        )}
                    </div>
                    
                    {/* Signature & Stamp */}
                    <div>
                        <label className="block font-medium mb-2">
                            {t('member.attachments.signatureImage')}
                        </label>
                        <FileUpload
                            mode="basic"
                            accept="image/*,.pdf"
                            maxFileSize={2000000}
                            chooseLabel={formData.signatureImage ? t('common.changeFile') : t('common.chooseFile')}
                            onSelect={(e) => handleFileUpload('signatureImage', e.files[0])}
                        />
                        {formData.signatureImage && (
                            <div className="mt-2 text-sm text-green-600">
                                <i className="pi pi-check mr-2"></i>
                                {formData.signatureImage.name}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </>
    );
    
    // Step 4: Payment Information
    const renderStep4 = () => (
        <Card className="mb-4">
            <h3 className="text-xl font-semibold mb-4">{t('member.payment.title')}</h3>
            
            {/* Fee Breakdown */}
            <Panel header={t('member.payment.feeBreakdown')} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">${formData.registrationFee}</div>
                        <div className="text-sm text-gray-600">{t('member.payment.registrationFee')}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">${formData.subscriptionFee * 2}</div>
                        <div className="text-sm text-gray-600">{t('member.payment.subscriptionFee')} (2 {t('common.years')})</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                        <div className="text-3xl font-bold text-purple-600">${formData.totalAmount}</div>
                        <div className="text-sm text-gray-600">{t('common.total')}</div>
                    </div>
                </div>
            </Panel>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Payment Method */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.payment.paymentMethod')} *
                    </label>
                    <Dropdown
                        value={formData.paymentMethod}
                        options={paymentMethods}
                        onChange={(e) => handleInputChange('paymentMethod', e.value)}
                        className={`w-full ${submitted && !formData.paymentMethod ? 'p-invalid' : ''}`}
                        placeholder={t('common.selectOption')}
                    />
                    {submitted && !formData.paymentMethod && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* Reference Number */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.payment.referenceNumber')} *
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
                
                {/* Reference Date */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.payment.referenceDate')} *
                    </label>
                    <Calendar
                        value={formData.referenceDate}
                        onChange={(e) => handleInputChange('referenceDate', e.value)}
                        className={`w-full ${submitted && !formData.referenceDate ? 'p-invalid' : ''}`}
                        dateFormat="yy-mm-dd"
                        placeholder={t('common.selectDate')}
                        showIcon
                    />
                    {submitted && !formData.referenceDate && (
                        <small className="p-error">{t('common.required')}</small>
                    )}
                </div>
                
                {/* Total Amount (Read-only) */}
                <div className="p-field">
                    <label className="block font-medium mb-2">
                        {t('member.payment.amount')}
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
                        {t('common.notes')}
                    </label>
                    <InputTextarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="w-full"
                        rows={3}
                        placeholder={t('member.payment.notesPlaceholder')}
                    />
                </div>
            </div>
            
            {/* Payment Receipt Upload */}
            <div className="mt-6">
                <label className="block font-medium mb-2">
                    {t('member.payment.receipt')}
                </label>
                <FileUpload
                    mode="basic"
                    accept="image/*,.pdf"
                    maxFileSize={3000000}
                    chooseLabel={formData.paymentReceipt ? t('common.changeFile') : t('common.chooseFile')}
                    onSelect={(e) => handleFileUpload('paymentReceipt', e.files[0])}
                />
                {formData.paymentReceipt && (
                    <div className="mt-2 text-sm text-green-600">
                        <i className="pi pi-check mr-2"></i>
                        {formData.paymentReceipt.name}
                    </div>
                )}
            </div>
        </Card>
    );
    
    // Step indicator component
    const StepIndicator = () => (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                ${step <= currentStep 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {step < currentStep ? (
                                <i className="pi pi-check"></i>
                            ) : (
                                step
                            )}
                        </div>
                        {step < 4 && (
                            <div
                                className={`h-1 w-24 mx-2 
                                    ${step < currentStep 
                                        ? 'bg-blue-600' 
                                        : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className={currentStep === 1 ? 'font-bold text-blue-600' : 'text-gray-500'}>
                    {t('member.personalInfo.title')}
                </div>
                <div className={currentStep === 2 ? 'font-bold text-blue-600' : 'text-gray-500'}>
                    {t('member.businessInfo.title')}
                </div>
                <div className={currentStep === 3 ? 'font-bold text-blue-600' : 'text-gray-500'}>
                    {t('member.contactInfo.title')}
                </div>
                <div className={currentStep === 4 ? 'font-bold text-blue-600' : 'text-gray-500'}>
                    {t('member.payment.title')}
                </div>
            </div>
            
            <ProgressBar 
                value={(currentStep / totalSteps) * 100} 
                className="mt-4" 
                style={{ height: '6px' }}
            />
        </div>
    );
    
    return (
        <div className="add-member-screen p-4" dir="rtl">
            <Toast ref={toast} position="top-center" />
            
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t('dashboard.members.add')}</h1>
                        <p className="text-gray-600 mt-1">
                            {t('dashboard.members.addDescription')}
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
            
            {/* Step Indicator */}
            <StepIndicator />
            
            {/* Form Content */}
            <div className="max-w-4xl mx-auto">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                
                {/* Navigation Buttons */}
                <Card>
                    <div className="flex justify-between items-center">
                        <Button
                            label={t('common.previous')}
                            icon="pi pi-arrow-right"
                            onClick={prevStep}
                            className="p-button-outlined"
                            disabled={currentStep === 1}
                        />
                        
                        <div className="text-sm text-gray-500">
                            {t('common.step')} {currentStep} {t('common.of')} {totalSteps}
                        </div>
                        
                        {currentStep < totalSteps ? (
                            <Button
                                label={t('common.next')}
                                icon="pi pi-arrow-left"
                                iconPos="right"
                                onClick={nextStep}
                                className="p-button-primary"
                            />
                        ) : (
                            <Button
                                label={t('dashboard.members.addMember')}
                                icon="pi pi-check"
                                onClick={handleSubmit}
                                className="p-button-success"
                                loading={loading}
                            />
                        )}
                    </div>
                </Card>
            </div>
            
            {/* Summary Panel (visible on last step) */}
            {currentStep === 4 && (
                <Card className="mt-6 max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold mb-4">{t('member.summary.title')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">{t('member.personalInfo.title')}</h4>
                            <div className="space-y-1 text-sm">
                                <div><strong>{t('member.personalInfo.fullNameArabic')}:</strong> {formData.fullNameArabic}</div>
                                <div><strong>{t('member.personalInfo.fullNameEnglish')}:</strong> {formData.fullNameEnglish}</div>
                                <div><strong>{t('member.personalInfo.idNumber')}:</strong> {formData.idNumber}</div>
                                <div><strong>{t('member.personalInfo.qualification')}:</strong> {qualifications.find(q => q.value === formData.qualification)?.label}</div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">{t('member.businessInfo.title')}</h4>
                            <div className="space-y-1 text-sm">
                                <div><strong>{t('member.businessInfo.businessName')}:</strong> {formData.businessName}</div>
                                <div><strong>{t('member.businessInfo.businessType')}:</strong> {businessTypes.find(b => b.value === formData.businessType)?.label}</div>
                                <div><strong>{t('member.businessInfo.licenseNumber')}:</strong> {formData.licenseNumber}</div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">{t('member.contactInfo.title')}</h4>
                            <div className="space-y-1 text-sm">
                                <div><strong>{t('member.contactInfo.phone1')}:</strong> {formData.phone1}</div>
                                <div><strong>{t('member.contactInfo.email')}:</strong> {formData.email}</div>
                                {formData.mobile && <div><strong>{t('member.contactInfo.mobile')}:</strong> {formData.mobile}</div>}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">{t('member.payment.title')}</h4>
                            <div className="space-y-1 text-sm">
                                <div><strong>{t('member.payment.paymentMethod')}:</strong> {paymentMethods.find(p => p.value === formData.paymentMethod)?.label}</div>
                                <div><strong>{t('member.payment.referenceNumber')}:</strong> {formData.referenceNumber}</div>
                                <div><strong>{t('member.payment.amount')}:</strong> ${formData.totalAmount}</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Uploaded Files Summary */}
                    <div className="mt-6">
                        <h4 className="font-medium text-gray-800 mb-2">{t('member.attachments.uploadedFiles')}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            {formData.profileImage && (
                                <div className="flex items-center text-green-600">
                                    <i className="pi pi-check mr-1"></i> {t('member.personalInfo.profileImage')}
                                </div>
                            )}
                            {formData.idImage && (
                                <div className="flex items-center text-green-600">
                                    <i className="pi pi-check mr-1"></i> {t('member.personalInfo.idImage')}
                                </div>
                            )}
                            {formData.licenseImage && (
                                <div className="flex items-center text-green-600">
                                    <i className="pi pi-check mr-1"></i> {t('member.attachments.licenseImage')}
                                </div>
                            )}
                            {formData.degreeImage && (
                                <div className="flex items-center text-green-600">
                                    <i className="pi pi-check mr-1"></i> {t('member.attachments.degreeImage')}
                                </div>
                            )}
                            {formData.signatureImage && (
                                <div className="flex items-center text-green-600">
                                    <i className="pi pi-check mr-1"></i> {t('member.attachments.signatureImage')}
                                </div>
                            )}
                            {formData.paymentReceipt && (
                                <div className="flex items-center text-green-600">
                                    <i className="pi pi-check mr-1"></i> {t('member.payment.receipt')}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Important Notes */}
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                            <i className="pi pi-exclamation-triangle text-yellow-600 mt-1 mr-2"></i>
                            <div className="text-sm">
                                <strong className="text-yellow-800">{t('common.importantNote')}:</strong>
                                <ul className="mt-2 space-y-1 text-yellow-700">
                                    <li>• {t('member.notes.initialPayment')}</li>
                                    <li>• {t('member.notes.documentVerification')}</li>
                                    <li>• {t('member.notes.membershipCard')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AddMemberScreen;