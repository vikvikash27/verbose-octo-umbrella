import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../types';
import { API_URL } from '../api/config';
import { SpinnerIcon, DownloadIcon } from '../components/icons';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import OrderTracker from '../components/OrderTracker';
import { generateInvoicePDF } from '../utils/invoiceGenerator';

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case 'Delivered': return 'green';
        case 'Shipped': return 'blue';
        case 'Out for Delivery': return 'blue';
        case 'Processing': return 'yellow';
        case 'Pending': return 'gray';
        case 'Cancelled': return 'red';
        default: return 'gray';
    }
};

const AdminOrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('admin-token');
                if (!token) {
                    throw new Error('Admin authentication required.');
                }

                const response = await fetch(`${API_URL}/api/orders/${encodeURIComponent(id)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Order not found or access denied.');
                }
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);
    
    if (loading) {
        return <div className="flex justify-center items-center h-[60vh]"><SpinnerIcon className="h-10 w-10 text-brand-primary" /></div>;
    }

    if (error || !order) {
        return <div className="text-center py-20 text-red-500">{error || 'Could not load order details.'}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
                    <p className="text-slate-500">Order ID: {order.id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => generateInvoicePDF(order)} className="flex items-center gap-2">
                        <DownloadIcon className="h-4 w-4" />
                        Download Invoice
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                </div>
            </div>
            
            <Card className="mb-8">
                <div className="flex flex-wrap justify-between items-center gap-6 p-4">
                     <div>
                        <p className="text-sm text-slate-500">Order Date</p>
                        <p className="font-semibold">{new Date(order.orderTimestamp).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Amount</p>
                        <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <Badge color={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Order Tracker</h2>
                        <OrderTracker history={order.statusHistory} currentStatus={order.status} />
                    </Card>
                    <Card>
                         <h2 className="text-xl font-semibold mb-4">Items in Order ({order.items.length})</h2>
                         <ul className="divide-y divide-slate-200">
                            {order.items.map((item, index) => (
                                <li key={index} className="py-4 flex items-center">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-slate-800">{item.productName}</p>
                                        <p className="text-sm text-slate-500">
                                            {item.quantity} x ₹{item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </li>
                            ))}
                         </ul>
                    </Card>
                </div>
                <div className="space-y-8">
                     <Card>
                         <h2 className="text-xl font-semibold mb-4">Customer & Address</h2>
                         <div className="space-y-1 text-slate-600">
                            <p className="font-semibold text-slate-800">{order.customerName}</p>
                            <p>{order.customerEmail}</p>
                            <div className="border-t my-2"></div>
                            {order.address ? (
                            <>
                                <p className="font-semibold">{order.address.fullName}</p>
                                <p>{order.address.street}</p>
                                <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                                <p>Phone: {order.address.phone}</p>
                            </>
                            ) : (
                            <p>No address specified.</p>
                            )}
                         </div>
                    </Card>
                     <Card>
                         <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                         <div className="space-y-1 text-slate-600">
                            <p><strong>Method:</strong> {order.paymentMethod}</p>
                            <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailsPage;