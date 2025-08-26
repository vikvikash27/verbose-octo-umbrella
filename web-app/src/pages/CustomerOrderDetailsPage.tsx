import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { Order, OrderStatus } from '../types';
import { SpinnerIcon } from '../components/icons';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import OrderTracker from '../components/OrderTracker';
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

const CustomerOrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { customer } = useCustomerAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const fetchOrder = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('customer-token');
            if (!token) {
                throw new Error('You must be logged in to view order details.');
            }

            const response = await fetch(`${API_URL}/api/orders/${encodeURIComponent(id)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Order not found or you do not have permission to view it.');
            }
            const data = await response.json();
            
            // Backend handles primary authorization, this is a secondary check.
            if (customer && data.customerEmail.toLowerCase() !== customer.email.toLowerCase()) {
                 throw new Error('You are not authorized to view this order.');
            }
            setOrder(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch order only when the customer context has been resolved.
        if (customer) {
            fetchOrder();
        }
    }, [id, customer]);
    
    const handleCancelOrder = async () => {
        if (!order || !window.confirm('Are you sure you want to cancel this order?')) return;
        
        setIsCancelling(true);
        try {
            const response = await fetch(`${API_URL}/api/orders/${encodeURIComponent(order.id)}/cancel`, { method: 'POST' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel order.');
            }
            // Refetch order details to show the updated status
            fetchOrder(); 
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not cancel the order.');
        } finally {
            setIsCancelling(false);
        }
    };


    if (loading) {
        return <div className="flex justify-center items-center h-[60vh]"><SpinnerIcon className="h-10 w-10 text-brand-primary" /></div>;
    }

    if (error || !order) {
        return <div className="text-center py-20 text-red-500">{error || 'Could not load order details.'}</div>;
    }

    return (
        <div className="bg-slate-50">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Order Details</h1>
                        <p className="text-slate-500">Order ID: {order.id}</p>
                    </div>
                    <Link to="/account/orders">
                        <Button variant="secondary">Back to Order History</Button>
                    </Link>
                </div>
                
                <Card className="mb-8">
                    <div className="flex flex-wrap justify-between items-center gap-6 p-4">
                         <div>
                            <p className="text-sm text-slate-500">Order Date</p>
                            <p className="font-semibold">{new Date(order.orderTimestamp).toLocaleDateString()}</p>
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
                             <h2 className="text-xl font-semibold mb-4">Items in Your Order</h2>
                             <ul className="divide-y divide-slate-200">
                                {order.items.map(item => (
                                    <li key={item.productId} className="py-4 flex items-center">
                                        {/* In a real app, you might fetch product images */}
                                        <div className="w-16 h-16 bg-slate-200 rounded-md mr-4 flex-shrink-0"></div>
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.productName}</p>
                                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </li>
                                ))}
                             </ul>
                        </Card>
                    </div>
                    <div className="space-y-8">
                        <Card>
                             <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                             {order.address ? (
                                <div className="space-y-1 text-slate-600">
                                    <p className="font-semibold">{order.address.fullName}</p>
                                    <p>{order.address.street}</p>
                                    <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                                    <p>{order.address.country}</p>
                                    <p>Phone: {order.address.phone}</p>
                                </div>
                             ) : (
                                <p>No address specified.</p>
                             )}
                        </Card>
                         <Card>
                             <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                             <div className="space-y-1 text-slate-600">
                                <p><strong>Method:</strong> {order.paymentMethod}</p>
                                <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                             </div>
                        </Card>
                        {order.status === 'Pending' && (
                            <Card>
                                <h2 className="text-xl font-semibold mb-2">Need to change something?</h2>
                                <p className="text-slate-500 text-sm mb-4">You can cancel this order as long as it is in the "Pending" state.</p>
                                <Button 
                                    variant="danger" 
                                    className="w-full"
                                    onClick={handleCancelOrder}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? <SpinnerIcon /> : 'Cancel Order'}
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CustomerOrderDetailsPage;