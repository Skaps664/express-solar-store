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
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
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
        const { data } = await api.get<{ user: User; success: boolean }>('/api/user/me');
        
        // Check if the response indicates success
        if (data.success && data.user) {
          return data.user;
        }
        
        return null;
      } catch (error: any) {
        console.log('User query failed:', error?.response?.status);
        // Always return null instead of undefined for failed requests
        return null;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry 401 errors (user not authenticated)
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    staleTime: 1 * 60 * 1000, // 1 minute (reduced from 5)
    gcTime: 5 * 60 * 1000, // 5 minutes (reduced from 10)
    refetchOnWindowFocus: true, // Ensure refetch when window regains focus
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await api.post<{ user: User; token?: string; success: boolean; message?: string }>('/api/user/login', credentials);
      
      // Check if the backend indicates failure
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token in localStorage for production cross-origin deployments
      if (data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.token);
        }
      }
      
      return data;
    },
    onSuccess: async (data) => {
      console.log("✅ Login mutation success, user data:", data.user);
      
      // First set the user data immediately
      queryClient.setQueryData(['user'], data.user);
      
      // Then force a refetch to ensure sync with backend
      try {
        await queryClient.refetchQueries({ queryKey: ['user'] });
      } catch (error) {
        console.log('User refetch failed:', error);
        // Still use the login response data
      }
      
      // Don't show success toast here - let the page handle it
      // Don't auto-redirect, let the component handle it
    },
    onError: (error: any) => {
      console.log("❌ Login error details:", error);
      console.log("Error response:", error?.response);
      console.log("Error data:", error?.response?.data);
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
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
      router.push('/auth');
    },
    onError: () => {
      toast.error('Logout failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; mobile?: string }) => {
      const response = await api.post<{ user: User; token?: string; message?: string; success: boolean }>('/api/user/register', data);
      
      // Check if the backend indicates failure
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      // Store token in localStorage for production cross-origin deployments
      if (response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', response.data.token);
        }
      }
      
      return response.data;
    },
    onSuccess: async (data) => {
      console.log("✅ Registration mutation success, user data:", data.user);
      
      // First set the user data immediately
      queryClient.setQueryData(['user'], data.user);
      
      // Then force a refetch to ensure sync with backend
      try {
        await queryClient.refetchQueries({ queryKey: ['user'] });
      } catch (error) {
        console.log('User refetch failed:', error);
        // Still use the registration response data
      }
      
      // Use the custom message from backend
      toast.success(data.message || 'Account created successfully, happy shopping!');
      // Don't auto-redirect, let the component handle it
    },
    onError: (error: any) => {
      console.log("❌ Registration error details:", error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
        isAuthenticated: !!user,
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