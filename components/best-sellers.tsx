"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { client } from "../lib/sanity" // Adjust path if needed


type HeadingData = {
  bestSellersHeading: {
    title: string
    subtext: string
  }
}

export default function BestSellers() {
  const bestSellers = [
    {
      id: "jinko-tiger-neo",
      name: "Jinko 550W Tiger Neo N-Type Solar Panel",
      originalPrice: 42500,
      salePrice: 36999,
      image: "/19.webp?height=150&width=150",
      discount: "13% OFF",
      rating: 4.8,
      soldCount: "2.5k+ sold",
    },
    {
      id: "growatt-hybrid",
      name: "Growatt 5kW SPF 5000ES Hybrid Inverter",
      originalPrice: 185000,
      salePrice: 159000,
      image: "/14.webp?height=150&width=150",
      discount: "14% OFF",
      rating: 4.9,
      soldCount: "1.8k+ sold",
    },
    {
      id: "tesla-powerwall",
      name: "Tesla Powerwall 13.5kWh Battery",
      originalPrice: 950000,
      salePrice: 899000,
      image: "/16.webp?height=150&width=150",
      discount: "5% OFF",
      rating: 4.7,
      soldCount: "950+ sold",
    },
    {
      id: "off-grid-kits",
      name: "Complete 5kW Solar System Package",
      originalPrice: 750000,
      salePrice: 675000,
      image: "/17.webp?height=150&width=150",
      discount: "10% OFF",
      rating: 4.6,
      soldCount: "1.2k+ sold",
    },
    {
      id: "canadian-solar-panel",
      name: "Canadian Solar 450W HiKu7 Mono Panel",
      originalPrice: 38000,
      salePrice: 32500,
      image: "/18.webp?height=150&width=150",
      discount: "14% OFF",
      rating: 4.5,
      soldCount: "3.2k+ sold",
    },
    {
      id: "victron-mppt",
      name: "Victron SmartSolar MPPT 100/30 Charge Controller",
      originalPrice: 45000,
      salePrice: 39999,
      image: "/15.webp?height=150&width=150",
      discount: "11% OFF",
      rating: 4.9,
      soldCount: "1.5k+ sold",
    },
  ]

  // Format price in PKR with commas
  const formatPrice = (price : any) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }
  
  const [headingData, setHeadingData] = useState<HeadingData | null>(null)

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const data: HeadingData = await client.fetch(
          `*[_type == "homePageContent"]{
  bestSellersHeading{
    title,
    subtext
  }
}`
        );
        setHeadingData(data);
      } catch (error) {
        console.error("Failed to fetch Sanity heading:", error);
      }
    };

    fetchHeading();
  }, [])

  return (
    <div className="my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1a5ca4] flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-[#f26522]" />
            {headingData?.bestSellersHeading?.title || "Best Sellers"}
            <span className="bg-gradient-to-r from-[#f26522] to-[#ff8c42] text-white text-xs px-3 py-1 rounded-full">
              TOP PICKS
            </span>
          </h2>
          <p className="text-gray-600 mt-1 text-sm">{headingData?.bestSellersHeading?.subtext || "Most popular products chosen by our customers"}</p>
        </div>
        <div className="flex gap-2 mt-3 md:mt-0">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {bestSellers.map((product, index) => (
          <Link
            key={index}
            href={`/product/${product.id}`}
            className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#1a5ca4] hover:shadow-lg transition-all duration-300 group relative"
          >
            <div className="relative">
              <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-3">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              {/* <div className="absolute top-3 left-3 bg-[#f26522] text-white text-xs font-bold px-2 py-1 rounded-lg">
                {product.discount}
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1a5ca4] text-xs font-semibold px-2 py-1 rounded-lg border">
                #{index + 1} Best Seller
              </div> */}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-3 line-clamp-2 h-10 group-hover:text-[#1a5ca4] transition-colors leading-tight">
                {product.name}
              </h3>

              {/* <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">({product.rating})</span>
              </div> */}

              <div className="text-xs text-[#f26522] font-medium mb-3">{product.soldCount}</div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-[#1a5ca4]">{formatPrice(product.salePrice)}</span>
                {/* <span className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</span> */}
              </div>

              <Button
                className="w-full bg-[#1a5ca4] text-white font-medium py-2.5 rounded-lg transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault()
                  // Add to cart logic
                  window.location.href = `/cart/add/${product.id}`
                }}
              >
                Add to Cart
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
