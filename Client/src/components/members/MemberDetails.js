// src/components/members/MemberDetails.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useLanguage } from '../../contexts/LanguageContext';

const MemberDetails = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState(0);
    const [showRenewDialog, setShowRenewDialog] = useState(false);
    const [showCardDialog, setShowCardDialog] = useState(false);

    // Mock member data - in a real app, this would be fetched from the API
    const member = {
        id: 'M1001',
        fullName: 'عبدالله سالم الهاشمي',
        businessName: 'شركة الأمل للمحاسبة',
        businessType: 'company',
        email: 'abdullah@alamamal.com',
        phone1: '+967 777 123 456',
        phone2: '+967 777 123 457',
        mobile: '+967 733 123 456',
        whatsapp: '+967 733 123 456',
        idType: 'national_id',
        idNumber: '123456789',
        qualification: 'bachelor',
        headOfficeAddress: 'عدن، المنصورة، شارع الستين، مبنى رقم 15',
        localBranchAddress: 'عدن، كريتر، شارع الملكة أروى، مبنى رقم 7',
        licenseNumber: 'LIC-12345',
        licenseIssueDate: '2023-01-15',
        profileImagePath: null,
        idImagePath: null,
        attachments: [
            { type: 'license', path: null, uploadDate: '2023-01-20' },
            { type: 'degree', path: null, uploadDate: '2023-01-20' },
            { type: 'signature', path: null, uploadDate: '2023-01-20' }
        ],
        status: 'active',
        createdAt: '2023-01-20',
        createdBy: 'admin',
        subscriptions: [
            {
                id: 'SUB1002',
                startDate: '2024-01-20',
                endDate: '2025-01-19',
                paymentId: 'P1002',
                isActive: true
            },
            {
                id: 'SUB1001',
                startDate: '2023-01-20',
                endDate: '2024-01-19',
                paymentId: 'P1001',
                isActive: false
            }
        ],
        payments: [
            {
                id: 'P1001',
                date: '2023-01-20',
                amount: 350,
                type: 'registration',
                referenceNumber: 'REF123456',
                paymentMethod: 'bank_transfer',
                notes: 'Initial registration payment'
            },
            {
                id: 'P1002',
                date: '2024-01-15',
                amount: 150,
                type: 'renewal',
                referenceNumber: 'REF789012',
                paymentMethod: 'cash',
                notes: 'Renewal for 2024-2025'
            }
        ]
    };

    // Template for status tag
    const statusTemplate = (status) => {
        const statusMap = {
            'active': { severity: 'success', label: t('common.active') },
            'inactive': { severity: 'danger', label: t('common.inactive') },
            'pending': { severity: 'warning', label: t('common.pending') }
        };

        return <Tag severity={statusMap[status].severity} value={statusMap[status].label} />;
    };

    // Template for payment type
    const paymentTypeTemplate = (rowData) => {
        const typeMap = {
            'registration': { severity: 'info', label: t('dashboard.payments.registration') },
            'renewal': { severity: 'success', label: t('dashboard.payments.renewal') },
            'other': { severity: 'warning', label: t('dashboard.payments.other') }
        };

        return <Tag severity={typeMap[rowData.type].severity} value={typeMap[rowData.type].label} />;
    };

    // Template for amount column
    const amountTemplate = (rowData) => {
        return <span className="font-semibold">${rowData.amount}</span>;
    };

    // Template for payment method
    const paymentMethodTemplate = (rowData) => {
        const methodMap = {
            'cash': t('common.cash'),
            'bank_transfer': t('common.bankTransfer'),
            'check': t('common.check')
        };

        return <span>{methodMap[rowData.paymentMethod]}</span>;
    };

    // Template for subscription status
    const subscriptionStatusTemplate = (rowData) => {
        return statusTemplate(rowData.isActive ? 'active' : 'inactive');
    };

    // Navigate back to members list
    const goBack = () => {
        navigate('/dashboard/members/view');
    };

    // Render membership card dialog
    const renderCardDialog = () => {
        return (
            <Dialog
                header={t('member.card.title')}
                visible={showCardDialog}
                style={{ width: '400px' }}
                onHide={() => setShowCardDialog(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            label={t('common.print')}
                            icon="pi pi-print"
                            onClick={() => window.print()}
                        />
                        <Button
                            label={t('common.close')}
                            icon="pi pi-times"
                            outlined
                            onClick={() => setShowCardDialog(false)}
                        />
                    </div>
                }
            >
                <div className="membership-card bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-4 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>

                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 mr-4">
                            {member.profileImagePath ? (
                                <img
                                    src={member.profileImagePath}
                                    alt={member.fullName}
                                    className="w-20 h-20 rounded-full border-2 border-white"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center border-2 border-white">
                                    <i className="pi pi-user text-3xl text-white"></i>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{member.fullName}</h3>
                            <p className="text-blue-100 text-sm">{member.businessName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-blue-700 bg-opacity-40 p-2 rounded">
                            <div className="text-xs text-blue-200">{t('member.card.id')}</div>
                            <div className="font-bold">{member.id}</div>
                        </div>
                        <div className="bg-blue-700 bg-opacity-40 p-2 rounded">
                            <div className="text-xs text-blue-200">{t('member.subscription.startDate')}</div>
                            <div className="font-bold">{member.subscriptions[0]?.startDate}</div>
                        </div>
                        <div className="bg-blue-700 bg-opacity-40 p-2 rounded">
                            <div className="text-xs text-blue-200">{t('member.subscription.endDate')}</div>
                            <div className="font-bold">{member.subscriptions[0]?.endDate}</div>
                        </div>
                        <div className="bg-blue-700 bg-opacity-40 p-2 rounded">
                            <div className="text-xs text-blue-200">{t('common.status')}</div>
                            <div className="font-bold">{t(`common.${member.status}`)}</div>
                        </div>
                    </div>

                    <div className="flex justify-center mb-2">
                        {/* Barcode placeholder */}
                        <div className="bg-white p-2 rounded">
                            <div className="text-blue-800 text-xs text-center">{member.id}</div>
                            <div className="h-10 flex items-center justify-center">
                                <i className="pi pi-barcode text-3xl text-blue-800"></i>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-xs text-blue-200">
                        {t('app.name')}
                    </div>
                </div>
            </Dialog>
        );
    };

    // Render renewal dialog
    const renderRenewDialog = () => {
        return (
            <Dialog
                header={t('dashboard.subscriptions.renew')}
                visible={showRenewDialog}
                style={{ width: '500px' }}
                onHide={() => setShowRenewDialog(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            label={t('common.save')}
                            icon="pi pi-check"
                            onClick={() => setShowRenewDialog(false)}
                        />
                        <Button
                            label={t('common.cancel')}
                            icon="pi pi-times"
                            outlined
                            onClick={() => setShowRenewDialog(false)}
                        />
                    </div>
                }
            >
                <div className="p-fluid">
                    <p className="text-center mb-4">
                        {t('dashboard.subscriptions.renewMemberMessage', { name: member.fullName })}
                    </p>

                    <div className="mb-4">
                        <label className="block mb-1">{t('member.subscription.currentEndDate')}</label>
                        <div className="p-inputtext p-disabled">
                            {member.subscriptions[0]?.endDate}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">{t('member.subscription.newEndDate')}</label>
                        <div className="p-inputtext p-disabled">
                            {new Date(new Date(member.subscriptions[0]?.endDate).setFullYear(
                                new Date(member.subscriptions[0]?.endDate).getFullYear() + 1
                            )).toISOString().split('T')[0]}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">{t('member.payment.amount')}</label>
                        <div className="p-inputtext p-disabled">
                            $150
                        </div>
                    </div>

                    {/* In a real implementation, this would include payment method selection and other fields */}
                </div>
            </Dialog>
        );
    };

    return (
        <div>
            {/* Dialogs */}
            {renderCardDialog()}
            {renderRenewDialog()}

            {/* Header with back button, title, and actions */}
            <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center">
                    <Button
                        icon="pi pi-arrow-left"
                        onClick={goBack}
                        className="p-button-text mr-2"
                        aria-label={t('common.back')}
                    />
                    <h1 className="text-2xl font-bold">{t('member.details')}</h1>
                </div>

                <div className="flex gap-2">
                    <Button
                        label={t('member.card.print')}
                        icon="pi pi-id-card"
                        onClick={() => setShowCardDialog(true)}
                    />
                    <Button
                        label={t('dashboard.subscriptions.renew')}
                        icon="pi pi-sync"
                        className="p-button-success"
                        onClick={() => setShowRenewDialog(true)}
                        disabled={member.status === 'inactive'}
                    />
                    <Button
                        label={t('common.edit')}
                        icon="pi pi-pencil"
                        className="p-button-warning"
                        onClick={() => navigate(`/dashboard/members/edit/${member.id}`)}
                    />
                </div>
            </div>

            {/* Member profile card */}
            <Card className="mb-4">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Profile image */}
                    <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                        {member.profileImagePath ? (
                            <img
                                src={member.profileImagePath}
                                alt={member.fullName}
                                className="w-24 h-24 rounded-full border border-gray-200"
                            />
                        ) : (
                            <Avatar
                                icon="pi pi-user"
                                size="xlarge"
                                className="w-24 h-24"
                                shape="circle"
                            />
                        )}

                        <div className="mt-2 flex flex-col items-center">
                            <div className="text-sm text-gray-500 mb-2">{t('common.id')}: {member.id}</div>
                            {statusTemplate(member.status)}
                        </div>
                    </div>

                    {/* Member details */}
                    <div className="flex-grow">
                        <h2 className="text-xl font-semibold mb-1">{member.fullName}</h2>
                        <p className="text-gray-600 mb-4">{member.businessName}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                            <div>
                                <span className="text-gray-500 text-sm">{t('member.businessInfo.businessType')}:</span>
                                <span className="ml-1">{t(`member.businessInfo.${member.businessType}`)}</span>
                            </div>

                            <div>
                                <span className="text-gray-500 text-sm">{t('member.contactInfo.email')}:</span>
                                <span className="ml-1">{member.email}</span>
                            </div>

                            <div>
                                <span className="text-gray-500 text-sm">{t('member.contactInfo.phone1')}:</span>
                                <span className="ml-1">{member.phone1}</span>
                            </div>

                            <div>
                                <span className="text-gray-500 text-sm">{t('member.personalInfo.qualification')}:</span>
                                <span className="ml-1">{t(`member.personalInfo.${member.qualification}`)}</span>
                            </div>

                            <div className="md:col-span-2">
                                <span className="text-gray-500 text-sm">{t('member.subscription.endDate')}:</span>
                                <span className="ml-1">{member.subscriptions[0]?.endDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tabs with member information */}
            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                {/* Personal Information */}
                <TabPanel header={t('member.personalInfo.title')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-fluid">
                            <h3 className="text-lg font-semibold mb-4">{t('member.personalInfo.title')}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t('member.personalInfo.fullName')}</label>
                                    <div className="p-inputtext p-disabled mb-3">{member.fullName}</div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t('member.personalInfo.idType')}</label>
                                    <div className="p-inputtext p-disabled mb-3">{t(`member.personalInfo.${member.idType}`)}</div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t('member.personalInfo.idNumber')}</label>
                                    <div className="p-inputtext p-disabled mb-3">{member.idNumber}</div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t('member.personalInfo.qualification')}</label>
                                    <div className="p-inputtext p-disabled mb-3">{t(`member.personalInfo.${member.qualification}`)}</div>
                                </div>
                            </div>

                            <h4 className="text-md font-semibold mt-3 mb-3">{t('member.attachments.title')}</h4>

                            <div className="grid grid-cols-1 gap-3">
                                {member.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center border border-gray-200 rounded-lg p-3">
                                        <i className="pi pi-file-pdf text-red-500 text-xl mr-3"></i>
                                        <div className="flex-grow">
                                            <div className="font-medium">{t(`member.attachments.${attachment.type}`)}</div>
                                            <div className="text-sm text-gray-500">{attachment.uploadDate}</div>
                                        </div>
                                        <Button
                                            icon="pi pi-download"
                                            rounded
                                            outlined
                                            onClick={() => {/* Download action */ }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div>
                            {/* ID Image */}
                            <Card className="mb-4">
                                <h3 className="text-lg font-semibold mb-3">{t('member.personalInfo.idImage')}</h3>
                                <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-center h-40 bg-gray-50">
                                    {member.idImagePath ? (
                                        <img src={member.idImagePath} alt="ID" className="max-h-full" />
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <i className="pi pi-id-card text-3xl mb-2"></i>
                                            <div>{t('common.noImageAvailable')}</div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Profile Image */}
                            <Card>
                                <h3 className="text-lg font-semibold mb-3">{t('member.personalInfo.profileImage')}</h3>
                                <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-center h-40 bg-gray-50">
                                    {member.profileImagePath ? (
                                        <img src={member.profileImagePath} alt="Profile" className="max-h-full" />
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <i className="pi pi-user text-3xl mb-2"></i>
                                            <div>{t('common.noImageAvailable')}</div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabPanel>

                {/* Business Information */}
                <TabPanel header={t('member.businessInfo.title')}>
                    <Card className="p-fluid">
                        <h3 className="text-lg font-semibold mb-4">{t('member.businessInfo.title')}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.businessInfo.businessName')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.businessName}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.businessInfo.businessType')}</label>
                                <div className="p-inputtext p-disabled mb-3">{t(`member.businessInfo.${member.businessType}`)}</div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-medium mb-1">{t('member.businessInfo.headOfficeAddress')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.headOfficeAddress}</div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-medium mb-1">{t('member.businessInfo.localBranchAddress')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.localBranchAddress}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.businessInfo.licenseNumber')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.licenseNumber}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.businessInfo.licenseIssueDate')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.licenseIssueDate}</div>
                            </div>
                        </div>

                        <h4 className="text-md font-semibold mt-4 mb-3">{t('member.attachments.licenseImage')}</h4>
                        <div className="border border-gray-200 rounded-lg p-3 flex items-center">
                            <i className="pi pi-file-pdf text-red-500 text-xl mr-3"></i>
                            <div className="flex-grow">
                                <div className="font-medium">{t('member.attachments.licenseImage')}</div>
                                <div className="text-sm text-gray-500">{member.attachments[0]?.uploadDate}</div>
                            </div>
                            <Button
                                icon="pi pi-download"
                                rounded
                                outlined
                                onClick={() => {/* Download action */ }}
                            />
                        </div>
                    </Card>
                </TabPanel>

                {/* Contact Information */}
                <TabPanel header={t('member.contactInfo.title')}>
                    <Card className="p-fluid">
                        <h3 className="text-lg font-semibold mb-4">{t('member.contactInfo.title')}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.phone1')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.phone1}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.phone2')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.phone2 || '-'}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.mobile')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.mobile}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.whatsapp')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.whatsapp}</div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.email')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.email}</div>
                            </div>
                        </div>
                    </Card>
                </TabPanel>

                {/* Subscription History */}
                <TabPanel header={t('member.subscription.history')}>
                    <Card>
                        <DataTable
                            value={member.subscriptions}
                            responsiveLayout="scroll"
                            className="p-datatable-sm"
                            emptyMessage={t('common.noSubscriptionsFound')}
                        >
                            <Column field="id" header={t('common.id')} sortable></Column>
                            <Column field="startDate" header={t('member.subscription.startDate')} sortable></Column>
                            <Column field="endDate" header={t('member.subscription.endDate')} sortable></Column>
                            <Column field="paymentId" header={t('member.payment.id')} sortable></Column>
                            <Column
                                field="isActive"
                                header={t('common.status')}
                                body={subscriptionStatusTemplate}
                                sortable
                            ></Column>
                        </DataTable>
                    </Card>
                </TabPanel>

                {/* Payment History */}
                <TabPanel header={t('member.payment.history')}>
                    <Card>
                        <DataTable
                            value={member.payments}
                            responsiveLayout="scroll"
                            className="p-datatable-sm"
                            emptyMessage={t('common.noPaymentsFound')}
                        >
                            <Column field="id" header={t('common.id')} sortable></Column>
                            <Column field="date" header={t('common.date')} sortable></Column>
                            <Column field="amount" header={t('common.amount')} body={amountTemplate} sortable></Column>
                            <Column field="type" header={t('common.type')} body={paymentTypeTemplate} sortable></Column>
                            <Column field="referenceNumber" header={t('member.payment.referenceNumber')} sortable></Column>
                            <Column field="paymentMethod" header={t('member.payment.method')} body={paymentMethodTemplate} sortable></Column>
                            <Column field="notes" header={t('common.notes')}></Column>
                        </DataTable>
                    </Card>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default MemberDetails;