// src/components/dashboard/DashboardOverview.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import StatCard from './StatCard';

const DashboardOverview = () => {
    const { t } = useTranslation();

    // Mock data for statistics
    const stats = [
        {
            key: 'totalMembers',
            title: t('dashboard.stats.totalMembers'),
            value: 254,
            icon: 'pi pi-users',
            change: '+12',
            period: t('dashboard.stats.thisMonth'),
            color: 'blue'
        },
        {
            key: 'activeSubscriptions',
            title: t('dashboard.stats.activeSubscriptions'),
            value: 198,
            icon: 'pi pi-check-circle',
            change: '+5',
            period: t('dashboard.stats.thisMonth'),
            color: 'green'
        },
        {
            key: 'expiringSubscriptions',
            title: t('dashboard.stats.expiringSubscriptions'),
            value: 28,
            icon: 'pi pi-calendar-times',
            change: '-3',
            period: t('dashboard.stats.thisMonth'),
            color: 'yellow'
        },
        {
            key: 'totalRevenue',
            title: t('dashboard.stats.totalRevenue'),
            value: '12,540',
            prefix: '$',
            icon: 'pi pi-money-bill',
            change: '+$2,180',
            period: t('dashboard.stats.thisMonth'),
            color: 'purple'
        }
    ];

    // Mock data for membership trend chart
    const membershipTrendData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: t('dashboard.charts.newMembers'),
                data: [12, 15, 18, 14, 20, 25, 22],
                fill: false,
                backgroundColor: '#4361ee',
                borderColor: '#4361ee',
                tension: 0.4
            },
            {
                label: t('dashboard.charts.renewals'),
                data: [8, 10, 12, 16, 18, 12, 15],
                fill: false,
                backgroundColor: '#3a86ff',
                borderColor: '#3a86ff',
                tension: 0.4
            }
        ]
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // Mock data for revenue distribution chart
    const revenueData = {
        labels: [t('dashboard.charts.registrationFees'), t('dashboard.charts.renewalFees'), t('dashboard.charts.otherServices')],
        datasets: [
            {
                data: [40, 55, 5],
                backgroundColor: ['#f72585', '#4cc9f0', '#4895ef'],
                hoverBackgroundColor: ['#b5179e', '#3d9db3', '#3a75bb']
            }
        ]
    };

    // Mock data for recent members
    const recentMembers = [
        { id: 'M1001', name: 'عبدالله سالم', business: 'شركة الأمل للمحاسبة', date: '2025-04-28', status: 'active' },
        { id: 'M1002', name: 'سارة محمد', business: 'مكتب السارة للاستشارات', date: '2025-04-25', status: 'active' },
        { id: 'M1003', name: 'محمد علي', business: 'المحاسبون المتحدون', date: '2025-04-22', status: 'pending' },
        { id: 'M1004', name: 'أحمد عبدالله', business: 'شركة النور المالية', date: '2025-04-20', status: 'active' },
        { id: 'M1005', name: 'فاطمة عبدالرحمن', business: 'فاطمة للمحاسبة', date: '2025-04-18', status: 'inactive' }
    ];

    // Mock data for recent payments
    const recentPayments = [
        { id: 'P1001', memberId: 'M1001', amount: 350, date: '2025-04-28', type: 'registration' },
        { id: 'P1002', memberId: 'M1002', amount: 350, date: '2025-04-25', type: 'registration' },
        { id: 'P1003', memberId: 'M908', amount: 150, date: '2025-04-24', type: 'renewal' },
        { id: 'P1004', memberId: 'M725', amount: 150, date: '2025-04-22', type: 'renewal' },
        { id: 'P1005', memberId: 'M1003', amount: 350, date: '2025-04-22', type: 'registration' }
    ];

    // Template for status column
    const statusTemplate = (rowData) => {
        const statusMap = {
            'active': { severity: 'success', label: t('common.active') },
            'inactive': { severity: 'danger', label: t('common.inactive') },
            'pending': { severity: 'warning', label: t('common.pending') }
        };

        const status = statusMap[rowData.status];

        return (
            <Tag severity={status.severity} value={status.label} />
        );
    };

    // Template for payment type column
    const paymentTypeTemplate = (rowData) => {
        const typeMap = {
            'registration': { severity: 'info', label: t('dashboard.payments.registration') },
            'renewal': { severity: 'success', label: t('dashboard.payments.renewal') },
            'other': { severity: 'warning', label: t('dashboard.payments.other') }
        };

        const type = typeMap[rowData.type];

        return (
            <Tag severity={type.severity} value={type.label} />
        );
    };

    // Template for amount column
    const amountTemplate = (rowData) => {
        return (
            <span className="font-semibold">${rowData.amount}</span>
        );
    };

    // Monthly target progress
    const monthlyTargetProgress = 65;

    return (
        <div className="dashboard-overview">
            <h1 className="text-2xl font-bold mb-6">{t('dashboard.overview')}</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                    <StatCard key={stat.key} {...stat} />
                ))}
            </div>

            {/* Membership Chart & Monthly Target */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{t('dashboard.charts.membershipTrend')}</h2>
                            <Button label={t('common.viewDetails')} link />
                        </div>
                        <div className="h-80">
                            <Chart type="line" data={membershipTrendData} options={chartOptions} />
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{t('dashboard.charts.monthlyTarget')}</h2>
                            <span className="text-xl font-bold text-blue-700">65%</span>
                        </div>

                        <ProgressBar value={monthlyTargetProgress} showValue={false} className="h-2 mb-4" />

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-lg font-bold text-blue-700">32</div>
                                <div className="text-sm text-gray-600">{t('dashboard.stats.newMembers')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-blue-700">50</div>
                                <div className="text-sm text-gray-600">{t('dashboard.stats.monthlyTarget')}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-lg font-bold text-green-600">$4,850</div>
                                <div className="text-sm text-gray-600">{t('dashboard.stats.currentRevenue')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-green-600">$7,500</div>
                                <div className="text-sm text-gray-600">{t('dashboard.stats.revenueTarget')}</div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('dashboard.stats.revenueBreakdown')}</h3>
                            <div className="h-40">
                                <Chart type="doughnut" data={revenueData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Recent Members & Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Members */}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">{t('dashboard.tables.recentMembers')}</h2>
                        <Button
                            label={t('dashboard.tables.viewAll')}
                            icon="pi pi-arrow-right"
                            className="p-button-text p-button-sm"
                            onClick={() => window.location.href = '/dashboard/members/view'}
                        />
                    </div>

                    <DataTable value={recentMembers} responsiveLayout="scroll" stripedRows>
                        <Column field="id" header={t('common.id')} className="text-sm" style={{ width: '15%' }}></Column>
                        <Column field="name" header={t('common.name')} className="text-sm" style={{ width: '25%' }}></Column>
                        <Column field="business" header={t('common.business')} className="text-sm" style={{ width: '30%' }}></Column>
                        <Column field="date" header={t('common.date')} className="text-sm" style={{ width: '15%' }}></Column>
                        <Column field="status" header={t('common.status')} body={statusTemplate} className="text-sm" style={{ width: '15%' }}></Column>
                    </DataTable>
                </Card>

                {/* Recent Payments */}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">{t('dashboard.tables.recentPayments')}</h2>
                        <Button
                            label={t('dashboard.tables.viewAll')}
                            icon="pi pi-arrow-right"
                            className="p-button-text p-button-sm"
                            onClick={() => window.location.href = '/dashboard/payments/history'}
                        />
                    </div>

                    <DataTable value={recentPayments} responsiveLayout="scroll" stripedRows>
                        <Column field="id" header={t('common.id')} className="text-sm" style={{ width: '15%' }}></Column>
                        <Column field="memberId" header={t('common.memberId')} className="text-sm" style={{ width: '15%' }}></Column>
                        <Column field="amount" header={t('common.amount')} body={amountTemplate} className="text-sm" style={{ width: '15%' }}></Column>
                        <Column field="date" header={t('common.date')} className="text-sm" style={{ width: '20%' }}></Column>
                        <Column field="type" header={t('common.type')} body={paymentTypeTemplate} className="text-sm" style={{ width: '35%' }}></Column>
                    </DataTable>
                </Card>
            </div>
        </div>
    );
};

export default DashboardOverview;