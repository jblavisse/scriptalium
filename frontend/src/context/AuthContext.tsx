"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

interface AuthResponse {
  success: boolean;
  message?: string;
}

interface AuthContextProps {
  user: any;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/auth/login/', { username, password });
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Erreur de connexion',
      };
    }
  };

  const logout = async (): Promise<AuthResponse> => {
    try {
      await api.post('/api/auth/logout/');
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        return { success: true };
      } else {
        console.error('Erreur de déconnexion', error);
        return {
          success: false,
          message: 'Erreur de déconnexion',
        };
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/user/');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
