import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';
import { CartProvider } from './contexts/CartContext';
import { LocationProvider } from './contexts/LocationContext';
import { SocketProvider } from './contexts/SocketContext';

import AdminLayout from './components/layout/AdminLayout';
import MainLayout from './components/layout/MainLayout';

import AdminProtectedRoute from './components/AdminProtectedRoute';
import CustomerProtectedRoute from './components/CustomerProtectedRoute';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import AdminOrderDetailsPage from './pages/AdminOrderDetailsPage';
import Customers from './pages/Customers';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import ActivityLog from './pages/ActivityLog';

// Public/Customer Pages
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerSignupPage from './pages/CustomerSignupPage';
import MyAccountPage from './pages/MyAccountPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CustomerOrderDetailsPage from './pages/CustomerOrderDetailsPage';
import PaymentGatewayPage from './pages/PaymentGatewayPage';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <SocketProvider>
      <AdminAuthProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <LocationProvider>
              <BrowserRouter>
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="customers/:id" element={<CustomerDetailsPage />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="activity-log" element={<ActivityLog />} />
                  </Route>

                  {/* Customer/Public Routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="products/:id" element={<ProductDetailsPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="login" element={<CustomerLoginPage />} />
                    <Route path="signup" element={<CustomerSignupPage />} />
                    <Route path="checkout" element={<CustomerProtectedRoute><CheckoutPage /></CustomerProtectedRoute>} />
                    <Route path="payment-gateway" element={<CustomerProtectedRoute><PaymentGatewayPage /></CustomerProtectedRoute>} />
                    <Route path="order-confirmation" element={<CustomerProtectedRoute><OrderConfirmationPage /></CustomerProtectedRoute>} />
                    <Route path="account" element={<CustomerProtectedRoute><MyAccountPage /></CustomerProtectedRoute>} />
                    <Route path="account/orders" element={<CustomerProtectedRoute><OrderHistoryPage /></CustomerProtectedRoute>} />
                    <Route path="account/orders/:id" element={<CustomerProtectedRoute><CustomerOrderDetailsPage /></CustomerProtectedRoute>} />
                  </Route>
                  
                  {/* Not Found Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </LocationProvider>
          </CartProvider>
        </CustomerAuthProvider>
      </AdminAuthProvider>
    </SocketProvider>
  );
};

export default App;