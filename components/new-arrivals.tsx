"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NewArrivals() {
  const newArrivals = [
    {
      id: "longi-hi-mo-6",
      name: "LONGi Hi-MO 6 Explorer 540W Solar Panel",
      originalPrice: 44000,
      salePrice: 41999,
      image: "/19.webp?height=150&width=150",
      discount: "5% OFF",
      rating: 4.9,
      arrivalDate: "Just Added",
    },
    {
      id: "sungrow-hybrid-new",
      name: "Sungrow SH8.0RT Hybrid Inverter 8kW",
      originalPrice: 220000,
      salePrice: 209000,
      image: "/14.webp?height=150&width=150",
      discount: "5% OFF",
      rating: 4.8,
      arrivalDate: "2 days ago",
    },
    {
      id: "byd-battery-box",
      name: "BYD Battery-Box Premium LVS 16.0kWh",
      originalPrice: 1200000,
      salePrice: 1150000,
      image: "/16.webp?height=150&width=150",
      discount: "4% OFF",
      rating: 4.7,
      arrivalDate: "1 week ago",
    },
    {
      id: "fronius-primo-gen24",
      name: "Fronius Primo GEN24 6.0 Plus Inverter",
      originalPrice: 195000,
      salePrice: 185000,
      image: "/17.webp?height=150&width=150",
      discount: "5% OFF",
      rating: 4.8,
      arrivalDate: "3 days ago",
    },
    {
      id: "trina-vertex-s",
      name: "Trina Solar Vertex S 405W Mono Panel",
      originalPrice: 35000,
      salePrice: 33250,
      image: "/18.webp?height=150&width=150",
      discount: "5% OFF",
      rating: 4.6,
      arrivalDate: "Just Added",
    },
    {
      id: "solaredge-optimizer",
      name: "SolarEdge P730 Power Optimizer",
      originalPrice: 12000,
      salePrice: 11400,
      image: "/15.webp?height=150&width=150",
      discount: "5% OFF",
      rating: 4.9,
      arrivalDate: "5 days ago",
    },
  ]

  // Format price in PKR with commas
  const formatPrice = (price) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  return (
    <div className="my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1a5ca4] flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-[#f26522]" />
            New Arrivals
            <span className="bg-gradient-to-r from-[#10b981] to-[#34d399] text-white text-xs px-3 py-1 rounded-full">
              JUST IN
            </span>
          </h2>
          <p className="text-gray-600 mt-1 text-sm">Latest products added to our collection</p>
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
        {newArrivals.map((product, index) => (
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
              {/* <div className="absolute top-3 left-3 bg-[#10b981] text-white text-xs font-bold px-2 py-1 rounded-lg">
                NEW
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1a5ca4] text-xs font-semibold px-2 py-1 rounded-lg border">
                New Arrival
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

              {/* <div className="text-xs text-[#10b981] font-medium mb-3">{product.arrivalDate}</div> */}

              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-[#1a5ca4]">{formatPrice(product.salePrice)}</span>
                {/* <span className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</span> */}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#1a5ca4] to-[#2563eb] hover:from-[#0e4a8a] hover:to-[#1d4ed8] text-white font-medium py-2.5 rounded-lg transition-all duration-300"
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
