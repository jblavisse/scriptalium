"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

// Définition de l'interface User directement dans AuthContext.tsx
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // Ajoutez d'autres champs selon vos besoins
}

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
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<{ user: User }>('/api/auth/login/', { username, password });
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail: string }>;
        return {
          success: false,
          message: axiosError.response?.data?.detail || 'Erreur de connexion',
        };
      }
      return {
        success: false,
        message: 'Erreur de connexion inconnue',
      };
    }
  };

  const logout = async (): Promise<AuthResponse> => {
    try {
      await api.post('/api/auth/logout/');
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail: string }>;
        if (axiosError.response && axiosError.response.status === 401) {
          setUser(null);
          setIsAuthenticated(false);
          return { success: true };
        }
        return {
          success: false,
          message: axiosError.response?.data?.detail || 'Erreur de déconnexion',
        };
      }
      console.error('Erreur de déconnexion', error);
      return {
        success: false,
        message: 'Erreur de déconnexion inconnue',
      };
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<User>('/api/auth/user/');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error.response?.data);
        }
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
