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
import apiService from '../../services/apiService';


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
    });
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [expirationWindow, setExpirationWindow] = useState(null); // Use separate state for the dropdown

    // Expiration window options for filtering
    const expirationWindows = [
        { label: t('dashboard.subscriptions.expiring30Days'), value: '30' },
        { label: t('dashboard.subscriptions.expiring60Days'), value: '60' },
        { label: t('dashboard.subscriptions.expiring90Days'), value: '90' }
    ];

    // Fetch data
    useEffect(() => {
        fetchExpiringSubscriptions();
    }, [expirationWindow]); // Depend on the new state

    const fetchExpiringSubscriptions = async () => {
        try {
            setLoading(true);
            const days = expirationWindow || 365;
            const response = await apiService.getExpiringSubscriptions(days);

            if (response.success) {
                setSubscriptions(response.data);
                console.log(response);
            }
        } catch (error) {
            console.error('Error fetching expiring subscriptions:', error);
            // setSubscriptions(mockSubscriptionsData);
        } finally {
            setLoading(false);
        }
    };

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
        setExpirationWindow(e.value);
        // Data will be refetched automatically due to useEffect dependency
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
        return <span className="font-semibold">YER {rowData.lastPaymentAmount}</span>;
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

    // Clear filters
    const clearFilter = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue('');
        setExpirationWindow(null);
    };

    // Table header with search and filter
    const renderHeader = () => {
        return (
            <div className="flex flex-row justify-between items-center gap-2">
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

                <Dropdown
                    value={expirationWindow}
                    options={expirationWindows}
                    onChange={handleExpirationWindowChange}
                    placeholder={t('dashboard.subscriptions.selectWindow')}
                    className="p-column-filter"
                    showClear
                    style={{ width: '100%', height: '100%' }}
                />

                <Button
                    type="button"
                    label={t('common.clearFilters')}
                    icon="pi pi-filter-slash"
                    outlined
                    onClick={clearFilter}
                    className="p-button-sm"
                    disabled={!globalFilterValue && !expirationWindow}
                    style={{ width: '100%', height: '100%' }}
                />



                <Button
                    label={t('dashboard.subscriptions.sendReminders')}
                    icon="pi pi-envelope"
                    severity="info"
                    className="p-button-sm"
                    disabled={selectedSubscriptions.length === 0}
                    onClick={() => {/* Send reminders action */ }}
                    style={{ width: '100%', height: '100%' }}
                />
                <Button
                    type="button"
                    icon="pi pi-refresh"
                    outlined
                    onClick={fetchExpiringSubscriptions}
                    className="p-button-sm"
                    tooltip={t('common.refresh')}
                    style={{ width: '50%', height: '100%' }}
                />
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