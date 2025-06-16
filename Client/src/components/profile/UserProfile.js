// src/components/profile/UserProfile.js
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Timeline } from 'primereact/timeline';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const UserProfile = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const { user, updateUser, changePassword } = useAuth();
    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    // State
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    // Profile form data
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        dateOfBirth: null,
        joinDate: null,
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        bio: '',
        avatar: null
    });

    // Security form data
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        emailNotifications: true,
        smsNotifications: false,
        loginAlerts: true
    });

    // Validation errors
    const [errors, setErrors] = useState({});

    // Profile strength calculation
    const [profileStrength, setProfileStrength] = useState(0);

    // Mock activity data
    const [recentActivity, setRecentActivity] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);

    // Options
    const departmentOptions = [
        { label: 'الإدارة العامة', value: 'administration' },
        { label: 'المحاسبة', value: 'accounting' },
        { label: 'المراجعة', value: 'auditing' },
        { label: 'تقنية المعلومات', value: 'it' },
        { label: 'الموارد البشرية', value: 'hr' },
        { label: 'القانونية', value: 'legal' }
    ];

    const positionOptions = [
        { label: 'مدير عام', value: 'general_manager' },
        { label: 'مدير إدارة', value: 'department_manager' },
        { label: 'محاسب أول', value: 'senior_accountant' },
        { label: 'محاسب', value: 'accountant' },
        { label: 'مساعد محاسب', value: 'assistant_accountant' },
        { label: 'مراجع', value: 'auditor' },
        { label: 'موظف', value: 'employee' }
    ];

    // Initialize data on component mount
    useEffect(() => {
        loadUserData();
        loadRecentActivity();
        loadLoginHistory();
    }, []);

    // Calculate profile strength whenever profile data changes
    useEffect(() => {
        calculateProfileStrength();
    }, [profileData]);

    const loadUserData = () => {
        // In real app, this would fetch from API
        const mockUserData = {
            id: 'U001',
            firstName: 'أحمد',
            lastName: 'محمد الشهري',
            email: 'ahmed.shahri@example.com',
            phone: '+967 777 123 456',
            position: 'senior_accountant',
            department: 'accounting',
            dateOfBirth: new Date('1985-05-15'),
            joinDate: new Date('2020-03-01'),
            address: 'صنعاء، اليمن',
            emergencyContact: 'محمد الشهري',
            emergencyPhone: '+967 777 654 321',
            bio: 'محاسب أول مع خبرة 10 سنوات في المحاسبة والمراجعة المالية',
            avatar: null,
            role: 'accountant',
            lastLogin: new Date(),
            isActive: true
        };

        setProfileData(mockUserData);
        setSecurityData(prev => ({
            ...prev,
            twoFactorEnabled: false,
            emailNotifications: true,
            smsNotifications: false,
            loginAlerts: true
        }));
    };

    const loadRecentActivity = () => {
        const mockActivity = [
            {
                id: 1,
                action: 'تحديث ملف العضو',
                description: 'تم تحديث معلومات العضو M2001',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                type: 'update',
                icon: 'pi-user-edit'
            },
            {
                id: 2,
                action: 'تجديد اشتراك',
                description: 'تم تجديد اشتراك العضو M1987',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                type: 'renewal',
                icon: 'pi-sync'
            },
            {
                id: 3,
                action: 'إضافة عضو جديد',
                description: 'تم إضافة العضو M2025',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                type: 'create',
                icon: 'pi-user-plus'
            },
            {
                id: 4,
                action: 'تسجيل دخول',
                description: 'تم تسجيل الدخول بنجاح',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                type: 'login',
                icon: 'pi-sign-in'
            },
            {
                id: 5,
                action: 'تصدير تقرير',
                description: 'تم تصدير تقرير الاشتراكات المنتهية',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                type: 'export',
                icon: 'pi-download'
            }
        ];
        setRecentActivity(mockActivity);
    };

    const loadLoginHistory = () => {
        const mockLoginHistory = [
            {
                id: 1,
                timestamp: new Date(),
                location: 'صنعاء، اليمن',
                device: 'Chrome على Windows',
                ip: '192.168.1.100',
                status: 'نجح',
                isCurrent: true
            },
            {
                id: 2,
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                location: 'صنعاء، اليمن',
                device: 'Firefox على Windows',
                ip: '192.168.1.100',
                status: 'نجح',
                isCurrent: false
            },
            {
                id: 3,
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                location: 'عدن، اليمن',
                device: 'Safari على iPhone',
                ip: '192.168.2.50',
                status: 'نجح',
                isCurrent: false
            },
            {
                id: 4,
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                location: 'الحديدة، اليمن',
                device: 'Chrome على Android',
                ip: '192.168.3.75',
                status: 'فشل',
                isCurrent: false
            }
        ];
        setLoginHistory(mockLoginHistory);
    };

    const calculateProfileStrength = () => {
        let strength = 0;
        const fields = ['firstName', 'lastName', 'email', 'phone', 'position', 'department', 'dateOfBirth', 'bio'];
        
        fields.forEach(field => {
            if (profileData[field] && profileData[field] !== '') {
                strength += 12.5;
            }
        });

        if (profileData.avatar) strength += 10;
        if (profileData.emergencyContact) strength += 5;
        
        
        setProfileStrength(Math.round(strength));
        
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleSecurityChange = (field, value) => {
        setSecurityData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateProfile = () => {
        const newErrors = {};

        if (!profileData.firstName?.trim()) {
            newErrors.firstName = 'الاسم الأول مطلوب';
        }

        if (!profileData.lastName?.trim()) {
            newErrors.lastName = 'اسم العائلة مطلوب';
        }

        if (!profileData.email?.trim()) {
            newErrors.email = 'البريد الإلكتروني مطلوب';
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'البريد الإلكتروني غير صحيح';
        }

        if (!profileData.phone?.trim()) {
            newErrors.phone = 'رقم الهاتف مطلوب';
        } else if (!/^(\+967|967|0)?[7][0-9]{8}$/.test(profileData.phone.replace(/\s+/g, ''))) {
            newErrors.phone = 'رقم الهاتف غير صحيح';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};

        if (!securityData.currentPassword) {
            newErrors.currentPassword = 'كلمة المرور الحالية مطلوبة';
        }

        if (!securityData.newPassword) {
            newErrors.newPassword = 'كلمة المرور الجديدة مطلوبة';
        } else if (securityData.newPassword.length < 8) {
            newErrors.newPassword = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        }

        if (securityData.newPassword !== securityData.confirmPassword) {
            newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateProfile()) return;

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update user context
            await updateUser(profileData);
            
            setIsEditing(false);
            toast.current?.show({
                severity: 'success',
                summary: 'تم الحفظ',
                detail: 'تم تحديث معلومات الملف الشخصي بنجاح',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'خطأ',
                detail: 'حدث خطأ أثناء حفظ المعلومات',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) return;

        setLoading(true);
        try {
            await changePassword(securityData.currentPassword, securityData.newPassword);
            
            setSecurityData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            
            toast.current?.show({
                severity: 'success',
                summary: 'تم التحديث',
                detail: 'تم تغيير كلمة المرور بنجاح',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'خطأ',
                detail: 'حدث خطأ أثناء تغيير كلمة المرور',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (event) => {
        setAvatarLoading(true);
        try {
            const file = event.files[0];
            
            // Simulate upload
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setProfileData(prev => ({
                ...prev,
                avatar: URL.createObjectURL(file)
            }));
            
            toast.current?.show({
                severity: 'success',
                summary: 'تم الرفع',
                detail: 'تم رفع الصورة الشخصية بنجاح',
                life: 3000
            });
            
            fileUploadRef.current?.clear();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'خطأ',
                detail: 'حدث خطأ أثناء رفع الصورة',
                life: 3000
            });
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        confirmDialog({
            message: 'هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.',
            header: 'تأكيد حذف الحساب',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'حذف',
            rejectLabel: 'إلغاء',
            acceptClassName: 'p-button-danger',
            accept: () => {
                toast.current?.show({
                    severity: 'info',
                    summary: 'طلب الحذف',
                    detail: 'تم إرسال طلب حذف الحساب للمراجعة',
                    life: 5000
                });
            }
        });
    };

    // Templates
    const activityItemTemplate = (item) => (
        <div className="flex items-start space-x-3 space-x-reverse">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                item.type === 'login' ? 'bg-blue-100 text-blue-600' :
                item.type === 'update' ? 'bg-green-100 text-green-600' :
                item.type === 'create' ? 'bg-purple-100 text-purple-600' :
                item.type === 'renewal' ? 'bg-orange-100 text-orange-600' :
                'bg-gray-100 text-gray-600'
            }`}>
                <i className={`pi ${item.icon} text-sm`}></i>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                    {item.timestamp.toLocaleString('ar-YE')}
                </p>
            </div>
        </div>
    );

    const loginStatusTemplate = (rowData) => {
        return (
            <div className="flex items-center gap-2">
                <Tag 
                    severity={rowData.status === 'نجح' ? 'success' : 'danger'} 
                    value={rowData.status} 
                />
                {rowData.isCurrent && (
                    <Tag severity="info" value="الجلسة الحالية" />
                )}
            </div>
        );
    };

    return (
        <div className="user-profile-page">
            <Toast ref={toast} position="top-center" />
            <ConfirmDialog />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('userProfile.title')}</h1>
                        <p className="text-gray-600">{t('userProfile.subtitle')}</p>
                    </div>
                    
                </div>
            </div>

            {/* Profile Header Card */}
            <Card className="mb-6 profile-header-card">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="relative">
                            <Avatar
                                image={profileData.avatar}
                                label={!profileData.avatar ? (profileData.firstName?.charAt(0) || '') + (profileData.lastName?.charAt(0) || '') : null}
                                size="xlarge"
                                shape="circle"
                                className="profile-avatar"
                            />
                            {avatarLoading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <i className="pi pi-spin pi-spinner text-white"></i>
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {profileData.firstName} {profileData.lastName}
                            </h2>
                            <p className="text-gray-600">
                                {positionOptions.find(p => p.value === profileData.position)?.label}
                            </p>
                            <p className="text-sm text-gray-500">
                                {departmentOptions.find(d => d.value === profileData.department)?.label}
                            </p>
                            <p className="text-sm text-gray-500">
                                انضم في {profileData.joinDate instanceof Date && !isNaN(profileData.joinDate) ? profileData.joinDate.toLocaleDateString('ar-YE') : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <Button
                                label="تعديل الملف الشخصي"
                                icon="pi pi-user-edit"
                                onClick={() => setIsEditing(true)}
                            />
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    label="حفظ"
                                    icon="pi pi-check"
                                    onClick={handleSaveProfile}
                                    loading={loading}
                                />
                                <Button
                                    label="إلغاء"
                                    icon="pi pi-times"
                                    outlined
                                    onClick={() => {
                                        setIsEditing(false);
                                        loadUserData(); // Reset data
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Main Content Tabs */}
            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                {/* Personal Information Tab */}
                <TabPanel header="المعلومات الشخصية" leftIcon="pi pi-user mr-2">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Avatar Upload */}
                        <Card title="الصورة الشخصية" className="lg:col-span-1">
                            <div className="text-center">
                                <Avatar
                                    image={profileData.avatar}
                                    label={!profileData.avatar ? (profileData.firstName?.charAt(0) || '') + (profileData.lastName?.charAt(0) || '') : null}
                                    size="xlarge"
                                    shape="circle"
                                    className="mb-4"
                                />
                                <FileUpload
                                    ref={fileUploadRef}
                                    mode="basic"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    onSelect={handleAvatarUpload}
                                    auto
                                    chooseLabel="رفع صورة جديدة"
                                    className="profile-upload"
                                    disabled={avatarLoading}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    الحد الأقصى: 1 ميجابايت، صيغ مقبولة: JPG, PNG
                                </p>
                            </div>
                        </Card>

                        {/* Personal Information Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card title="المعلومات الأساسية">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="field">
                                        <label htmlFor="firstName" className="font-medium">الاسم الأول *</label>
                                        <InputText
                                            id="firstName"
                                            value={profileData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full${errors.firstName ? ' p-invalid' : ''}`}
                                        />
                                        {errors.firstName && <small className="p-error">{errors.firstName}</small>}
                                    </div>

                                    <div className="field">
                                        <label htmlFor="lastName" className="font-medium">اسم العائلة *</label>
                                        <InputText
                                            id="lastName"
                                            value={profileData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full${errors.lastName ? ' p-invalid' : ''}`}
                                        />
                                        {errors.lastName && <small className="p-error">{errors.lastName}</small>}
                                    </div>

                                    <div className="field">
                                        <label htmlFor="email" className="font-medium">البريد الإلكتروني *</label>
                                        <InputText
                                            id="email"
                                            value={profileData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full${errors.email ? ' p-invalid' : ''}`}
                                        />
                                        {errors.email && <small className="p-error">{errors.email}</small>}
                                    </div>

                                    <div className="field">
                                        <label htmlFor="phone" className="font-medium">رقم الهاتف *</label>
                                        <InputText
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full${errors.phone ? ' p-invalid' : ''}`}
                                        />
                                        {errors.phone && <small className="p-error">{errors.phone}</small>}
                                    </div>

                                    <div className="field">
                                        <label htmlFor="dateOfBirth" className="font-medium">تاريخ الميلاد</label>
                                        <Calendar
                                            id="dateOfBirth"
                                            value={profileData.dateOfBirth}
                                            onChange={(e) => handleInputChange('dateOfBirth', e.value)}
                                            disabled={!isEditing}
                                            className="w-full"
                                            dateFormat="dd/mm/yy"
                                            showIcon
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="joinDate" className="font-medium">تاريخ الانضمام</label>
                                        <Calendar
                                            id="joinDate"
                                            value={profileData.joinDate}
                                            onChange={(e) => handleInputChange('joinDate', e.value)}
                                            disabled={!isEditing}
                                            className="w-full"
                                            dateFormat="dd/mm/yy"
                                            showIcon
                                        />
                                    </div>
                                </div>
                            </Card>

                            <Card title="معلومات العمل">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="field">
                                        <label htmlFor="department" className="font-medium">القسم</label>
                                        <Dropdown
                                            id="department"
                                            value={profileData.department}
                                            options={departmentOptions}
                                            onChange={(e) => handleInputChange('department', e.value)}
                                            disabled={!isEditing}
                                            className="w-full"
                                            placeholder="اختر القسم"
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="position" className="font-medium">المنصب</label>
                                        <Dropdown
                                            id="position"
                                            value={profileData.position}
                                            options={positionOptions}
                                            onChange={(e) => handleInputChange('position', e.value)}
                                            disabled={!isEditing}
                                            className="w-full"
                                            placeholder="اختر المنصب"
                                        />
                                    </div>
                                </div>
                            </Card>

                            <Card title="معلومات إضافية">
                                <div className="space-y-4">
                                    <div className="field">
                                        <label htmlFor="address" className="font-medium">العنوان</label>
                                        <InputText
                                            id="address"
                                            value={profileData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="field">
                                            <label htmlFor="emergencyContact" className="font-medium">جهة الاتصال الطارئة</label>
                                            <InputText
                                                id="emergencyContact"
                                                value={profileData.emergencyContact}
                                                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="field">
                                            <label htmlFor="emergencyPhone" className="font-medium">هاتف الطوارئ</label>
                                            <InputText
                                                id="emergencyPhone"
                                                value={profileData.emergencyPhone}
                                                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label htmlFor="bio" className="font-medium">نبذة شخصية</label>
                                        <InputText
                                            id="bio"
                                            value={profileData.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabPanel>
                {/* ...other tabs... */}
            </TabView>
        </div>
    );
};

export default UserProfile;