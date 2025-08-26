import React, { useState, useRef, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useSocket } from '../../hooks/useSocket';
import { BellIcon, ChevronDownIcon, LogoutIcon, SearchIcon, OrderIcon } from '../icons';
import { Order } from '../../types';

interface Notification {
  id: string;
  message: string;
  time: string;
}

const Header: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const { socket } = useSocket();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewOrder = (order: Order) => {
      const newNotification = {
        id: order.id,
        message: `New order #${order.id} for ₹${order.total.toFixed(2)}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep latest 10
    };

    socket.on('new_order', handleNewOrder);
    return () => {
      socket.off('new_order', handleNewOrder);
    };
  }, [socket]);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary bg-white"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationsRef}>
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-slate-500 hover:text-brand-primary">
              <BellIcon className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-3 font-semibold text-slate-700 border-b">Notifications</div>
                <ul className="py-1 max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(n => (
                    <li key={n.id} className="flex items-start gap-3 px-3 py-2 hover:bg-slate-50">
                       <OrderIcon className="h-5 w-5 mt-1 text-slate-400"/>
                       <div>
                          <p className="text-sm text-slate-700">{n.message}</p>
                          <p className="text-xs text-slate-500">{n.time}</p>
                       </div>
                    </li>
                  )) : (
                    <li className="text-center text-sm text-slate-500 p-4">No new notifications</li>
                  )}
                </ul>
                {notifications.length > 0 && 
                  <button onClick={() => setNotifications([])} className="w-full text-center py-2 text-sm text-brand-primary font-medium border-t hover:bg-slate-50">
                    Clear all
                  </button>
                }
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2"
            >
              <img src={user?.avatar} alt="User avatar" className="h-9 w-9 rounded-full" />
              <div className='text-left hidden md:block'>
                <span className="font-semibold text-sm text-slate-700">{user?.name}</span>
                <span className="block text-xs text-slate-500 capitalize">{user?.role}</span>
              </div>
              <ChevronDownIcon className="h-5 w-5 text-slate-400" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Settings</a>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogoutIcon className="h-5 w-5"/>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;