// src/components/members/MembersList.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { FilterMatchMode } from 'primereact/api';
import { useLanguage } from '../../contexts/LanguageContext';
import apiService from '../../services/apiService';

const MembersList = () => {
    const { t } = useTranslation();
    const { isRtl } = useLanguage();

    // State
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        businessType: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    // Fetch members data
    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await apiService.getMembers();
            if (response.success) {
                setMembers(response.data);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle deactivate member
    const handleDeactivateMember = (member) => {
        // Add deactivate confirmation logic here
        console.log('Deactivate member:', member.id);
    };


    // Filter options
    const statusOptions = [
        { label: t('common.all'), value: null },
        { label: t('common.active'), value: t('common.active') },
        { label: t('common.inactive'), value: t('common.inactive') },
    ];

    const businessTypeOptions = [
        { label: t('common.all'), value: null },
        { label: t('member.businessInfo.company'), value: t('member.businessInfo.company') },
        { label: t('member.businessInfo.individual'), value: t('member.businessInfo.individual') }
    ];

    // Template functions
    const idBodyTemplate = (rowData) => {
        return <span className="font-mono text-sm">{rowData.id}</span>;
    };

    const businessTypeBodyTemplate = (rowData) => {
        const severity = rowData.businessType === 'شركة' ? 'info' : 'success';
        const label = rowData.businessType === 'شركة' ?
            t('member.businessInfo.company') : t('member.businessInfo.individual');
        return <Tag value={label} severity={severity} />;
    };

    const statusBodyTemplate = (rowData) => {
        const severity = rowData.status === 'active' ? 'success' :
            rowData.status === 'inactive' ? 'danger' : 'warning';
        const label = rowData.status === 'active' ? t('common.active') :
            rowData.status === 'inactive' ? t('common.inactive') : t('common.pending');
        return <Tag value={label} severity={severity} />;
    };

    const actionsBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-outlined p-button-sm"
                    tooltip={t('common.view')}
                    onClick={() => window.location.href = `/dashboard/members/view/${rowData.id}`}
                />
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-outlined p-button-sm p-button-warning"
                    tooltip={t('common.edit')}
                    onClick={() => window.location.href = `/dashboard/members/edit/${rowData.id}`}
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
                <Button
                    icon="pi pi-ban"
                    className="p-button-rounded p-button-outlined p-button-sm p-button-danger"
                    tooltip={t('common.deactivate')}
                    onClick={() => handleDeactivateMember(rowData)}
                />
            </div>
        );
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

    const businessTypeFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={businessTypeOptions}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder={t('common.selectType')}
                className="p-column-filter"
                showClear
            />
        );
    };

    // Header functions
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const clearFilters = () => {
        setGlobalFilterValue('');
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            status: { value: null, matchMode: FilterMatchMode.EQUALS },
            businessType: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder={t('common.search')}
                            className="p-inputtext-sm"
                        />
                    </span>
                    <Button
                        icon="pi pi-filter-slash"
                        label={t('common.clearFilters')}
                        className="p-button-outlined p-button-sm"
                        onClick={clearFilters}
                        disabled={!globalFilterValue && !filters.status.value && !filters.businessType.value}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        icon="pi pi-refresh"
                        label={t('common.refresh')}
                        className="p-button-outlined p-button-sm"
                        onClick={fetchMembers}
                        loading={loading}
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

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t('dashboard.members.view')}</h1>
                <div className="text-sm text-gray-500">
                    {t('common.totalRecords')}: {members.length}
                </div>
            </div>

            <Card>
                {renderHeader()}
                <DataTable
                    value={members}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    filters={filters}
                    filterDisplay="row"
                    globalFilterFields={['id', 'fullName', 'businessName', 'email', 'phone']}
                    selectionMode="checkbox"
                    selection={selectedMembers}
                    onSelectionChange={e => setSelectedMembers(e.value)}
                    scrollable
                    scrollHeight="calc(100vh - 350px)"
                    className="p-datatable-members"
                    emptyMessage={t('common.noMembersFound')}
                    currentPageReportTemplate={t('common.showing') + ' {first} ' + t('common.to') + ' {last} ' + t('common.of') + ' {totalRecords} ' + t('common.entries')}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
                    <Column
                        field="id"
                        header={t('common.id')}
                        body={idBodyTemplate}
                        sortable
                        style={{ minWidth: '100px' }}
                    />
                    <Column
                        field="fullName"
                        header={t('member.personalInfo.fullName')}
                        sortable
                        style={{ minWidth: '200px' }}
                    />
                    <Column
                        field="businessName"
                        header={t('member.businessInfo.businessName')}
                        sortable
                        style={{ minWidth: '200px' }}
                    />
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
                    <Column
                        field="email"
                        header={t('member.contactInfo.email')}
                        sortable
                        style={{ minWidth: '200px' }}
                    />
                    <Column
                        field="phone"
                        header={t('member.contactInfo.phone1')}
                        sortable
                        style={{ minWidth: '150px' }}
                    />
                    <Column
                        field="subscriptionEndDate"
                        header={t('member.subscription.endDate')}
                        sortable
                        style={{ minWidth: '150px' }}
                    />
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
                    <Column
                        body={actionsBodyTemplate}
                        header={t('common.actions')}
                        style={{ minWidth: '120px', textAlign: 'center' }}
                    />
                </DataTable>
            </Card>
        </div>
    );
};

export default MembersList;