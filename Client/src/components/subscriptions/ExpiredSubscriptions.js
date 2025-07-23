// src/components/subscriptions/ExpiredSubscriptions.js
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const ExpiredSubscriptions = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const navigate = useNavigate();
    const toast = useRef(null);

    // State
    const [expiredSubscriptions, setExpiredSubscriptions] = useState([]);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'member.status': { value: null, matchMode: FilterMatchMode.EQUALS },
        'expiredDays': { value: null, matchMode: FilterMatchMode.EQUALS },
        'lastPaymentDate': { value: null, matchMode: FilterMatchMode.DATE_IS }
    });
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    // Filter options
    const statusOptions = [
        { label: t('member.status.active'), value: 'active' },
        { label: t('member.status.inactive'), value: 'inactive' },
    ];

    const expiredDaysOptions = [
        { label: t('dashboard.subscriptions.expired1Month'), value: '30' },
        { label: t('dashboard.subscriptions.expired3Months'), value: '90' },
        { label: t('dashboard.subscriptions.expired6Months'), value: '180' },
        { label: t('dashboard.subscriptions.expired1Year'), value: '365' },
        { label: t('dashboard.subscriptions.expiredOver1Year'), value: '365+' }
    ];

    // Mock data - in real app, this would be fetched from API
    const mockExpiredData = [
        {
            id: 'SUB2001',
            member: {
                id: 'M2001',
                name: 'خالد محمد الشهري',
                businessName: 'مكتب الشهري للمحاسبة',
                email: 'khalid@shahri.com',
                phone: '+967 777 111 222',
                status: 'inactive'
            },
            subscriptionEndDate: '2024-08-15',
            expiredDays: 125,
            lastPaymentDate: '2023-08-15',
            lastPaymentAmount: 150,
            totalOwed: 300, // 2 years expired
            gracePeriodEnded: '2024-09-15',
            notificationsSent: 3,
            canRenew: true
        },
        {
            id: 'SUB2002',
            member: {
                id: 'M2002',
                name: 'نورا أحمد باطرفي',
                businessName: 'شركة باطرفي للاستشارات المالية',
                email: 'nora@batrafi.com',
                phone: '+967 777 333 444',
                status: 'inactive'
            },
            subscriptionEndDate: '2024-03-20',
            expiredDays: 269,
            lastPaymentDate: '2023-03-20',
            lastPaymentAmount: 150,
            totalOwed: 300,
            gracePeriodEnded: '2024-04-20',
            notificationsSent: 5,
            canRenew: true
        },
        {
            id: 'SUB2003',
            member: {
                id: 'M2003',
                name: 'عبدالرحمن سالم النقيب',
                businessName: 'مؤسسة النقيب للمراجعة',
                email: 'abdulrahman@naqeeb.com',
                phone: '+967 777 555 666',
                status: 'inactive'
            },
            subscriptionEndDate: '2023-12-10',
            expiredDays: 371,
            lastPaymentDate: '2022-12-10',
            lastPaymentAmount: 150,
            totalOwed: 450,
            gracePeriodEnded: '2024-01-10',
            notificationsSent: 8,
            canRenew: false // Suspended for too long
        },
        {
            id: 'SUB2004',
            member: {
                id: 'M2004',
                name: 'فاطمة علي الحضرمي',
                businessName: 'مكتب الحضرمي للخدمات المحاسبية',
                email: 'fatima@hadrami.com',
                phone: '+967 777 777 888',
                status: 'inactive'
            },
            subscriptionEndDate: '2024-10-30',
            expiredDays: 48,
            lastPaymentDate: '2023-10-30',
            lastPaymentAmount: 150,
            totalOwed: 150,
            gracePeriodEnded: '2024-11-30',
            notificationsSent: 2,
            canRenew: true
        },
        {
            id: 'SUB2005',
            member: {
                id: 'M2005',
                name: 'محمد عبدالله الزبيدي',
                businessName: 'الزبيدي والشركاه للمحاسبة',
                email: 'mohammed@zubaidi.com',
                phone: '+967 777 999 000',
                status: 'inactive'
            },
            subscriptionEndDate: '2024-07-05',
            expiredDays: 165,
            lastPaymentDate: '2023-07-05',
            lastPaymentAmount: 150,
            totalOwed: 300,
            gracePeriodEnded: '2024-08-05',
            notificationsSent: 4,
            canRenew: true
        }
    ];

    // Fetch data
    useEffect(() => {
        setTimeout(() => {
            setExpiredSubscriptions(mockExpiredData);
            setLoading(false);
        }, 1000);
    }, []);

    // Global filter change handler
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // Custom filter function for expired days
    const filterExpiredDays = (value, filter) => {
        if (filter === null || filter === undefined) {
            return true;
        }

        if (filter === '365+') {
            return value > 365;
        }

        const filterValue = parseInt(filter, 10);
        return value <= filterValue;
    };

    // Templates for table columns
    const memberTemplate = (rowData) => {
        // <div className="text-sm text-gray-500">{rowData.member.id}</div>
        // <div className="text-sm text-gray-500">{rowData.member.businessName}</div>
        return (
            <div className="flex items-center">
                <div className="ml-3">
                    <div className="font-medium text-gray-900">{rowData.member.name}</div>
                </div>
            </div>
        );
    };

    const statusTemplate = (rowData) => {
        const statusMap = {
            'active': { severity: 'success', label: t('common.active') },
            'inactive': { severity: 'warning', label: t('common.inactive') },
            'suspended': { severity: 'danger', label: t('member.status.suspended') }
        };

        const status = statusMap[rowData.member.status];
        return <Tag severity={status.severity} value={status.label} />;
    };

    const expiredDaysTemplate = (rowData) => {
        let severity = 'info';

        if (rowData.expiredDays > 365) {
            severity = 'danger';
        } else if (rowData.expiredDays > 180) {
            severity = 'warning';
        }

        return (
            <div className="flex items-center">
                {/* <i className={`pi ${icon} mr-2 text-${severity === 'danger' ? 'red' : severity === 'warning' ? 'yellow' : 'blue'}-600`}></i> */}
                <Tag
                    severity={severity}
                    value={`${rowData.expiredDays} ${t('common.days')}`}
                />
            </div>
        );
    };

    const amountTemplate = (rowData) => {
        return (
            <div className="text-right">
                <div className="font-semibold text-red-600">${rowData.totalOwed}</div>
                <div className="text-xs text-gray-500">{t('dashboard.subscriptions.totalOwed')}</div>
            </div>
        );
    };

    const actionsTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    icon="pi pi-eye"
                    rounded
                    outlined
                    className="p-button-sm"
                    onClick={() => navigate(`/dashboard/members/view/${rowData.member.id}`)}
                    tooltip={t('common.viewDetails')}
                    tooltipOptions={{ position: 'top' }}
                />
                {rowData.canRenew ? (
                    <Button
                        icon="pi pi-sync"
                        rounded
                        outlined
                        severity="success"
                        className="p-button-sm"
                        onClick={() => navigate(`/dashboard/subscriptions/renew/${rowData.member.id}`)}
                        tooltip={t('dashboard.subscriptions.renew')}
                        tooltipOptions={{ position: 'top' }}
                    />
                ) : (
                    <Button
                        icon="pi pi-ban"
                        rounded
                        outlined
                        severity="danger"
                        className="p-button-sm"
                        onClick={() => contactMember(rowData)}
                        tooltip={t('dashboard.subscriptions.contactRequired')}
                        tooltipOptions={{ position: 'top' }}
                    />
                )}

            </div>
        );
    };


    const contactMember = (subscription) => {
        toast.current?.show({
            severity: 'info',
            summary: 'يتطلب التواصل المباشر',
            detail: `يرجى التواصل مع ${subscription.member.name} على ${subscription.member.phone}`,
            life: 5000
        });
    };

    const sendBulkNotifications = () => {
        if (selectedSubscriptions.length === 0) return;

        setBulkActionLoading(true);
        setTimeout(() => {
            toast.current?.show({
                severity: 'success',
                summary: 'تم الإرسال',
                detail: `تم إرسال إشعارات إلى ${selectedSubscriptions.length} عضو`,
                life: 3000
            });
            setBulkActionLoading(false);
            setSelectedSubscriptions([]);
        }, 2000);
    };

    const exportExpiredList = () => {
        // In real implementation, this would generate and download a file
        toast.current?.show({
            severity: 'info',
            summary: 'جاري التصدير',
            detail: 'سيتم تنزيل قائمة الاشتراكات المنتهية',
            life: 3000
        });
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'member.status': { value: null, matchMode: FilterMatchMode.EQUALS },
            'expiredDays': { value: null, matchMode: FilterMatchMode.EQUALS },
            'lastPaymentDate': { value: null, matchMode: FilterMatchMode.DATE_IS }
        });
        setGlobalFilterValue('');
    };

    // Filter templates
    const statusFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statusOptions}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder={t('common.selectStatus')}
                className="p-column-filter"
                showClear
            />
        );
    };

    const expiredDaysFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={expiredDaysOptions}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder={t('dashboard.subscriptions.selectPeriod')}
                className="p-column-filter"
                showClear
            />
        );
    };

    // Toolbar content
    const leftToolbarTemplate = () => {
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder={t('common.searchMembers')}
                        className="p-inputtext-sm"
                    />
                </span>
                <Button
                    label={t('common.clearFilters')}
                    icon="pi pi-filter-slash"
                    outlined
                    onClick={clearFilters}
                    disabled={!globalFilterValue && !filters['member.status'].value && !filters['expiredDays'].value}
                />
            </div>
        );
    };

    // Member details dialog


    return (
        <div>
            <Toast ref={toast} position="top-center" />
            <ConfirmDialog />

            {/* Header */}
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{t('dashboard.subscriptions.expired')}</h1>
                    <p className="text-gray-600">{t('dashboard.subscriptions.expiredDescription')}</p>
                </div>
                <div className="text-sm text-gray-500">
                    {t('common.totalRecords')}: {expiredSubscriptions.length}
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-red-50 border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-red-600">
                                {expiredSubscriptions.filter(s => s.expiredDays > 365).length}
                            </div>
                            <div className="text-sm text-red-700">منتهية أكثر من سنة</div>
                        </div>
                        <i className="pi pi-exclamation-triangle text-3xl text-red-400"></i>
                    </div>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-orange-600">
                                {expiredSubscriptions.filter(s => s.expiredDays > 180 && s.expiredDays <= 365).length}
                            </div>
                            <div className="text-sm text-orange-700">منتهية 6-12 شهر</div>
                        </div>
                        <i className="pi pi-clock text-3xl text-orange-400"></i>
                    </div>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {expiredSubscriptions.filter(s => s.expiredDays > 90 && s.expiredDays <= 180).length}
                            </div>
                            <div className="text-sm text-yellow-700">منتهية 3-6 أشهر</div>
                        </div>
                        <i className="pi pi-calendar-times text-3xl text-yellow-400"></i>
                    </div>
                </Card>


            </div>

            {/* Main Table */}
            <Card>
                <Toolbar className="mb-4" left={rightToolbarTemplate} />

                <DataTable
                    value={expiredSubscriptions}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    filters={filters}
                    filterDisplay="row"
                    globalFilterFields={['member.name', 'member.id', 'member.businessName', 'member.email']}
                    emptyMessage={t('dashboard.subscriptions.noExpiredSubscriptions')}
                    // selectionMode='multiple'
                    // selection={selectedSubscriptions}
                    // onSelectionChange={e => setSelectedSubscriptions(e.value)}
                    scrollable
                    // scrollHeight="calc(100vh - 400px)"
                    selectAll
                    resizableColumns
                    currentPageReportTemplate={t('common.showing') + ' {first} ' + t('common.to') + ' {last} ' + t('common.of') + ' {totalRecords} ' + t('common.entries')}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >

                    <Column
                        body={actionsTemplate}
                        header={t('common.actions')}
                        style={{ minWidth: '150px', textAlign: 'center' }}
                    />
                    <Column
                        field="member"
                        header={t('member.info')}
                        body={memberTemplate}
                        sortable
                        style={{ minWidth: '250px', textAlign: 'right' }}
                    />
                    <Column
                        field="subscriptionEndDate"
                        header={t('member.subscription.endDate')}
                        sortable
                        style={{ minWidth: '120px', textAlign: 'right' }}
                    />
                    <Column
                        field="expiredDays"
                        header={t('dashboard.subscriptions.expiredDays')}
                        body={expiredDaysTemplate}
                        sortable
                        // filter
                        // filterElement={expiredDaysFilterTemplate}
                        // filterFunction={filterExpiredDays}
                        // showFilterMenu={false}
                        style={{ minWidth: '150px', textAlign: 'right' }}
                    />
                    <Column
                        field="lastPaymentDate"
                        header={t('dashboard.subscriptions.lastPayment')}
                        sortable
                        style={{ minWidth: '120px', textAlign: 'right' }}
                    />
                    <Column
                        field="totalOwed"
                        header={t('dashboard.subscriptions.amountOwed')}
                        body={amountTemplate}
                        sortable
                        style={{ minWidth: '120px', textAlign: 'right' }}
                    />
                    <Column
                        field="member.status"
                        header={t('common.status')}
                        body={statusTemplate}
                        sortable
                        // filter
                        // filterElement={statusFilterTemplate}
                        // showFilterMenu={false}
                        style={{ minWidth: '100px', textAlign: 'right' }}
                    />

                </DataTable>
            </Card>

            {/* Details Dialog */}

        </div>
    );
};

export default ExpiredSubscriptions;