import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
      {/* Main hero section */}
      <div className="bg-gray-100 p-10 rounded-lg flex flex-col justify-center relative overflow-hidden h-[450px] border-2 border-dashed border-gray-300">
        <div className="z-10">
          <div className="text-amber-600 font-medium mb-3">POWER YOUR FUTURE WITH SOLAR</div>
          <h1 className="text-5xl font-bold mb-6">Solar Panel Pro.</h1>
          <p className="text-lg mb-8">
            High-efficiency solar panels designed for maximum energy production in all weather conditions.
            Industry-leading warranty and professional installation available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white">SHOP NOW</Button>
            <Button variant="outline">LEARN MORE</Button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gray-200 flex items-center justify-center border-l border-dashed border-gray-300">
          <div className="text-gray-400 text-center">
            [Product Image]
            <br />
            Solar Panel
          </div>
        </div>
      </div>

      {/* Secondary product cards */}
      <div className="grid grid-rows-2 gap-6">
        <div className="bg-gray-100 p-8 rounded-lg flex items-center border-2 border-dashed border-gray-300">
          <div className="flex-1">
            <div className="text-green-600 font-medium mb-2">BEST SALE</div>
            <h2 className="text-3xl font-bold mb-3">Solar Inverters</h2>
            <p className="mb-4">
              Convert DC power to AC efficiently with our premium inverters. Compatible with all major solar panel
              brands.
            </p>
            <p className="text-sm font-medium">
              From $1699.00 or
              <br />
              $64.62/mo.
            </p>
          </div>
          <div className="w-1/3 h-40 bg-gray-200 flex items-center justify-center border border-dashed border-gray-300">
            <div className="text-gray-400 text-center text-xs">
              [Product Image]
              <br />
              Inverter
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-8 rounded-lg flex items-center border-2 border-dashed border-gray-300">
          <div className="flex-1">
            <div className="text-red-600 font-medium mb-2">NEW ARRIVAL</div>
            <h2 className="text-3xl font-bold mb-3">Battery Storage</h2>
            <p className="mb-4">
              Store excess energy and ensure power during outages with our advanced battery solutions. Scalable for
              homes and businesses.
            </p>
            <p className="text-sm font-medium">
              From $599 or
              <br />
              $49.91/mo. for 12 mo. *
            </p>
          </div>
          <div className="w-1/3 h-40 bg-gray-200 flex items-center justify-center border border-dashed border-gray-300">
            <div className="text-gray-400 text-center text-xs">
              [Product Image]
              <br />
              Battery
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
