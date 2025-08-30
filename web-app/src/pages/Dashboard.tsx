// import React, { useState, useEffect, useCallback } from 'react';
// import { useAdminAuth } from '../hooks/useAdminAuth';
// import { useSocket } from '../hooks/useSocket';
// import StatCard from '../components/dashboard/StatCard';
// import SalesChart from '../components/dashboard/SalesChart';
// import { OrderIcon, ProductIcon, SpinnerIcon } from '../components/icons';
// import Card from '../components/ui/Card';
// import Badge from '../components/ui/Badge';
// import { Order } from '../types';
// import { API_URL } from '../api/config';
// import Button from '../components/ui/Button';

// interface DashboardStats {
//   totalRevenue: number;
//   newOrdersCount: number;
//   totalProducts: number;
//   recentOrders: Order[];
// }

// type FilterPeriod = 'all' | 'today' | '7d' | '30d';

// const Dashboard: React.FC = () => {
//   const { user } = useAdminAuth();
//   const { socket } = useSocket();
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filter, setFilter] = useState<FilterPeriod>('all');

//   const fetchStats = useCallback(async (period: FilterPeriod) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('admin-token');
//       if (!token) throw new Error('Authentication token not found. Please log in.');

//       const params = new URLSearchParams();
//       const today = new Date();
//       if (period === 'today') {
//         params.append('startDate', today.toISOString().split('T')[0]);
//         params.append('endDate', today.toISOString().split('T')[0]);
//       } else if (period === '7d') {
//         const startDate = new Date();
//         startDate.setDate(today.getDate() - 6);
//         params.append('startDate', startDate.toISOString().split('T')[0]);
//         params.append('endDate', today.toISOString().split('T')[0]);
//       } else if (period === '30d') {
//         const startDate = new Date();
//         startDate.setDate(today.getDate() - 29);
//         params.append('startDate', startDate.toISOString().split('T')[0]);
//         params.append('endDate', today.toISOString().split('T')[0]);
//       }

//       const response = await fetch(`${API_URL}/api/dashboard-stats?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboard data');

//       const data = await response.json();
//       setStats(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchStats(filter);
//   }, [filter, fetchStats]);

//   useEffect(() => {
//     if (!socket) return;

//     const handleStatsUpdate = (newStats: DashboardStats) => {
//         // Only update if the current filter is 'all' to avoid overwriting filtered data
//         if (filter === 'all') {
//             setStats(newStats);
//         }
//     };

//     socket.on('stats_update', handleStatsUpdate);

//     return () => {
//         socket.off('stats_update', handleStatsUpdate);
//     };
//   }, [socket, filter]);

//   const renderStats = () => {
//     if (loading) {
//       return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <Card key={i} className="flex items-center justify-center h-28">
//               <SpinnerIcon className="h-6 w-6 text-slate-400" />
//             </Card>
//           ))}
//         </div>
//       );
//     }
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Total Revenue" value={`₹${stats?.totalRevenue.toLocaleString() ?? 0}`} icon={<span className="text-2xl">💰</span>} color="green" />
//         <StatCard title="Pending Orders" value={stats?.newOrdersCount.toString() ?? '0'} icon={<OrderIcon className="h-6 w-6" />} color="blue" />
//         <StatCard title="Total Products" value={stats?.totalProducts.toString() ?? '0'} icon={<ProductIcon className="h-6 w-6" />} color="yellow" />
//         <StatCard title="Conversion Rate" value="2.5%" icon={<span className="text-2xl">📈</span>} color="red" />
//       </div>
//     );
//   };

//   if (error && !loading) {
//     return <div className="text-red-500 text-center">Error: {error}</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-2xl font-bold text-slate-800">
//           Welcome back, {user?.name.split(' ')[0]}!
//         </h1>
//         <div className="flex items-center gap-2">
//             <Button size="sm" variant={filter === 'today' ? 'primary' : 'secondary'} onClick={() => setFilter('today')}>Today</Button>
//             <Button size="sm" variant={filter === '7d' ? 'primary' : 'secondary'} onClick={() => setFilter('7d')}>Last 7 Days</Button>
//             <Button size="sm" variant={filter === '30d' ? 'primary' : 'secondary'} onClick={() => setFilter('30d')}>Last 30 Days</Button>
//             <Button size="sm" variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>All Time</Button>
//         </div>
//       </div>

//       {renderStats()}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <SalesChart />
//         </div>
//         <div className="lg:col-span-1">
//           <Card>
//             <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Orders</h3>
//             <ul className="space-y-4">
//               {stats?.recentOrders && stats.recentOrders.length > 0 ? (
//                 stats.recentOrders.map(order => (
//                   <li key={order.id} className="flex items-center justify-between">
//                     <div>
//                       <p className="font-medium text-sm text-slate-700">{order.customerName}</p>
//                       <p className="text-xs text-slate-500">{order.id}</p>
//                     </div>
//                     <Badge color={order.status === 'Delivered' ? 'green' : order.status === 'Shipped' || order.status === 'Out for Delivery' ? 'blue' : order.status === 'Processing' ? 'yellow' : order.status === 'Pending' ? 'gray' : 'red'}>
//                       {order.status}
//                     </Badge>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-center text-sm text-slate-500 p-4">No recent orders found.</li>
//               )}
//             </ul>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

/////////////////////////Unite Define for product categories/////////////////////

import React, { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useSocket } from "../hooks/useSocket";
import StatCard from "../components/dashboard/StatCard";
import SalesChart from "../components/dashboard/SalesChart";
import { OrderIcon, ProductIcon, SpinnerIcon } from "../components/icons";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { Order, TopCustomerData } from "../types";
import { API_URL } from "../api/config";
import Button from "../components/ui/Button";
import Table, { ColumnDefinition } from "../components/ui/Table";

