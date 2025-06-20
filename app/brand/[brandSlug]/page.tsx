"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Filter, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import InBrandAd from "@/components/inBrandAd"
import { useState, use } from "react"

// Sample brand data - in a real app, this would come from a database or API
const brandsData = {
  "jinko-solar": {
    name: "Jinko Solar",
    logo: "/jinko-logo.webp",
    banner: "/bann-4.jpg", // Desktop banner
    mobileBanner: "/bann-1.jpg", // Mobile banner

    description:
      "Jinko is one of the largest and most innovative solar module manufacturers in the world. With a strong global presence, Jinko Solar is known for its high-efficiency panels and commitment to quality and innovation.",
    established: 2006,
    headquarters: "Shanghai, China",
    warranty: "12-year product warranty, 25-year performance warranty",
    categories: ["Mono PERC Panels", "Bifacial Panels", "N-Type Panels", "Tiger Neo Series"],
    featuredProducts: [
      {
        id: "jinko-tiger-neo",
        name: "Jinko 550W Tiger Neo N-Type Solar Panel",
        price: 42500,
        discountPrice: 39999,
        image: "jinko-panel-1",
      },
      {
        id: "jinko-eagle-bifacial",
        name: "Jinko 535W Eagle Bifacial Solar Panel",
        price: 41000,
        discountPrice: null,
        image: "jinko-panel-2",
      },
      {
        id: "jinko-residential",
        name: "Jinko 410W All Black Residential Panel",
        price: 32000,
        discountPrice: 29999,
        image: "jinko-panel-3",
      },
      {
        id: "jinko-commercial",
        name: "Jinko 600W Tiger Pro Commercial Panel",
        price: 48000,
        discountPrice: null,
        image: "jinko-panel-4",
      },
    ],
  },
  "canadian-solar": {
    name: "Canadian Solar",
    logo: "canadian-logo",
    banner: "/canadian-banner.jpg", // Desktop banner
    mobileBanner: "/canadian-banner-mobile.jpg", // Mobile banner
    description:
      "Canadian Solar is one of the world's largest solar technology and renewable energy companies. They are a leading manufacturer of solar photovoltaic modules and provider of solar energy solutions with operations across the globe.",
    established: 2001,
    headquarters: "Ontario, Canada",
    warranty: "12-year product warranty, 25-year performance warranty",
    categories: ["HiKu Panels", "BiHiKu Panels", "All Black Panels", "Commercial Panels"],
    featuredProducts: [
      {
        id: "canadian-bihiku",
        name: "Canadian Solar 540W BiHiKu Bifacial Panel",
        price: 45000,
        discountPrice: 42500,
        image: "canadian-panel-1",
      },
      {
        id: "canadian-hiku",
        name: "Canadian Solar 450W HiKu Mono PERC Panel",
        price: 36000,
        discountPrice: null,
        image: "canadian-panel-2",
      },
      {
        id: "canadian-residential",
        name: "Canadian Solar 400W All Black Residential Panel",
        price: 30000,
        discountPrice: 28500,
        image: "canadian-panel-3",
      },
      {
        id: "canadian-commercial",
        name: "Canadian Solar 590W HiKu6 Commercial Panel",
        price: 47000,
        discountPrice: null,
        image: "canadian-panel-4",
      },
    ],
  },
  "longi-solar": {
    name: "Longi Solar",
    logo: "longi-logo",
    banner: "/longi-banner.jpg", // Desktop banner
    mobileBanner: "/longi-banner-mobile.jpg", // Mobile banner
    description:
      "LONGi Solar is the world's largest manufacturer of high-efficiency mono-crystalline solar cells and modules. The company focuses on technological innovation and has set multiple world records for cell efficiency.",
    established: 2000,
    headquarters: "Xi'an, China",
    warranty: "12-year product warranty, 25-year performance warranty",
    categories: ["Hi-MO 5 Series", "Hi-MO 6 Series", "Residential Panels", "Commercial Panels"],
    featuredProducts: [
      {
        id: "longi-himo5",
        name: "Longi 500W Hi-MO 5 Mono PERC Module",
        price: 39999,
        discountPrice: 37500,
        image: "longi-panel-1",
      },
      {
        id: "longi-himo6",
        name: "Longi 430W Hi-MO 6 Residential Panel",
        price: 34000,
        discountPrice: null,
        image: "longi-panel-2",
      },
      {
        id: "longi-residential",
        name: "Longi 415W All Black Residential Panel",
        price: 32500,
        discountPrice: 30000,
        image: "longi-panel-3",
      },
      {
        id: "longi-commercial",
        name: "Longi 570W Hi-MO 5m Commercial Panel",
        price: 46000,
        discountPrice: null,
        image: "longi-panel-4",
      },
    ],
  },
  "ja-solar": {
    name: "JA Solar",
    logo: "ja-logo",
    banner: "/ja-banner.jpg", // Desktop banner
    mobileBanner: "/ja-banner-mobile.jpg", // Mobile banner
    description:
      "JA Solar is a manufacturer of high-performance photovoltaic products. The company has 12 manufacturing bases and more than 20 branches around the world, with products available in 135 countries and regions worldwide.",
    established: 2005,
    headquarters: "Beijing, China",
    warranty: "12-year product warranty, 25-year performance warranty",
    categories: ["MBB Half-Cell", "Bifacial Modules", "All Black Series", "Commercial Series"],
    featuredProducts: [
      {
        id: "ja-mbb",
        name: "JA Solar 530W MBB Half-Cell Module",
        price: 41200,
        discountPrice: 38500,
        image: "ja-panel-1",
      },
      {
        id: "ja-bifacial",
        name: "JA Solar 545W Bifacial Module",
        price: 43000,
        discountPrice: null,
        image: "ja-panel-2",
      },
      {
        id: "ja-residential",
        name: "JA Solar 410W All Black Residential Panel",
        price: 31500,
        discountPrice: 29000,
        image: "ja-panel-3",
      },
      {
        id: "ja-commercial",
        name: "JA Solar 580W Commercial Panel",
        price: 46500,
        discountPrice: null,
        image: "ja-panel-4",
      },
    ],
  },
  sorotec: {
    name: "sorotec",
    logo: "/sorotec-logo.png",
    banner: "/bann-3.png", // Desktop banner
    mobileBanner: "/bann-3-mobile.png", // Mobile banner
    description:
      "Sorotec is a global leader in smart energy solutions, specializing in residential and commercial solar inverters, storage systems, and smart energy management solutions. The company is known for its reliable and cost-effective products.",
    established: 2010,
    headquarters: "Shenzhen, China",
    warranty: "5-10 year standard warranty, extendable to 20 years",
    categories: ["String Inverters", "Hybrid Inverters", "Microinverters", "Commercial Inverters"],
    featuredProducts: [
      {
        id: "sorotec-hybrid",
        name: "Sorotec 5kW SPF 5000ES Hybrid Inverter",
        price: 185000,
        discountPrice: 175000,
        image: "/prod-1.jpg",
      },
      {
        id: "sorotec-string",
        name: "Sorotec 8kW MIN 8000TL-X String Inverter",
        price: 150000,
        discountPrice: null,
        image: "/prod-2.jpg",
      },
      {
        id: "sorotec-lvm",
        name: "Sorotec 3kW SPF 3000TL LVM-ES Inverter",
        price: 120000,
        discountPrice: 110000,
        image: "/prod-3.jpg",
      },
    ],
  },
  // Add more brands as needed
}

