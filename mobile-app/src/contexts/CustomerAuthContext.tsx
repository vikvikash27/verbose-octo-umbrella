import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomerUser } from '../types';
import { API_URL } from '../api/config';

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  getToken: () => Promise<string | null>;
  loginWithFirebaseToken: (token: string) => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const CUSTOMER_TOKEN_KEY = 'customer-token-mobile';

export const CustomerAuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = await AsyncStorage.getItem(CUSTOMER_TOKEN_KEY);
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
              logout(); // Not a customer, log out
            }
          } else {
            await AsyncStorage.removeItem(CUSTOMER_TOKEN_KEY);
          }
        } catch (error) {
          console.error("Failed to fetch user from token", error);
          await AsyncStorage.removeItem(CUSTOMER_TOKEN_KEY);
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
    await AsyncStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
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
  };

  const logout = async () => {
    setCustomer(null);
    await AsyncStorage.removeItem(CUSTOMER_TOKEN_KEY);
  };
  
  const getToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(CUSTOMER_TOKEN_KEY);
  };

  const loginWithFirebaseToken = async (token: string) => {
    const response = await fetch(`${API_URL}/api/auth/verify-firebase-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Firebase token verification failed');
    }
    const data = await response.json();
    setCustomer(data);
    await AsyncStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
  };

  const value = { customer, loading, login, signup, logout, getToken, loginWithFirebaseToken };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};