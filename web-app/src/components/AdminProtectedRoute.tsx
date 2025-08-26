
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface AdminProtectedRouteProps {
  children: React.ReactElement;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div>Loading...</div>
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
