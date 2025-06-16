import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { AutoComplete } from 'primereact/autocomplete';
import { Checkbox } from 'primereact/checkbox';

const NewPaymentComponent = () => {
    const [formData, setFormData] = useState({
        memberId: '',
        memberName: '',
        paymentType: '',
        paymentMethod: '',
        amount: 0,
        referenceNumber: '',
        receiptDate: new Date(),
        purpose: '',
        notes: '',
        attachment: null,
        subscriptionYears: 1,
        isPartialPayment: false,
        nextPaymentDate: null
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [feeCalculation, setFeeCalculation] = useState({
        baseAmount: 0,
        discountAmount: 0,
        totalAmount: 0
    });

    // Mock data - replace with actual API calls
    const mockMembers = [
        { id: '001', name: 'أحمد محمد علي', nameEn: 'Ahmed Mohamed Ali', status: 'active' },
        { id: '002', name: 'فاطمة حسن', nameEn: 'Fatma Hassan', status: 'pending' },
        { id: '003', name: 'محمد عبدالله', nameEn: 'Mohamed Abdullah', status: 'active' }
    ];

    const paymentTypes = [
        { label: 'رسوم التسجيل', value: 'registration', color: 'info' },
        { label: 'تجديد الاشتراك', value: 'renewal', color: 'success' },
        { label: 'رسوم إضافية', value: 'additional', color: 'warning' },
        { label: 'دفع متأخر', value: 'late_payment', color: 'danger' }
    ];

    const paymentMethods = [
        { label: 'نقداً', value: 'cash' },
        { label: 'تحويل بنكي', value: 'bank_transfer' },
        { label: 'شيك', value: 'check' },
        { label: 'بطاقة ائتمان', value: 'credit_card' },
        { label: 'محفظة إلكترونية', value: 'e_wallet' }
    ];

    const subscriptionPurposes = [
        { label: 'اشتراك سنوي عادي', value: 'annual_regular' },
        { label: 'اشتراك متعدد السنوات', value: 'multi_year' },
        { label: 'اشتراك مؤسسي', value: 'corporate' },
        { label: 'اشتراك طلابي', value: 'student' }
    ];

    useEffect(() => {
        setMembers(mockMembers);
    }, []);

    useEffect(() => {
        calculateFees();
    }, [formData.paymentType, formData.subscriptionYears, formData.amount]);

    const calculateFees = () => {
        let baseAmount = 0;
        let discountAmount = 0;

        switch (formData.paymentType) {
            case 'registration':
                baseAmount = 150; // Registration fee
                break;
            case 'renewal':
                baseAmount = 100 * formData.subscriptionYears; // Annual subscription
                if (formData.subscriptionYears > 1) {
                    discountAmount = baseAmount * 0.1; // 10% discount for multi-year
                }
                break;
            case 'additional':
                baseAmount = formData.amount || 0;
                break;
            case 'late_payment':
                baseAmount = (formData.amount || 0) * 1.15; // 15% penalty
                break;
            default:
                baseAmount = formData.amount || 0;
        }

        setFeeCalculation({
            baseAmount,
            discountAmount,
            totalAmount: baseAmount - discountAmount
        });

        if (baseAmount > 0) {
            setFormData(prev => ({ ...prev, amount: baseAmount - discountAmount }));
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleMemberSearch = (event) => {
        const query = event.query.toLowerCase();
        const filtered = members.filter(member => 
            member.name.toLowerCase().includes(query) || 
            member.nameEn.toLowerCase().includes(query) ||
            member.id.includes(query)
        );
        setFilteredMembers(filtered);
    };

    const handleMemberSelect = (member) => {
        setFormData(prev => ({
            ...prev,
            memberId: member.id,
            memberName: member.name
        }));
    };

    const handleFileUpload = (files) => {
        const file = files[0];
        if (file) {
            setFormData(prev => ({ ...prev, attachment: file }));
        }
    };

    const validateForm = () => {
        return formData.memberId && 
               formData.paymentType && 
               formData.paymentMethod && 
               formData.amount > 0 && 
               formData.referenceNumber;
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success - show success message and reset form
            console.log('Payment submitted:', formData);
            
            // Reset form
            setFormData({
                memberId: '',
                memberName: '',
                paymentType: '',
                paymentMethod: '',
                amount: 0,
                referenceNumber: '',
                receiptDate: new Date(),
                purpose: '',
                notes: '',
                attachment: null,
                subscriptionYears: 1,
                isPartialPayment: false,
                nextPaymentDate: null
            });
            setSubmitted(false);
            
        } catch (error) {
            console.error('Payment submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    const memberItemTemplate = (member) => {
        return (
            <div className="flex justify-between items-center p-2">
                <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.nameEn} - ID: {member.id}</div>
                </div>
                <Tag 
                    severity={member.status === 'active' ? 'success' : 'warning'} 
                    value={member.status === 'active' ? 'نشط' : 'معلق'} 
                />
            </div>
        );
    };

    return (
        <div className="p-6 max-w-4xl mx-auto" dir="rtl">
            <Toast />
            
            {/* Header */}
            <Card className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">دفعة جديدة</h1>
                        <p className="text-gray-600">إضافة دفعة جديدة لعضو في الجمعية</p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            label="حفظ كمسودة" 
                            icon="pi pi-save" 
                            className="p-button-outlined"
                            onClick={() => console.log('Save as draft')}
                        />
                        <Button 
                            label="إلغاء" 
                            icon="pi pi-times" 
                            className="p-button-outlined p-button-secondary"
                            onClick={() => window.history.back()}
                        />
                    </div>
                </div>
            </Card>

            {/* Member Selection */}
            <Card className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    <i className="pi pi-user mr-2"></i>
                    معلومات العضو
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            البحث عن العضو *
                        </label>
                        <AutoComplete
                            value={formData.memberName}
                            suggestions={filteredMembers}
                            completeMethod={handleMemberSearch}
                            onSelect={(e) => handleMemberSelect(e.value)}
                            onChange={(e) => handleInputChange('memberName', e.value)}
                            itemTemplate={memberItemTemplate}
                            placeholder="ابحث بالاسم أو رقم العضوية..."
                            className={`w-full ${submitted && !formData.memberId ? 'p-invalid' : ''}`}
                            dropdown
                        />
                        {submitted && !formData.memberId && (
                            <small className="p-error">هذا الحقل مطلوب</small>
                        )}
                    </div>

                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            رقم العضوية
                        </label>
                        <InputText
                            value={formData.memberId}
                            readOnly
                            className="w-full"
                            placeholder="سيتم ملؤه تلقائياً"
                        />
                    </div>
                </div>
            </Card>

            {/* Payment Information */}
            <Card className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    <i className="pi pi-credit-card mr-2"></i>
                    معلومات الدفع
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            نوع الدفع *
                        </label>
                        <Dropdown
                            value={formData.paymentType}
                            options={paymentTypes}
                            onChange={(e) => handleInputChange('paymentType', e.value)}
                            className={`w-full ${submitted && !formData.paymentType ? 'p-invalid' : ''}`}
                            placeholder="اختر نوع الدفع"
                        />
                        {submitted && !formData.paymentType && (
                            <small className="p-error">هذا الحقل مطلوب</small>
                        )}
                    </div>

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
                            <small className="p-error">هذا الحقل مطلوب</small>
                        )}
                    </div>

                    {formData.paymentType === 'renewal' && (
                        <div className="p-field">
                            <label className="block font-medium mb-2">
                                عدد سنوات الاشتراك
                            </label>
                            <InputNumber
                                value={formData.subscriptionYears}
                                onValueChange={(e) => handleInputChange('subscriptionYears', e.value)}
                                min={1}
                                max={5}
                                className="w-full"
                            />
                        </div>
                    )}

                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            الغرض من الدفع
                        </label>
                        <Dropdown
                            value={formData.purpose}
                            options={subscriptionPurposes}
                            onChange={(e) => handleInputChange('purpose', e.value)}
                            className="w-full"
                            placeholder="اختر الغرض"
                        />
                    </div>
                </div>

                {/* Fee Calculation Display */}
                {formData.paymentType && (
                    <Panel header="تفاصيل الرسوم" className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    ${feeCalculation.baseAmount}
                                </div>
                                <div className="text-sm text-gray-600">المبلغ الأساسي</div>
                            </div>
                            
                            {feeCalculation.discountAmount > 0 && (
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        -${feeCalculation.discountAmount}
                                    </div>
                                    <div className="text-sm text-gray-600">خصم</div>
                                </div>
                            )}
                            
                            <div className="bg-purple-50 p-4 rounded-lg text-center border-2 border-purple-200">
                                <div className="text-3xl font-bold text-purple-600">
                                    ${feeCalculation.totalAmount}
                                </div>
                                <div className="text-sm text-gray-600">المجموع النهائي</div>
                            </div>
                        </div>
                    </Panel>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            المبلغ *
                        </label>
                        <InputNumber
                            value={formData.amount}
                            onValueChange={(e) => handleInputChange('amount', e.value)}
                            mode="currency"
                            currency="USD"
                            locale="en-US"
                            className={`w-full ${submitted && !formData.amount ? 'p-invalid' : ''}`}
                        />
                        {submitted && !formData.amount && (
                            <small className="p-error">هذا الحقل مطلوب</small>
                        )}
                    </div>

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
                            <small className="p-error">هذا الحقل مطلوب</small>
                        )}
                    </div>

                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            تاريخ الإيصال
                        </label>
                        <Calendar
                            value={formData.receiptDate}
                            onChange={(e) => handleInputChange('receiptDate', e.value)}
                            dateFormat="dd/mm/yy"
                            className="w-full"
                            showIcon
                        />
                    </div>

                    <div className="p-field">
                        <div className="flex items-center gap-2 mt-6">
                            <Checkbox
                                inputId="partialPayment"
                                checked={formData.isPartialPayment}
                                onChange={(e) => handleInputChange('isPartialPayment', e.checked)}
                            />
                            <label htmlFor="partialPayment" className="font-medium">
                                دفع جزئي
                            </label>
                        </div>
                    </div>
                </div>

                {formData.isPartialPayment && (
                    <div className="p-field mt-4">
                        <label className="block font-medium mb-2">
                            موعد الدفعة التالية
                        </label>
                        <Calendar
                            value={formData.nextPaymentDate}
                            onChange={(e) => handleInputChange('nextPaymentDate', e.value)}
                            dateFormat="dd/mm/yy"
                            className="w-full"
                            showIcon
                            minDate={new Date()}
                        />
                    </div>
                )}
            </Card>

            {/* Attachment and Notes */}
            <Card className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    <i className="pi pi-paperclip mr-2"></i>
                    المرفقات والملاحظات
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            إيصال الدفع
                        </label>
                        <FileUpload
                            mode="basic"
                            name="attachment"
                            accept="image/*,application/pdf"
                            maxFileSize={5000000}
                            customUpload
                            uploadHandler={(e) => handleFileUpload(e.files)}
                            chooseLabel={formData.attachment ? 'تغيير المرفق' : 'اختيار مرفق'}
                            className="w-full"
                        />
                        {formData.attachment && (
                            <div className="mt-2 p-2 bg-green-50 rounded border">
                                <i className="pi pi-check text-green-600 mr-2"></i>
                                <span className="text-green-700">{formData.attachment.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-field">
                        <label className="block font-medium mb-2">
                            ملاحظات إضافية
                        </label>
                        <InputTextarea
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            rows={4}
                            className="w-full"
                            placeholder="أي ملاحظات إضافية حول هذه الدفعة..."
                        />
                    </div>
                </div>
            </Card>

            {/* Submit Actions */}
            <Card>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Button
                            label="حفظ الدفعة"
                            icon="pi pi-check"
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={loading}
                            className="p-button-success"
                        />
                        <Button
                            label="حفظ وإضافة أخرى"
                            icon="pi pi-plus"
                            onClick={() => {
                                handleSubmit();
                                // Keep form open for another entry
                            }}
                            loading={loading}
                            disabled={loading}
                            className="p-button-outlined"
                        />
                    </div>
                    
                    <div className="text-sm text-gray-500">
                        <i className="pi pi-info-circle mr-1"></i>
                        جميع الحقول المطلوبة مُشار إليها بالرمز *
                    </div>
                </div>
                
                {loading && (
                    <div className="mt-4">
                        <ProgressBar mode="indeterminate" style={{height: '6px'}} />
                        <p className="text-center text-sm text-gray-600 mt-2">
                            جاري حفظ الدفعة...
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default NewPaymentComponent;