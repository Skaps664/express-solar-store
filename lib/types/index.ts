export interface ProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  label?: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// extend User with optional address and admin flags used across the frontend
export interface UserWithAddress extends User {
  isAdmin?: boolean;
  mobile?: string;
  adress?: Address[]; // note: backend uses the 'adress' field name
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: User;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
