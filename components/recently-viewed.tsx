'use client'

import { Button } from "@/components/ui/button"
import { ShoppingCart } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import AnalyticsClient from "@/lib/analytics"

export default function RecentlyViewed() {
  const { recentProducts, loading } = useRecentlyViewed()
  
  // Track product click
  const handleProductClick = (productId: string, productSlug: string) => {
    const analytics = AnalyticsClient.getInstance()
    analytics.trackProductClick(productId, productSlug)
  }

  // Format price in PKR with commas
  const formatPrice = (price: number) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  // Don't render if no products or still loading
  if (loading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold text-[#1a5ca4] mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-9 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!recentProducts || recentProducts.length === 0) {
    return null // Don't show section if no recently viewed products
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-[#1a5ca4] mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentProducts
          .filter(Boolean)
          .map((product) => {
            // guard against malformed items
            if (!product || !product._id || !product.slug) return null

            return (
              <Link
                key={product._id}
                href={`/product/${product.slug}`}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-sm transition-all group"
                onClick={() => handleProductClick(product._id, product.slug)}
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <Image
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name || 'Product image'}
                    width={150}
                    height={150}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10 group-hover:text-[#1a5ca4] transition-colors">
                    {product.name || 'Untitled product'}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    {product.originalPrice && product.discountPercentage ? (
                      <>
                        <span className="text-[#1a5ca4] font-bold">{formatPrice(product.price)}</span>
                        <span className="text-gray-500 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                      </>
                    ) : (
                      <span className="text-[#1a5ca4] font-bold">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  <Button
                    className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add to cart logic
                      if (product.slug) window.location.href = `/cart/add/${product.slug}`
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </Link>
            )
          })}
      </div>
    </div>
  )
}

// Utility function to add a product to recently viewed
export const addToRecentlyViewed = (productId: string) => {
  try {
    const existingViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
    
    // Remove if already exists to avoid duplicates
    const filteredViewed = existingViewed.filter((id: string) => id !== productId)
    
    // Add to beginning of array
    const updatedViewed = [productId, ...filteredViewed].slice(0, 8) // Keep only 8 most recent
    
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed))
  } catch (error) {
    console.error('Error adding to recently viewed:', error)
  }
}
