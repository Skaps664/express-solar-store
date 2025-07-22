'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/services/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (data: { name: string; email: string; password: string; mobile?: string }) => Promise<void>;
  loginLoading: boolean;
  registerLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      try {
        const { data } = await api.get<{ user: User }>('/api/user/me');
        return data.user || null;
      } catch (error) {
        // Always return null instead of undefined for failed requests
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await api.post<{ user: User; token?: string }>('/api/user/login', credentials);
      
      // Store token in localStorage for production cross-origin deployments
      if (data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.token);
        }
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      toast.success('Successfully logged in');
      // Don't auto-redirect, let the component handle it
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Login failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/user/logout');
    },
    onSuccess: () => {
      // Clear localStorage tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      queryClient.setQueryData(['user'], null);
      toast.success('Successfully logged out');
      router.push('/login');
    },
    onError: () => {
      toast.error('Logout failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; mobile?: string }) => {
      const response = await api.post<{ user: User; token?: string }>('/api/user/register', data);
      
      // Store token in localStorage for production cross-origin deployments
      if (response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', response.data.token);
        }
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      toast.success('Registration successful');
      // Don't auto-redirect, let the component handle it
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Registration failed');
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
        login: (credentials) => {
          return new Promise<void>((resolve, reject) => {
            loginMutation.mutate(credentials, {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            });
          });
        },
        logout: logoutMutation.mutate,
        register: (data) => {
          return new Promise<void>((resolve, reject) => {
            registerMutation.mutate(data, {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            });
          });
        },
        loginLoading: loginMutation.isPending,
        registerLoading: registerMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}