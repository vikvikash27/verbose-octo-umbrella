
import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChevronRightIcon } from '../components/icons';

const MyAccountPage: React.FC = () => {
    const { customer, logout } = useCustomerAuth();

    if (!customer) {
        return null; // Or a loading spinner, CustomerProtectedRoute handles redirection
    }

    return (
        <div className="container mx-auto px-6 py-12 bg-slate-50">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">My Account</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-brand-primary text-white flex items-center justify-center text-4xl font-bold mb-4">
                                {customer.name.charAt(0)}
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">{customer.name}</h2>
                            <p className="text-slate-500">{customer.email}</p>
                            <Button variant="secondary" size="sm" onClick={logout} className="mt-4">
                                Log Out
                            </Button>
                        </div>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-700 border-b pb-3">Account Dashboard</h3>
                        <Link to="/account/orders" className="flex justify-between items-center p-4 rounded-lg hover:bg-slate-100 transition-colors">
                            <div>
                                <h4 className="font-semibold text-slate-800">Order History</h4>
                                <p className="text-sm text-slate-500">View your past orders and their status.</p>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                        </Link>
                        <div className="flex justify-between items-center p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-not-allowed opacity-50">
                             <div>
                                <h4 className="font-semibold text-slate-800">Profile Settings</h4>
                                <p className="text-sm text-slate-500">Edit your name, email, and password.</p>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                        </div>
                         <div className="flex justify-between items-center p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-not-allowed opacity-50">
                             <div>
                                <h4 className="font-semibold text-slate-800">Saved Addresses</h4>
                                <p className="text-sm text-slate-500">Manage your shipping addresses.</p>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MyAccountPage;
