// src/components/members/MembersList.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { FilterMatchMode } from 'primereact/api';
import { useLanguage } from '../../contexts/LanguageContext';

const MembersList = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();

    // Mock members data
    const membersData = [
        {
            id: 'M1001',
            fullName: 'عبدالله سالم الهاشمي',
            businessName: 'شركة الأمل للمحاسبة',
            businessType: 'company',
            email: 'abdullah@alamamal.com',
            phone: '+967 777 123 456',
            subscriptionEndDate: '2026-04-28',
            status: 'active'
        },
        {
            id: 'M1002',
            fullName: 'سارة محمد الغامدي',
            businessName: 'مكتب السارة للاستشارات',
            businessType: 'individual',
            email: 'sarah@consultancy.com',
            phone: '+967 777 789 123',
            subscriptionEndDate: '2026-04-25',
            status: 'active'
        },
        {
            id: 'M1003',
            fullName: 'محمد علي المقطري',
            businessName: 'المحاسبون المتحدون',
            businessType: 'company',
            email: 'mohammed@unitedaccountants.com',
            phone: '+967 777 456 789',
            subscriptionEndDate: '2025-05-15',
            status: 'pending'
        },
        {
            id: 'M1004',
            fullName: 'أحمد عبدالله البكري',
            businessName: 'شركة النور المالية',
            businessType: 'company',
            email: 'ahmed@alnoor.com',
            phone: '+967 777 654 321',
            subscriptionEndDate: '2026-04-20',
            status: 'active'
        },
        {
            id: 'M1005',
            fullName: 'فاطمة عبدالرحمن السقاف',
            businessName: 'فاطمة للمحاسبة',
            businessType: 'individual',
            email: 'fatima@accounting.com',
            phone: '+967 777 321 654',
            subscriptionEndDate: '2025-03-10',
            status: 'inactive'
        },
        {
            id: 'M1006',
            fullName: 'هاني سعيد العمودي',
            businessName: 'مؤسسة هاني للمراجعة',
            businessType: 'individual',
            email: 'hani@audit.com',
            phone: '+967 777 987 654',
            subscriptionEndDate: '2025-07-22',
            status: 'active'
        },
        {
            id: 'M1007',
            fullName: 'ليلى حسن الكندي',
            businessName: 'مكتب الكندي للمحاسبة',
            businessType: 'company',
            email: 'layla@alkindi.com',
            phone: '+967 777 654 987',
            subscriptionEndDate: '2025-09-15',
            status: 'active'
        },
        {
            id: 'M1008',
            fullName: 'يوسف محمود الجنيد',
            businessName: 'شركة المستقبل المالية',
            businessType: 'company',
            email: 'yousef@future.com',
            phone: '+967 777 123 987',
            subscriptionEndDate: '2025-02-05',
            status: 'inactive'
        }
    ];

    // State for table
    const [members, setMembers] = useState(membersData);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        businessType: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Status filter options
    const statuses = [
        { label: t('common.active'), value: 'active' },
        { label: t('common.inactive'), value: 'inactive' },
        { label: t('common.pending'), value: 'pending' }
    ];

    // Business type filter options
    const businessTypes = [
        { label: t('member.businessInfo.company'), value: 'company' },
        { label: t('member.businessInfo.individual'), value: 'individual' }
    ];

    // Global filter change handler
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // Template for ID column with link
    const idBodyTemplate = (rowData) => {
        return (
            <Button
                link
                label={rowData.id}
                onClick={() => window.location.href = `/dashboard/members/view/${rowData.id}`}
                className="p-0 underline font-normal"
            />
        );
    };

    // Template for status column
    const statusBodyTemplate = (rowData) => {
        const statusMap = {
            'active': { severity: 'success', label: t('common.active') },
            'inactive': { severity: 'danger', label: t('common.inactive') },
            'pending': { severity: 'warning', label: t('common.pending') }
        };

        const status = statusMap[rowData.status];

        return <Tag severity={status.severity} value={status.label} />;
    };

    // Template for business type column
    const businessTypeBodyTemplate = (rowData) => {
        const typeMap = {
            'company': { label: t('member.businessInfo.company') },
            'individual': { label: t('member.businessInfo.individual') }
        };

        return <span>{typeMap[rowData.businessType].label}</span>;
    };

    // Template for actions column
    const actionsBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    icon="pi pi-eye"
                    rounded
                    outlined
                    className="p-button-sm"
                    onClick={() => window.location.href = `/dashboard/members/view/${rowData.id}`}
                    tooltip={t('common.view')}
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="p-button-sm p-button-warning"
                    onClick={() => window.location.href = `/dashboard/members/edit/${rowData.id}`}
                    tooltip={t('common.edit')}
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-sync"
                    rounded
                    outlined
                    className="p-button-sm p-button-success"
                    onClick={() => window.location.href = `/dashboard/subscriptions/renew/${rowData.id}`}
                    tooltip={t('dashboard.subscriptions.renew')}
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    // Template for status filter
    const statusFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder={t('common.selectStatus')}
                className="p-column-filter"
                showClear
            />
        );
    };

    // Template for business type filter
    const businessTypeFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={businessTypes}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder={t('common.selectType')}
                className="p-column-filter"
                showClear
            />
        );
    };

    // Clear filters
    const clearFilter = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            status: { value: null, matchMode: FilterMatchMode.EQUALS },
            businessType: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    // Header with search and add button
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder={t('common.searchMembers')}
                        className="p-inputtext-sm"
                    />
                </span>

                <div className="flex gap-2">
                    <Button
                        label={t('common.clearFilters')}
                        icon="pi pi-filter-slash"
                        outlined
                        onClick={clearFilter}
                        className="p-button-sm"
                        disabled={!globalFilterValue && !filters.status.value && !filters.businessType.value}
                    />
                    <Button
                        label={t('dashboard.members.add')}
                        icon="pi pi-user-plus"
                        className="p-button-sm"
                        onClick={() => window.location.href = '/dashboard/members/add'}
                    />
                </div>
            </div>
        );
    };

    // Selected members header
    const selectedMembersHeader = () => {
        return (
            <div className="flex items-center justify-between">
                <span>{t('common.selectedMembers')}: {selectedMembers.length}</span>
                <Button
                    icon="pi pi-trash"
                    label={t('common.delete')}
                    severity="danger"
                    className="p-button-sm"
                    onClick={() => {/* Handle delete action */ }}
                    disabled={selectedMembers.length === 0}
                />
            </div>
        );
    };

    const header = renderHeader();
    const selectedHeader = selectedMembersHeader();

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t('dashboard.members.view')}</h1>
                <div className="text-sm text-gray-500">
                    {t('common.totalRecords')}: {members.length}
                </div>
            </div>

            <Card>
                <DataTable
                    value={members}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    filters={filters}
                    filterDisplay="row"
                    globalFilterFields={['id', 'fullName', 'businessName', 'email', 'phone']}
                    header={header}
                    selectionMode="checkbox"
                    selection={selectedMembers}
                    onSelectionChange={e => setSelectedMembers(e.value)}
                    scrollable
                    scrollHeight="calc(100vh - 350px)"
                    selectAll
                    className="p-datatable-members"
                    emptyMessage={t('common.noMembersFound')}
                    currentPageReportTemplate={t('common.showing') + ' {first} ' + t('common.to') + ' {last} ' + t('common.of') + ' {totalRecords} ' + t('common.entries')}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
                    <Column field="id" header={t('common.id')} body={idBodyTemplate} sortable style={{ minWidth: '100px' }} />
                    <Column field="fullName" header={t('member.personalInfo.fullName')} sortable style={{ minWidth: '200px' }} />
                    <Column field="businessName" header={t('member.businessInfo.businessName')} sortable style={{ minWidth: '200px' }} />
                    <Column
                        field="businessType"
                        header={t('member.businessInfo.businessType')}
                        body={businessTypeBodyTemplate}
                        sortable
                        filter
                        filterElement={businessTypeFilterTemplate}
                        showFilterMenu={false}
                        style={{ minWidth: '150px' }}
                    />
                    <Column field="email" header={t('member.contactInfo.email')} sortable style={{ minWidth: '200px' }} />
                    <Column field="phone" header={t('member.contactInfo.phone1')} sortable style={{ minWidth: '150px' }} />
                    <Column field="subscriptionEndDate" header={t('member.subscription.endDate')} sortable style={{ minWidth: '150px' }} />
                    <Column
                        field="status"
                        header={t('common.status')}
                        body={statusBodyTemplate}
                        sortable
                        filter
                        filterElement={statusFilterTemplate}
                        showFilterMenu={false}
                        style={{ minWidth: '120px' }}
                    />
                    <Column body={actionsBodyTemplate} header={t('common.actions')} style={{ minWidth: '120px', textAlign: 'center' }} />
                </DataTable>
            </Card>
        </div>
    );
};

export default MembersList;