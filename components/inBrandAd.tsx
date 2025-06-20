"use client"

import { Button } from "@/components/ui/button"
import { Zap, Phone, ArrowRight, BatteryCharging } from "lucide-react"
import Image from "next/image"

export default function InBrandAd() {
  return (
    <div className="my-8">
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex flex-col lg:flex-row">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 p-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-[#1a5ca4] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                <BatteryCharging className="h-3 w-3" />
                SOLAR SPECIALISTS
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Power Your Home <br />
                <span className="text-[#f26522]">With Sunshine</span>
              </h1>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-[#1a5ca4]">90%</div>
                <div className="text-xs text-gray-500">Savings Potential</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-[#1a5ca4]">25+</div>
                <div className="text-xs text-gray-500">Years Warranty</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-[#1a5ca4]">0%</div>
                <div className="text-xs text-gray-500">Upfront Cost*</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-[#1a5ca4]">PKR 675K</div>
                <div className="text-xs text-gray-500">Starting Price</div>
              </div>
            </div>
            
            <Button className="w-full bg-[#f26522] hover:bg-[#e05b1a] text-white font-bold py-3">
              <Phone className="h-4 w-4 mr-2" />
              Schedule Free Audit
            </Button>
          </div>
          
          {/* Right Visual */}
          <div className="w-full lg:w-1/2 relative min-h-[300px] bg-gradient-to-br from-[#1a5ca4]/5 to-[#1a5ca4]/10">
            <Image
              src="/sixteen.jpg"
              alt="Solar Installation"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm">
                <span className="font-bold">Limited Time:</span> Government rebates available until June 30
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}