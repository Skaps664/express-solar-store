import { api } from './api';

export interface OrderItem {
  product: string;
  name: string;
  slug: string;
  quantity: number;
  price: number;
  selectedVariant?: string;
  image?: string;
}

export interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  shippingAddress: string;
  email?: string;
  specialNotes?: string;
}

export interface Order {
  _id: string;
  user: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  orderNotes?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  whatsappSent: boolean;
  emailSent: boolean;
  whatsappMessageContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  customerInfo: CustomerInfo;
  paymentMethod: string;
  orderNotes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: {
    orderNumber: string;
    totalAmount: number;
    status: string;
    customerInfo: CustomerInfo;
  };
  whatsappURL: string;
  whatsappMessage: string;
}

export const orderService = {
  createOrder: async (orderData: CreateOrderData): Promise<CreateOrderResponse> => {
    const { data } = await api.post('/api/orders', orderData);
    return data as CreateOrderResponse;
  },

  getUserOrders: async (): Promise<{ orders: Order[] }> => {
    const { data } = await api.get('/api/orders/user');
    return data as { orders: Order[] };
  },

  getOrderById: async (orderId: string): Promise<{ order: Order }> => {
    const { data } = await api.get(`/api/orders/${orderId}`);
    return data as { order: Order };
  },

  // Admin functions
  getAllOrders: async (): Promise<{ orders: Order[] }> => {
    const { data } = await api.get('/api/orders');
    return data as { orders: Order[] };
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<{ order: Order }> => {
    const { data } = await api.put(`/api/orders/${orderId}/status`, { status });
    return data as { order: Order };
  },
};
