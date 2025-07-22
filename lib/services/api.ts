import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ApiResponse {
  message?: string;
  [key: string]: any;
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

// Create axios instance with optimized settings
export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000, // Increased timeout for slower connections
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable automatic retries for failed requests
  validateStatus: (status) => status < 500, // Only retry 500+ errors
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Request interceptor with enhanced error handling and retries
api.interceptors.request.use(
  async (config: any) => {
    // Add timestamp to prevent caching for GET requests
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    // Remove custom headers that cause CORS issues
    // config.headers['X-Client-Timestamp'] = Date.now().toString();

    return config;
  },
  (error: any) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling and token refresh
api.interceptors.response.use(
  (response: any) => {
    // Simple response logging
    console.debug(`API Call to ${response.config.url} completed successfully`);
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle rate limiting
    if (error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 5;
      toast.error(`Too many requests. Please wait ${retryAfter} seconds.`);
      return Promise.reject(error);
    }

    // Handle authentication errors with token refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;

      if (originalRequest._retry <= MAX_RETRIES) {
        try {
          // Try to refresh token
          await api.post('/api/auth/refresh');
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // Clear auth state and redirect to login
          console.error('Token refresh failed:', refreshError);
          toast.error('Session expired. Please log in again.');
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle server errors with retries
    if (error.response.status >= 500 && (!originalRequest._retry || originalRequest._retry < MAX_RETRIES)) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      
      // Implement exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, originalRequest._retry - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(originalRequest);
    }

    // Show user-friendly error messages
    const errorData = error.response?.data as ApiResponse;
    const errorMessage = errorData?.message || 'An error occurred. Please try again.';
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);
