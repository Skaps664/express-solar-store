"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function FeaturedPromoCards() {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-[#1a5ca4] mb-6">Featured Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Solar Panels Card */}
        <Link href="/category/solar-panels" className="group">
          <div className="bg-blue-50 rounded-lg overflow-hidden relative h-[250px] hover:shadow-lg transition-all">
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-[#1a5ca4] text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2">
                  BESTSELLER
                </div>
                <h3 className="text-2xl font-bold text-[#1a5ca4] mb-2">Premium Solar Panels</h3>
                <p className="text-gray-700">High-efficiency panels for maximum energy production</p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit">Shop Now</Button>
            </div>
            <Image
              src="eleven.png"
              alt="Solar Panels"
              fill
              className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Inverters Card */}
        <Link href="/category/inverters" className="group">
          <div className="bg-green-50 rounded-lg overflow-hidden relative h-[250px] hover:shadow-lg transition-all">
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2">
                  NEW ARRIVAL
                </div>
                <h3 className="text-2xl font-bold text-[#1a5ca4] mb-2">Smart Inverters</h3>
                <p className="text-gray-700">Convert DC to AC with maximum efficiency</p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit">Shop Now</Button>
            </div>
            <Image
              src="nine.png"
              alt="Solar Inverter"
              fill
              className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Batteries Card */}
        <Link href="/category/batteries" className="group">
          <div className="bg-amber-50 rounded-lg overflow-hidden relative h-[250px] hover:shadow-lg transition-all">
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2">
                  SALE
                </div>
                <h3 className="text-2xl font-bold text-[#1a5ca4] mb-2">Energy Storage</h3>
                <p className="text-gray-700">Store excess energy for when you need it most</p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit">Shop Now</Button>
            </div>
            <Image
              src="twelve.png"
              alt="Solar Batteries"
              fill
              className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
