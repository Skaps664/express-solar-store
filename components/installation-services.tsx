"use client"

import { Button } from "@/components/ui/button"
import { Zap, Phone, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function SolarAd() {
  return (
    <div className="my-8">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex flex-col lg:flex-row">
          {/* Left Content */}
          <div className="w-full lg:w-2/3 p-8">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 bg-[#f26522] text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
              <Zap className="h-4 w-4" />
              LIMITED OFFER
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-900 leading-tight">
              Go Solar & Save
              <span className="block text-[#1a5ca4]">Up to 90%</span>
              on Electricity Bills
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-600 mb-6">
              Complete solar system starting from <span className="text-[#1a5ca4] font-bold">PKR 675,000</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] text-white font-bold py-3 px-6 rounded-lg group">
                <Phone className="h-4 w-4 mr-2" />
                Call: 0300-1234567
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white font-bold py-3 px-6 rounded-lg"
              >
                Free Consultation
              </Button>
            </div>

            {/* Urgency Text */}
            <p className="text-[#f26522] text-sm mt-4 font-medium">⚡ Offer expires soon • Limited slots available</p>
          </div>

          {/* Right Visual */}
          <div className="w-full lg:w-1/3 relative min-h-[250px] bg-gradient-to-br from-[#1a5ca4]/5 to-[#1a5ca4]/10">
            <div className="absolute inset-4 rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Solar Installation"
                fill
                className="object-cover"
              />
            </div>

            {/* Single Floating Element */}
            <div className="absolute top-6 right-6 bg-white rounded-xl p-3 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-xl font-bold text-[#1a5ca4]">90%</div>
                <div className="text-xs text-gray-600">Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
