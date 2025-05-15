"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export default function CustomerReviews() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const reviews = [
    {
      name: "Ahmed Khan",
      location: "Lahore",
      rating: 5,
      comment:
        "I installed a 10kW system from Solar Express last year, and it's been amazing. My electricity bills have dropped by 65%, and the installation team was professional and efficient.",
      image: "person-1",
      product: "10kW Complete Solar System",
    },
    {
      name: "Fatima Ali",
      location: "Karachi",
      rating: 5,
      comment:
        "The customer service at Solar Express is exceptional. They helped me choose the right system for my home and provided excellent after-sales support. Highly recommended!",
      image: "person-2",
      product: "5kW Hybrid Solar System",
    },
    {
      name: "Muhammad Rizwan",
      location: "Islamabad",
      rating: 4,
      comment:
        "Great products at competitive prices. The Jinko panels I purchased have been performing well even during cloudy days. The monitoring system is also very user-friendly.",
      image: "person-3",
      product: "Jinko Solar Panels",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-[#1a5ca4] mb-6">What Our Customers Say</h2>
      <div className="relative bg-gray-50 rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full mb-4 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-xs">[{reviews[currentSlide].image}]</div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">{reviews[currentSlide].name}</h3>
              <p className="text-gray-500 text-sm">{reviews[currentSlide].location}</p>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < reviews[currentSlide].rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-[#1a5ca4] text-sm mt-2">{reviews[currentSlide].product}</p>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-sm relative">
              <div className="absolute top-4 left-4 text-6xl text-[#1a5ca4]/10">"</div>
              <p className="text-gray-700 relative z-10 italic">{reviews[currentSlide].comment}</p>
              <div className="absolute bottom-4 right-4 text-6xl text-[#1a5ca4]/10">"</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={prevSlide}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {reviews.map((_, index) => (
            <Button
              key={index}
              variant={currentSlide === index ? "default" : "outline"}
              size="icon"
              className={`h-2 w-8 rounded-full ${currentSlide === index ? "bg-[#1a5ca4]" : ""}`}
              onClick={() => setCurrentSlide(index)}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </Button>
          ))}
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={nextSlide}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
