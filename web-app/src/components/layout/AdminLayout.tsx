import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSocket } from '../../hooks/useSocket';
import { Order } from '../../types';
import { CloseIcon } from '../icons';

interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const NotificationToast: React.FC<ToastNotification & {onClose: () => void}> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // Fade in
        const timer = setTimeout(() => {
            handleClose();
        }, 5000); // Auto-dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
    };

    const baseClasses = "flex items-center justify-between w-full max-w-sm p-4 text-white rounded-lg shadow-lg";
    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500"
    };
    const transitionClasses = visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";

    return (
        <div className={`${baseClasses} ${typeClasses[type]} transform transition-all duration-300 ease-out ${transitionClasses}`}>
            <div className="text-sm font-medium">{message}</div>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20">
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


const AdminLayout: React.FC = () => {
  const { socket } = useSocket();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (order: Order) => {
      addToast(`New Order #${order.id} received from ${order.customerName}!`, 'success');
    };
    const handleOrderCancelled = (order: Order) => {
      addToast(`Order #${order.id} was cancelled. Refund may be required.`, 'error');
    };

    socket.on('new_order', handleNewOrder);
    socket.on('order_cancelled', handleOrderCancelled);

    return () => {
      socket.off('new_order', handleNewOrder);
      socket.off('order_cancelled', handleOrderCancelled);
    };
  }, [socket]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prevToasts => [...prevToasts, newToast]);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };


  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
       {/* Toast Container */}
       <div className="fixed bottom-4 right-4 z-50 space-y-3">
            {toasts.map(toast => (
                <NotificationToast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
       </div>
    </div>
  );
};

export default AdminLayout;