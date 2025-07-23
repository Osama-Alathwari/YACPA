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
import apiService from '../../services/apiService';

const ExpiredSubscriptions = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const navigate = useNavigate();
    const toast = useRef(null);

    // State
    const [expiredSubscriptions, setExpiredSubscriptions] = useState([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    // Toolbar filter states
    const [selectedExpiredDaysFilter, setSelectedExpiredDaysFilter] = useState(null);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState(null);

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

    // Fetch data from API
    const fetchExpiredSubscriptions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.getExpiredSubscriptions();

            if (response && response.data) {
                setExpiredSubscriptions(response.data);
                setFilteredSubscriptions(response.data);
            } else {
                setExpiredSubscriptions([]);
                setFilteredSubscriptions([]);
            }
        } catch (err) {
            console.error('Error fetching expired subscriptions:', err);
            setError(err.message || 'Failed to fetch expired subscriptions');

            // Show error toast
            toast.current?.show({
                severity: 'error',
                summary: t('common.error'),
                detail: err.message || t('dashboard.subscriptions.fetchError'),
                life: 5000
            });

            // Set empty arrays on error
            setExpiredSubscriptions([]);
            setFilteredSubscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchExpiredSubscriptions();
    }, []);

    // Apply filters whenever filter values change
    useEffect(() => {
        applyFilters();
    }, [selectedExpiredDaysFilter, selectedStatusFilter, expiredSubscriptions]);

    // Apply toolbar filters
    const applyFilters = () => {
        let filtered = [...expiredSubscriptions];

        // Apply expired days filter
        if (selectedExpiredDaysFilter) {
            filtered = filtered.filter(subscription => {
                if (selectedExpiredDaysFilter === '365+') {
                    return subscription.expiredDays > 365;
                }
                const filterValue = parseInt(selectedExpiredDaysFilter, 10);
                return subscription.expiredDays >= filterValue;
            });
        }

        // Apply status filter
        if (selectedStatusFilter) {
            filtered = filtered.filter(subscription =>
                subscription.member.status === selectedStatusFilter
            );
        }

        setFilteredSubscriptions(filtered);
    };

    // Global filter change handler
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // Handle expired days filter change
    const handleExpiredDaysFilterChange = (e) => {
        setSelectedExpiredDaysFilter(e.value);
    };

    // Handle status filter change
    const handleStatusFilterChange = (e) => {
        setSelectedStatusFilter(e.value);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedExpiredDaysFilter(null);
        setSelectedStatusFilter(null);
        setGlobalFilterValue('');
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'member.status': { value: null, matchMode: FilterMatchMode.EQUALS },
            'expiredDays': { value: null, matchMode: FilterMatchMode.EQUALS },
            'lastPaymentDate': { value: null, matchMode: FilterMatchMode.DATE_IS }
        });
    };

    // Check if any filters are active
    const hasActiveFilters = () => {
        return selectedExpiredDaysFilter || selectedStatusFilter || globalFilterValue;
    };

    // Custom filter function for expired days (for DataTable column filter if needed)
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

    // Refresh data handler
    const handleRefresh = () => {
        fetchExpiredSubscriptions();
    };

    // Templates for table columns
    const memberTemplate = (rowData) => {
        return (
            <div className="flex items-center">
                <div className="ml-3">
                    <div className="font-medium text-gray-900">{rowData.member?.name || 'N/A'}</div>
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

        const status = statusMap[rowData.member?.status] || statusMap['inactive'];
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
                <Tag
                    severity={severity}
                    value={`${rowData.expiredDays || 0} ${t('common.days')}`}
                />
            </div>
        );
    };

    const amountTemplate = (rowData) => {
        return (
            <div className="text-right">
                <div className="font-semibold text-red-600">YER {rowData.totalOwed || 0}</div>
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
                    onClick={() => navigate(`/dashboard/members/view/${rowData.member?.id}`)}
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
                        onClick={() => navigate(`/dashboard/subscriptions/renew/${rowData.member?.id}`)}
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
            detail: `يرجى التواصل مع ${subscription.member?.name || 'العضو'} على ${subscription.member?.phone || 'رقم غير متوفر'}`,
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
        toast.current?.show({
            severity: 'info',
            summary: 'جاري التصدير',
            detail: 'سيتم تنزيل قائمة الاشتراكات المنتهية',
            life: 3000
        });
    };

    // Enhanced toolbar content with filters
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        {t('dashboard.subscriptions.filterByExpiredDays')}:
                    </label>
                    <Dropdown
                        value={selectedExpiredDaysFilter}
                        options={expiredDaysOptions}
                        onChange={handleExpiredDaysFilterChange}
                        placeholder={t('dashboard.subscriptions.selectPeriod')}
                        className="w-48"
                        showClear
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        {t('common.status')}:
                    </label>
                    <Dropdown
                        value={selectedStatusFilter}
                        options={statusOptions}
                        onChange={handleStatusFilterChange}
                        placeholder={t('common.selectStatus')}
                        className="w-40"
                        showClear
                    />
                </div>
            </div>
        );
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
                    onClick={clearAllFilters}
                    disabled={!hasActiveFilters()}
                    size="small"
                />

                <Button
                    icon="pi pi-refresh"
                    outlined
                    onClick={handleRefresh}
                    disabled={loading}
                    tooltip={t('common.refresh')}
                    tooltipOptions={{ position: 'top' }}
                    size="small"
                />
            </div>
        );
    };

    // Calculate filtered statistics
    const getFilteredStats = () => {
        const over1Year = filteredSubscriptions.filter(s => s.expiredDays > 365).length;
        const sixToTwelveMonths = filteredSubscriptions.filter(s => s.expiredDays > 180 && s.expiredDays <= 365).length;
        const threeToSixMonths = filteredSubscriptions.filter(s => s.expiredDays > 90 && s.expiredDays <= 180).length;
        const oneToThreeMonths = filteredSubscriptions.filter(s => s.expiredDays > 0 && s.expiredDays <= 90).length;

        return { over1Year, sixToTwelveMonths, threeToSixMonths, oneToThreeMonths };
    };

    const stats = getFilteredStats();

    // Show error state if there's an error
    if (error && !loading) {
        return (
            <div>
                <Toast ref={toast} position="top-center" />
                <Card>
                    <div className="text-center py-8">
                        <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {t('common.error')}
                        </h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button
                            label={t('common.retry')}
                            icon="pi pi-refresh"
                            onClick={handleRefresh}
                            className="p-button-outlined"
                        />
                    </div>
                </Card>
            </div>
        );
    }

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
                    {t('common.totalRecords')}: {filteredSubscriptions.length}
                    {hasActiveFilters() && (
                        <span className="ml-2 text-blue-600">
                            ({t('common.filtered')})
                        </span>
                    )}
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-red-50 border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-red-600">
                                {stats.over1Year}
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
                                {stats.sixToTwelveMonths}
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
                                {stats.threeToSixMonths}
                            </div>
                            <div className="text-sm text-yellow-700">منتهية 3-6 أشهر</div>
                        </div>
                        <i className="pi pi-calendar-times text-3xl text-yellow-400"></i>
                    </div>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.oneToThreeMonths}
                            </div>
                            <div className="text-sm text-blue-700">منتهية 1-3 أشهر</div>
                        </div>
                        <i className="pi pi-calendar-times text-3xl text-blue-400"></i>
                    </div>
                </Card>
            </div>

            {/* Main Table */}
            <Card>
                <Toolbar
                    className="mb-4"
                    right={leftToolbarTemplate}
                    center={<Divider layout="vertical" />}
                    left={rightToolbarTemplate}
                />

                <DataTable
                    value={filteredSubscriptions}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    filters={filters}
                    filterDisplay="row"
                    globalFilterFields={['member.name', 'member.id', 'member.businessName', 'member.email']}
                    emptyMessage={t('dashboard.subscriptions.noExpiredSubscriptions')}
                    onSelectionChange={e => setSelectedSubscriptions(e.value)}
                    scrollable
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
                        style={{ minWidth: '100px', textAlign: 'right' }}
                    />
                </DataTable>
            </Card>
        </div>
    );
};

export default ExpiredSubscriptions;