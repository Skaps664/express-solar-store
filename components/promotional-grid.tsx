import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PromotionalGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-8">
      {/* First promo */}
      <Link href="/product/solar-batteries" className="block">
        <div className="bg-green-50 rounded-lg overflow-hidden p-6 relative hover:shadow-md transition-all">
          <div className="mb-2 inline-block bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            ROLLBACKS
          </div>
          <h2 className="text-2xl font-bold text-[#1a5ca4] mb-2">Solar Batteries</h2>
          <p className="text-gray-700 mb-4">Store energy for when you need it most</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-[#1a5ca4]">From PKR 225,000</span>
          </div>
          <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a]">Shop Now</Button>
          <div className="absolute right-4 bottom-4 w-24 h-24 bg-white/50 rounded-full flex items-center justify-center overflow-hidden">
            <div className="text-gray-400 text-center text-xs">[Solar Battery]</div>
          </div>
        </div>
      </Link>

      {/* Second promo */}
      <Link href="/product/mounting-systems" className="block">
        <div className="bg-orange-50 rounded-lg overflow-hidden p-6 relative hover:shadow-md transition-all">
          <div className="mb-2 inline-block bg-[#f26522] text-white text-xs font-semibold px-2 py-1 rounded-full">
            SAVE BIG
          </div>
          <h2 className="text-2xl font-bold text-[#1a5ca4] mb-2">Mounting Systems</h2>
          <p className="text-gray-700 mb-4">Secure installation for any roof type</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-[#1a5ca4]">Under PKR 50,000</span>
          </div>
          <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a]">Shop Now</Button>
          <div className="absolute right-4 bottom-4 w-24 h-24 bg-white/50 rounded-full flex items-center justify-center overflow-hidden">
            <div className="text-gray-400 text-center text-xs">[Mounting System]</div>
          </div>
        </div>
      </Link>

      {/* Third promo */}
      <Link href="/product/monitoring-systems" className="block">
        <div className="bg-blue-50 rounded-lg overflow-hidden p-6 relative hover:shadow-md transition-all">
          <div className="mb-2 inline-block bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            TECH ESSENTIALS
          </div>
          <h2 className="text-2xl font-bold text-[#1a5ca4] mb-2">Monitoring Systems</h2>
          <p className="text-gray-700 mb-4">Track your energy production in real-time</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-[#1a5ca4]">From PKR 15,000</span>
          </div>
          <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a]">Shop Now</Button>
          <div className="absolute right-4 bottom-4 w-24 h-24 bg-white/50 rounded-full flex items-center justify-center overflow-hidden">
            <div className="text-gray-400 text-center text-xs">[Monitoring System]</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
