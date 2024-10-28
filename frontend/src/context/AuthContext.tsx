"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, 
});

interface AuthContextProps {
  user: any;
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login/', { username, password });
      setUser(response.data.user);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Erreur de connexion',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout/');
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur de déconnexion', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/user/');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
