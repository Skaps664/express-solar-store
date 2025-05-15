import Link from "next/link"
import Image from "next/image"

export default function TopBrands() {
  const brands = [
    {
      name: "Fronus",
      slug: "Fronus",
      logo: "/fronus-logo.png" // Add your image path
    },
    {
      name: "Knox",
      slug: "Knox",
      logo: "/Knox_logo.png" // Add your image path
    },
    {
      name: "LuxPower",
      slug: "LuxPower",
      logo: "/Luxpower-logo.png" // Add your image path
    },
    {
      name: "Ziewnic",
      slug: "Ziewnic",
      logo: "/Ziewnic-Logo.png" // Add your image path
    },
    {
      name: "1on Inverters",
      slug: "1on",
      logo: "/1on-logo.png" // Add your image path
    },
    {
      name: "SMA",
      slug: "sma",
      logo: "/brand-logos/sma-logo.png" // Add your image path
    },
  ]

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-[#1a5ca4] mb-4">Top Brands</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {brands.map((brand, index) => (
          <Link
            key={index}
            href={`/brand/${brand.slug}`}
            className="border border-gray-200 rounded-lg p-4 h-24 flex items-center justify-center hover:border-[#1a5ca4] hover:shadow-sm transition-all"
          >
            <div className="text-center">
              <div className="w-18 h-14 mx-auto mb-2 flex items-center justify-center">
                <Image 
                  src={brand.logo}
                  alt={`${brand.name} Logo`}
                  width={104}
                  height={80}
                  className="object-contain"
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