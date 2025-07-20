"use client"

import { Button } from "@/components/ui/button"
import { Zap, Phone, ArrowRight, Sun, Battery, Home } from "lucide-react"
import Image from "next/image"

export default function SolarAd() {
  return (
    <div className="my-8">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row">
          {/* Left Content - Now with more visual elements */}
          <div className="w-full lg:w-2/3 p-8 relative">
            {/* Decorative solar panel pattern */}
            <div className="absolute -bottom-4 -right-4 opacity-5">
              <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M12 4V20M12 8L16 12M12 16L8 12M12 16L16 12M12 8L8 12" stroke="#1a5ca4" strokeWidth="1.5"/>
              </svg>
            </div>

            {/* Header Badge with improved styling */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f26522] to-[#ff9a56] text-white text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-sm">
              <Zap className="h-4 w-4" />
              LIMITED OFFER
            </div>

            {/* Main Headline with better hierarchy */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Go Solar & Save
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1a5ca4] to-[#4facfe]">
                  Up to 90% on Bills
                </span>
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Let the Sun Lead the Way to Energy Independence
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                <Sun className="h-5 w-5 text-[#1a5ca4]" />
                <span className="text-sm font-medium">Clean Energy</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                <Battery className="h-5 w-5 text-[#1a5ca4]" />
                <span className="text-sm font-medium">24/7 Power</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                <Home className="h-5 w-5 text-[#1a5ca4]" />
                <span className="text-sm font-medium">Home Value +15%</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                <svg className="h-5 w-5 text-[#1a5ca4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm font-medium">Govt. Incentives</span>
              </div>
            </div>

            {/* Pricing & CTA */}
            <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0] mb-4">
              <p className="text-gray-700 mb-2">
                Complete solar system starting from
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1a5ca4]">PKR 675,000</span>
                <span className="text-sm text-gray-500">or PKR 12,500/month</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-gradient-to-r from-[#1a5ca4] to-[#4facfe] hover:from-[#0e4a8a] hover:to-[#3a92e0] text-white font-bold py-3 px-6 rounded-lg group transition-all shadow-md">
                <Phone className="h-4 w-4 mr-2" />
                Call: 0300-1234567
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Free Consultation
              </Button>
            </div>

            {/* Urgency Text with improved visual */}
            <div className="mt-4 flex items-center gap-2 bg-[#fff8f5] border border-[#ffddd2] rounded-full px-4 py-2 w-fit">
              <div className="h-2 w-2 bg-[#f26522] rounded-full animate-pulse"></div>
              <p className="text-[#f26522] text-sm font-medium">Offer expires soon • Limited slots available</p>
            </div>
          </div>

          {/* Right Visual - Enhanced */}
          <div className="w-full lg:w-1/3 relative min-h-[250px] bg-gradient-to-br from-[#1a5ca4]/5 to-[#1a5ca4]/10">
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <Image
                src="/q2.jpeg"
                alt="Solar Installation"
                fill
                className="object-cover"
                priority
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a5ca4]/30 to-transparent"></div>
            </div>

            {/* Floating Savings Badge */}
            <div className="absolute top-6 right-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-[#1a5ca4]">90%</div>
              <div className="text-xs text-gray-600 uppercase tracking-wider">Savings</div>
            </div>

            {/* Floating Testimonial */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-[70%]">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-xs font-medium text-gray-700">"Best investment we've made!"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}