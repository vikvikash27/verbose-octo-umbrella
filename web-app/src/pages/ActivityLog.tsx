import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Table, { ColumnDefinition } from '../components/ui/Table';
import { SpinnerIcon } from '../components/icons';
import { ActivityLog as ActivityLogType } from '../types';
import { API_URL } from '../api/config';

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('admin-token');
        if (!token) throw new Error('Authentication required.');

        const response = await fetch(`${API_URL}/api/activity-log`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch activity logs.');

        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columns: ColumnDefinition<ActivityLogType>[] = [
    {
      accessor: 'createdAt',
      header: 'Timestamp',
      cell: (item) => new Date(item.createdAt).toLocaleString(),
    },
    {
      accessor: 'adminName',
      header: 'Admin',
    },
    {
      accessor: 'action',
      header: 'Action',
      cell: (item) => <span className="font-medium text-slate-800">{item.action}</span>,
    },
    {
      accessor: 'details',
      header: 'Details',
      cell: (item) => <span className="text-sm text-slate-600">{item.details}</span>,
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
    return <Table data={logs} columns={columns} />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Admin Activity Log</h1>
      <Card>
        {renderContent()}
      </Card>
    </div>
  );
};

export default ActivityLog;