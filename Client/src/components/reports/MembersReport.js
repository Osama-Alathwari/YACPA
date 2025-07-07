import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Chart } from 'primereact/chart';
import { FilterMatchMode } from 'primereact/api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';

const MembersReportComponent = () => {
    const { t, i18n } = useTranslation();
    const toast = useRef(null);
    const dt = useRef(null);
    const isRtl = i18n.language === 'ar';

    // State for filters and data
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [exportLoading, setExportLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        businessName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        businessType: { value: null, matchMode: FilterMatchMode.EQUALS },
        subscriptionEndDate: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });

    // Advanced filter states
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedBusinessTypes, setSelectedBusinessTypes] = useState([]);
    const [qualificationFilter, setQualificationFilter] = useState(null);
    const [expiryDateRange, setExpiryDateRange] = useState([null, null]);

    // Report configuration
    const [reportConfig, setReportConfig] = useState({
        includePersonalInfo: true,
        includeBusinessInfo: true,
        includeContactInfo: true,
        includeSubscriptionInfo: true,
        includePaymentHistory: false,
        includeDocuments: false,
        showSummaryStats: true
    });

    // Chart data for visual reports
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    // Mock data - in real app, this would be fetched from API
    const mockMembersData = [
        {
            id: 'M1001',
            fullName: 'عبدالله سالم الهاشمي',
            fullNameEn: 'Abdullah Salem Al-Hashimi',
            businessName: 'شركة الأمل للمحاسبة',
            businessNameEn: 'Al-Amal Accounting Company',
            businessType: 'company',
            email: 'abdullah@alamamal.com',
            phone1: '+967 777 123 456',
            mobile: '+967 733 123 456',
            registrationDate: '2024-04-28',
            subscriptionEndDate: '2026-04-28',
            status: 'active',
            qualification: 'bachelor',
            lastPaymentDate: '2024-04-28',
            totalPaid: 500,
            profileImage: null,
            idType: 'national_id',
            idNumber: '123456789'
        },
        {
            id: 'M1002',
            fullName: 'سارة محمد الغامدي',
            fullNameEn: 'Sarah Mohammed Al-Ghamdi',
            businessName: 'مكتب السارة للاستشارات',
            businessNameEn: 'Sarah Consultancy Office',
            businessType: 'individual',
            email: 'sarah@consultancy.com',
            phone1: '+967 777 789 123',
            mobile: '+967 733 789 123',
            registrationDate: '2024-04-25',
            subscriptionEndDate: '2026-04-25',
            status: 'active',
            qualification: 'master',
            lastPaymentDate: '2024-04-25',
            totalPaid: 500,
            profileImage: null,
            idType: 'passport',
            idNumber: 'P123456789'
        },
        {
            id: 'M1003',
            fullName: 'محمد علي المقطري',
            fullNameEn: 'Mohammed Ali Al-Muqtari',
            businessName: 'المحاسبون المتحدون',
            businessNameEn: 'United Accountants',
            businessType: 'company',
            email: 'mohammed@unitedaccountants.com',
            phone1: '+967 777 456 789',
            mobile: '+967 733 456 789',
            registrationDate: '2024-05-15',
            subscriptionEndDate: '2025-05-15',
            status: 'pending',
            qualification: 'bachelor',
            lastPaymentDate: '2024-05-15',
            totalPaid: 200,
            profileImage: null,
            idType: 'national_id',
            idNumber: '987654321'
        },
        {
            id: 'M1004',
            fullName: 'أحمد عبدالله البكري',
            fullNameEn: 'Ahmed Abdullah Al-Bakri',
            businessName: 'شركة النور المالية',
            businessNameEn: 'Al-Noor Financial Company',
            businessType: 'company',
            email: 'ahmed@alnoor.com',
            phone1: '+967 777 654 321',
            mobile: '+967 733 654 321',
            registrationDate: '2024-04-20',
            subscriptionEndDate: '2026-04-20',
            status: 'active',
            qualification: 'master',
            lastPaymentDate: '2024-04-20',
            totalPaid: 500,
            profileImage: null,
            idType: 'national_id',
            idNumber: '456789123'
        },
        {
            id: 'M1005',
            fullName: 'فاطمة عبدالرحمن السقاف',
            fullNameEn: 'Fatima Abdulrahman Al-Saqqaf',
            businessName: 'فاطمة للمحاسبة',
            businessNameEn: 'Fatima Accounting',
            businessType: 'individual',
            email: 'fatima@accounting.com',
            phone1: '+967 777 111 333',
            mobile: '+967 733 111 333',
            registrationDate: '2024-03-10',
            subscriptionEndDate: '2025-03-10',
            status: 'expired',
            qualification: 'bachelor',
            lastPaymentDate: '2024-03-10',
            totalPaid: 350,
            profileImage: null,
            idType: 'national_id',
            idNumber: '789123456'
        }
    ];

    // Options for dropdowns
    const statusOptions = [
        { label: 'نشط', value: 'active' },
        { label: 'معلق', value: 'pending' },
        { label: 'منتهي الصلاحية', value: 'expired' },
        { label: 'معلق', value: 'suspended' }
    ];

    const businessTypeOptions = [
        { label: 'شركة', value: 'company' },
        { label: 'فردي', value: 'individual' }
    ];

    const qualificationOptions = [
        { label: 'بكالوريوس', value: 'bachelor' },
        { label: 'ماجستير', value: 'master' },
        { label: 'دكتوراه', value: 'doctorate' },
        { label: 'دبلوم', value: 'diploma' }
    ];

    // Load data on component mount
    useEffect(() => {
        loadMembers();
        initializeChartData();
    }, []);

    const loadMembers = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMembers(mockMembersData);
            setTotalRecords(mockMembersData.length);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'خطأ',
                detail: 'فشل في تحميل بيانات الأعضاء',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const initializeChartData = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        
        // Status distribution chart
        const statusData = {
            labels: ['نشط', 'معلق', 'منتهي الصلاحية', 'معلق'],
            datasets: [
                {
                    data: [
                        mockMembersData.filter(m => m.status === 'active').length,
                        mockMembersData.filter(m => m.status === 'pending').length,
                        mockMembersData.filter(m => m.status === 'expired').length,
                        mockMembersData.filter(m => m.status === 'suspended').length
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--gray-500')
                    ],
                    borderWidth: 1
                }
            ]
        };

        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        font: {
                            family: isRtl ? 'Cairo' : 'Arial'
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };

        setChartData(statusData);
        setChartOptions(options);
    };

    // Template functions for table columns
    const avatarBodyTemplate = (rowData) => {
        return (
            <Avatar
                image={rowData.profileImage}
                label={rowData.fullName.charAt(0)}
                className="w-8 h-8"
                shape="circle"
            />
        );
    };

    const statusBodyTemplate = (rowData) => {
        const getSeverity = (status) => {
            switch (status) {
                case 'active': return 'success';
                case 'pending': return 'warning';
                case 'expired': return 'danger';
                case 'suspended': return 'info';
                default: return 'info';
            }
        };

        const getLabel = (status) => {
            switch (status) {
                case 'active': return 'نشط';
                case 'pending': return 'معلق';
                case 'expired': return 'منتهي الصلاحية';
                case 'suspended': return 'معلق';
                default: return status;
            }
        };

        return <Tag value={getLabel(rowData.status)} severity={getSeverity(rowData.status)} />;
    };

    const businessTypeBodyTemplate = (rowData) => {
        return rowData.businessType === 'company' ? 'شركة' : 'فردي';
    };

    const dateBodyTemplate = (field) => (rowData) => {
        return new Date(rowData[field]).toLocaleDateString('ar-SA');
    };

    const qualificationBodyTemplate = (rowData) => {
        const qualificationMap = {
            'bachelor': 'بكالوريوس',
            'master': 'ماجستير',
            'doctorate': 'دكتوراه',
            'diploma': 'دبلوم'
        };
        return qualificationMap[rowData.qualification] || rowData.qualification;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => viewMember(rowData)}
                    tooltip="عرض التفاصيل"
                />
                <Button
                    icon="pi pi-edit"
                    className="p-button-rounded p-button-success p-button-sm"
                    onClick={() => editMember(rowData)}
                    tooltip="تعديل"
                />
                <Button
                    icon="pi pi-id-card"
                    className="p-button-rounded p-button-warning p-button-sm"
                    onClick={() => generateCard(rowData)}
                    tooltip="إنشاء بطاقة عضوية"
                />
            </div>
        );
    };

    // Action handlers
    const viewMember = (member) => {
        // Navigate to member details
        console.log('View member:', member);
    };

    const editMember = (member) => {
        // Navigate to edit member
        console.log('Edit member:', member);
    };

    const generateCard = (member) => {
        // Generate membership card
        console.log('Generate card for:', member);
    };

    // Export functions
    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const exportPDF = async () => {
        setExportLoading(true);
        try {
            // Simulate PDF generation
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.current?.show({
                severity: 'success',
                summary: 'نجح التصدير',
                detail: 'تم تصدير التقرير بتنسيق PDF بنجاح',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'خطأ في التصدير',
                detail: 'فشل في تصدير التقرير',
                life: 3000
            });
        } finally {
            setExportLoading(false);
        }
    };

    const exportExcel = async () => {
        setExportLoading(true);
        try {
            // Simulate Excel generation
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.current?.show({
                severity: 'success',
                summary: 'نجح التصدير',
                detail: 'تم تصدير التقرير بتنسيق Excel بنجاح',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'خطأ في التصدير',
                detail: 'فشل في تصدير التقرير',
                life: 3000
            });
        } finally {
            setExportLoading(false);
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            businessName: { value: null, matchMode: FilterMatchMode.CONTAINS },
            status: { value: null, matchMode: FilterMatchMode.EQUALS },
            businessType: { value: null, matchMode: FilterMatchMode.EQUALS },
            subscriptionEndDate: { value: null, matchMode: FilterMatchMode.DATE_IS }
        });
        setDateRange([null, null]);
        setSelectedStatuses([]);
        setSelectedBusinessTypes([]);
        setQualificationFilter(null);
        setExpiryDateRange([null, null]);
    };

    // Apply advanced filters
    const applyAdvancedFilters = () => {
        let filteredData = [...mockMembersData];

        // Date range filter
        if (dateRange[0] && dateRange[1]) {
            filteredData = filteredData.filter(member => {
                const regDate = new Date(member.registrationDate);
                return regDate >= dateRange[0] && regDate <= dateRange[1];
            });
        }

        // Status filter
        if (selectedStatuses.length > 0) {
            filteredData = filteredData.filter(member => 
                selectedStatuses.includes(member.status)
            );
        }

        // Business type filter
        if (selectedBusinessTypes.length > 0) {
            filteredData = filteredData.filter(member => 
                selectedBusinessTypes.includes(member.businessType)
            );
        }

        // Qualification filter
        if (qualificationFilter) {
            filteredData = filteredData.filter(member => 
                member.qualification === qualificationFilter
            );
        }

        // Expiry date range filter
        if (expiryDateRange[0] && expiryDateRange[1]) {
            filteredData = filteredData.filter(member => {
                const expDate = new Date(member.subscriptionEndDate);
                return expDate >= expiryDateRange[0] && expDate <= expiryDateRange[1];
            });
        }

        setMembers(filteredData);
        setTotalRecords(filteredData.length);
        setShowAdvancedFilters(false);
    };

    // Summary statistics
    const getSummaryStats = () => {
        const activeMembers = members.filter(m => m.status === 'active').length;
        const pendingMembers = members.filter(m => m.status === 'pending').length;
        const expiredMembers = members.filter(m => m.status === 'expired').length;
        const totalRevenue = members.reduce((sum, m) => sum + m.totalPaid, 0);

        return {
            total: members.length,
            active: activeMembers,
            pending: pendingMembers,
            expired: expiredMembers,
            totalRevenue
        };
    };

    const stats = getSummaryStats();

    // Table header
    const header = (
        <div className="table-header flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="flex flex-wrap gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => setFilters({
                            ...filters,
                            global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }
                        })}
                        placeholder="البحث..."
                        className="w-full sm:w-auto"
                    />
                </span>
                <Button
                    type="button"
                    icon="pi pi-filter"
                    label="فلاتر متقدمة"
                    outlined
                    onClick={() => setShowAdvancedFilters(true)}
                />
                <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="مسح الفلاتر"
                    outlined
                    onClick={clearFilters}
                />
            </div>
            <div className="flex gap-2">
                <Button
                    type="button"
                    icon="pi pi-file"
                    severity="help"
                    rounded
                    onClick={exportCSV}
                    data-pr-tooltip="CSV"
                    tooltip="تصدير CSV"
                />
                <Button
                    type="button"
                    icon="pi pi-file-excel"
                    severity="success"
                    rounded
                    onClick={exportExcel}
                    loading={exportLoading}
                    data-pr-tooltip="XLS"
                    tooltip="تصدير Excel"
                />
                <Button
                    type="button"
                    icon="pi pi-file-pdf"
                    severity="warning"
                    rounded
                    onClick={exportPDF}
                    loading={exportLoading}
                    data-pr-tooltip="PDF"
                    tooltip="تصدير PDF"
                />
            </div>
        </div>
    );

    return (
        <div className={`members-report ${isRtl ? 'rtl' : 'ltr'}`}>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="grid">
                {/* Summary Statistics */}
                {reportConfig.showSummaryStats && (
                    <div className="col-12">
                        <Card title="إحصائيات الأعضاء" className="mb-4">
                            <div className="grid">
                                <div className="col-12 md:col-3">
                                    <div className="bg-blue-100 p-3 border-round text-center">
                                        <div className="text-blue-900 font-medium text-xl">{stats.total}</div>
                                        <div className="text-blue-700">إجمالي الأعضاء</div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-3">
                                    <div className="bg-green-100 p-3 border-round text-center">
                                        <div className="text-green-900 font-medium text-xl">{stats.active}</div>
                                        <div className="text-green-700">أعضاء نشطون</div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-3">
                                    <div className="bg-yellow-100 p-3 border-round text-center">
                                        <div className="text-yellow-900 font-medium text-xl">{stats.pending}</div>
                                        <div className="text-yellow-700">أعضاء معلقون</div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-3">
                                    <div className="bg-purple-100 p-3 border-round text-center">
                                        <div className="text-purple-900 font-medium text-xl">${stats.totalRevenue}</div>
                                        <div className="text-purple-700">إجمالي الإيرادات</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Chart Section */}
                <div className="col-12 lg:col-8">
                    <Card title="تقرير الأعضاء">
                        <DataTable
                            ref={dt}
                            value={members}
                            selection={selectedMembers}
                            onSelectionChange={(e) => setSelectedMembers(e.value)}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            totalRecords={totalRecords}
                            loading={loading}
                            filters={filters}
                            filterDisplay="menu"
                            globalFilterFields={['fullName', 'businessName', 'email', 'id']}
                            header={header}
                            emptyMessage="لا توجد بيانات للعرض"
                            className="p-datatable-striped"
                            responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                            <Column 
                                header="الصورة" 
                                body={avatarBodyTemplate} 
                                style={{ width: '5rem' }} 
                            />
                            <Column 
                                field="id" 
                                header="رقم العضوية" 
                                sortable 
                                filter 
                                filterPlaceholder="البحث برقم العضوية"
                            />
                            <Column 
                                field="fullName" 
                                header="الاسم الكامل" 
                                sortable 
                                filter 
                                filterPlaceholder="البحث بالاسم"
                            />
                            <Column 
                                field="businessName" 
                                header="اسم النشاط" 
                                sortable 
                                filter 
                                filterPlaceholder="البحث بالنشاط"
                            />
                            <Column 
                                field="businessType" 
                                header="نوع النشاط" 
                                body={businessTypeBodyTemplate}
                                sortable 
                                filter
                                filterElement={(options) => (
                                    <Dropdown
                                        value={options.value}
                                        options={businessTypeOptions}
                                        onChange={(e) => options.filterCallback(e.value)}
                                        placeholder="اختر النوع"
                                        className="p-column-filter"
                                        showClear
                                    />
                                )}
                            />
                            <Column 
                                field="qualification" 
                                header="المؤهل" 
                                body={qualificationBodyTemplate}
                                sortable 
                                filter
                                filterElement={(options) => (
                                    <Dropdown
                                        value={options.value}
                                        options={qualificationOptions}
                                        onChange={(e) => options.filterCallback(e.value)}
                                        placeholder="اختر المؤهل"
                                        className="p-column-filter"
                                        showClear
                                    />
                                )}
                            />
                            <Column 
                                field="email" 
                                header="البريد الإلكتروني" 
                                sortable 
                                filter 
                                filterPlaceholder="البحث بالبريد"
                            />
                            <Column 
                                field="phone1" 
                                header="رقم الهاتف" 
                                sortable 
                            />
                            <Column 
                                field="registrationDate" 
                                header="تاريخ التسجيل" 
                                body={dateBodyTemplate('registrationDate')}
                                sortable 
                                filter
                                filterElement={(options) => (
                                    <Calendar
                                        value={options.value}
                                        onChange={(e) => options.filterCallback(e.value)}
                                        placeholder="اختر التاريخ"
                                        className="p-column-filter"
                                    />
                                )}
                            />
                            <Column 
                                field="subscriptionEndDate" 
                                header="انتهاء الاشتراك" 
                                body={dateBodyTemplate('subscriptionEndDate')}
                                sortable 
                                filter
                                filterElement={(options) => (
                                    <Calendar
                                        value={options.value}
                                        onChange={(e) => options.filterCallback(e.value)}
                                        placeholder="اختر التاريخ"
                                        className="p-column-filter"
                                    />
                                )}
                            />
                            <Column 
                                field="status" 
                                header="الحالة" 
                                body={statusBodyTemplate}
                                sortable 
                                filter
                                filterElement={(options) => (
                                    <Dropdown
                                        value={options.value}
                                        options={statusOptions}
                                        onChange={(e) => options.filterCallback(e.value)}
                                        placeholder="اختر الحالة"
                                        className="p-column-filter"
                                        showClear
                                    />
                                )}
                            />
                            <Column 
                                header="الإجراءات" 
                                body={actionBodyTemplate} 
                                style={{ width: '12rem' }} 
                            />
                        </DataTable>
                    </Card>
                </div>

                {/* Charts and Statistics */}
                <div className="col-12 lg:col-4">
                    <Card title="توزيع الأعضاء حسب الحالة" className="mb-4">
                        <Chart 
                            type="doughnut" 
                            data={chartData} 
                            options={chartOptions} 
                            style={{ height: '300px' }}
                        />
                    </Card>

                    <Card title="إعدادات التقرير">
                        <div className="field-checkbox mb-3">
                            <Checkbox
                                id="includePersonalInfo"
                                checked={reportConfig.includePersonalInfo}
                                onChange={(e) => setReportConfig({
                                    ...reportConfig,
                                    includePersonalInfo: e.checked
                                })}
                            />
                            <label htmlFor="includePersonalInfo" className="ml-2">
                                المعلومات الشخصية
                            </label>
                        </div>
                        <div className="field-checkbox mb-3">
                            <Checkbox
                                id="includeBusinessInfo"
                                checked={reportConfig.includeBusinessInfo}
                                onChange={(e) => setReportConfig({
                                    ...reportConfig,
                                    includeBusinessInfo: e.checked
                                })}
                            />
                            <label htmlFor="includeBusinessInfo" className="ml-2">
                                معلومات النشاط
                            </label>
                        </div>
                        <div className="field-checkbox mb-3">
                            <Checkbox
                                id="includeContactInfo"
                                checked={reportConfig.includeContactInfo}
                                onChange={(e) => setReportConfig({
                                    ...reportConfig,
                                    includeContactInfo: e.checked
                                })}
                            />
                            <label htmlFor="includeContactInfo" className="ml-2">
                                معلومات الاتصال
                            </label>
                        </div>
                        <div className="field-checkbox mb-3">
                            <Checkbox
                                id="includeSubscriptionInfo"
                                checked={reportConfig.includeSubscriptionInfo}
                                onChange={(e) => setReportConfig({
                                    ...reportConfig,
                                    includeSubscriptionInfo: e.checked
                                })}
                            />
                            <label htmlFor="includeSubscriptionInfo" className="ml-2">
                                معلومات الاشتراك
                            </label>
                        </div>
                        <div className="field-checkbox mb-3">
                            <Checkbox
                                id="includePaymentHistory"
                                checked={reportConfig.includePaymentHistory}
                                onChange={(e) => setReportConfig({
                                    ...reportConfig,
                                    includePaymentHistory: e.checked
                                })}
                            />
                            <label htmlFor="includePaymentHistory" className="ml-2">
                                تاريخ المدفوعات
                            </label>
                        </div>
                        <div className="field-checkbox mb-3">
                            <Checkbox
                                id="includeDocuments"
                                checked={reportConfig.includeDocuments}
                                onChange={(e) => setReportConfig({
                                    ...reportConfig,
                                    includeDocuments: e.checked
                                })}
                            />
                            <label htmlFor="includeDocuments" className="ml-2">
                                المستندات
                            </label>
                        </div>
                        <div className="field-checkbox mb-3">
                            <Checkbox
                                id="showSummaryStats"
                                checked={reportConfig.showSummaryStats}
                                onChange={(e) => setReportConfig({
                                    ...reportConfig,
                                    showSummaryStats: e.checked
                                })}
                            />
                            <label htmlFor="showSummaryStats" className="ml-2">
                                إظهار الإحصائيات
                            </label>
                        </div>
                        
                        <Divider />
                        
                        <Button
                            label="تطبيق الإعدادات"
                            icon="pi pi-check"
                            className="w-full"
                            onClick={() => {
                                toast.current?.show({
                                    severity: 'success',
                                    summary: 'تم التحديث',
                                    detail: 'تم تطبيق إعدادات التقرير بنجاح',
                                    life: 3000
                                });
                            }}
                        />
                    </Card>
                </div>
            </div>

            {/* Advanced Filters Dialog */}
            <Panel
                header="الفلاتر المتقدمة"
                visible={showAdvancedFilters}
                onHide={() => setShowAdvancedFilters(false)}
                style={{ width: '50vw' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                modal
                className="p-fluid"
            >
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <label htmlFor="dateRange" className="font-medium">
                            نطاق تاريخ التسجيل
                        </label>
                        <Calendar
                            id="dateRange"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            hideOnRangeSelection
                            placeholder="اختر النطاق الزمني"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6">
                        <label htmlFor="expiryDateRange" className="font-medium">
                            نطاق تاريخ انتهاء الاشتراك
                        </label>
                        <Calendar
                            id="expiryDateRange"
                            value={expiryDateRange}
                            onChange={(e) => setExpiryDateRange(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            hideOnRangeSelection
                            placeholder="اختر النطاق الزمني"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6">
                        <label htmlFor="statusFilter" className="font-medium">
                            حالة العضوية
                        </label>
                        <MultiSelect
                            id="statusFilter"
                            value={selectedStatuses}
                            onChange={(e) => setSelectedStatuses(e.value)}
                            options={statusOptions}
                            placeholder="اختر الحالات"
                            maxSelectedLabels={3}
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6">
                        <label htmlFor="businessTypeFilter" className="font-medium">
                            نوع النشاط
                        </label>
                        <MultiSelect
                            id="businessTypeFilter"
                            value={selectedBusinessTypes}
                            onChange={(e) => setSelectedBusinessTypes(e.value)}
                            options={businessTypeOptions}
                            placeholder="اختر أنواع النشاط"
                            maxSelectedLabels={3}
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6">
                        <label htmlFor="qualificationFilter" className="font-medium">
                            المؤهل العلمي
                        </label>
                        <Dropdown
                            id="qualificationFilter"
                            value={qualificationFilter}
                            onChange={(e) => setQualificationFilter(e.value)}
                            options={qualificationOptions}
                            placeholder="اختر المؤهل"
                            showClear
                            className="w-full"
                        />
                    </div>
                </div>
                
                <div className="flex justify-content-end gap-2 mt-4">
                    <Button
                        label="إلغاء"
                        icon="pi pi-times"
                        outlined
                        onClick={() => setShowAdvancedFilters(false)}
                    />
                    <Button
                        label="مسح الفلاتر"
                        icon="pi pi-filter-slash"
                        severity="secondary"
                        onClick={clearFilters}
                    />
                    <Button
                        label="تطبيق"
                        icon="pi pi-check"
                        onClick={applyAdvancedFilters}
                    />
                </div>
            </Panel>
        </div>
    );
};

export default MembersReportComponent;