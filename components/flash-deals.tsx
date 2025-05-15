"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function FlashDeals() {
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

  const deals = [
    {
      id: "jinko-tiger-neo",
      name: "Jinko 550W Tiger Neo N-Type Solar Panel",
      originalPrice: 42500,
      salePrice: 36999,
      image: "/19.webp?height=150&width=150",
      discount: "13% OFF",
    },
    {
      id: "growatt-hybrid",
      name: "Growatt 5kW SPF 5000ES Hybrid Inverter",
      originalPrice: 185000,
      salePrice: 159000,
      image: "/14.webp?height=150&width=150",
      discount: "14% OFF",
    },
    {
      id: "tesla-powerwall",
      name: "Tesla Powerwall 13.5kWh Battery",
      originalPrice: 950000,
      salePrice: 899000,
      image: "/16.webp?height=150&width=150",
      discount: "5% OFF",
    },
    {
      id: "off-grid-kits",
      name: "Complete 5kW Solar System Package",
      originalPrice: 750000,
      salePrice: 675000,
      image: "/17.webp?height=150&width=150",
      discount: "10% OFF",
    },
  ]

  // Format price in PKR with commas
  const formatPrice = (price) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  return (
    <div className="my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a5ca4] flex items-center gap-2">
            Flash Deals
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
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {deals.map((deal, index) => (
          <Link
            key={index}
            href={`/product/${deal.id}`}
            className="block border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-all group"
          >
            <div className="relative">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <Image
                  src={deal.image || "/placeholder.svg"}
                  alt={deal.name}
                  width={150}
                  height={150}
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-2 right-2 bg-[#f26522] text-white text-xs font-bold px-2 py-1 rounded">
                {deal.discount}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10 group-hover:text-[#1a5ca4] transition-colors">
                {deal.name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-[#1a5ca4]">{formatPrice(deal.salePrice)}</span>
                <span className="text-xs text-gray-500 line-through">{formatPrice(deal.originalPrice)}</span>
              </div>
              <Button
                className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a]"
                onClick={(e) => {
                  e.preventDefault()
                  // Add to cart logic
                  window.location.href = `/cart/add/${deal.id}`
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
