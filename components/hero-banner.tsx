"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const banners = [
    {
      brand: "Jinko Solar",
      tagline: "Premium Solar Panels for Maximum Efficiency",
      description: "Discover high-performance monocrystalline panels with industry-leading conversion rates",
      bgColor: "bg-blue-50",
      textColor: "text-[#1a5ca4]",
      accentColor: "bg-[#1a5ca4]",
      buttonColor: "bg-[#1a5ca4] hover:bg-[#0e4a8a]",
    },
    {
      brand: "Growatt Inverters",
      tagline: "Smart Inverter Technology for Your Home",
      description: "Advanced hybrid inverters with intelligent monitoring and battery compatibility",
      bgColor: "bg-orange-50",
      textColor: "text-[#1a5ca4]",
      accentColor: "bg-[#f26522]",
      buttonColor: "bg-[#f26522] hover:bg-[#e55511]",
    },
    {
      brand: "Tesla Powerwall",
      tagline: "Energy Storage Solutions for 24/7 Power",
      description: "Reliable battery backup systems to keep your home powered during outages",
      bgColor: "bg-gray-50",
      textColor: "text-[#1a5ca4]",
      accentColor: "bg-[#1a5ca4]",
      buttonColor: "bg-[#1a5ca4] hover:bg-[#0e4a8a]",
    },
    {
      brand: "Complete Solar Systems",
      tagline: "Turnkey Solar Solutions for Every Need",
      description: "From residential rooftops to commercial installations, we have the perfect system for you",
      bgColor: "bg-blue-50",
      textColor: "text-[#1a5ca4]",
      accentColor: "bg-[#f26522]",
      buttonColor: "bg-[#f26522] hover:bg-[#e55511]",
    },
  ]

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  const currentBanner = banners[currentSlide]

  return (
    <div className="relative my-6 overflow-hidden rounded-xl border-2 border-dashed border-gray-300">
      <div className="relative w-full h-[400px] md:h-[500px]">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${banner.bgColor}`}
          >
            <div className="flex w-full md:w-1/2 flex-col justify-center p-6 md:p-12">
              <div
                className={`mb-2 inline-block rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${banner.accentColor} text-white`}
              >
                Featured Brand
              </div>
              <h2 className={`mb-2 text-3xl md:text-4xl font-bold ${banner.textColor}`}>{banner.brand}</h2>
              <p className={`mb-3 md:mb-4 text-xl md:text-2xl font-medium ${banner.textColor}`}>{banner.tagline}</p>
              <p className={`mb-6 md:mb-8 text-base md:text-lg ${banner.textColor} opacity-80`}>{banner.description}</p>
              <div className="flex gap-3 md:gap-4">
                <Button className={`px-4 py-2 md:px-8 md:py-6 text-base md:text-lg ${banner.buttonColor} text-white`}>
                  Shop Now
                </Button>
                <Button variant="outline" className="px-4 py-2 md:px-8 md:py-6 text-base md:text-lg">
                  Explore
                </Button>
              </div>
            </div>
            <div className="hidden md:flex md:w-1/2">
              <div className="flex h-full w-full items-center justify-center border-l-2 border-dashed border-gray-300 bg-white bg-opacity-50">
                <div className="text-center text-gray-400">
                  [Brand Banner Image]
                  <br />
                  {banner.brand} Featured Products
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1 md:p-2 shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1 md:p-2 shadow-md"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-8 rounded-full transition-all ${
                index === currentSlide ? "bg-[#1a5ca4]" : "bg-white bg-opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
