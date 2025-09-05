// Frontend API caching layer for instant loading
class ClientCache {
  private cache = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const clientCache = new ClientCache();

// Enhanced API service with aggressive caching
export const cachedApiService = {
  async getProducts(page = 1, limit = 20, category?: string, sort?: string) {
    const cacheKey = `products:${page}:${limit}:${category || 'all'}:${sort || 'newest'}`;
    
    // Check cache first
    const cached = clientCache.get(cacheKey);
    if (cached) {
      console.log('🚀 Serving from client cache:', cacheKey);
      return cached;
    }
    
  // Build API base. Support both NEXT_PUBLIC_API_BASE and NEXT_PUBLIC_API_URL for historical reasons.
  const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || ''
  const API_BASE = RAW_API_BASE ? RAW_API_BASE.replace(/\/$/, '') : ''
  const buildUrl = (path: string) => API_BASE ? `${API_BASE}${path.startsWith('/') ? path : `/${path}`}` : (path.startsWith('/') ? path : `/${path}`)

  // Fetch from API
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(sort && { sort })
    });
    
  const response = await fetch(`${buildUrl(`/api/products`)}?${params.toString()}`, {
      // Enable browser caching
      cache: 'force-cache',
      next: { revalidate: 300 } // 5 minutes
    });
    
    const data = await response.json();
    
    // Cache in client
    clientCache.set(cacheKey, data);
    
    return data;
  },

  async getBrands() {
    const cacheKey = 'brands:all';
    
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;
    
  const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || ''
  const API_BASE = RAW_API_BASE ? RAW_API_BASE.replace(/\/$/, '') : ''
  const buildUrl = (path: string) => API_BASE ? `${API_BASE}${path.startsWith('/') ? path : `/${path}`}` : (path.startsWith('/') ? path : `/${path}`)

  const response = await fetch(`${buildUrl(`/api/brands`)}`, {
      cache: 'force-cache',
      next: { revalidate: 600 } // 10 minutes - brands change less frequently
    });
    
    const data = await response.json();
    clientCache.set(cacheKey, data);
    
    return data;
  },

  async getCategories() {
    const cacheKey = 'categories:all';
    
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;
    
  const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || ''
  const API_BASE = RAW_API_BASE ? RAW_API_BASE.replace(/\/$/, '') : ''
  const buildUrl = (path: string) => API_BASE ? `${API_BASE}${path.startsWith('/') ? path : `/${path}`}` : (path.startsWith('/') ? path : `/${path}`)

  const response = await fetch(`${buildUrl(`/api/category`)}`, {
      cache: 'force-cache',
      next: { revalidate: 1800 } // 30 minutes - categories rarely change
    });
    
    const data = await response.json();
    clientCache.set(cacheKey, data);
    
    return data;
  }
};
