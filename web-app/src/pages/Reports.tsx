import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SpinnerIcon, DownloadIcon } from '../components/icons';
import { API_URL } from '../api/config';
import { ReportData, TopProductData, CategorySalesData } from '../types';
import BarChart from '../components/charts/BarChart';
import Table, { ColumnDefinition } from '../components/ui/Table';
import { downloadCSV } from '../utils/csv';

// Helper to format date to YYYY-MM-DD
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const Reports: React.FC = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const [startDate, setStartDate] = useState(formatDate(thirtyDaysAgo));
    const [endDate, setEndDate] = useState(formatDate(today));
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReportData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('admin-token');
            if (!token) throw new Error('Authentication token not found.');

            const params = new URLSearchParams({ startDate, endDate });
            const response = await fetch(`${API_URL}/api/reports?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Failed to fetch report data');
            }
            const data = await response.json();
            setReportData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    const topProductsColumns: ColumnDefinition<TopProductData>[] = [
        { accessor: 'productName', header: 'Product', cell: (item) => (
            <div className="flex items-center">
                <img src={item.imageUrl} alt={item.productName} className="w-10 h-10 rounded-md object-cover mr-4" />
                <span className="font-medium text-slate-800">{item.productName}</span>
            </div>
        )},
        { accessor: 'unitsSold', header: 'Units Sold' },
        { accessor: 'totalRevenue', header: 'Total Revenue', cell: (item) => `₹${item.totalRevenue.toFixed(2)}` }
    ];
    
    const categorySalesColumns: ColumnDefinition<CategorySalesData>[] = [
        { accessor: 'category', header: 'Category' },
        { accessor: 'sales', header: 'Total Sales', cell: (item) => `₹${item.sales.toFixed(2)}` }
    ];

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-96"><SpinnerIcon className="h-10 w-10 text-brand-primary" /></div>;
        }
        if (error) {
            return <div className="text-red-500 text-center p-8">{error}</div>;
        }
        if (!reportData) {
            return <div className="text-center p-8">No data available for the selected period.</div>;
        }

        return (
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-800">₹{reportData.summary.totalRevenue.toLocaleString('en-IN')}</p>
                    </Card>
                     <Card>
                        <p className="text-sm font-medium text-slate-500">Total Orders</p>
                        <p className="text-2xl font-bold text-slate-800">{reportData.summary.totalOrders.toLocaleString('en-IN')}</p>
                    </Card>
                 </div>

                <Card>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales Over Time</h3>
                    <BarChart data={reportData.salesOverTime.map(d => ({ label: d.date, value: d.sales }))} />
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">Top Selling Products</h3>
                            <Button variant="secondary" size="sm" onClick={() => downloadCSV(reportData.topSellingProducts, 'top-products.csv')} className="flex items-center gap-1">
                                <DownloadIcon className="w-4 h-4" /> Export
                            </Button>
                        </div>
                        <Table data={reportData.topSellingProducts} columns={topProductsColumns} />
                    </Card>
                     <Card>
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">Sales by Category</h3>
                            <Button variant="secondary" size="sm" onClick={() => downloadCSV(reportData.salesByCategory, 'sales-by-category.csv')} className="flex items-center gap-1">
                                <DownloadIcon className="w-4 h-4" /> Export
                            </Button>
                        </div>
                        <Table data={reportData.salesByCategory} columns={categorySalesColumns} />
                    </Card>
                </div>

            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
            <Card>
                <div className="flex flex-wrap items-center gap-4">
                    <Input
                        label="Start Date"
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        containerClassName="flex-grow"
                    />
                    <Input
                        label="End Date"
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        containerClassName="flex-grow"
                    />
                    <div className="self-end">
                        <Button onClick={fetchReportData} disabled={loading}>
                           {loading ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </div>
                </div>
            </Card>
            
            {renderContent()}
        </div>
    );
};

export default Reports;
