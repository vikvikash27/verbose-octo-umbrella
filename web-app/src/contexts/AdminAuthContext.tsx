import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';
import { API_URL } from '../api/config';

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'admin-token';

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
             // Ensure the user has an admin role
            if (userData.role === 'admin') {
                setUser(userData);
            } else {
                // If token is for a non-admin, log them out of the admin context
                logout();
            }
          } else {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
          }
        } catch (error) {
          console.error("Failed to fetch user from token", error);
          localStorage.removeItem(ADMIN_TOKEN_KEY);
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    setUser(data);
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  const value = { user, loading, login, logout };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};