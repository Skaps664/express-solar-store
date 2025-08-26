"use client"

import Link from "next/link"
import { Heart, Plus } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import AnalyticsClient from "@/lib/analytics"

type HeadingData = {
  featuredBrandsHeading: {
    title: string
    subtext: string
  }
}

type HomePromotion = {
  id: string
  title: string
  subtitle: string
  selectedBrand: {
    value: string
    label: string
    brand: any
  }
  tagline: string
  mainText: string
  buttonText: string
  redirectLink: string
  featuredProducts: any[]
  images: {
    desktop: string
    mobile: string
  }
  isActive: boolean
}

export default function FeaturedBrandProducts() {
  const [headingData, setHeadingData] = useState<HeadingData | null>(null)
  const [homePromotion, setHomePromotion] = useState<HomePromotion | null>(null)
  
  // Track product click
  const handleProductClick = (productId: string, productSlug: string) => {
    const analytics = AnalyticsClient.getInstance()
    analytics.trackProductClick(productId, productSlug)
  }
  
  // Track brand click
  const handleBrandClick = () => {
    if (homePromotion?.selectedBrand) {
      const analytics = AnalyticsClient.getInstance()
      const brandId = homePromotion.selectedBrand.value
      const brandSlug = homePromotion.selectedBrand.brand?.slug || brandId
      analytics.trackBrandClick(brandId, brandSlug)
    }
  }

  useEffect(() => {
    // Fetch heading data (keep existing logic if you have Sanity for other content)
    const fetchHeading = async () => {
      try {
        // If you have sanity client for other content, keep this
        // const data: HeadingData = await client.fetch(...)
        // For now, we'll use the promotion data
        const promotion = localStorage.getItem('homePromotion')
        if (promotion) {
          const promotionData = JSON.parse(promotion)
          console.log('Home promotion data:', promotionData)
          console.log('Featured products in promotion:', promotionData.featuredProducts)
          setHomePromotion(promotionData)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchHeading()
  }, [])

  // Fallback products if no promotion is set
  const fallbackProducts = [
    {
      id: "jinko-400w-panel",
      slug: "jinko-400w-panel",
      name: "JinkoSolar ProSeries 400W Mono Solar Panel with Half-Cell Technology",
      price: 125000,
      image: "/11.png",
    },
    {
      id: "jinko-370w-panel", 
      slug: "jinko-370w-panel",
      name: "JinkoSolar Original 370W Mono Solar Panel with Optimized Cell Design",
      price: 95000,
      image: "/12.png",
    },
    {
      id: "jinko-450w-panel",
      slug: "jinko-450w-panel",
      name: "JinkoSolar ProSeries 450W XL Mono Solar Panel with Bifacial Technology", 
      price: 150000,
      image: "/13.png",
    },
    {
      id: "jinko-380w-panel",
      slug: "jinko-380w-panel",
      name: "JinkoSolar EcoSeries 380W Mono Solar Panel with Advanced Technology",
      price: 110000,
      image: "/11.png",
    },
  ]

  // Format price in PKR with commas
  const formatPrice = (price: any) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  // Use promotion data if available, otherwise fallback
  const displayTitle = homePromotion?.title || headingData?.featuredBrandsHeading?.title || "Power up!"
  const displaySubtitle = homePromotion?.subtitle || headingData?.featuredBrandsHeading?.subtext || "Panels, inverters & much more."
  const brandLink = homePromotion?.redirectLink || "/brand/jinko"
  const desktopImage = homePromotion?.images?.desktop || "/q15.jpg"
  const mobileImage = homePromotion?.images?.mobile || "/eighteen.jpg"
  
  // Use promotion products if available, otherwise fallback
  const products = homePromotion?.featuredProducts?.map(p => {
    const product = p.product || {}
    const imageUrl = product.images?.[0] || product.image || "/placeholder.svg"
    
    // Debug logging for image issues
    if (imageUrl === "/placeholder.svg") {
      console.warn('Product missing image:', product.name, 'Product data:', product)
    }
    
    return {
      id: product._id || p.value,
      slug: product.slug || product._id || p.value, // Use slug for routing
      name: product.name || "Product",
      price: product.price || 0,
      image: imageUrl // Use first image from images array
    }
  }) || fallbackProducts

  // Only show if promotion is active or if no promotion is set (fallback)
  if (homePromotion && !homePromotion.isActive) {
    return null
  }

  return (
    <div className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{displayTitle}</h2>
          <p className="text-gray-600">{displaySubtitle}</p>
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
    href={brandLink}
    className="rounded-lg overflow-hidden relative group hover:shadow-lg transition-all block h-40 sm:h-48"
    onClick={handleBrandClick}
  >
    {/* Background image covering entire card */}
    <div className="absolute inset-0 z-0 ">
      <Image
        src={mobileImage}
        alt="Brand promotion"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 "></div>
    </div>

    {/* Content */}
    <div className="p-6 h-full flex flex-col relative z-10">
      {/* <div className="mb-2 text-sm font-semibold text-white">{homePromotion?.selectedBrand?.label || "Featured Brand"}</div> */}
      {/* <h2 className="text-3xl font-bold text-white mb-4">
        {homePromotion?.selectedBrand?.brand?.name || "Solar Products"}
      </h2>
      <button className="bg-white text-black hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium w-fit">
        Shop now
      </button> */}
    </div>
  </Link>
</div>

        {/* Products grid for mobile - 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 auto-rows-max">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="relative flex flex-col">
              <button className="absolute top-2 right-2 z-10 text-gray-500 hover:text-red-500 bg-white rounded-full p-1">
                <Heart size={16} />
              </button>
              <Link href={`/product/${product.slug}`} className="block group flex-1" onClick={() => handleProductClick(product.id, product.slug)}>
                <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('Image failed to load:', product.image)
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                </div>
                <div className="pr-6 pb-8">
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
      </div>

      {/* Original desktop layout - only visible on lg screens and up */}
      <div className="hidden lg:flex lg:flex-row gap-6">
        {/* Left side - Products (65% width) */}
        <div className="lg:w-[65%] grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <button className="absolute top-2 right-2 z-10 text-gray-500 hover:text-red-500 bg-white rounded-full p-1">
                <Heart size={20} />
              </button>
              <Link href={`/product/${product.slug}`} className="block group" onClick={() => handleProductClick(product.id, product.slug)}>
                <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={180}
                    height={180}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('Image failed to load:', product.image)
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                </div>
                <div className="mb-2">
                  <div className="text-lg font-bold">{formatPrice(product.price)}</div>
                  <h3 className="text-sm line-clamp-2 group-hover:text-[#1a5ca4] transition-colors">{product.name}</h3>
                </div>
              </Link>
              <button
                className="mt-2 flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault()
                  // TODO: Implement add to cart functionality
                  console.log('Add to cart clicked for product:', product.slug)
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Right side - Brand promotion (35% width) */}
        <Link
  href={brandLink}
  className="h-[400px] w-[400px] rounded-lg overflow-hidden relative group hover:shadow-lg transition-all"
  onClick={handleBrandClick}
>
  {/* Background image covering entire card */}
  <div className="absolute inset-0 z-0">
    <Image
      src={desktopImage}
      alt="Brand promotion"
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
    {/* Semi-transparent overlay for better text visibility */}
    <div className="absolute inset-0 "></div>
  </div>

  {/* Content */}
  {/* <div className="p-6 h-full flex flex-col relative z-10">
    <div className="mb-2 text-sm font-semibold text-[#1a5ca4]">{homePromotion?.selectedBrand?.label || "Featured Brand"}</div>
    <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">
      {homePromotion?.selectedBrand?.brand?.name || "Solar Products"}
    </h2>
    <button className="mt-48 bg-white text-black hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium w-fit">
      Shop now
    </button>
  </div> */}
</Link>
      </div>
    </div>
  )
}