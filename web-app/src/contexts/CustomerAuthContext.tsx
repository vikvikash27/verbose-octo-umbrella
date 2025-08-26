import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { CustomerUser } from '../types';
import { API_URL } from '../api/config';

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
}

export const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const CUSTOMER_TOKEN_KEY = 'customer-token';

interface CustomerAuthProviderProps {
  children: ReactNode;
}

export const CustomerAuthProvider: React.FC<CustomerAuthProviderProps> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem(CUSTOMER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const userData = await response.json();
             if (userData.role === 'customer') {
                setCustomer(userData);
            } else {
                logout();
            }
          } else {
            localStorage.removeItem(CUSTOMER_TOKEN_KEY);
          }
        } catch (error) {
          console.error("Failed to fetch user from token", error);
          localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        }
      }
      setLoading(false);
    };
    loadUserFromToken();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
     const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    const data = await response.json();
    setCustomer(data);
    localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
  };
  
  const signup = async (name: string, email: string, password: string, phone: string): Promise<void> => {
     const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Could not sign up.');
    }
    const data = await response.json();
    setCustomer(data); // Automatically log user in on successful signup
    localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  };

  const value = { customer, loading, login, signup, logout };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};