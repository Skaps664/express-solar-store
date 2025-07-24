"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function FeaturedBrands() {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-[#1a5ca4] mb-6">Featured Brands</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Jinko Solar Card */}
        <Link href="/brand/jinko-solar" className="group">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden relative h-[280px] md:h-[350px] hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-[#1a5ca4] text-white text-xs font-bold px-2 md:px-3 py-1 rounded-full inline-block mb-2 md:mb-3">
                  #1 GLOBAL
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1a5ca4] mb-1 md:mb-2">Jinko Solar</h3>
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                  World's leading solar panel manufacturer with cutting-edge Tiger Neo technology
                </p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit rounded-lg text-xs md:text-sm">Shop Jinko</Button>
            </div>
            <Image
              src="/19.webp"
              alt="Jinko Solar Panels"
              fill
              className="object-cover opacity-15 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Tesla Card */}
        <Link href="/brand/tesla" className="group">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden relative h-[280px] md:h-[350px] hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-red-600 text-white text-xs font-bold px-2 md:px-3 py-1 rounded-full inline-block mb-2 md:mb-3">
                  PREMIUM
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1a5ca4] mb-1 md:mb-2">Tesla Energy</h3>
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                  Revolutionary energy storage solutions with Powerwall and Solar Roof technology
                </p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit rounded-lg text-xs md:text-sm">Shop Tesla</Button>
            </div>
            <Image
              src="/16.webp"
              alt="Tesla Powerwall"
              fill
              className="object-cover opacity-15 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Growatt Card */}
        <Link href="/brand/growatt" className="group">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl overflow-hidden relative h-[280px] md:h-[350px] hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-green-600 text-white text-xs font-bold px-2 md:px-3 py-1 rounded-full inline-block mb-2 md:mb-3">
                  INNOVATIVE
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1a5ca4] mb-1 md:mb-2">Growatt</h3>
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                  Smart inverter solutions with advanced monitoring and hybrid technology
                </p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit rounded-lg text-xs md:text-sm">Shop Growatt</Button>
            </div>
            <Image
              src="/14.webp"
              alt="Growatt Inverter"
              fill
              className="object-cover opacity-15 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Canadian Solar Card */}
        <Link href="/brand/canadian-solar" className="group">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl overflow-hidden relative h-[280px] md:h-[350px] hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-amber-600 text-white text-xs font-bold px-2 md:px-3 py-1 rounded-full inline-block mb-2 md:mb-3">
                  TRUSTED
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1a5ca4] mb-1 md:mb-2">Canadian Solar</h3>
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                  Reliable solar panels with proven performance and industry-leading warranties
                </p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit rounded-lg text-xs md:text-sm">Shop Canadian Solar</Button>
            </div>
            <Image
              src="/18.webp"
              alt="Canadian Solar Panels"
              fill
              className="object-cover opacity-15 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
