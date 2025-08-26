import React from 'react';
import Card from '../components/ui/Card';
import Table, { ColumnDefinition } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { SpinnerIcon } from '../components/icons';
import { API_URL } from '../api/config';

interface Payment {
  transactionId: string;
  orderId: string;
  amount: number;
  date: string;
  method: 'Card' | 'COD' | 'N/A';
  status: 'Completed' | 'Pending' | 'Refunded';
}

const Payments: React.FC = () => {
    const [payments, setPayments] = React.useState<Payment[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('admin-token');
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                const response = await fetch(`${API_URL}/api/payments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch payment data.');
                }
                const data = await response.json();
                setPayments(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

  const columns: ColumnDefinition<Payment>[] = [
    { accessor: 'transactionId', header: 'Transaction ID' },
    { accessor: 'orderId', header: 'Order ID' },
    { accessor: 'date', header: 'Date' },
    { accessor: 'method', header: 'Method' },
    { accessor: 'amount', header: 'Amount', cell: (item) => `₹${item.amount.toFixed(2)}` },
    {
      accessor: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge color={item.status === 'Completed' ? 'green' : item.status === 'Pending' ? 'yellow' : 'red'}>
          {item.status}
        </Badge>
      ),
    },
  ];

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
    return <Table data={payments} columns={columns} />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Payments</h1>
      <Card>
        {renderContent()}
      </Card>
    </div>
  );
};

export default Payments;