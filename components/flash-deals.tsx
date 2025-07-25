"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { client } from "@/lib/sanity"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

type HeadingData = {
  flashDealsHeading: string
}

type Product = {
  _id: string
  slug: string
  name: string
  price: number
  images: string[]
}

type Offer = {
  _id: string
  name: string
  description?: string
  discountType: string
  discountValue: number
  originalPrice: number
  discountedPrice: number
  startDate: string
  endDate: string
  product: Product
}

export default function FlashDeals() {
  const [headingData, setHeadingData] = useState<HeadingData | null>(null)
  const [deals, setDeals] = useState<Offer[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const data: HeadingData = await client.fetch(
          `*[_type == "homePageContent"][0]{ flashDealsHeading }`
        );
        console.log("Fetched Heading Data:", data);
        setHeadingData(data);
        
      } catch (error) {
        console.error("Failed to fetch Sanity heading:", error);
      }
    };

    fetchHeading();
  }, [])

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/offers`)
        if (response.ok) {
          const data = await response.json()
          console.log("Fetched offers data:", data)
          
          // Filter out offers without product data and ensure they have the required fields
          const validDeals = data.filter((offer: any) => 
            offer && 
            offer.product && 
            offer.product._id && 
            offer.product.name &&
            offer.discountedPrice !== undefined &&
            offer.originalPrice !== undefined
          )
          
          console.log("Valid deals after filtering:", validDeals)
          setDeals(validDeals || [])
        } else {
          console.error("Failed to fetch offers:", response.status)
        }
      } catch (error) {
        console.error("Failed to fetch offers:", error)
      }
    }

    fetchDeals()
  }, [])

  const [hours, setHours] = useState(5)
  const [minutes, setMinutes] = useState(59)
  const [seconds, setSeconds] = useState(59)

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else {
        setSeconds(59)
        if (minutes > 0) {
          setMinutes(minutes - 1)
        } else {
          setMinutes(59)
          if (hours > 0) {
            setHours(hours - 1)
          } else {
            clearInterval(timer)
          }
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [hours, minutes, seconds])

  // Navigation functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.offsetWidth / (window.innerWidth >= 768 ? 4 : 2)
      container.scrollBy({ left: -itemWidth, behavior: 'smooth' })
      setCurrentIndex(Math.max(0, currentIndex - 1))
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.offsetWidth / (window.innerWidth >= 768 ? 4 : 2)
      container.scrollBy({ left: itemWidth, behavior: 'smooth' })
      setCurrentIndex(Math.min(deals.length - 1, currentIndex + 1))
    }
  }

  // Format price in PKR with commas
  const formatPrice = (price: number) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  // Calculate discount percentage
  const calculateDiscount = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100)
  }

  return (
    <div className="my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a5ca4] flex items-center gap-2">
            {headingData?.flashDealsHeading || "Flash Dealss"}
            <span className="bg-[#f26522] text-white text-xs px-2 py-1 rounded-full">HOT</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-700">Ends in:</span>
            <div className="flex items-center gap-1">
              <span className="bg-[#1a5ca4] text-white text-xs font-bold px-2 py-1 rounded">
                {hours.toString().padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="bg-[#1a5ca4] text-white text-xs font-bold px-2 py-1 rounded">
                {minutes.toString().padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="bg-[#1a5ca4] text-white text-xs font-bold px-2 py-1 rounded">
                {seconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
        {deals.length > 4 && (
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={scrollLeft}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={scrollRight}
              disabled={currentIndex >= deals.length - 4}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No flash deals available at the moment.
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {deals.filter(deal => deal.product).map((deal, index) => (
          <Link
            key={deal._id}
            href={`/product/${deal.product.slug}`}
            className="block border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-all group min-w-0"
          >
            <div className="relative">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <Image
                  src={(deal.product.images && deal.product.images[0]) || "/placeholder.svg"}
                  alt={deal.product.name}
                  width={150}
                  height={150}
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {deal.originalPrice && deal.originalPrice > deal.discountedPrice && (
                <div className="absolute top-2 right-2 bg-[#f26522] text-white text-xs font-bold px-2 py-1 rounded">
                  {calculateDiscount(deal.originalPrice, deal.discountedPrice)}% OFF
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10 group-hover:text-[#1a5ca4] transition-colors">
                {deal.product.name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-[#1a5ca4]">{formatPrice(deal.discountedPrice)}</span>
                {deal.originalPrice && deal.originalPrice > deal.discountedPrice && (
                  <span className="text-xs text-gray-500 line-through">{formatPrice(deal.originalPrice)}</span>
                )}
              </div>
              <Button
                className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a]"
                onClick={(e) => {
                  e.preventDefault()
                  // Add to cart logic
                  window.location.href = `/cart/add/${deal.product._id}`
                }}
              >
                Add to Cart
              </Button>
            </div>
          </Link>
        ))}
        </div>
      )}
    </div>
  )
}
