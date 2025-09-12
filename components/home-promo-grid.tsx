"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { client, urlForImage } from "@/lib/sanity"

type BannerData = {
  image?: any
  text?: string
  button?: string
  link?: string
}

type HomePageBannerData = {
  TopFullLeftBAnner?: BannerData
  TopCenterLeftBAnner?: BannerData
  TopCenterRightBAnner?: BannerData
  BottomLeftBanner?: BannerData
  BottomWideCenterBanner?: BannerData
  FullRightTallBanner?: BannerData
  MobileTopWideBanner?: BannerData
  MobileSecondWideBanner?: BannerData
  MobileBottomLeftBanner?: BannerData
  MobileBottomRightBanner?: BannerData
}

export default function HomePromoGrid() {
  const [bannerData, setBannerData] = useState<HomePageBannerData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fallback data
  const fallbackData: HomePageBannerData = {
    TopFullLeftBAnner: {
      image: "/q2.jpeg",
      text: "",
      button: "",
      link: "/brand/jinko-solar"
    },
    BottomWideCenterBanner: {
      image: "/wer.jpg",
      text: "",
      button: "",
      link: "/services/installation"
    },
    FullRightTallBanner: {
      image: "/q1.jpeg",
      text: "",
      button: "",
      link: "/premium-solutions"
    },
    BottomLeftBanner: {
      image: "/q8.jpeg",
      text: "",
      button: "",
      link: "/summer-deals"
    },
    TopCenterLeftBAnner: {
      image: "/q7.jpeg",
      text: "",
      button: "",
      link: "/category/solar-panels"
    },
    TopCenterRightBAnner: {
      image: "/q17.jpg",
      text: "",
      button: "",
      link: "/flash-deals"
    },
    MobileTopWideBanner: {
      image: "/seventeen.jpg",
      text: "",
      button: "",
      link: "/premium-solutions"
    },
    MobileSecondWideBanner: {
      image: "/q6.jpeg",
      text: "",
      button: "",
      link: "/flash-deals"
    },
    MobileBottomLeftBanner: {
      image: "/q9.jpeg",
      text: "",
      button: "",
      link: "/brand/jinko-solar"
    },
    MobileBottomRightBanner: {
      image: "/q7.jpeg",
      text: "",
      button: "",
      link: "/category/solar-panels"
    }
  }

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "homePageBanner"][0] {
            TopFullLeftBAnner,
            TopCenterLeftBAnner,
            TopCenterRightBAnner,
            BottomLeftBanner,
            BottomWideCenterBanner,
            FullRightTallBanner,
            MobileTopWideBanner,
            MobileSecondWideBanner,
            MobileBottomLeftBanner,
            MobileBottomRightBanner
          }`
        )
        
        console.log("Fetched Banner Data:", data)
        setBannerData(data)
        
      } catch (error) {
        console.error("Failed to fetch banner data from Sanity:", error)
        setBannerData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBannerData()
  }, [])

  const getImageSrc = (banner: BannerData | undefined, fallbackSrc: string) => {
    if (banner?.image && typeof banner.image === 'object' && banner.image.asset) {
      return urlForImage(banner.image).width(800).height(600).url()
    }
    return fallbackSrc
  }

  const getBannerData = (key: keyof HomePageBannerData) => {
    return bannerData?.[key] || fallbackData[key]
  }
  if (loading) {
    return (
      <div className="my-6">
        <div className="hidden md:grid md:grid-cols-4 gap-3 max-h-[700px] animate-pulse">
          <div className="col-span-1 bg-gray-200 rounded-lg h-[300px]"></div>
          <div className="col-span-2 bg-gray-200 rounded-lg h-[300px]"></div>
          <div className="col-span-1 row-span-2 bg-gray-200 rounded-lg h-[610px]"></div>
          <div className="col-span-1 bg-gray-200 rounded-lg h-[300px]"></div>
          <div className="col-span-1 bg-gray-200 rounded-lg h-[300px]"></div>
          <div className="col-span-1 bg-gray-200 rounded-lg h-[300px]"></div>
        </div>
        <div className="md:hidden space-y-4">
          <div className="bg-gray-200 rounded-2xl h-[220px]"></div>
          <div className="bg-gray-200 rounded-2xl h-[160px]"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-200 rounded-xl h-[180px]"></div>
            <div className="bg-gray-200 rounded-xl h-[180px]"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-6">
      {/* For desktop view - visible on md screens and up */}
      <div className="hidden md:grid md:grid-cols-4 gap-3 max-h-[700px]">
        {/* Top Row - Updated Layout */}
        {/* Top Left */}
        <Link
          href={getBannerData('TopFullLeftBAnner')?.link || "/brand/jinko-solar"}
          className="col-span-1 bg-gray-100 rounded-lg overflow-hidden h-[300px] flex items-center justify-center relative group hover:shadow-lg transition-all"
        >
          <div className="absolute inset-0 bg-black/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {getBannerData('TopFullLeftBAnner')?.text && (
            <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white font-semibold text-sm mb-2">{getBannerData('TopFullLeftBAnner')?.text}</p>
              {getBannerData('TopFullLeftBAnner')?.button && (
                <span className="text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold">
                  {getBannerData('TopFullLeftBAnner')?.button}
                </span>
              )}
            </div>
          )}
          <Image
            src={getImageSrc(getBannerData('TopFullLeftBAnner'), "/q2.jpeg")}
            alt={getBannerData('TopFullLeftBAnner')?.text || "Solar Panel"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Top Center - Now showing BottomWideCenterBanner */}
        <Link
          href={getBannerData('BottomWideCenterBanner')?.link || "/services/installation"}
          className="col-span-2 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          <div className="absolute inset-0  z-10"></div>
          {getBannerData('BottomWideCenterBanner')?.text && (
            <div className="absolute top-6 left-6 z-20">
              <h2 className="text-2xl font-bold text-white mb-2">{getBannerData('BottomWideCenterBanner')?.text}</h2>
              {getBannerData('BottomWideCenterBanner')?.button && (
                <span className="text-white font-semibold hover:underline">{getBannerData('BottomWideCenterBanner')?.button}</span>
              )}
            </div>
          )}
          <Image
            src={getImageSrc(getBannerData('BottomWideCenterBanner'), "/wer.jpg")}
            alt={getBannerData('BottomWideCenterBanner')?.text || "Solar Installation"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Tall Right Block (spans both rows) */}
        <Link
          href={getBannerData('FullRightTallBanner')?.link || "/premium-solutions"}
          className="col-span-1 row-span-2 rounded-lg overflow-hidden p-6 flex flex-col justify-between group hover:shadow-lg transition-all h-[610px] relative"
        >
          <div className="absolute inset-0  z-10"></div>
          {getBannerData('FullRightTallBanner')?.text && (
            <div className="relative z-20">
              <h2 className="text-2xl font-bold text-white mb-4">{getBannerData('FullRightTallBanner')?.text}</h2>
              {getBannerData('FullRightTallBanner')?.button && (
                <span className="text-white font-semibold hover:underline">{getBannerData('FullRightTallBanner')?.button}</span>
              )}
            </div>
          )}
          <Image
            src={getImageSrc(getBannerData('FullRightTallBanner'), "/q1.jpeg")}
            alt={getBannerData('FullRightTallBanner')?.text || "Premium Solar"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Bottom Row - Now showing TopCenterLeft and TopCenterRight */}
        {/* Bottom Left */}
        <Link
          href={getBannerData('BottomLeftBanner')?.link || "/summer-deals"}
          className="col-span-1 bg-blue-100 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          <div className="absolute inset-0 bg-black/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {getBannerData('BottomLeftBanner')?.text && (
            <div className="absolute top-4 left-4 z-20">
              <h2 className="text-xl font-bold text-white mb-2">{getBannerData('BottomLeftBanner')?.text}</h2>
              {getBannerData('BottomLeftBanner')?.button && (
                <span className="text-white font-semibold hover:underline text-sm">{getBannerData('BottomLeftBanner')?.button}</span>
              )}
            </div>
          )}
          <Image
            src={getImageSrc(getBannerData('BottomLeftBanner'), "/q8.jpeg")}
            alt={getBannerData('BottomLeftBanner')?.text || "Summer Deals"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Bottom Center Left - Now showing TopCenterLeftBanner */}
        <Link
          href={getBannerData('TopCenterLeftBAnner')?.link || "/category/solar-panels"}
          className="col-span-1 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          <div className="absolute inset-0 bg-black/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {getBannerData('TopCenterLeftBAnner')?.text && (
            <div className="absolute top-4 left-4 z-20">
              <h2 className="text-xl font-bold text-white mb-2">{getBannerData('TopCenterLeftBAnner')?.text}</h2>
              {getBannerData('TopCenterLeftBAnner')?.button && (
                <span className="text-white font-semibold hover:underline text-sm">{getBannerData('TopCenterLeftBAnner')?.button}</span>
              )}
            </div>
          )}
          <Image
            src={getImageSrc(getBannerData('TopCenterLeftBAnner'), "/q7.jpeg")}
            alt={getBannerData('TopCenterLeftBAnner')?.text || "Solar Options"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Bottom Center Right - Now showing TopCenterRightBanner */}
        <Link
          href={getBannerData('TopCenterRightBAnner')?.link || "/flash-deals"}
          className="col-span-1 bg-yellow-100 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          <div className="absolute inset-0 bg-black/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {getBannerData('TopCenterRightBAnner')?.text && (
            <div className="absolute top-4 left-4 z-20">
              <h2 className="text-xl font-bold text-white mb-2">{getBannerData('TopCenterRightBAnner')?.text}</h2>
              {getBannerData('TopCenterRightBAnner')?.button && (
                <span className="text-white font-semibold hover:underline text-sm">{getBannerData('TopCenterRightBAnner')?.button}</span>
              )}
            </div>
          )}
          <Image
            src={getImageSrc(getBannerData('TopCenterRightBAnner'), "/q17.jpg")}
            alt={getBannerData('TopCenterRightBAnner')?.text || "Flash Deals"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

      </div>

      {/* MOBILE VIEW - Using Sanity Data */}
      <div className="md:hidden space-y-4">
        
        {/* Hero Card - Full Width Feature */}
        <Link
          href={getBannerData('MobileTopWideBanner')?.link || "/premium-solutions"}
          className="block rounded-2xl overflow-hidden relative h-[220px] shadow-lg group"
        >
          <div className="absolute inset-0 "></div>
          <div className="absolute top-6 left-6 right-6 z-20">
            <div className="flex items-center gap-2 mb-3">
              {/* <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-xs font-semibold">PREMIUM</span>
              </div> */}
            </div>
            {getBannerData('MobileTopWideBanner')?.text && (
              <h1 className="text-2xl font-bold text-white leading-tight mb-2">
                {getBannerData('MobileTopWideBanner')?.text}
              </h1>
            )}
            {/* <p className="text-white/90 text-sm mb-4">Transform your home with our top-tier solar systems</p> */}
            <div className="flex items-center gap-2">
              {getBannerData('MobileTopWideBanner')?.button && (
                <span className="text-white font-semibold text-sm">{getBannerData('MobileTopWideBanner')?.button}</span>
              )}
              
            </div>
          </div>
          <Image
            src={getImageSrc(getBannerData('MobileTopWideBanner'), "/seventeen.jpg")}
            alt={getBannerData('MobileTopWideBanner')?.text || "Premium Solar Home Installation"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Flash Deals - Eye-catching Accent Card */}
        <Link
          href={getBannerData('MobileSecondWideBanner')?.link || "/flash-deals"}
          className="block rounded-2xl overflow-hidden relative h-[160px] shadow-lg group"
        >
          <div className="absolute inset-0 "></div>
          <div className="flex items-center justify-between h-full p-6 relative z-20">
            <div>
              <div className="rounded-full px-3 py-1 mb-3 inline-block">
                {/* <span className="text-white text-xs font-bold">LIMITED TIME</span> */}
              </div>
              {getBannerData('MobileSecondWideBanner')?.text && (
                <h2 className="text-2xl font-bold text-white mb-1">{getBannerData('MobileSecondWideBanner')?.text}</h2>
              )}
              {/* <p className="text-white/90 text-sm mb-3">Up to 50% off solar equipment</p> */}
              {getBannerData('MobileSecondWideBanner')?.button && (
                <span className="text-white font-semibold text-sm underline">{getBannerData('MobileSecondWideBanner')?.button}</span>
              )}
            </div>
            <div className="text-right">
              {/* <div className="text-4xl font-black text-white/20">50%</div> */}
              {/* <div className="text-white font-bold text-sm">OFF</div> */}
            </div>
          </div>
          <Image
            src={getImageSrc(getBannerData('MobileSecondWideBanner'), "/q6.jpeg")}
            alt={getBannerData('MobileSecondWideBanner')?.text || "Solar Flash Deals"}
            fill
            className="group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Dual Cards Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Mobile Bottom Left Banner */}
          <Link
            href={getBannerData('MobileBottomLeftBanner')?.link || "/brand/jinko-solar"}
            className=" rounded-xl overflow-hidden relative h-[180px] shadow-md group"
          >
            <div className="absolute inset-0 bg-black/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {getBannerData('MobileBottomLeftBanner')?.text && (
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="bg-white rounded-lg p-3 text-center shadow-lg">
                  {(() => {
                    const text = getBannerData('MobileBottomLeftBanner')?.text || 'BRAND SOLAR PANELS'
                    const words = text.split(' ')
                    const firstWord = words[0] || 'BRAND'
                    const restWords = words.slice(1).join(' ') || 'SOLAR PANELS'
                    
                    return (
                      <>
                        <div className="text-[#1a5ca4] font-bold text-lg mb-1">{firstWord}</div>
                        <div className="text-[#1a5ca4] font-semibold text-xs">{restWords}</div>
                      </>
                    )
                  })()}
                  {getBannerData('MobileBottomLeftBanner')?.button && (
                    <div className="mt-2">
                      <span className="bg-[#1a5ca4] text-white text-xs px-2 py-1 rounded font-semibold">
                        {getBannerData('MobileBottomLeftBanner')?.button}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <Image
              src={getImageSrc(getBannerData('MobileBottomLeftBanner'), "/q9.jpeg")}
              alt={getBannerData('MobileBottomLeftBanner')?.text || "Jinko Solar Panels"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Mobile Bottom Right Banner */}
          <Link
            href={getBannerData('MobileBottomRightBanner')?.link || "/category/solar-panels"}
            className=" rounded-xl overflow-hidden relative h-[180px] shadow-md group"
          >
            <div className="absolute inset-0 z-10"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-20">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 self-start">
                {/* <span className="text-white text-xs font-semibold">1000+ OPTIONS</span> */}
              </div>
              <div>
                {getBannerData('MobileBottomRightBanner')?.text && (
                  <h3 className="text-white font-bold text-lg leading-tight mb-2">
                    {getBannerData('MobileBottomRightBanner')?.text}
                  </h3>
                )}
                {getBannerData('MobileBottomRightBanner')?.button && (
                  <span className="text-white text-sm font-semibold underline">{getBannerData('MobileBottomRightBanner')?.button}</span>
                )}
              </div>
            </div>
            <Image
              src={getImageSrc(getBannerData('MobileBottomRightBanner'), "/q7.jpeg")}
              alt={getBannerData('MobileBottomRightBanner')?.text || "Solar Panel Options"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

      </div>
    </div>
  )
}