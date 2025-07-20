"use client"

import React, { useEffect, useState } from "react"
import { QuickBuyCard } from "@/components/quick-buy-card"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  _id: string
  name: string
  slug?: string
  price: number
  images: string[]
  description?: string
  brand?: {
    name: string
    slug?: string
  }
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products/featured`, { 
          next: { revalidate: 3600 } // Cache for 1 hour
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products')
        }
        
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeaturedProducts()
  }, [])

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Quick Shop Popular Products</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {loading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="rounded-lg border overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            // Render products
            products.map((product) => (
              <QuickBuyCard key={product._id} product={product} />
            ))
          ) : (
            // No products found
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
