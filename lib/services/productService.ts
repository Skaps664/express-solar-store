import { api } from './api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  createdAt: string;
  specifications?: Record<string, string>;
  tags?: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export const ITEMS_PER_PAGE = 12;

export const productService = {
  getProducts: async (params: ProductFilters & { page?: number; limit?: number }): Promise<ProductsResponse> => {
    const { data } = await api.get('/api/products', {
      params: {
        limit: ITEMS_PER_PAGE,
        ...params,
      },
      headers: {
        'Cache-Control': 'max-age=300', // Cache for 5 minutes
      },
    });
    return data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/api/products/${id}`, {
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    return data;
  },

  getCategories: async () => {
    const { data } = await api.get('/api/categories', {
      headers: {
        'Cache-Control': 'max-age=3600', // Cache for 1 hour
      },
    });
    return data;
  },

  getBrands: async () => {
    const { data } = await api.get('/api/brands', {
      headers: {
        'Cache-Control': 'max-age=3600',
      },
    });
    return data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await api.get('/api/products/featured', {
      headers: {
        'Cache-Control': 'max-age=1800', // Cache for 30 minutes
      },
    });
    return data;
  },

  getRelatedProducts: async (productId: string): Promise<Product[]> => {
    const { data } = await api.get(`/api/products/${productId}/related`, {
      headers: {
        'Cache-Control': 'max-age=1800',
      },
    });
    return data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const { data } = await api.get('/api/products/search', {
      params: { q: query },
      headers: {
        'Cache-Control': 'max-age=60', // Cache search results for 1 minute
      },
    });
    return data;
  },

  getBrandProducts: async (brandId: string, params?: ProductFilters): Promise<ProductsResponse> => {
    const { data } = await api.get(`/api/brands/${brandId}/products`, {
      params: {
        limit: ITEMS_PER_PAGE,
        ...params,
      },
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    return data;
  },

  getCategoryProducts: async (categorySlug: string, params?: ProductFilters): Promise<ProductsResponse> => {
    const { data } = await api.get(`/api/products/category/${categorySlug}`, {
      params: {
        limit: ITEMS_PER_PAGE,
        ...params,
      },
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    return data;
  },
};
