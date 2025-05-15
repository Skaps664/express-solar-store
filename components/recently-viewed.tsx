"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function RecentlyViewed() {
  const recentProducts = [
    {
      id: "jinko-tiger-neo",
      name: "Jinko 550W Tiger Neo N-Type Solar Panel",
      price: 39999,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "growatt-hybrid",
      name: "Growatt 5kW SPF 5000ES Hybrid Inverter",
      price: 175000,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "tesla-powerwall",
      name: "Tesla Powerwall 13.5kWh Battery",
      price: 899000,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "mounting-kit",
      name: "Mounting Structure Kit - Premium",
      price: 45000,
      image: "/placeholder.svg?height=150&width=150",
    },
  ]

  // Format price in PKR with commas
  const formatPrice = (price) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-[#1a5ca4] mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentProducts.map((product, index) => (
          <Link
            key={index}
            href={`/product/${product.id}`}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-sm transition-all group"
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={150}
                height={150}
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10 group-hover:text-[#1a5ca4] transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#1a5ca4] font-bold">{formatPrice(product.price)}</span>
              </div>
              <Button
                className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault()
                  // Add to cart logic
                  window.location.href = `/cart/add/${product.id}`
                }}
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
