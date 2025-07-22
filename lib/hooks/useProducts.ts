import { useQuery, useInfiniteQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { productService, ProductFilters, Product, ITEMS_PER_PAGE, ProductsResponse } from '../services/productService';
import { useCallback, useEffect } from 'react';

// Query key factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  infinite: (filters: ProductFilters) => [...productKeys.lists(), 'infinite', filters] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  related: (id: string) => [...productKeys.all, 'related', id] as const,
};

export function useProducts(filters: ProductFilters = {}, options?: UseQueryOptions<ProductsResponse>) {
  const queryClient = useQueryClient();

  // Pre-fetch next page
  const prefetchNextPage = useCallback(
    (currentPage: number) => {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: productKeys.list({ ...filters, page: nextPage }),
        queryFn: () => productService.getProducts({ ...filters, page: nextPage }),
      });
    },
    [queryClient, filters]
  );

  const query = useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    ...options,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onSuccess: (data) => {
      // Pre-fetch next page
      if (data.page < data.totalPages) {
        prefetchNextPage(data.page);
      }
    },
  });

  return { ...query, prefetchNextPage };
}

// Infinite loading version for better performance with large lists
export function useInfiniteProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: productKeys.infinite(filters),
    queryFn: ({ pageParam = 1 }) => 
      productService.getProducts({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: string, options?: UseQueryOptions<Product>) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    ...options,
    staleTime: 1000 * 60 * 5,
    onSuccess: (product) => {
      // Pre-fetch related products
      queryClient.prefetchQuery({
        queryKey: productKeys.related(id),
        queryFn: () => productService.getRelatedProducts(id),
      });
    },
  });
}

export function useCategories(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
    ...options,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useBrands(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ['brands'],
    queryFn: productService.getBrands,
    ...options,
    staleTime: 1000 * 60 * 30,
  });
}

export function useSearchProducts(query: string, options?: UseQueryOptions<Product[]>) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.searchProducts(query),
    ...options,
    enabled: query.length >= 2,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useFeaturedProducts(options?: UseQueryOptions<Product[]>) {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: productService.getFeaturedProducts,
    ...options,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useRelatedProducts(productId: string, options?: UseQueryOptions<Product[]>) {
  return useQuery({
    queryKey: productKeys.related(productId),
    queryFn: () => productService.getRelatedProducts(productId),
    ...options,
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}
