// src/components/auth/LoginForm.js - Fixed to prevent reload and show toast
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Test toast on component mount to ensure it's working
    useEffect(() => {
        // Uncomment this line to test if toast is working
        // toast.current?.show({ severity: 'info', summary: 'Test', detail: 'Toast is working!', life: 2000 });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        setFormData(prev => ({ ...prev, rememberMe: e.checked }));
    };

    const validateForm = () => {
        return formData.username.trim() !== '' && formData.password.trim() !== '';
    };

    const handleSubmit = async (e) => {
        // CRITICAL: Prevent default form submission
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Form submitted with:', formData); // Debug log
        
        setSubmitted(true);

        if (!validateForm()) {
            console.log('Validation failed'); // Debug log
            toast.current?.show({
                severity: 'error',
                summary: isRtl ? 'خطأ' : 'Error',
                detail: isRtl ? 'يرجى إدخال اسم المستخدم وكلمة المرور' : 'Please enter username and password',
                life: 4000
            });
            return false; // Ensure we don't continue
        }

        try {
            setLoading(true);
            console.log('Calling login function...'); // Debug log

            // Call the login function from auth context
            const result = await login(formData.username, formData.password);
            console.log('Login result:', result); // Debug log

            if (result && result.success) {
                console.log('Login successful'); // Debug log
                toast.current?.show({
                    severity: 'success',
                    summary: isRtl ? 'نجح تسجيل الدخول' : 'Login Successful',
                    detail: isRtl ? 'مرحباً بك في النظام' : 'Welcome to the system',
                    life: 3000
                });

                // Navigate to dashboard after successful login
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                console.log('Login failed:', result); // Debug log
                // Show error toast for wrong credentials
                toast.current?.show({
                    severity: 'error',
                    summary: isRtl ? 'خطأ في تسجيل الدخول' : 'Login Error',
                    detail: isRtl ? 
                        'اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.' : 
                        'Invalid username or password. Please try again.',
                    life: 4000
                });
            }
        } catch (error) {
            console.error('Login error:', error); // Debug log
            toast.current?.show({
                severity: 'error',
                summary: isRtl ? 'خطأ في النظام' : 'System Error',
                detail: isRtl ? 
                    'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة لاحقاً.' : 
                    'An error occurred during login. Please try again later.',
                life: 4000
            });
        } finally {
            setLoading(false);
        }

        return false; // Prevent any default behavior
    };

    return (
        <div>
            {/* Toast component - positioned globally */}
            <Toast 
                ref={toast} 
                position="top-center" 
                className="z-50"
                style={{ zIndex: 9999 }}
            />

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Username Field */}
                <div className="p-field mb-4">
                    <label htmlFor="username" className="block text-right font-medium text-gray-700 mb-2">
                        {t('auth.login.username')}
                    </label>
                    <span className={`p-input-icon-${isRtl ? 'right' : 'left'} w-full`}>
                        <i className="pi pi-user px-1" />
                        <InputText
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder={t('auth.login.usernamePlaceholder')}
                            className={classNames('w-full placeholder:px-4', {
                                'p-invalid': submitted && !formData.username
                            })}
                            autoComplete="username"
                        />
                    </span>
                    {submitted && !formData.username && (
                        <small className="p-error block mt-1">{t('auth.login.usernameRequired')}</small>
                    )}
                </div>

                {/* Password Field */}
                <div className="p-field mb-4 w-full">
                    <label htmlFor="password" className="block text-right font-medium text-gray-700 mb-2">
                        {t('auth.login.password')}
                    </label>
                    <span className={`w-full custom-password-wrapper ${isRtl ? 'rtl-password' : ''}`}>
                        <Password
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder={t('auth.login.passwordPlaceholder')}
                            toggleMask
                            feedback={false}
                            className={classNames('w-full custom-password block', {
                                'p-invalid': submitted && !formData.password
                            })}
                            inputClassName="w-full"
                            autoComplete="current-password"
                        />
                    </span>
                    {submitted && !formData.password && (
                        <small className="p-error block mt-1">{t('auth.login.passwordRequired')}</small>
                    )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Checkbox
                            inputId="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleCheckboxChange}
                            className={`${isRtl ? 'ml-2' : 'mr-2'}`}
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-600">
                            {t('auth.login.rememberMe')}
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    label={t('auth.login.submit')}
                    icon={isRtl ? "pi pi-arrow-left" : "pi pi-arrow-right"}
                    iconPos={isRtl ? "right" : "left"}
                    loading={loading}
                    className="w-full p-button-primary"
                    onClick={handleSubmit} // Added onClick as backup
                />

            </form>
        </div>
    );
};

export default LoginForm;