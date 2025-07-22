'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/services/api';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Loading, LoadingSpinner } from '@/components/ui/loading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
  inStock: boolean;
  brand: string;
  category: string;
}

interface ProductsResponse {
  products: Product[];
  page: number;
  totalPages: number;
  total: number;
}

interface ProductsListProps {
  category?: string;
  brand?: string;
}

export function ProductsList({ category, brand }: ProductsListProps) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', { category, brand, search, sortBy, priceRange }],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: '12',
        ...(category && { category }),
        ...(brand && { brand }),
        ...(search && { search }),
        ...(sortBy && { sort: sortBy }),
        ...(priceRange && { priceRange }),
      });

      const { data } = await api.get<ProductsResponse>(`/api/products?${params}`);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ProductsResponse) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      await api.post('/api/cart/add', {
        productId: product._id,
        quantity: 1,
      });
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  if (isLoading) {
    return <Loading text="Loading products..." />;
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load products</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((page: ProductsResponse) => page.products) || [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Price range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Prices</SelectItem>
            <SelectItem value="0-100">$0 - $100</SelectItem>
            <SelectItem value="100-500">$100 - $500</SelectItem>
            <SelectItem value="500-1000">$500 - $1,000</SelectItem>
            <SelectItem value="1000+">$1,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {allProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products found</p>
          <Button onClick={() => {
            setSearch('');
            setSortBy('');
            setPriceRange('');
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="text-center pt-8">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                size="lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Products'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
