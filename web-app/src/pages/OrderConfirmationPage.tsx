
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const OrderConfirmationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20 text-center">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="mx-auto flex items-center justify-center h-20 w-20">
          <CheckCircleIcon />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mt-6">Thank You for Your Order!</h1>
        <p className="text-slate-600 mt-4">
          Your order has been placed successfully. You will receive an email confirmation shortly.
        </p>
        <Link to="/">
          <Button className="mt-8">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
