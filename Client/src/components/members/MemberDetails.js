// src/components/members/MemberDetails.js
import React, { useState, useEffect } from 'react';
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
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { useLanguage } from '../../contexts/LanguageContext';
import apiService from '../../services/apiService';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';

const MemberDetails = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [showRenewDialog, setShowRenewDialog] = useState(false);
    const [showCardDialog, setShowCardDialog] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date());
    const [notes, setNotes] = useState('');

    // Fetch member data
    useEffect(() => {
        fetchMemberData();
    }, [id]);

    const fetchMemberData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getMember(id);
            if (response.success) {
                setMember(response.data);
            } else {
                setError(response.message || 'خطأ في تحميل بيانات العضو');
            }
        } catch (err) {
            console.error('Error fetching member:', err);
            setError('خطأ في تحميل بيانات العضو');
        } finally {
            setLoading(false);
        }
    };

    // Status template
    const statusTemplate = (status) => {
        const severity = status === 'active' ? 'success' :
            status === 'inactive' ? 'danger' : 'warning';
        const label = status === 'active' ? t('common.active') :
            status === 'inactive' ? t('common.inactive') : t('common.pending');
        return <Tag value={label} severity={severity} />;
    };

    // Handle subscription renewal
    const handleRenewSubscription = () => {
        setShowRenewDialog(false);
        navigate(`/dashboard/subscriptions/renew/${id}`);
    };

    // Handle status change
    const handleStatusChange = () => {
        // Implementation for status change
        console.log('Status change for:', member.id);
        // You can implement the actual status change logic here
        setMember(prev => ({
            ...prev,
            status: prev.status === 'active' ? 'inactive' : 'active'
        }));
    };

    // Navigate back to members list
    const goBack = () => {
        navigate('/dashboard/members/view');
    };

    // Render loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ProgressSpinner />
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="p-4">
                <Message severity="error" text={error} />
                <Button
                    label={t('common.retry')}
                    onClick={fetchMemberData}
                    className="mt-2"
                />
            </div>
        );
    }

    // Render if no member data
    if (!member) {
        return (
            <div className="p-4">
                <Message severity="warn" text="لم يتم العثور على بيانات العضو" />
            </div>
        );
    }

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
                            <div className="font-bold">{member.status === 'active' ? 'نشط' : 'غير نشط'}</div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-xs text-blue-200">جمعية المحاسبين القانونيين اليمنية</div>
                        <div className="text-xs text-blue-200">Yemen Association of Certified Public Accountants</div>
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
                        {t('dashboard.subscriptions.renewMemberMessage', { name: member?.fullName || '' })}
                    </p>
                    <div className="mb-4">
                        <label className="block mb-1">{t('member.subscription.currentEndDate')}</label>
                        <div className="p-inputtext p-disabled">
                            {member?.subscriptions?.[0]?.endDate}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">{t('member.subscription.newEndDate')}</label>
                        <div className="p-inputtext p-disabled">
                            {member?.subscriptions?.[0]?.endDate && new Date(new Date(member.subscriptions[0].endDate).setFullYear(
                                new Date(member.subscriptions[0].endDate).getFullYear() + 1
                            )).toISOString().split('T')[0]}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">{t('member.payment.amount')}</label>
                        <div className="p-inputtext p-disabled">
                            $150
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">{t('member.payment.paymentMethod')}</label>
                        <Dropdown
                            value={paymentMethod}
                            options={[
                                { label: t('common.cash'), value: 'cash' },
                                { label: t('common.bankTransfer'), value: 'bank_transfer' },
                            ]}
                            onChange={(e) => setPaymentMethod(e.value)}
                            placeholder={t('member.payment.method')}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">{t('member.payment.referenceNumber')}</label>
                        <InputText
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            placeholder={t('member.payment.enterReference')}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">{t('member.payment.date')}</label>
                        <Calendar
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.value)}
                            showIcon
                            dateFormat="yy-mm-dd"
                            maxDate={new Date()}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">{t('member.payment.notes')}</label>
                        <InputTextarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder={t('member.payment.enterNotes')}
                        />
                    </div>
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
                                <span className="ml-1">{member.businessType}</span>
                            </div>

                            <div>
                                <span className="text-gray-500 text-sm">{t('member.personalInfo.qualification')}:</span>
                                <span className="ml-1">{member.qualification}</span>
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
                                <span className="text-gray-500 text-sm">{t('member.contactInfo.mobile')}:</span>
                                <span className="ml-1">{member.mobile}</span>
                            </div>

                            <div>
                                <span className="text-gray-500 text-sm">{t('common.createdAt')}: </span>
                                <span className="ml-1">{member.createdAt}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Detailed information tabs */}
            <Card>
                <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                    {/* Personal Information */}
                    <TabPanel header={t('member.personalInfo.title')}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.personalInfo.fullName')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.fullName}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.personalInfo.idType')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.idType}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.personalInfo.idNumber')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.idNumber}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.personalInfo.qualification')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.qualification}</div>
                            </div>
                        </div>

                        {member.idImagePath && (
                            <>
                                <h4 className="text-md font-semibold mt-4 mb-3">{t('member.attachments.idImage')}</h4>
                                <div className="border border-gray-200 rounded-lg p-3 flex items-center">
                                    <i className="pi pi-file-pdf text-red-500 text-xl mr-3"></i>
                                    <div className="flex-grow">
                                        <div className="font-medium">{t('member.attachments.idImage')}</div>
                                        <div className="text-sm text-gray-500">{member.createdAt}</div>
                                    </div>
                                    <Button
                                        icon="pi pi-download"
                                        rounded
                                        outlined
                                        onClick={() => window.open(member.idImagePath, '_blank')}
                                    />
                                </div>
                            </>
                        )}
                    </TabPanel>

                    {/* Business Information */}
                    <TabPanel header={t('member.businessInfo.title')}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.businessInfo.businessName')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.businessName}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.businessInfo.businessType')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.businessType}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.businessInfo.headOfficeAddress')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.headOfficeAddress}</div>
                            </div>

                            <div>
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

                        {/* Attachments */}
                        {member.attachments && member.attachments.length > 0 && (
                            <>
                                <h4 className="text-md font-semibold mt-4 mb-3">{t('member.attachments.title')}</h4>
                                {member.attachments.map((attachment, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-3 flex items-center mb-2">
                                        <i className="pi pi-file-pdf text-red-500 text-xl mr-3"></i>
                                        <div className="flex-grow">
                                            <div className="font-medium">{attachment.type}</div>
                                            <div className="text-sm text-gray-500">{attachment.uploadDate}</div>
                                        </div>
                                        {attachment.path && (
                                            <Button
                                                icon="pi pi-download"
                                                rounded
                                                outlined
                                                onClick={() => window.open(attachment.path, '_blank')}
                                            />
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </TabPanel>

                    {/* Contact Information */}
                    <TabPanel header={t('member.contactInfo.title')}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.email')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.email}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.phone1')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.phone1}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.phone2')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.phone2}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.mobile')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.mobile}</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">{t('member.contactInfo.whatsapp')}</label>
                                <div className="p-inputtext p-disabled mb-3">{member.whatsapp}</div>
                            </div>
                        </div>
                    </TabPanel>

                    {/* Subscription History */}
                    <TabPanel header={t('member.subscription.history')}>
                        <DataTable
                            value={member.subscriptions}
                            responsiveLayout="scroll"
                            emptyMessage={t('member.subscription.noSubscriptions')}
                        >
                            <Column field="id" header={t('common.id')} />
                            <Column field="startDate" header={t('member.subscription.startDate')} />
                            <Column field="endDate" header={t('member.subscription.endDate')} />
                            <Column
                                field="isActive"
                                header={t('common.status')}
                                body={(rowData) =>
                                    <Tag
                                        value={rowData.isActive ? t('common.active') : t('common.inactive')}
                                        severity={rowData.isActive ? 'success' : 'danger'}
                                    />
                                }
                            />
                        </DataTable>
                    </TabPanel>

                    {/* Payment History */}
                    <TabPanel header={t('member.payment.history')}>
                        <DataTable
                            value={member.payments}
                            responsiveLayout="scroll"
                            emptyMessage={t('member.payment.noPayments')}
                        >
                            <Column field="id" header={t('common.id')} />
                            <Column field="date" header={t('member.payment.date')} />
                            <Column field="amount" header={t('member.payment.amount')} />
                            <Column field="type" header={t('member.payment.type')} />
                            <Column field="referenceNumber" header={t('member.payment.referenceNumber')} />
                            <Column field="paymentMethod" header={t('member.payment.method')} />
                        </DataTable>
                    </TabPanel>
                </TabView>
            </Card>
        </div>
    );
};

export default MemberDetails;