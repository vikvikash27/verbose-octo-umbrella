import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomerDetails, Order } from '../types';
import { API_URL } from '../api/config';
import { SpinnerIcon } from '../components/icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table, { ColumnDefinition } from '../components/ui/Table';
import Badge from '../components/ui/Badge';

const CustomerDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [customer, setCustomer] = useState<CustomerDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchCustomerDetails = async () => {
            try {
                const token = localStorage.getItem('admin-token');
                if (!token) throw new Error('Authentication token not found.');

                const response = await fetch(`${API_URL}/api/customers/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch customer details');
                
                const data = await response.json();
                setCustomer(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerDetails();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><SpinnerIcon className="h-8 w-8 text-brand-primary" /></div>;
    }

    if (error || !customer) {
        return <div className="text-red-500 text-center">Error: {error || 'Customer not found.'}</div>;
    }
    
    const orderColumns: ColumnDefinition<Order>[] = [
        { 
            accessor: 'id', 
            header: 'Order ID',
            cell: (item) => (
                <Link to={`/admin/orders/${encodeURIComponent(item.id)}`} className="text-brand-primary hover:underline font-medium">
                    {item.id}
                </Link>
            )
        },
        { accessor: 'orderTimestamp', header: 'Date', cell: (item) => new Date(item.orderTimestamp).toLocaleDateString() },
        { accessor: 'total', header: 'Total', cell: (item) => `₹${item.total.toFixed(2)}` },
        { accessor: 'status', header: 'Status', cell: (item) => (
             <Badge color={item.status === 'Delivered' ? 'green' : item.status === 'Shipped' || item.status === 'Out for Delivery' ? 'blue' : item.status === 'Processing' ? 'yellow' : item.status === 'Pending' ? 'gray' : 'red'}>
                {item.status}
            </Badge>
        )},
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Customer Details</h1>
                <Link to="/admin/customers">
                    <Button variant="secondary">Back to Customers</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        <img src={customer.avatar} alt={customer.name} className="w-24 h-24 rounded-full mb-4" />
                        <h2 className="text-xl font-semibold text-slate-800">{customer.name}</h2>
                        <p className="text-slate-500">{customer.email}</p>
                        <p className="text-slate-500 mt-1">{customer.phone}</p>
                    </div>
                    <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Total Spent:</span>
                            <span className="font-medium text-slate-700">₹{customer.totalSpent.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Total Orders:</span>
                            <span className="font-medium text-slate-700">{customer.orders.length}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-slate-500">Joined On:</span>
                            <span className="font-medium text-slate-700">{new Date(customer.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </Card>
                <Card className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Order History</h3>
                    <Table data={customer.orders} columns={orderColumns} />
                </Card>
            </div>
        </div>
    );
};

export default CustomerDetailsPage;