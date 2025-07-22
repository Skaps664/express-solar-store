import { api } from './api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post('/api/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData) => {
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/api/auth/logout');
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/api/auth/me');
    return data;
  },

  refreshToken: async () => {
    const { data } = await api.post('/api/auth/refresh');
    return data;
  },
};
