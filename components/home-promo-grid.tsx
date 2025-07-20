"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePromoGrid() {
  return (
    <div className="my-6">
      {/* For desktop view - visible on md screens and up */}
      <div className="hidden md:grid md:grid-cols-4 gap-3 max-h-[700px]">
        {/* Top Row */}
        <Link
          href="/brand/jinko-solar"
          className="col-span-1 bg-gray-100 rounded-lg overflow-hidden h-[300px] flex items-center justify-center relative group hover:shadow-lg transition-all"
        >
          {/* <div className="absolute bottom-8 left-8 z-10">
            <div className="bg-white opacity-0 rounded-full w-24 h-24 flex items-center justify-center shadow-md">
              <span className="text-[#1a5ca4] font-bold text-sm">BUY NOW</span>
            </div>
          </div> */}
          <Image
            src="/q2.jpeg" //seventeen.jpg
            alt="Solar Panel Close-up"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <Link
          href="/category/solar-panels"
          className="col-span-1 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          {/* <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">1,000s of solar options,</h2>
              <h2 className="text-2xl font-bold text-white mb-4">for way less</h2>
              <span className="text-white font-semibold hover:underline">Shop now</span>
            </div>
            <div className="flex justify-end">
              <div className="w-40 h-40 relative">
                {/* <div className="absolute top-0 left-0 bg-blue-400 rounded-full w-16 h-16 flex items-center justify-center text-white text-xs font-bold p-2 z-10">
                  solar event
                </div> 
              </div>
            </div>
          </div> */}
          <Image
            src="/q7.jpeg" //sixteen 335x335
            alt="Solar Panel Installation"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <Link
          href="/flash-deals"
          className="col-span-1 bg-yellow-100 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          {/* <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Up to 50% off</h2>
              <span className="text-white font-semibold hover:underline">Shop now</span>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold text-white">Flash Deals</h2>
            </div>
          </div> */}
          <Image
            src="q17.jpg"
            alt="Solar Inverter"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Tall Right Block (spans both rows) */}
        <Link
          href="/premium-solutions"
          className="col-span-1 row-span-2 rounded-lg overflow-hidden p-6 flex flex-col justify-between group hover:shadow-lg transition-all h-[610px] relative"
        >
          {/* <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">Premium solar solutions for homes</h2>
            <span className="text-white font-semibold hover:underline">Shop now</span>
          </div> */}
          <Image
            src="/q1.jpeg"
            alt="Premium Solar Home Installation"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Bottom Row */}
        <Link
          href="/summer-deals"
          className="col-span-1 bg-blue-100 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          {/* <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Summer energy</h2>
              <h2 className="text-2xl font-bold text-white mb-4">savings from PKR 25,000</h2>
              <span className="text-white font-semibold hover:underline">Shop now</span>
            </div>
          </div> */}
          <Image
            src="/q8.jpeg"
            alt="Solar Panels in Summer"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <Link
          href="/services/installation"
          className="col-span-2 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          {/* <div className="flex flex-col md:flex-row h-full justify-between items-center relative z-10">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-white mb-2">Free installation with SolarExpress+</h2>
              <p className="text-white mb-4">One free consultation per customer. T&C apply.</p>
              <span className="text-white font-semibold hover:underline">Try SolarExpress+ for free</span>
            </div>
          </div> */}
          <Image
            src="/one.jpg"
            alt="Solar Panel Installation"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* REDESIGNED MOBILE VIEW - Modern and Professional Layout */}
      <div className="md:hidden space-y-4">
        
        {/* Hero Card - Full Width Feature */}
        <Link
          href="/premium-solutions"
          className="block rounded-2xl overflow-hidden relative h-[220px] shadow-lg group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-transparent z-10"></div>
          <div className="absolute top-6 left-6 right-6 z-20">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-xs font-semibold">PREMIUM</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight mb-2">
              Premium Solar Solutions
            </h1>
            <p className="text-white/90 text-sm mb-4">Transform your home with our top-tier solar systems</p>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">Explore Solutions</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">→</span>
              </div>
            </div>
          </div>
          <Image
            src="/seventeen.jpg"
            alt="Premium Solar Home Installation"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Flash Deals - Eye-catching Accent Card */}
        <Link
          href="/flash-deals"
          className="block  rounded-2xl overflow-hidden relative h-[160px] shadow-lg group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
          <div className="flex items-center justify-between h-full p-6 relative z-20">
            <div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3 inline-block">
                <span className="text-white text-xs font-bold">LIMITED TIME</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Flash Deals</h2>
              <p className="text-white/90 text-sm mb-3">Up to 50% off solar equipment</p>
              <span className="text-white font-semibold text-sm underline">Shop Now</span>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-white/20">50%</div>
              <div className="text-white font-bold text-sm">OFF</div>
            </div>
          </div>
          <Image
            src="/q6.jpeg"
            alt="Solar Flash Deals"
            fill
            className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Dual Cards Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Jinko Solar Brand Card */}
          <Link
            href="/brand/jinko-solar"
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl overflow-hidden relative h-[180px] shadow-md group"
          >
            {/* <div className="absolute inset-0 bg-black/20 z-10"></div> */}
            {/* <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="bg-white rounded-lg p-3 text-center shadow-lg">
                <div className="text-[#1a5ca4] font-bold text-lg mb-1">JINKO</div>
                <div className="text-[#1a5ca4] font-semibold text-xs">SOLAR PANELS</div>
                <div className="mt-2">
                  <span className="bg-[#1a5ca4] text-white text-xs px-2 py-1 rounded font-semibold">
                    BUY NOW
                  </span>
                </div>
              </div>
            </div> */}
            <Image
              src="/q9.jpeg"
              alt="Jinko Solar Panels"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Solar Options Card */}
          <Link
            href="/category/solar-panels"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl overflow-hidden relative h-[180px] shadow-md group"
          >
            {/* <div className="absolute inset-0 bg-black/30 z-10"></div> */}
            {/* <div className="absolute inset-0 p-4 flex flex-col justify-between z-20">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 self-start">
                <span className="text-white text-xs font-semibold">1000+ OPTIONS</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight mb-2">
                  Solar Panels for Less
                </h3>
                <span className="text-white text-sm font-semibold underline">Browse All</span>
              </div>
            </div> */}
            <Image
              src="q7.jpeg"
              alt="Solar Panel Options"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

        {/* Summer Deals - Full Width Accent */}
        
      </div>
    </div>
  )
}