// src/components/auth/LoginForm.js - update login functionality
import React, { useState, useRef } from 'react';
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
        e.preventDefault();
        setSubmitted(true);

        if (!validateForm()) {
            toast.current?.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.login.validation'),
                life: 3000
            });
            return;
        }

        try {
            setLoading(true);

            // Call the login function from auth context
            const result = await login(formData.username, formData.password);

            if (result.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: t('common.success'),
                    detail: t('auth.login.successMessage'),
                    life: 3000
                });

                // Navigate to dashboard after successful login
                // Small timeout to allow the success message to be displayed
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: result.error || t('auth.login.genericError'),
                    life: 3000
                });
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('auth.login.genericError'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    // rest of the component remains the same...

    return (
        <div>
            <Toast ref={toast} position="top-center" />

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields remain the same */}
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
                        />
                    </span>
                    {submitted && !formData.username && (
                        <small className="p-error block mt-1">{t('auth.login.usernameRequired')}</small>
                    )}
                </div>

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
                            inputProps={{
                                className: 'w-full',
                                prefix: <i className="pi pi-lock custom-password-icon" />
                            }}
                        />
                    </span>
                    {submitted && !formData.password && (
                        <small className="p-error block mt-1">{t('auth.login.passwordRequired')}</small>
                    )}
                </div>

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

                <Button
                    type="submit"
                    label={t('auth.login.submit')}
                    icon={isRtl ? "pi pi-arrow-left" : "pi pi-arrow-right"}
                    iconPos={isRtl ? "right" : "left"}
                    loading={loading}
                    className="w-full p-button-primary"
                />
            </form>
        </div>
    );
};

export default LoginForm;