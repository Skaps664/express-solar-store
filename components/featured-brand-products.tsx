"use client"

import Link from "next/link"
import { Heart, Plus } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { client } from "../lib/sanity"



type HeadingData = {
  featuredBrandsHeading: {
    title: string
    subtext: string
  }
}

export default function FeaturedBrandProducts() {

  const [headingData, setHeadingData] = useState<HeadingData | null>(null)

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const data: HeadingData = await client.fetch(
          `*[_type == "homePageContent"][0]{
    featuredBrandsHeading{
      title,
      subtext
    }
  }`
        );
        setHeadingData(data);
      } catch (error) {
        console.error("Failed to fetch Sanity heading:", error);
      }
    };

    fetchHeading();
  }, [])


  const products = [
    {
      id: "jinko-400w-panel",
      name: "JinkoSolar ProSeries 400W Mono Solar Panel with Half-Cell Technology",
      price: 125000,
      image: "/11.png?height=180&width=180",
    },
    {
      id: "jinko-370w-panel",
      name: "JinkoSolar Original 370W Mono Solar Panel with Optimized Cell Design",
      price: 95000,
      image: "/12.png?height=180&width=180",
    },
    {
      id: "jinko-450w-panel",
      name: "JinkoSolar ProSeries 450W XL Mono Solar Panel with Bifacial Technology",
      price: 150000,
      image: "/13.png?height=180&width=180",
    },
  ]

  // Format price in PKR with commas
  const formatPrice = (price : any) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  return (
    <div className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{headingData?.featuredBrandsHeading?.title || "Power uup!"}</h2>
          <p className="text-gray-600">{headingData?.featuredBrandsHeading?.subtext || "Pannels, inverters & much more."}</p>
        </div>
        <Link href="/store" className="text-[#1a5ca4] hover:underline font-medium">
          View all
        </Link>
      </div>

      {/* Mobile-first layout with a different structure than desktop */}
      <div className="block lg:hidden">
        {/* Brand promotion first on mobile */}
        <div className="mb-6">
  <Link
    href="/brand/jinko"
    className="rounded-lg overflow-hidden relative group hover:shadow-lg transition-all block h-full"
  >
    {/* Background image covering entire card */}
    <div className="absolute inset-0 z-0 ">
      <Image
        src="/eighteen.jpg"
        alt="JinkoSolar Panel"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/30"></div>
    </div>

    {/* Content */}
    <div className="p-6 h-full flex flex-col relative z-10">
      <div className="mb-2 text-sm font-semibold text-white">Get it fast</div>
      <h2 className="text-3xl font-bold text-white mb-4">
        Solar <br />
        Panels
      </h2>
      <button className="bg-white text-black hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium w-fit">
        Shop now
      </button>
    </div>
  </Link>
</div>

        {/* Products grid for mobile - original layout with fixes */}
        <div className="space-y-4">
          {/* Top row - two products side by side */}
          <div className="flex gap-4">
            {products.slice(0, 2).map((product) => (
              <div key={product.id} className="relative w-1/2">
                <button className="absolute top-2 right-2 z-10 text-gray-500 hover:text-red-500 bg-white rounded-full p-1">
                  <Heart size={16} />
                </button>
                <Link href={`/product/${product.id}`} className="block group">
                  <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2 overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="pr-6">
                    <div className="text-sm font-bold">{formatPrice(product.price)}</div>
                    <h3 className="text-xs line-clamp-2 group-hover:text-[#1a5ca4] transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </Link>
                <button className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 border border-gray-300 rounded-full hover:bg-gray-100">
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom row - single stretched product */}
          <div className="relative">
            <button className="absolute top-2 right-2 z-10 text-gray-500 hover:text-red-500 bg-white rounded-full p-1">
              <Heart size={16} />
            </button>
            <Link href={`/product/${products[2].id}`} className="block group">
              <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center mb-2 overflow-hidden">
                <Image
                  src={products[2].image || "/placeholder.svg"}
                  alt={products[2].name}
                  width={280}
                  height={160}
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="pr-10">
                <div className="text-sm font-bold">{formatPrice(products[2].price)}</div>
                <h3 className="text-xs line-clamp-2 group-hover:text-[#1a5ca4] transition-colors">
                  {products[2].name}
                </h3>
              </div>
            </Link>
            <button className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 border border-gray-300 rounded-full hover:bg-gray-100">
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Original desktop layout - only visible on lg screens and up */}
      <div className="hidden lg:flex lg:flex-row gap-6">
        {/* Left side - Products (65% width) */}
        <div className="lg:w-[65%] grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <button className="absolute top-2 right-2 z-10 text-gray-500 hover:text-red-500 bg-white rounded-full p-1">
                <Heart size={20} />
              </button>
              <Link href={`/product/${product.id}`} className="block group">
                <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={180}
                    height={180}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mb-2">
                  <div className="text-lg font-bold">{formatPrice(product.price)}</div>
                  <h3 className="text-sm line-clamp-2 group-hover:text-[#1a5ca4] transition-colors">{product.name}</h3>
                </div>
              </Link>
              <Link
                href={`/cart/add/${product.id}`}
                className="mt-2 flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full hover:bg-gray-100"
              >
                <Plus size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Right side - Brand promotion (35% width) */}
        <Link
  href="/brand/jinko"
  className="h-[400px] w-[400px] rounded-lg overflow-hidden relative group hover:shadow-lg transition-all"
>
  {/* Background image covering entire card */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/q15.jpg"
      alt="JinkoSolar Panel"
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
    {/* Semi-transparent overlay for better text visibility */}
    {/* <div className="absolute inset-0  from-white/30 via-white/10 to-white/30"></div> */}
  </div>

  {/* Content */}
  <div className="p-6 h-full flex flex-col relative z-10">
    {/* <div className="mb-2 text-sm font-semibold text-[#1a5ca4]">Get it fast</div>
    <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">
      Solar <br />
      Panels
    </h2> */}
    {/* <button className="mt-48 bg-white text-black hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium w-fit">
      Shop now
    </button> */}
  </div>
</Link>
      </div>
    </div>
  )
}