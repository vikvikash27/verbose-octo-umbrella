
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { Order, OrderStatus } from '../types';
import { SpinnerIcon } from '../components/icons';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { API_URL } from '../api/config';

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

const OrderHistoryPage: React.FC = () => {
    const { customer } = useCustomerAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('customer-token');
        if (!customer || !token) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/orders/myorders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [customer]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <SpinnerIcon className="h-8 w-8 text-brand-primary" />
                </div>
            );
        }

        if (error) {
            return <div className="text-red-500 text-center p-8">Error: {error}</div>;
        }

        if (orders.length === 0) {
            return (
                <Card className="text-center py-16">
                    <h2 className="text-xl font-semibold text-slate-700">No Orders Found</h2>
                    <p className="text-slate-500 mt-2">You haven't placed any orders with us yet.</p>
                    <Link to="/">
                        <Button className="mt-6">Start Shopping</Button>
                    </Link>
                </Card>
            );
        }

        return (
            <div className="space-y-6">
                {orders.map((order) => (
                    <Link to={`/account/orders/${encodeURIComponent(order.id)}`} key={order.id} className="block">
                        <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">Order ID</p>
                                    <p className="font-semibold text-slate-800">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Date Placed</p>
                                    <p className="font-semibold text-slate-800">{new Date(order.orderTimestamp).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Total</p>
                                    <p className="font-semibold text-slate-800">₹{order.total.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <Badge color={getStatusColor(order.status)}>{order.status}</Badge>
                                    <p className="text-sm text-slate-500 mt-2">{order.items.length} item(s)</p>
                                </div>
                                <div>
                                    <Button variant="secondary" size="sm">View Details</Button>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Order History</h1>
                 <Link to="/account">
                    <Button variant="secondary">Back to Account</Button>
                </Link>
            </div>
            {renderContent()}
        </div>
    );
};

export default OrderHistoryPage;
