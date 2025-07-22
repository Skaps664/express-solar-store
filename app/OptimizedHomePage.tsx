'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/services/api';
import { Loading } from '@/components/ui/loading';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/error-boundary';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function OptimizedHomePage() {
  const { user } = useAuth();

  // Fetch featured products
  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get<{ products: Product[] }>('/api/products/featured');
      return data.products;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<{ categories: Category[] }>('/api/categories');
      return data.categories;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,
  });

  // Fetch best sellers
  const { data: bestSellers = [], isLoading: bestSellersLoading } = useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      const { data } = await api.get<{ products: Product[] }>('/api/products/best-sellers');
      return data.products;
    },
    staleTime: 15 * 60 * 1000,
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

  return (
    <div className="container mx-auto px-4 md:px-14 lg:px-16 pb-12">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Power Your Future with <span className="text-primary">Solar Energy</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover premium solar products and complete energy solutions for your home or business
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/calculator">Solar Calculator</Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <Button variant="outline" asChild>
            <Link href="/categories" className="flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ErrorBoundary>
          <Suspense fallback={<Loading text="Loading categories..." />}>
            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug}`}
                    className="group bg-white rounded-lg p-4 border hover:shadow-md transition-shadow"
                  >
                    <div className="h-16 bg-primary/10 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="font-medium text-center group-hover:text-primary">
                      {category.name}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products?featured=true" className="flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ErrorBoundary>
          <Suspense fallback={<Loading text="Loading featured products..." />}>
            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product._id}
                    productId={product._id}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* Best Sellers */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
          <Button variant="outline" asChild>
            <Link href="/products?sort=best-selling" className="flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ErrorBoundary>
          <Suspense fallback={<Loading text="Loading best sellers..." />}>
            {bestSellersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product._id}
                    productId={product._id}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary/5 rounded-xl text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Switch to Solar?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get a free consultation and personalized solar solution for your property
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/consultation">Free Consultation</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
