
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../hooks/useCustomerAuth';

interface CustomerProtectedRouteProps {
  children: React.ReactElement;
}

const CustomerProtectedRoute: React.FC<CustomerProtectedRouteProps> = ({ children }) => {
  const { customer, loading } = useCustomerAuth();
  const location = useLocation();

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div>Loading...</div>
        </div>
    );
  }

  if (!customer) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default CustomerProtectedRoute;
