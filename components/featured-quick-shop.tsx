"use client"

import React, { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/CartContext"
import { client } from "../lib/sanity"

type HeadingData = {
  featuredProductsHeading: {
    title: string
    subtext: string
  }
}

interface Product {
  _id: string
  name: string
  slug?: string
  price: number
  originalPrice?: number
  discountPercentage?: number
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
  const [headingData, setHeadingData] = useState<HeadingData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  // Calculate items per view based on screen size
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 6 // lg: desktop
      if (window.innerWidth >= 768) return 3 // md: tablet  
      return 2 // mobile
    }
    return 6
  }

  const [itemsPerView, setItemsPerView] = useState(6)

  useEffect(() => {
    const updateItemsPerView = () => setItemsPerView(getItemsPerView())
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  // Format price in PKR with commas
  const formatPrice = (price: number) => {
    return `Rs ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  // Fetch heading data from Sanity
  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const data: HeadingData = await client.fetch(
          `*[_type == "homePageContent"][0]{
            featuredProductsHeading{
              title,
              subtext
            }
          }`
        )
        setHeadingData(data)
      } catch (error) {
        console.error("Failed to fetch Sanity heading:", error)
      }
    }

    fetchHeading()
  }, [])

  // Fetch featured products
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

  // Carousel navigation functions
  const nextSlide = () => {
    if (isTransitioning || products.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, products.length - itemsPerView)
      return prev >= maxIndex ? 0 : prev + 1
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevSlide = () => {
    if (isTransitioning || products.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, products.length - itemsPerView)
      return prev <= 0 ? maxIndex : prev - 1
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Touch/swipe handlers for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) nextSlide()
    if (isRightSwipe) prevSlide()
  }

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const success = await addToCart({ productId: product._id, quantity: 1 })
      
      if (success) {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`
        })
      } else {
        toast({
          title: "Error",
          description: "Could not add item to cart.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1a5ca4] flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-[#f26522]" />
            {headingData?.featuredProductsHeading?.title || "Feature Products"}
            <span className="bg-gradient-to-r from-[#f26522] to-[#ff8c42] text-white text-xs px-3 py-1 rounded-full">
              FEATURED
            </span>
          </h2>
          <p className="text-gray-600 mt-1 text-sm">
            {headingData?.featuredProductsHeading?.subtext || "Discover our handpicked feature products"}
          </p>
        </div>
        <div className="flex gap-2 mt-3 md:mt-0">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white"
            onClick={prevSlide}
            disabled={isTransitioning || loading || products.length === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white"
            onClick={nextSlide}
            disabled={isTransitioning || loading || products.length === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        // Loading skeletons
        <div className="flex gap-4">
          {Array(itemsPerView).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0" style={{ width: `${100 / itemsPerView}%` }}>
              <div className="px-2">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-3" />
                    <Skeleton className="h-3 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        // Products carousel
        <div className="relative">
          <div 
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              ref={containerRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(products.length / itemsPerView) * 100}%`
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="flex-shrink-0"
                  style={{ width: `${100 / products.length}%` }}
                >
                  <div className="px-2">
                    <Link
                      href={`/product/${product.slug || product._id}`}
                      className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#1a5ca4] hover:shadow-lg transition-all duration-300 group relative"
                    >
                      <div className="relative">
                        <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-3">
                          <Image
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={150}
                            height={150}
                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1a5ca4] text-xs font-semibold px-2 py-1 rounded-lg border">
                          Featured
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-3 line-clamp-2 h-10 group-hover:text-[#1a5ca4] transition-colors leading-tight">
                          {product.name}
                        </h3>

                        {/* {product.brand && (
                          <div className="text-xs text-[#f26522] font-medium mb-3">
                            {product.brand.name}
                          </div>
                        )} */}

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold text-[#1a5ca4]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <Button
                          className="w-full bg-[#1a5ca4] text-white font-medium py-2.5 rounded-lg transition-all duration-300"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // No products found
        <div className="text-center py-10">
          <p className="text-gray-500">No featured products available at the moment.</p>
        </div>
      )}
    </div>
  )
}
