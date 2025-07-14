// src/components/auth/LoginForm.js - Fixed version with better navigation handling
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
    const { login, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [loginInProgress, setLoginInProgress] = useState(false);

    // Check if user is blocked (too many failed attempts)
    useEffect(() => {
        if (attempts >= 5) {
            setIsBlocked(true);
            const timer = setTimeout(() => {
                setIsBlocked(false);
                setAttempts(0);
            }, 300000); // 5 minutes block

            return () => clearTimeout(timer);
        }
    }, [attempts]);

    // Handle navigation after successful authentication
    useEffect(() => {
        if (isAuthenticated && loginInProgress) {
            console.log('Authentication detected, navigating to dashboard...');
            setLoginInProgress(false);
            
            // Small delay to ensure state is fully updated
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 100);
        }
    }, [isAuthenticated, loginInProgress, navigate]);

    // Load saved username if remember me was checked
    useEffect(() => {
        const rememberMe = localStorage.getItem('rememberMe');
        const savedUsername = localStorage.getItem('savedUsername');
        
        if (rememberMe === 'true' && savedUsername) {
            setFormData(prev => ({
                ...prev,
                username: savedUsername,
                rememberMe: true
            }));
        }
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
        
        // Check if user is blocked
        if (isBlocked) {
            toast.current?.show({
                severity: 'error',
                summary: isRtl ? 'محظور مؤقتاً' : 'Temporarily Blocked',
                detail: isRtl ? 'محاولات فاشلة كثيرة جداً. يرجى الانتظار 5 دقائق.' : 'Too many failed attempts. Please wait 5 minutes.',
                life: 5000
            });
            return false;
        }
        
        setSubmitted(true);

        if (!validateForm()) {
            console.log('Validation failed'); // Debug log
            toast.current?.show({
                severity: 'error',
                summary: isRtl ? 'خطأ' : 'Error',
                detail: isRtl ? 'يرجى إدخال اسم المستخدم وكلمة المرور' : 'Please enter username and password',
                life: 4000
            });
            return false;
        }

        try {
            setLoginInProgress(true);
            console.log('Calling login function...'); // Debug log

            // Call the login function from auth context
            const result = await login(formData.username, formData.password);
            console.log('Login result:', result); // Debug log

            if (result && result.success) {
                console.log('Login successful'); // Debug log
                
                // Reset attempts on successful login
                setAttempts(0);
                
                // Save remember me preference
                if (formData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('savedUsername', formData.username);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('savedUsername');
                }

                toast.current?.show({
                    severity: 'success',
                    summary: isRtl ? 'نجح تسجيل الدخول' : 'Login Successful',
                    detail: result.message || (isRtl ? 'مرحباً بك في النظام' : 'Welcome to the system'),
                    life: 2000
                });

                // Don't navigate here - let the useEffect handle it when isAuthenticated becomes true
                console.log('Waiting for authentication state to update...');
                
            } else {
                console.log('Login failed:', result); // Debug log
                setLoginInProgress(false);
                
                // Increment failed attempts
                setAttempts(prev => prev + 1);
                
                // Show specific error messages based on error type
                let errorMessage = isRtl ? 
                    'اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.' : 
                    'Invalid username or password. Please try again.';
                
                let severity = 'error';
                
                if (result.error === 'NETWORK_ERROR') {
                    errorMessage = isRtl ? 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.' : 'Unable to connect to server. Check your internet connection.';
                    severity = 'warn';
                } else if (result.error === 'TIMEOUT_ERROR') {
                    errorMessage = isRtl ? 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.' : 'Request timeout. Please try again.';
                    severity = 'warn';
                } else if (result.error === 'SERVER_ERROR') {
                    errorMessage = isRtl ? 'خطأ في الخادم. يرجى المحاولة لاحقاً.' : 'Server error. Please try again later.';
                } else if (result.error === 'ACCOUNT_DISABLED') {
                    errorMessage = isRtl ? 'الحساب غير مفعل أو معطل' : 'Account is disabled or inactive';
                } else if (result.error === 'RATE_LIMITED') {
                    errorMessage = isRtl ? 'طلبات كثيرة جداً. يرجى الانتظار قليلاً.' : 'Too many requests. Please wait a moment.';
                    severity = 'warn';
                } else if (result.message) {
                    errorMessage = result.message;
                }

                // Show error toast for failed login
                toast.current?.show({
                    severity,
                    summary: isRtl ? 'خطأ في تسجيل الدخول' : 'Login Error',
                    detail: errorMessage,
                    life: 4000
                });

                // Show warning for multiple attempts
                if (attempts >= 2 && attempts < 4) {
                    setTimeout(() => {
                        toast.current?.show({
                            severity: 'warn',
                            summary: isRtl ? 'تحذير' : 'Warning',
                            detail: isRtl ? 
                                `تبقى ${5 - attempts - 1} محاولات قبل حظر الحساب مؤقتاً` : 
                                `${5 - attempts - 1} attempts remaining before temporary block`,
                            life: 3000
                        });
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Login error:', error); // Debug log
            setLoginInProgress(false);
            
            // Increment failed attempts
            setAttempts(prev => prev + 1);
            
            // Handle different types of errors
            let errorMessage = isRtl ? 
                'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة لاحقاً.' : 
                'An error occurred during login. Please try again later.';
            
            let severity = 'error';
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = isRtl ? 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.' : 'Request timeout. Please try again.';
                severity = 'warn';
            } else if (error.request && !error.response) {
                errorMessage = isRtl ? 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.' : 'Unable to connect to server. Check your internet connection.';
                severity = 'warn';
            } else if (error.userMessage) {
                errorMessage = error.userMessage;
            }

            toast.current?.show({
                severity,
                summary: isRtl ? 'خطأ في النظام' : 'System Error',
                detail: errorMessage,
                life: 4000
            });
        }

        return false; // Prevent any default behavior
    };

    return (
        <div>
            {/* Toast component - positioned globally with high z-index */}
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
                            disabled={isLoading || isBlocked || loginInProgress}
                            autoFocus
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
                            disabled={isLoading || isBlocked || loginInProgress}
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
                            disabled={isLoading || isBlocked || loginInProgress}
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-600">
                            {t('auth.login.rememberMe')}
                        </label>
                    </div>
                    
                    {/* Forgot Password Link */}
                    <button 
                        type="button"
                        className="text-sm text-blue-600 hover:underline bg-transparent border-0 cursor-pointer p-0"
                        onClick={(e) => {
                            e.preventDefault();
                            toast.current?.show({
                                severity: 'info',
                                summary: isRtl ? 'قريباً' : 'Coming Soon',
                                detail: isRtl ? 'ميزة نسيان كلمة المرور قريباً' : 'Forgot password feature coming soon',
                                life: 3000
                            });
                        }}
                        disabled={isLoading || isBlocked || loginInProgress}
                    >
                        {t('auth.login.forgotPassword')}
                    </button>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    label={isBlocked ? (isRtl ? 'محظور مؤقتاً' : 'Temporarily Blocked') : t('auth.login.submit')}
                    icon={isRtl ? "pi pi-arrow-left" : "pi pi-arrow-right"}
                    iconPos={isRtl ? "right" : "left"}
                    loading={isLoading || loginInProgress}
                    disabled={isBlocked}
                    className="w-full p-button-primary"
                />

                {/* Block Timer */}
                {isBlocked && (
                    <div className="text-center mt-4">
                        <small className="text-red-500">
                            {isRtl ? 
                                'تم حظر الحساب لمدة 5 دقائق بسبب محاولات فاشلة متعددة' :
                                'Account blocked for 5 minutes due to multiple failed attempts'
                            }
                        </small>
                    </div>
                )}
            </form>
        </div>
    );
};

export default LoginForm;