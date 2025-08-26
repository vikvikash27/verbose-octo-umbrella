import React from 'react';
import { OrderStatus, StatusEvent } from '../types';
import { CheckCircleIcon, HomeIcon, PackageCheckIcon, TruckIcon, XCircleIcon } from './icons';

interface OrderTrackerProps {
    history: StatusEvent[];
    currentStatus: OrderStatus;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ history, currentStatus }) => {
    
    const allStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    if (currentStatus === 'Cancelled') {
        const cancelledEvent = history.find(h => h.status === 'Cancelled');
        return (
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <XCircleIcon className="w-8 h-8 text-red-500 mr-4" />
                <div>
                    <p className="font-bold text-red-700">Order Cancelled</p>
                     {cancelledEvent && (
                        <p className="text-sm text-red-600">
                            on {new Date(cancelledEvent.timestamp).toLocaleDateString()}
                            {cancelledEvent.notes && ` - Note: ${cancelledEvent.notes}`}
                        </p>
                    )}
                </div>
            </div>
        )
    }

    const getIconForStatus = (status: OrderStatus) => {
        const iconProps = { className:"w-6 h-6" };
        switch(status) {
            case 'Pending': return <CheckCircleIcon {...iconProps} />;
            case 'Processing': return <PackageCheckIcon {...iconProps} />;
            case 'Shipped': return <TruckIcon {...iconProps} />;
            case 'Out for Delivery': return <TruckIcon {...iconProps} />;
            case 'Delivered': return <HomeIcon {...iconProps} />;
            default: return <CheckCircleIcon {...iconProps} />;
        }
    }

    const currentStatusIndex = allStatuses.indexOf(currentStatus);

    return (
        <div className="flex items-center justify-between relative pt-4 pb-8">
             <div className="absolute top-7 left-0 w-full h-1 bg-slate-200">
                <div className="absolute top-0 left-0 h-1 bg-brand-secondary" style={{ width: `${(currentStatusIndex / (allStatuses.length - 1)) * 100}%` }}></div>
            </div>
            {allStatuses.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const event = history.find(h => h.status === status);
                
                const textColor = isCompleted ? 'text-brand-secondary' : 'text-slate-400';
                const circleColor = isCompleted ? 'bg-brand-secondary' : 'bg-slate-300';

                return (
                    <div key={status} className="flex flex-col items-center z-10 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${circleColor} text-white`}>
                           {getIconForStatus(status)}
                        </div>
                        <p className={`mt-2 text-xs sm:text-sm font-semibold ${isCompleted ? 'text-slate-700' : 'text-slate-500'}`}>{status}</p>
                        {event && isCompleted && (
                            <p className="text-xs text-slate-500 mt-1">{new Date(event.timestamp).toLocaleDateString()}</p>
                        )}
                    </div>
                )
            })}
        </div>
    );
};

export default OrderTracker;
