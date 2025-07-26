const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken'); // Use same key as main API service
  }
  return null;
};

// Create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Dashboard API functions
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (days = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats?days=${days}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activity
  getActivity: async (limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/activity?limit=${limit}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard activity:', error);
      throw error;
    }
  },

  // Get all orders (admin)
  getOrders: async (page = 1, limit = 10, status = 'all') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/admin/all?page=${page}&limit=${limit}&status=${status}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/admin/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Get site analytics
  getSiteAnalytics: async (startDate = null, endDate = null) => {
    try {
      let url = `${API_BASE_URL}/api/analytics/site`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching site analytics:', error);
      throw error;
    }
  }
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Helper function to format numbers
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Helper function to format percentage
export const formatPercentage = (num: number): string => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num}%`;
};

// Helper function to get status color
export const getStatusColor = (status: string | undefined): string => {
  const colors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800'
  };
  return colors[status?.toLowerCase() || ''] || 'bg-gray-100 text-gray-800';
};

export default dashboardApi;
