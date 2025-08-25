// Optimized product list component for instant loading
'use client';

import { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cachedApiService } from '@/lib/cached-api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  brand: {
    name: string;
    slug: string;
  };
  stock: number;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean; // For above-fold images
}

// Memoized product card for better performance
const ProductCard = memo(({ product, priority = false }: ProductCardProps) => {
  // Memoize expensive calculations
  const discountPrice = useMemo(() => {
    if (!product.originalPrice || !product.discountPercentage) return product.price;
    return product.originalPrice * (1 - product.discountPercentage / 100);
  }, [product.originalPrice, product.discountPercentage, product.price]);

  const savings = useMemo(() => {
    if (!product.originalPrice) return 0;
    return product.originalPrice - discountPrice;
  }, [product.originalPrice, discountPrice]);

  // Optimized image URL
  const imageUrl = useMemo(() => {
    if (!product.images?.length) return '/placeholder-product.jpg';
    const url = product.images[0];
    // Add Cloudinary optimizations if using Cloudinary
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto,w_300,h_300,c_fill/');
    }
    return url;
  }, [product.images]);

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
      prefetch={false} // Only prefetch on hover
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        
        {/* Discount badge */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            -{product.discountPercentage}%
          </div>
        )}
        
        {/* Stock indicator */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
            Only {product.stock} left
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">{product.brand.name}</p>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            PKR {discountPrice.toLocaleString()}
          </span>
          
          {product.originalPrice && product.originalPrice > discountPrice && (
            <>
              <span className="text-sm text-gray-500 line-through">
                PKR {product.originalPrice.toLocaleString()}
              </span>
              <span className="text-sm text-green-600 font-medium">
                Save PKR {savings.toLocaleString()}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
