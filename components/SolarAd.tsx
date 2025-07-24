"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap, Phone, ArrowRight, Sun, Battery, Home, TrendingUp } from "lucide-react"
import Image from "next/image"
import { client } from "@/lib/sanity"
import { urlForImage } from "@/lib/sanity"

interface MainSolarAdData {
  offerBadge: string
  headline: string
  subHeadline: string
  benefits: Array<{ text: string; icon: string }>
  pricing: {
    startingPrice: number
    monthlyPrice: number
    priceText: string
  }
  cta: {
    phoneNumber: string
    callButtonText: string
    consultationText: string
    consultationLink: string
  }
  urgencyText: string
  mainImage: any
  savingsBadge: {
    percentage: number
    text: string
  }
}

export default function SolarAd() {
  const [adData, setAdData] = useState<MainSolarAdData>({
    offerBadge: "Limited Offer",
    headline: "Go Solar. Save Big.",
    subHeadline: "Energy freedom starts now.",
    benefits: [
      { text: "Clean Energy", icon: "sun" },
      { text: "24/7 Power", icon: "battery" },
      { text: "+15% Home Value", icon: "home" }
    ],
    pricing: {
      startingPrice: 675000,
      monthlyPrice: 12500,
      priceText: "Starting at"
    },
    cta: {
      phoneNumber: "",
      callButtonText: "Call Now",
      consultationText: "Free Consultation",
      consultationLink: ""
    },
    urgencyText: "Offer expires soon",
    mainImage: null,
    savingsBadge: {
      percentage: 90,
      text: "On Bills"
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "solarAds"][0] {
            mainSolarAd {
              offerBadge,
              headline,
              subHeadline,
              benefits,
              pricing,
              cta,
              urgencyText,
              mainImage,
              savingsBadge
            }
          }
        `)
        
        if (data?.mainSolarAd) {
          setAdData(data.mainSolarAd)
        }
      } catch (error) {
        console.error("Error fetching main solar ad data:", error)
      }
    }

    fetchData()
  }, [])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return <Sun className="text-[#1a5ca4]" />
      case 'battery': return <Battery className="text-[#1a5ca4]" />
      case 'home': return <Home className="text-[#1a5ca4]" />
      case 'graph': return <TrendingUp className="text-[#1a5ca4]" />
      default: return <Sun className="text-[#1a5ca4]" />
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PK')
  }

  const handlePhoneCall = () => {
    if (adData.cta.phoneNumber) {
      window.location.href = `tel:${adData.cta.phoneNumber}`
    }
  }

  const handleConsultation = () => {
    if (adData.cta.consultationLink) {
      window.open(adData.cta.consultationLink, '_blank')
    }
  }

  return (
    <div className="my-8 px-4">
      <div className="bg-white border rounded-xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
        
        {/* Image Top on Mobile */}
        <div className="relative h-64 lg:h-auto lg:w-1/2">
          <Image
            src={adData.mainImage ? urlForImage(adData.mainImage).url() : "/q2.jpeg"}
            alt="Solar Installation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a5ca4]/40 to-transparent"></div>

          {/* Floating Savings Badge */}
          <div className="absolute top-4 right-4 bg-white rounded-xl px-4 py-2 shadow-md text-center">
            <div className="text-xl font-bold text-[#1a5ca4]">Save {adData.savingsBadge.percentage}%</div>
            <div className="text-xs text-gray-500 uppercase">{adData.savingsBadge.text}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:w-1/2">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f26522] to-[#ff9a56] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
            <Zap className="h-3 w-3" />
            {adData.offerBadge}
          </div>

          {/* Headline */}
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {adData.headline}
          </h2>
          <p className="text-sm text-gray-600 mb-4">{adData.subHeadline}</p>

          {/* Key Benefits - Horizontally scrollable on mobile */}
          <div className="flex gap-3 overflow-x-auto mb-4 pb-1">
            {adData.benefits.map((item, idx) => (
              <div key={idx} className="min-w-fit bg-blue-50 rounded-md px-3 py-2 flex items-center gap-2 text-sm text-gray-700">
                {getIcon(item.icon)}
                {item.text}
              </div>
            ))}
          </div>

          {/* Pricing Info */}
          <div className="bg-[#f8fafc] border p-3 rounded-lg mb-4">
            <p className="text-gray-700 text-sm">{adData.pricing.priceText}</p>
            <div className="text-xl font-bold text-[#1a5ca4]">PKR {formatPrice(adData.pricing.startingPrice)}</div>
            <p className="text-xs text-gray-500">or {formatPrice(adData.pricing.monthlyPrice)}/month</p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <Button 
              className="bg-gradient-to-r from-[#1a5ca4] to-[#4facfe] text-white font-bold py-2 px-4 shadow"
              onClick={handlePhoneCall}
            >
              <Phone className="h-4 w-4 mr-1" />
              {adData.cta.callButtonText}
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white font-bold py-2 px-4"
              onClick={handleConsultation}
            >
              {adData.cta.consultationText}
            </Button>
          </div>

          {/* Urgency */}
          <div className="text-[#f26522] text-xs bg-[#fff5f0] px-3 py-2 rounded-full w-fit border border-[#fddbd2] flex items-center gap-2">
            <div className="w-2 h-2 bg-[#f26522] rounded-full animate-pulse" />
            {adData.urgencyText}
          </div>
        </div>
      </div>
    </div>
  )
}
