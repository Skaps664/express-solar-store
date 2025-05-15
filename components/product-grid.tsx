"use client"

import Link from "next/link"

export default function ProductGrid() {
  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Explore our most popular solar and renewable energy solutions, designed for efficiency and reliability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Smart Monitoring */}
        <Link href="/product/monitoring-systems" className="block">
          <div className="bg-gray-100 p-8 rounded-lg flex items-center border border-gray-200 hover:border-[#1a5ca4] hover:shadow-md transition-all">
            <div className="flex-1">
              <div className="text-blue-600 font-medium mb-2">15% OFF</div>
              <h2 className="text-2xl font-bold mb-3">Smart Monitoring</h2>
              <p className="mb-4">
                Track your system's performance in real-time with our advanced monitoring solutions. Compatible with all
                major solar installations.
              </p>
              <p className="text-sm">
                Monitor your solar system with
                <br />
                real-time analytics and controls.
              </p>
            </div>
            <div className="w-1/3 h-40 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400">[Smart Monitoring Image]</div>
            </div>
          </div>
        </Link>

        {/* Solar Accessories */}
        <Link href="/product/mounting-systems" className="block">
          <div className="bg-gray-100 p-8 rounded-lg flex items-center border border-gray-200 hover:border-[#1a5ca4] hover:shadow-md transition-all">
            <div className="flex-1">
              <div className="text-purple-600 font-medium mb-2">FREE INSTALLATION</div>
              <h2 className="text-2xl font-bold mb-3">Solar Accessories</h2>
              <p className="mb-4">
                Complete your solar setup with our range of high-quality accessories, from mounting hardware to cables
                and connectors.
              </p>
              <p className="text-sm">
                High-quality components &<br />
                professional installation
              </p>
            </div>
            <div className="w-1/3 h-40 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400">[Solar Accessories Image]</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Additional Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            id: "mounting-systems",
            title: "Mounting Systems",
            price: "PKR 45,000",
            tag: "BESTSELLER",
            image: "mounting-system",
          },
          {
            id: "charge-controllers",
            title: "Charge Controllers",
            price: "PKR 35,000",
            tag: "NEW",
            image: "charge-controller",
          },
          {
            id: "solar-water-heaters",
            title: "Solar Water Heaters",
            price: "PKR 120,000",
            tag: "POPULAR",
            image: "solar-water-heater",
          },
          {
            id: "off-grid-kits",
            title: "Off-Grid Kits",
            price: "PKR 650,000",
            tag: "COMPLETE SOLUTION",
            image: "off-grid-kit",
          },
        ].map((product, index) => (
          <Link key={index} href={`/product/${product.id}`} className="block">
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-all">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400">[{product.image}]</div>
              </div>
              <div className="p-4">
                <div className="text-xs text-amber-600 font-medium mb-1">{product.tag}</div>
                <h3 className="font-bold mb-2">{product.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-800 font-bold">{product.price}</span>
                </div>
                <button
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                  onClick={(e) => {
                    e.preventDefault()
                    // Add to cart logic
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recently viewed product */}
      <div className="mt-8 p-6 border border-gray-200 rounded-lg">
        <h3 className="font-bold mb-4">Recently Viewed</h3>
        <Link href="/product/solar-roof-mount-kit" className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-xs">[Mounting Kit]</div>
          </div>
          <div>
            <h3 className="font-medium">Solar Roof Mount Kit - Premium</h3>
            <p className="text-sm text-gray-500">From PKR 18,000</p>
            <p className="text-xs text-gray-400">40 minutes ago</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
