import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('khyber_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('khyber_token') || null);
  const [isLoading, setIsLoading] = useState(Boolean(token && !user));

  useEffect(() => {
    if (token) {
      authService
        .getCurrentUser()
        .then((res) => {
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('khyber_admin_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          // Token is expired or invalid
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = (authToken, userData) => {
    localStorage.setItem('khyber_token', authToken);
    if (userData) {
      localStorage.setItem('khyber_admin_user', JSON.stringify(userData));
    }
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    try {
      if (token) {
        authService.logout().catch(() => {});
      }
    } finally {
      localStorage.removeItem('khyber_token');
      localStorage.removeItem('khyber_admin_user');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
