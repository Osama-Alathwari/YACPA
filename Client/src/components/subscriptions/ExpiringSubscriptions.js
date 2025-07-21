// src/components/subscriptions/ExpiringSubscriptions.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const ExpiringSubscriptions = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();
    const navigate = useNavigate();

    // State
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        expirationWindow: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);

    // Expiration window options for filtering
    const expirationWindows = [
        { label: t('dashboard.subscriptions.expiring30Days'), value: '30' },
        { label: t('dashboard.subscriptions.expiring60Days'), value: '60' },
        { label: t('dashboard.subscriptions.expiring90Days'), value: '90' }
    ];

    // Mock data - in a real app, this would be fetched from an API
    const mockSubscriptionsData = [
        {
            id: 'SUB1001',
            memberId: 'M1001',
            memberName: 'عبدالله سالم الهاشمي',
            businessName: 'شركة الأمل للمحاسبة',
            endDate: '2025-06-15',
            daysRemaining: 30,
            status: 'active',
            lastPaymentDate: '2024-06-15',
            lastPaymentAmount: 150
        },
        {
            id: 'SUB1002',
            memberId: 'M1002',
            memberName: 'سارة محمد الغامدي',
            businessName: 'مكتب السارة للاستشارات',
            endDate: '2025-06-20',
            daysRemaining: 35,
            status: 'active',
            lastPaymentDate: '2024-06-20',
            lastPaymentAmount: 150
        },
        {
            id: 'SUB1003',
            memberId: 'M1003',
            memberName: 'محمد علي المقطري',
            businessName: 'المحاسبون المتحدون',
            endDate: '2025-07-05',
            daysRemaining: 50,
            status: 'active',
            lastPaymentDate: '2024-07-05',
            lastPaymentAmount: 150
        },
        {
            id: 'SUB1004',
            memberId: 'M1004',
            memberName: 'أحمد عبدالله البكري',
            businessName: 'شركة النور المالية',
            endDate: '2025-07-15',
            daysRemaining: 60,
            status: 'active',
            lastPaymentDate: '2024-07-15',
            lastPaymentAmount: 150
        },
        {
            id: 'SUB1005',
            memberId: 'M1005',
            memberName: 'فاطمة عبدالرحمن السقاف',
            businessName: 'فاطمة للمحاسبة',
            endDate: '2025-08-10',
            daysRemaining: 85,
            status: 'active',
            lastPaymentDate: '2024-08-10',
            lastPaymentAmount: 150
        }
    ];

    // Fetch data
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setSubscriptions(mockSubscriptionsData);
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

    // Handle expiration window change
    const handleExpirationWindowChange = (e) => {
        const value = e.value;
        let _filters = { ...filters };
        _filters['expirationWindow'].value = value;
        setFilters(_filters);
    };

    // Custom filter function for expiration window
    const expirationWindowFilter = (value, filter) => {
        if (filter === null || filter === undefined) {
            return true;
        }
        const filterValue = parseInt(filter, 10);
        return value <= filterValue;
    };

    // Template for status column
    const statusTemplate = (rowData) => {
        const statusMap = {
            'active': { severity: 'success', label: t('common.active') },
            'expired': { severity: 'danger', label: t('common.expired') },
            'pending': { severity: 'warning', label: t('common.pending') }
        };

        return <Tag severity={statusMap[rowData.status].severity} value={statusMap[rowData.status].label} />;
    };

    // Template for days remaining column
    const daysRemainingTemplate = (rowData) => {
        let severity = 'success';

        if (rowData.daysRemaining <= 30) {
            severity = 'danger';
        } else if (rowData.daysRemaining <= 60) {
            severity = 'warning';
        }

        return <Tag severity={severity} value={`${rowData.daysRemaining} ${t('common.days')}`} />;
    };

    // Template for amount column
    const amountTemplate = (rowData) => {
        return <span className="font-semibold">${rowData.lastPaymentAmount}</span>;
    };

    // Template for actions column
    const actionsTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    icon="pi pi-eye"
                    rounded
                    outlined
                    className="p-button-sm"
                    onClick={() => navigate(`/dashboard/members/view/${rowData.memberId}`)}
                    tooltip={t('common.viewMember')}
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-sync"
                    rounded
                    outlined
                    severity="success"
                    className="p-button-sm"
                    onClick={() => navigate(`/dashboard/subscriptions/renew/${rowData.memberId}`)}
                    tooltip={t('dashboard.subscriptions.renew')}
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-envelope"
                    rounded
                    outlined
                    severity="info"
                    className="p-button-sm"
                    onClick={() => {/* Send reminder action */ }}
                    tooltip={t('dashboard.subscriptions.sendReminder')}
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    // Template for member ID column with link
    const memberIdTemplate = (rowData) => {
        return (
            <Button
                link
                label={rowData.memberId}
                onClick={() => navigate(`/dashboard/members/view/${rowData.memberId}`)}
                className="p-0 underline font-normal"
            />
        );
    };

    // Template for expiration window filter
    const expirationWindowFilterTemplate = (e) => {
        const value = e.value;
        const _filters = { ...filters };
        _filters.expirationWindow.value = value;
        setFilters(_filters);
    };

    // Clear filters
    const clearFilter = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            expirationWindow: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    // Table header with search and filter
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder={t('common.searchMembers')}
                            className="p-inputtext-sm"
                        />
                    </span>
                </div>

                <div className="flex gap-2">
                    <Dropdown
                        value={filters.expirationWindow.value}
                        options={expirationWindows}
                        onChange={handleExpirationWindowChange}
                        placeholder={t('dashboard.subscriptions.selectWindow')}
                        className="p-column-filter"
                        showClear
                    // style={{ width: '100%', height: '100%' }}
                    />

                    <Button
                        type="button"
                        label={t('common.clearFilters')}
                        icon="pi pi-filter-slash"
                        outlined
                        onClick={clearFilter}
                        className="p-button-sm"
                        disabled={!globalFilterValue && !filters.expirationWindow.value}
                    />
                    <Button
                        label={t('dashboard.subscriptions.sendReminders')}
                        icon="pi pi-envelope"
                        severity="info"
                        className="p-button-sm"
                        disabled={selectedSubscriptions.length === 0}
                        onClick={() => {/* Send reminders action */ }}
                    />
                </div>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{t('dashboard.subscriptions.expiring')}</h1>
                    <p className="text-gray-600">{t('dashboard.subscriptions.expiringDescription')}</p>
                </div>
                <div className="text-sm text-gray-500">
                    {t('common.totalRecords')}: {subscriptions.length}
                </div>
            </div>

            <Card>
                <DataTable
                    value={subscriptions}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    filters={filters}
                    filterDisplay="row"
                    globalFilterFields={['memberId', 'memberName', 'businessName']}
                    header={header}
                    emptyMessage={t('dashboard.subscriptions.noExpiringSubscriptions')}
                    selectionMode="checkbox"
                    selection={selectedSubscriptions}
                    onSelectionChange={e => setSelectedSubscriptions(e.value)}
                    scrollable
                    // scrollHeight="calc(100vh - 350px)"
                    selectAll
                    resizableColumns
                    currentPageReportTemplate={t('common.showing') + ' {first} ' + t('common.to') + ' {last} ' + t('common.of') + ' {totalRecords} ' + t('common.entries')}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '2em' }} />
                    <Column body={actionsTemplate} header={t('common.actions')} style={{ minWidth: '150px', textAlign: 'center' }} />
                    <Column field="memberId" header={t('common.memberId')} body={memberIdTemplate} sortable style={{ minWidth: '100px', textAlign: 'right' }} />
                    <Column field="memberName" header={t('common.name')} sortable style={{ minWidth: '200px', textAlign: 'right' }} />
                    <Column field="businessName" header={t('common.business')} sortable style={{ minWidth: '200px', textAlign: 'right' }} />
                    <Column field="endDate" header={t('member.subscription.endDate')} sortable style={{ minWidth: '120px', textAlign: 'right' }} />
                    <Column
                        field="daysRemaining"
                        header={t('dashboard.subscriptions.daysRemaining')}
                        body={daysRemainingTemplate}
                        sortable
                        style={{ minWidth: '150px', textAlign: 'right' }}
                        filter
                        filterField="daysRemaining"
                        showFilterMenu={false}
                        filterElement={() => null} // Hide default filter input
                        filterFunction={expirationWindowFilter}
                    />
                    <Column field="status" header={t('common.status')} body={statusTemplate} sortable style={{ minWidth: '100px', textAlign: 'right' }} />
                    <Column field="lastPaymentDate" header={t('dashboard.subscriptions.lastPayment')} sortable style={{ minWidth: '120px', textAlign: 'right' }} />
                    <Column field="lastPaymentAmount" header={t('common.amount')} body={amountTemplate} sortable style={{ minWidth: '100px', textAlign: 'right' }} />
                </DataTable>
            </Card>
        </div>
    );
};

export default ExpiringSubscriptions;