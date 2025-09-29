'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/services/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
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

interface ProductCardProps {
  productId: string;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ productId, onAddToCart }: ProductCardProps) {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await api.get<{ product: Product }>(`/api/products/${productId}`);
      return data.product;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const handleAddToCart = () => {
    if (product && onAddToCart) {
      onAddToCart(product);
      toast.success(`${product.name} added to cart`);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <div className="h-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
        </CardContent>
        <CardFooter>
          <div className="h-10 bg-gray-200 animate-pulse rounded w-full"></div>
        </CardFooter>
      </Card>
    );
  }

  if (error || !product) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-gray-500">Product not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative">
          <Link href={`/products/${product._id}`} className="group block">
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
              />
              <Image
                src={product.images[1] || product.images[0] || '/placeholder-product.jpg'}
                alt={`${product.name} - 2`}
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-105"
              />
            </div>
          </Link>
          <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </button>
          {!product.inStock && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <Link href={`/products/${product._id}`}>
          <CardTitle className="text-sm font-medium line-clamp-2 hover:text-primary">
            {product.name}
          </CardTitle>
        </Link>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
          <Badge variant="secondary">{product.brand}</Badge>
        </div>
        
        <p className="text-lg font-bold text-primary mt-2">
          ${product.price.toLocaleString()}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}