interface DashboardStats {
  totalRevenue: number;
  newOrdersCount: number;
  totalProducts: number;
  recentOrders: Order[];
}

type FilterPeriod = "all" | "today" | "7d" | "30d";

const Dashboard: React.FC = () => {
  const { user } = useAdminAuth();
  const { socket } = useSocket();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterPeriod>("all");

  const fetchDashboardData = useCallback(async (period: FilterPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("admin-token");
      if (!token)
        throw new Error("Authentication token not found. Please log in.");

      const params = new URLSearchParams();
      const today = new Date();
      if (period === "today") {
        params.append("startDate", today.toISOString().split("T")[0]);
        params.append("endDate", today.toISOString().split("T")[0]);
      } else if (period === "7d") {
        const startDate = new Date();
        startDate.setDate(today.getDate() - 6);
        params.append("startDate", startDate.toISOString().split("T")[0]);
        params.append("endDate", today.toISOString().split("T")[0]);
      } else if (period === "30d") {
        const startDate = new Date();
        startDate.setDate(today.getDate() - 29);
        params.append("startDate", startDate.toISOString().split("T")[0]);
        params.append("endDate", today.toISOString().split("T")[0]);
      }

      const [statsResponse, topCustomersResponse] = await Promise.all([
        fetch(`${API_URL}/api/dashboard-stats?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/dashboard-stats/top-customers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!statsResponse.ok) throw new Error("Failed to fetch dashboard data");
      if (!topCustomersResponse.ok)
        throw new Error("Failed to fetch top customers");

      const statsData = await statsResponse.json();
      const topCustomersData = await topCustomersResponse.json();

      setStats(statsData);
      setTopCustomers(topCustomersData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(filter);
  }, [filter, fetchDashboardData]);

  useEffect(() => {
    if (!socket) return;

    const handleStatsUpdate = (newStats: DashboardStats) => {
      if (filter === "all") {
        setStats(newStats);
        fetchDashboardData("all"); // Refetch all data including customers on update
      }
    };

    socket.on("stats_update", handleStatsUpdate);

    return () => {
      socket.off("stats_update", handleStatsUpdate);
    };
  }, [socket, filter, fetchDashboardData]);

  const renderStats = () => {
    if (loading && !stats) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="flex items-center justify-center h-28">
              <SpinnerIcon className="h-6 w-6 text-slate-400" />
            </Card>
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue.toLocaleString() ?? 0}`}
          icon={<span className="text-2xl">💰</span>}
          color="green"
        />
        <StatCard
          title="Pending Orders"
          value={stats?.newOrdersCount.toString() ?? "0"}
          icon={<OrderIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts.toString() ?? "0"}
          icon={<ProductIcon className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Conversion Rate"
          value="2.5%"
          icon={<span className="text-2xl">📈</span>}
          color="red"
        />
      </div>
    );
  };

  if (error && !loading) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  const topCustomerColumns: ColumnDefinition<TopCustomerData>[] = [
    {
      accessor: "name",
      header: "Customer",
      cell: (item) => (
        <div className="flex items-center">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover mr-4"
          />
          <div className="font-medium text-slate-800">{item.name}</div>
        </div>
      ),
    },
    {
      accessor: "totalSpent",
      header: "Total Spent",
      cell: (item) => `₹${item.totalSpent.toLocaleString("en-IN")}`,
    },
    {
      accessor: "orderCount",
      header: "Purchases",
    },
    {
      accessor: "lastPurchase",
      header: "Last Purchase",
      cell: (item) => new Date(item.lastPurchase).toLocaleDateString(),
    },
    {
      accessor: "id" as any,
      header: "Status",
      cell: (item) => (
        <div className="flex flex-col items-start gap-1">
          {item.totalSpent > 5000 && <Badge color="yellow">VIP</Badge>}
          {item.orderCount > 1 && <Badge color="blue">Repeat</Badge>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user?.name.split(" ")[0]}!
        </h1>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filter === "today" ? "primary" : "secondary"}
            onClick={() => setFilter("today")}
          >
            Today
          </Button>
          <Button
            size="sm"
            variant={filter === "7d" ? "primary" : "secondary"}
            onClick={() => setFilter("7d")}
          >
            Last 7 Days
          </Button>
          <Button
            size="sm"
            variant={filter === "30d" ? "primary" : "secondary"}
            onClick={() => setFilter("30d")}
          >
            Last 30 Days
          </Button>
          <Button
            size="sm"
            variant={filter === "all" ? "primary" : "secondary"}
            onClick={() => setFilter("all")}
          >
            All Time
          </Button>
        </div>
      </div>

      {renderStats()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Orders
            </h3>
            <ul className="space-y-4">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm text-slate-700">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-500">{order.id}</p>
                    </div>
                    <Badge
                      color={
                        order.status === "Delivered"
                          ? "green"
                          : order.status === "Shipped" ||
                            order.status === "Out for Delivery"
                          ? "blue"
                          : order.status === "Processing"
                          ? "yellow"
                          : order.status === "Pending"
                          ? "gray"
                          : "red"
                      }
                    >
                      {order.status}
                    </Badge>
                  </li>
                ))
              ) : (
                <li className="text-center text-sm text-slate-500 p-4">
                  No recent orders found.
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          High-Value & Repeat Customers
        </h3>
        {loading && topCustomers.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <SpinnerIcon className="h-8 w-8 text-brand-primary" />
          </div>
        ) : (
          <Table data={topCustomers} columns={topCustomerColumns} />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
