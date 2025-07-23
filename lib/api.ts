// Import services
import { cartService } from './services/cartService';
import { orderService } from './services/orderService';

// Export all services from a central location
export { cartService } from './services/cartService';
export { orderService } from './services/orderService';
export { api } from './services/api';

// Re-export common functions for backward compatibility
export const getCart = cartService.getCart;
export const createOrder = orderService.createOrder;

// Export types
export type { CartItem, Cart } from './services/cartService';
export type { Order, OrderItem, CustomerInfo, CreateOrderData, CreateOrderResponse } from './services/orderService';
