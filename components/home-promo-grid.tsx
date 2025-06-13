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
          <div className="absolute bottom-8 left-8 z-10">
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md">
              <span className="text-[#1a5ca4] font-bold text-sm">BUY NOW</span>
            </div>
          </div>
          <Image
            src="/c1-size.png" //seventeen.jpg
            alt="Solar Panel Close-up"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <Link
          href="/category/solar-panels"
          className="col-span-1 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">1,000s of solar options,</h2>
              <h2 className="text-2xl font-bold text-white mb-4">for way less</h2>
              <span className="text-white font-semibold hover:underline">Shop now</span>
            </div>
            <div className="flex justify-end">
              <div className="w-40 h-40 relative">
                {/* <div className="absolute top-0 left-0 bg-blue-400 rounded-full w-16 h-16 flex items-center justify-center text-white text-xs font-bold p-2 z-10">
                  solar event
                </div> */}
              </div>
            </div>
          </div>
          <Image
            src="/c1-size.png" //sixteen 335x335
            alt="Solar Panel Installation"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <Link
          href="/flash-deals"
          className="col-span-1 bg-yellow-100 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Up to 50% off</h2>
              <span className="text-white font-semibold hover:underline">Shop now</span>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold text-white">Flash Deals</h2>
            </div>
          </div>
          <Image
            src="/c1-size.png"
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
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">Premium solar solutions for homes</h2>
            <span className="text-white font-semibold hover:underline">Shop now</span>
          </div>
          <Image
            src="/r1-size.png"
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
          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Summer energy</h2>
              <h2 className="text-2xl font-bold text-white mb-4">savings from PKR 25,000</h2>
              <span className="text-white font-semibold hover:underline">Shop now</span>
            </div>
          </div>
          <Image
            src="/c1-size.png"
            alt="Solar Panels in Summer"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <Link
          href="/services/installation"
          className="col-span-2 rounded-lg overflow-hidden p-6 h-[300px] group hover:shadow-lg transition-all relative"
        >
          <div className="flex flex-col md:flex-row h-full justify-between items-center relative z-10">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-white mb-2">Free installation with SolarExpress+</h2>
              <p className="text-white mb-4">One free consultation per customer. T&C apply.</p>
              <span className="text-white font-semibold hover:underline">Try SolarExpress+ for free</span>
            </div>
          </div>
          <Image
            src="/c9-test.png"
            alt="Solar Panel Installation"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* For mobile view - visible only on small screens */}
      <div className="md:hidden">
        
        


        {/* Second row - Jinko Solar and Solar Options */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          
          {/* Jinko Solar */}
          <Link
            href="/brand/jinko-solar"
            className="bg-gray-100 rounded-lg overflow-hidden relative h-[140px] shadow flex items-start p-4"
          >
            {/* <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-md z-10">
              <span className="text-[#1a5ca4] font-bold text-xs">JINKO SOLAR</span>
            </div> */}
            <Image
              src="/c7-test.png" //sixteen
              alt="Solar Panel Close-up"
              fill
              className="object-cover"
            />
          </Link>
          
          {/* Solar Options */}
          <Link
            href="/category/solar-panels"
            className="rounded-lg overflow-hidden p-4 h-[140px] relative shadow flex flex-col justify-between"
          >
            <div className="z-10">
              {/* <h2 className="text-sm font-bold text-black mb-1">1,000s of solar options,</h2>
              <h3 className="text-sm font-bold text-black mb-1">for way less</h3>
              <span className="text-white font-semibold text-xs hover:underline">Shop now</span> */}
            </div> 
             {/* <div className="flex justify-end">
              <div className="bg-blue-400 rounded-full w-12 h-12 flex items-center justify-center text-white text-xs font-bold p-1 z-10">
                solar event
              </div>
            </div> */}
            <Image
              src="six.jpg"
              alt="Solar Panel Installation"
              fill
              className="object-cover"
            />
          </Link>
        </div>

        {/* Third row - Flash Deals (wider) and Premium Solar Solutions */}
        {/* moved one row below */}

        {/* Fourth row - Summer Energy and SolarExpress+ */}
        <div className="grid grid-cols-1 gap-4">
          {/* Summer Energy Savings */}
          <Link
            href="/summer-deals"
            className="bg-blue-100 rounded-lg overflow-hidden p-4 h-[120px] relative shadow"
          >
            <div className="relative z-10">
              <h2 className="text-lg font-bold text-white mb-1">Summer energy</h2>
              <h2 className="text-lg font-bold text-white mb-2">savings from PKR 25,000</h2>
              <span className="text-white font-semibold text-sm hover:underline">Shop now</span>
            </div>
            <Image
              src="two.webp"
              alt="Solar Panels in Summer"
              fill
              className="object-cover"
            />
          </Link>

          {/* SolarExpress+ */}
          
        </div>

        <div className="grid grid-cols-5 gap-4 mt-4 mb-4">
          {/* Flash Deals - Wide card */}
          <Link
            href="/flash-deals"
            className="col-span-3 rounded-lg overflow-hidden p-4 h-[150px] relative shadow flex flex-col justify-between"
          >
            <div className="z-10">
              {/* <h2 className="text-lg font-bold text-white mb-2">Up to 50% off</h2> */}
              {/* <span className="text-[#1a5ca4] font-semibold text-sm hover:underline">Shop now</span> */}
            </div>
            <div className="flex justify-end">
              {/* <h2 className="text-2xl font-bold text-[#1a5ca4]">Flash Deals</h2> */}
            </div>
            <Image
              src="/fifteen.jpg"
              alt="Solar Inverter"
              fill
              className="object-cover"
            />
          </Link>
          
          {/* Premium Solar Solutions - Narrow card */}
          <Link
            href="/premium-solutions"
            className="col-span-2 bg-gray-200 rounded-lg overflow-hidden p-3 h-[150px] relative shadow flex flex-col justify-between"
          >
            {/* <div className="z-10">
              <h2 className="text-sm font-bold text-[#1a5ca4] mb-1">Premium solar solutions for homes</h2>
              <span className="text-[#1a5ca4] font-semibold text-xs hover:underline">Shop now</span>
            </div> */}
            <Image
              src="/four.jpg"
              alt="Premium Solar Home Installation"
              fill
              className="object-cover"
            />
          </Link>
        </div>
      </div>

      {/* Additional promotional banner - responsive for both desktop and mobile */}
      {/* <div className="mt-6 bg-[#1a5ca4] rounded-lg overflow-hidden relative h-auto py-4 md:h-[150px] group hover:shadow-lg transition-all">
        <div className="flex flex-col md:flex-row h-full justify-between items-center p-4 md:p-6 relative z-10">
          <div className="text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Free shipping on orders over PKR 50,000</h2>
            <p className="text-sm md:text-base mb-4 md:mb-0">That's SolarExpress+. One free trial per customer. T&C apply.</p>
          </div>
          <Button className="bg-white text-[#1a5ca4] hover:bg-gray-100 w-full md:w-auto">Try SolarExpress+ for free</Button>
        </div>
        <Image
          src=""
          alt="Solar Panels on Roof"
          fill
          className="object-cover opacity-10 group-hover:scale-105 transition-transform duration-300"
        />
      </div> */}
    </div>
  )
}