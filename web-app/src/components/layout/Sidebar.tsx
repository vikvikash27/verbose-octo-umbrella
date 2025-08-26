import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  DashboardIcon, 
  ProductIcon, 
  OrderIcon, 
  CustomerIcon, 
  SettingsIcon,
  PaymentsIcon,
  TagIcon,
  BarChartIcon,
  ActivityIcon,
  Logo 
} from '../icons';
import AddCategoryModal from '../AddCategoryModal';

// This is the main navigation sidebar for the admin panel.
// It displays the application logo and navigation links.
const Sidebar: React.FC = () => {
  const { user } = useAdminAuth();
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  const navItems = [
    { to: '/admin/dashboard', icon: <DashboardIcon className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/admin/products', icon: <ProductIcon className="h-5 w-5" />, label: 'Products' },
    { to: '/admin/orders', icon: <OrderIcon className="h-5 w-5" />, label: 'Orders' },
    { to: '/admin/customers', icon: <CustomerIcon className="h-5 w-5" />, label: 'Customers' },
    { to: '/admin/payments', icon: <PaymentsIcon className="h-5 w-5" />, label: 'Payments' },
    { to: '/admin/reports', icon: <BarChartIcon className="h-5 w-5" />, label: 'Reports' },
    { to: '/admin/activity-log', icon: <ActivityIcon className="h-5 w-5" />, label: 'Activity Log' },
    { to: '/admin/settings', icon: <SettingsIcon className="h-5 w-5" />, label: 'Settings' },
  ];

  const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-brand-primary text-white shadow-md'
            : 'text-slate-600 hover:bg-slate-200'
        }`
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <>
      <div className="w-64 bg-white flex flex-col border-r border-slate-200">
        <div className="flex items-center justify-center h-20 border-b border-slate-200">
            <div className="flex items-center gap-3">
                <Logo className="h-10 w-10 text-brand-primary" />
                <span className="text-xl font-bold text-slate-800">EasyOrganic</span>
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
            <button 
                onClick={() => setCategoryModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
                <TagIcon className="h-5 w-5"/>
                <span className="font-medium">Add Category</span>
            </button>
        </div>
      </div>
      <AddCategoryModal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
    </>
  );
};

export default Sidebar;