import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// User management API functions
export const userAPI = {
  // Get user statistics
  getStats: async () => {
    const response = await api.get("/users/admin/stats");
    return response.data;
  },

  // Get users with filtering and pagination
  getUsers: async (params = {}) => {
    const response = await api.get("/users/admin/users", { params });
    return response.data;
  },

  // Get single user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/admin/profile/${userId}`);
    return response.data;
  },

  // Block/unblock user
  blockUser: async (userId) => {
    const response = await api.put(`/users/block/${userId}`);
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await api.put(`/users/unblock/${userId}`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
};

export default api;