// Format price in PKR with commas
const formatPrice = (price) => {
  return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export default function BrandPage({ params }) {
  // Unwrap the params promise
  const unwrappedParams = use(params)
  const { brandSlug } = unwrappedParams
  
  const brand = brandsData[brandSlug]
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Handle case where brand doesn't exist
  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Brand Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the brand you're looking for.</p>
        <Button asChild>
          <Link href="/store">Return to Store</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-[#1a5ca4]">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <Link href="/store" className="text-gray-500 hover:text-[#1a5ca4]">
          Store
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-[#1a5ca4]">{brand.name}</span>
      </div>

      {/* Brand Cover Photo/Banner - Two different banners for mobile and desktop */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 mb-6 overflow-hidden rounded-lg shadow-md">
        {/* Desktop banner - hidden on mobile */}
        <div className="absolute inset-0 hidden sm:block">
          <Image 
              src={brand.banner} 
              alt={`${brand.name} Banner`} 
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority
          />
        </div>
        
        {/* Mobile banner - hidden on desktop */}
        <div className="absolute inset-0 block sm:hidden">
          <Image 
              src={brand.mobileBanner || brand.banner} 
              alt={`${brand.name} Mobile Banner`} 
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority
          />
        </div>
        
        {/* Semi-transparent overlay for text readability */}
        <div className="absolute inset-0"></div>
      </div>

      {/* Brand Header - Optimized for mobile */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mb-6 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Logo - Smaller on mobile */}
        <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gray-100 rounded-lg relative flex-shrink-0">
          <Image 
            src={brand.logo.startsWith('/') ? brand.logo : `/${brand.logo}.webp`}
            alt={`${brand.name} Logo`}
            layout="fill"
            objectFit="contain"
            className="p-2 sm:p-4"
          />
        </div>
        {/* Brand Info - Compact on mobile */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-[#1a5ca4]">{brand.name}</h1>
          {/* Description - Shorter on mobile */}
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-none">
            {brand.description}
          </p>
          {/* Info Grid - Stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="text-center sm:text-left">
              <span className="font-medium text-gray-700">Est:</span> {brand.established}
            </div>
            <div className="text-center sm:text-left">
              <span className="font-medium text-gray-700">HQ:</span> {brand.headquarters}
            </div>
            <div className="text-center sm:text-left">
              <span className="font-medium text-gray-700">Warranty:</span> 
              <span className="hidden sm:inline"> {brand.warranty}</span>
              <span className="sm:hidden"> Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="featured" className="mb-12">
        <TabsList className="w-full justify-start border-b overflow-x-auto">
          <TabsTrigger value="featured" className="text-xs sm:text-sm">Featured</TabsTrigger>
          <TabsTrigger value="all" className="text-xs sm:text-sm">All Products</TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">About</TabsTrigger>
          <TabsTrigger value="support" className="text-xs sm:text-sm">Support</TabsTrigger>
        </TabsList>

        {/* Featured Products Tab */}
        <TabsContent value="featured" className="pt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Featured Products from {brand.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {brand.featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-colors">
                  <div className="h-32 sm:h-48 bg-gray-100 relative">
                    <Image 
                      src={product.image.startsWith('/') ? product.image : `/products/${product.image}.jpg`}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="p-2 sm:p-4">
                    <h3 className="font-medium mb-2 line-clamp-2 text-xs sm:text-sm h-8 sm:h-12">{product.name}</h3>
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      {product.discountPrice ? (
                        <>
                          <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.discountPrice)}</span>
                          <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <Button className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] text-xs sm:text-sm py-1 sm:py-2">Add to Cart</Button>
                  </div>
                </div>
              </Link>
            ))}
            
          </div>
          <InBrandAd/>
        </TabsContent>

        {/* All Products Tab */}
        <TabsContent value="all" className="pt-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile filter toggle button - only shown on mobile */}
            <div className="lg:hidden">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Categories sidebar - Hidden on mobile by default, shown when toggled */}
            {(showMobileFilters || window.innerWidth >= 1024) && (
              <div className="w-full lg:w-1/4">
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold mb-4 text-sm sm:text-base">Categories</h3>
                  <ul className="space-y-2">
                    {brand.categories.map((category, index) => (
                      <li key={index}>
                        <a href="#" className="text-gray-700 hover:text-[#1a5ca4] text-sm">
                          {category}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-bold mt-6 mb-4 text-sm sm:text-base">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="price1" className="mr-2" />
                      <label htmlFor="price1" className="text-sm">Under PKR 30,000</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price2" className="mr-2" />
                      <label htmlFor="price2" className="text-sm">PKR 30,000 - 40,000</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price3" className="mr-2" />
                      <label htmlFor="price3" className="text-sm">PKR 40,000 - 50,000</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price4" className="mr-2" />
                      <label htmlFor="price4" className="text-sm">Over PKR 50,000</label>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-[#1a5ca4] hover:bg-[#0e4a8a] text-sm">Apply Filters</Button>
                </div>
              </div>
            )}

            {/* Products grid */}
            <div className="w-full lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                <div>
                  <span className="text-gray-600 text-sm">Showing 1-8 of 24 products</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort by:</span>
                  <select className="border rounded p-1 text-sm">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="flex gap-1 sm:gap-2">
                  <Button variant="outline" size="sm" disabled className="text-xs sm:text-sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-[#1a5ca4] text-white text-xs sm:text-sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="pt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">About {brand.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">{brand.description}</p>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                With a strong commitment to quality and innovation, {brand.name} has established itself as a leading
                manufacturer in the solar industry since {brand.established}.
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                Headquartered in {brand.headquarters}, {brand.name} products are known for their reliability,
                efficiency, and excellent warranty terms, including {brand.warranty}.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg h-48 sm:h-64 relative">
              <Image 
                src={`/brands/${brandSlug}-story.jpg`}
                alt={`${brand.name} Story`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Why Choose {brand.name}?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">Quality Assurance</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  Rigorous testing and quality control processes ensure that all {brand.name} products meet the highest
                  standards of performance and durability.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">Innovation</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  Continuous investment in R&D keeps {brand.name} at the forefront of solar technology, delivering
                  cutting-edge solutions to customers worldwide.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">Global Presence</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  With operations in multiple countries, {brand.name} has a strong global network that ensures reliable
                  service and support wherever you are.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="pt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{brand.name} Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Warranty Information</h3>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                {brand.name} products come with {brand.warranty}. Our warranty covers manufacturing defects and ensures
                that your solar products perform as expected.
              </p>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] text-sm sm:text-base">Download Warranty Document</Button>
            </div>
            <div className="p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Technical Support</h3>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                Need help with your {brand.name} products? Our technical support team is here to assist you with
                installation, troubleshooting, and maintenance.
              </p>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] text-sm sm:text-base">Contact Support</Button>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">How do I register my {brand.name} product?</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  You can register your product on the official {brand.name} website or through our customer service
                  portal. Registration is important to activate your warranty.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">What maintenance do {brand.name} products require?</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  Most {brand.name} products require minimal maintenance. Regular cleaning to remove dust and debris is
                  recommended to maintain optimal performance.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">How can I verify if my {brand.name} product is genuine?</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  All {brand.name} products come with unique serial numbers that can be verified through the official
                  website or by contacting authorized dealers like Solar Express.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}