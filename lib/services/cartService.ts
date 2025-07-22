import { api } from './api';
import type { Product } from './productService';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  totalItems: number;
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { data } = await api.get('/api/cart');
    return data;
  },

  addToCart: async (productId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.post('/api/cart/add', { productId, quantity });
    return data;
  },

  updateCartItem: async (productId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.put('/api/cart/update', { productId, quantity });
    return data;
  },

  removeFromCart: async (productId: string): Promise<Cart> => {
    const { data } = await api.delete(`/api/cart/remove/${productId}`);
    return data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/api/cart/clear');
  },
};
