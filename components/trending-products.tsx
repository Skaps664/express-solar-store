"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TrendingProducts() {
  const [scrollPosition, setScrollPosition] = useState(0)

  const products = [
    {
      id: "jinko-tiger-neo",
      name: "Jinko 550W Tiger Neo N-Type Solar Panel",
      brand: "Jinko Solar",
      price: 42500,
      discountPrice: 39999,
      isNew: true,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "canadian-bihiku",
      name: "Canadian Solar 540W BiHiKu Bifacial Panel",
      brand: "Canadian Solar",
      price: 45000,
      discountPrice: null,
      isNew: false,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "growatt-hybrid",
      name: "Growatt 5kW SPF 5000ES Hybrid Inverter",
      brand: "Growatt",
      price: 185000,
      discountPrice: 175000,
      isNew: false,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "longi-himo5",
      name: "Longi 500W Hi-MO 5 Mono PERC Module",
      brand: "Longi Solar",
      price: 39999,
      discountPrice: null,
      isNew: true,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "tesla-powerwall",
      name: "Tesla Powerwall 13.5kWh Battery",
      brand: "Tesla",
      price: 950000,
      discountPrice: 899000,
      isNew: false,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "sma-inverter",
      name: "SMA Sunny Boy 5.0 String Inverter",
      brand: "SMA",
      price: 210000,
      discountPrice: null,
      isNew: false,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "ja-mbb",
      name: "JA Solar 530W MBB Half-Cell Module",
      brand: "JA Solar",
      price: 41200,
      discountPrice: 38500,
      isNew: true,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "pylontech-battery",
      name: "Pylontech US3000C 3.5kWh Lithium Battery",
      brand: "Pylontech",
      price: 225000,
      discountPrice: 210000,
      isNew: false,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "fronius-inverter",
      name: "Fronius Symo 10kW Three-Phase Inverter",
      brand: "Fronius",
      price: 350000,
      discountPrice: null,
      isNew: false,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "trina-vertex",
      name: "Trina Vertex S+ 425W All-Black Panel",
      brand: "Trina Solar",
      price: 36000,
      discountPrice: 33500,
      isNew: true,
      image: "/placeholder.svg?height=180&width=180",
    },
  ]

  const scroll = (direction) => {
    const container = document.getElementById("trending-products-container")
    const scrollAmount = window.innerWidth < 768 ? 230 : 320 // Adjust for mobile

    if (container) {
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
        setScrollPosition(Math.max(0, scrollPosition - scrollAmount))
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
        setScrollPosition(scrollPosition + scrollAmount)
      }
    }
  }

  // Format price in PKR with commas
  const formatPrice = (price) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  return (
    <div className="my-16">
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
        <div>
          <h2 className="mb-1 md:mb-2 text-2xl md:text-3xl font-bold text-[#1a5ca4]">Trending Now</h2>
          <p className="text-sm md:text-base text-gray-600">Discover our most popular solar products</p>
        </div>
        <div className="flex gap-2 self-end md:self-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={scrollPosition <= 0}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          id="trending-products-container"
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex-shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white transition-all hover:border-[#1a5ca4] hover:shadow-md group"
              style={{ width: "220px", minWidth: "220px", maxWidth: "100%" }}
            >
              <div className="relative h-48 md:h-64 rounded-t-lg bg-gray-100">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={180}
                  height={180}
                  className="object-contain p-2 absolute inset-0 m-auto group-hover:scale-105 transition-transform duration-300"
                />
                {product.isNew && (
                  <div className="absolute left-2 top-2 md:left-3 md:top-3 rounded-full bg-[#1a5ca4] px-2 py-0.5 md:px-3 md:py-1 text-xs font-semibold text-white">
                    NEW
                  </div>
                )}
                {product.discountPrice && (
                  <div className="absolute right-2 top-2 md:right-3 md:top-3 rounded-full bg-[#f26522] px-2 py-0.5 md:px-3 md:py-1 text-xs font-semibold text-white">
                    SALE
                  </div>
                )}
                <button
                  className="absolute right-2 top-2 md:right-3 md:top-3 rounded-full bg-white p-1.5 md:p-2 shadow-md"
                  onClick={(e) => {
                    e.preventDefault()
                    // Add to wishlist logic
                    window.location.href = `/wishlist/add/${product.id}`
                  }}
                >
                  <Heart className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
              <div className="p-3 md:p-4">
                <div className="mb-1 text-xs font-semibold text-[#1a5ca4]">{product.brand}</div>
                <h3 className="mb-2 text-sm md:text-base font-medium line-clamp-2 group-hover:text-[#1a5ca4] transition-colors">
                  {product.name}
                </h3>
                <div className="mb-3 flex items-center gap-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-sm md:text-base font-bold text-[#1a5ca4]">
                        {formatPrice(product.discountPrice)}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm md:text-base font-bold text-[#1a5ca4]">{formatPrice(product.price)}</span>
                  )}
                </div>
                <Button
                  className="w-full gap-1 md:gap-2 text-xs md:text-sm py-1 md:py-2 bg-[#1a5ca4] hover:bg-[#0e4a8a]"
                  onClick={(e) => {
                    e.preventDefault()
                    // Add to cart logic
                    window.location.href = `/cart/add/${product.id}`
                  }}
                >
                  <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" /> Add to Cart
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
