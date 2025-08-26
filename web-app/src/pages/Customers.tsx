import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table, { ColumnDefinition } from '../components/ui/Table';
import { SpinnerIcon } from '../components/icons';
import { Customer } from '../types';
import ActionMenu from '../components/ui/ActionMenu';
import { API_URL } from '../api/config';

// This page displays a list of all customers.
const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('admin-token');
        if (!token) {
          throw new Error('Authentication token not found. Please log in.');
        }

        const response = await fetch(`${API_URL}/api/customers`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSendWhatsapp = (phone?: string) => {
    if (phone) {
        const cleanedPhone = phone.replace(/\D/g, '');
        const whatsappNumber = cleanedPhone.startsWith('91') ? cleanedPhone : `91${cleanedPhone}`;
        window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    } else {
        alert('No phone number available for this customer.');
    }
  };

  const columns: ColumnDefinition<Customer>[] = [
    {
      accessor: 'name',
      header: 'Customer',
      cell: (item) => (
        <Link to={`/admin/customers/${item.id}`} className="flex items-center group">
          <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover mr-4" />
          <div>
            <div className="font-medium text-slate-800 group-hover:text-brand-primary group-hover:underline">{item.name}</div>
            <div className="text-sm text-slate-500">{item.email}</div>
          </div>
        </Link>
      ),
    },
    {
      accessor: 'lastOrder',
      header: 'Last Order',
    },
    {
      accessor: 'totalSpent',
      header: 'Total Spent',
      cell: (item) => `₹${item.totalSpent.toLocaleString('en-IN')}`,
    },
    {
      accessor: 'id',
      header: 'Actions',
      cell: (item) => (
        <ActionMenu actions={[
            { label: 'View Details', onClick: () => navigate(`/admin/customers/${item.id}`) }, 
            { label: 'Send Whatsapp', onClick: () => handleSendWhatsapp(item.phone) }
        ]} />
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
    return <Table data={customers} columns={columns} />;
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
        <Button>Add Customer</Button>
      </div>
      <Card>
        {renderContent()}
      </Card>
    </div>
  );
};

export default Customers;