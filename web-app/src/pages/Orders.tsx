import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table, { ColumnDefinition } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { DownloadIcon, SearchIcon, SpinnerIcon } from '../components/icons';
import { Order, OrderStatus } from '../types';
import { useSocket } from '../hooks/useSocket';
import { API_URL } from '../api/config';
import Input from '../components/ui/Input';
import { downloadCSV } from '../utils/csv';

const statusFilters: (OrderStatus | 'All')[] = ['All', 'Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
const updatableStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const { socket } = useSocket();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin-token');
      if (!token) throw new Error('Admin authentication token not found.');
      const response = await fetch(`${API_URL}/api/orders`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.sort((a: Order, b: Order) => new Date(b.orderTimestamp).getTime() - new Date(a.orderTimestamp).getTime()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewOrder = (newOrder: Order) => {
      setOrders(prevOrders => [newOrder, ...prevOrders]);
    };

    const handleOrderUpdate = (updatedOrder: Order) => {
      setOrders(prevOrders => prevOrders.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
    };

    socket.on('new_order', handleNewOrder);
    socket.on('order_updated', handleOrderUpdate);

    return () => {
      socket.off('new_order', handleNewOrder);
      socket.off('order_updated', handleOrderUpdate);
    };
  }, [socket]);

  const filteredOrders = useMemo(() => {
    return orders
        .filter(order => filter === 'All' || order.status === filter)
        .filter(order => 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
  }, [orders, filter, searchTerm]);
  
  const handleSelectOrder = (orderId: string) => {
      setSelectedOrders(prev => {
          const newSelection = new Set(prev);
          if (newSelection.has(orderId)) {
              newSelection.delete(orderId);
          } else {
              newSelection.add(orderId);
          }
          return newSelection;
      });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
      } else {
          setSelectedOrders(new Set());
      }
  };
  
  const handleBulkStatusUpdate = async (status: OrderStatus) => {
      if (selectedOrders.size === 0) return;
      const token = localStorage.getItem('admin-token');
      try {
          await fetch(`${API_URL}/api/orders/bulk-update-status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ orderIds: Array.from(selectedOrders), status }),
          });
          // Optimistically update or refetch
          fetchOrders(); 
          setSelectedOrders(new Set());
      } catch (err) {
          console.error("Bulk update failed", err);
      }
  };
  
  const handleExport = () => {
    const dataToExport = filteredOrders.map(({ _id, items, address, statusHistory, ...rest }) => ({
        ...rest,
        orderTimestamp: new Date(rest.orderTimestamp).toLocaleString(),
        itemCount: items.length,
    }));
    downloadCSV(dataToExport, `orders_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const columns: ColumnDefinition<Order>[] = [
    { 
        accessor: 'id' as any, // Dummy accessor
        header: '',
        cell: (item) => <input type="checkbox" checked={selectedOrders.has(item.id)} onChange={() => handleSelectOrder(item.id)} />
    },
    { accessor: 'id', header: 'Order ID' },
    { accessor: 'customerName', header: 'Customer' },
    { accessor: 'orderTimestamp', header: 'Timestamp', cell: (item) => new Date(item.orderTimestamp).toLocaleString() },
    { accessor: 'total', header: 'Total', cell: (item) => `₹${item.total.toFixed(2)}` },
    {
      accessor: 'status',
      header: 'Status',
      cell: (item) => (
         <Badge color={item.status === 'Delivered' ? 'green' : item.status === 'Shipped' || item.status === 'Out for Delivery' ? 'blue' : item.status === 'Processing' ? 'yellow' : item.status === 'Pending' ? 'gray' : 'red'}>
          {item.status}
        </Badge>
      )
    },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64"><SpinnerIcon className="h-8 w-8 text-brand-primary" /></div>;
    }
    if (error) {
      return <div className="text-red-500 text-center p-8">Error: {error}</div>;
    }
    return <Table data={filteredOrders} columns={columns} rowClassName={(order) => order.status === 'Cancelled' ? 'bg-red-50 hover:bg-red-100' : ''} />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
      <Card>
        <div className="p-4 border-b border-slate-200 space-y-4">
            <div className="flex justify-between items-center gap-4">
                 <div className="relative w-full max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input 
                        placeholder="Search by Order ID or Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="secondary" onClick={handleExport} disabled={filteredOrders.length === 0} className="flex items-center gap-2">
                    <DownloadIcon className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
                {statusFilters.map(status => (
                    <Button 
                        key={status}
                        variant={filter === status ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setFilter(status)}
                        className="flex-shrink-0"
                    >
                        {status}
                    </Button>
                ))}
            </div>
        </div>
        {selectedOrders.size > 0 && (
            <div className="p-3 bg-indigo-50 border-b flex items-center gap-4">
                <p className="text-sm font-medium text-slate-700">{selectedOrders.size} selected</p>
                <select 
                    onChange={(e) => handleBulkStatusUpdate(e.target.value as OrderStatus)}
                    className="pl-3 pr-8 py-1.5 border border-slate-300 rounded-md text-sm"
                    value=""
                >
                    <option value="" disabled>Bulk Actions...</option>
                    {updatableStatuses.map(s => <option key={s} value={s}>Change status to {s}</option>)}
                </select>
            </div>
        )}
        {renderContent()}
      </Card>
    </div>
  );
};

export default Orders;