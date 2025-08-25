"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { client, urlForImage } from "../lib/sanity"

type Brand = {
  name: string
  logo: any
  link: string
}

type BrandsData = {
  brand1: Brand
  brand2: Brand
  brand3: Brand
  brand4: Brand
  brand5: Brand
  brand6: Brand
}

type HeadingData = {
  topBrandsHeading: string
}

export default function TopBrands() {
  const [brandsData, setBrandsData] = useState<BrandsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fallback hardcoded brands in case Sanity is not available
  const fallbackBrands: Brand[] = [
    {
      name: "FOX",
      logo: "/fox-logo.webp",
      link: "/brand/FOX"
    },
    {
      name: "Knox",
      logo: "/Knox_logo.png",
      link: "/brand/Knox"
    },
    {
      name: "LuxPower", 
      logo: "/Luxpower-logo.png",
      link: "/brand/LuxPower"
    },
    {
      name: "Ziewnic",
      logo: "/Ziewnic-Logo.png", 
      link: "/brand/Ziewnic"
    },
    {
      name: "1on Inverters",
      logo: "/1on-logo.png",
      link: "/brand/1on"
    },
    {
      name: "Fronus",
      logo: "/fronus-logo.png",
      link: "/brand/Fronus"
    }
  ]

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const sanityBrands = await client.fetch(
          `*[_type == "topBrands"][0] {
            brand1,
            brand2,
            brand3,
            brand4,
            brand5,
            brand6
          }`
        )
        
        console.log("Fetched Brands from Sanity:", sanityBrands)
        setBrandsData(sanityBrands)
        
      } catch (error) {
        console.error("Failed to fetch brands from Sanity:", error)
        setBrandsData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  const [headingData, setHeadingData] = useState<HeadingData | null>(null)

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const data: HeadingData = await client.fetch(
          `*[_type == "homePageContent"][0]{ topBrandsHeading }`
        );
        console.log("Fetched Heading Data:", data);
        setHeadingData(data);
        
      } catch (error) {
        console.error("Failed to fetch Sanity heading:", error);
      }
    };

    fetchHeading();
  }, [])

  const getImageSrc = (brand: Brand) => {
    // If it's a Sanity image object, use urlForImage
    if (brand.logo && typeof brand.logo === 'object' && brand.logo.asset) {
      return urlForImage(brand.logo).width(104).height(80).url()
    }
    // Otherwise it's a static image path
    return brand.logo
  }

  // Convert brandsData to array format
  const getBrandsArray = (): Brand[] => {
    if (brandsData) {
      return [
        brandsData.brand1,
        brandsData.brand2,
        brandsData.brand3,
        brandsData.brand4,
        brandsData.brand5,
        brandsData.brand6
      ].filter(brand => brand && brand.name) // Filter out any empty brands
    }
    return fallbackBrands
  }

  if (loading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold text-[#1a5ca4] mb-4">Loading Brands...</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 h-24 flex items-center justify-center animate-pulse"
            >
              <div className="bg-gray-200 w-18 h-14 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const brands = getBrandsArray()

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-[#1a5ca4] mb-4">{headingData?.topBrandsHeading || "Top Brands"}</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {brands.slice(0, 6).map((brand, index) => (
          <Link
            key={index}
            href={brand.link}
            className="border border-gray-200 rounded-lg p-4 h-24 flex items-center justify-center hover:border-[#1a5ca4] hover:shadow-sm transition-all"
          >
            <div className="text-center">
              <div className="w-18 h-14 mx-auto mb-2 flex items-center justify-center">
                <Image 
                  src={getImageSrc(brand)}
                  alt={`${brand.name} Logo`}
                  width={104}
                  height={80}
                  className="object-contain"
                  unoptimized
                />
              </div>
              {/* <span className="text-sm font-medium">{brand.name}</span> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}