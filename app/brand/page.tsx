import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BrandsPage() {
  // Sample brand categories
  const brandCategories = [
    {
      category: "Solar Panels",
      brands: [
        { name: "Jinko Solar", slug: "jinko-solar", logo: "jinko-logo" },
        { name: "Canadian Solar", slug: "canadian-solar", logo: "canadian-logo" },
        { name: "Longi Solar", slug: "longi-solar", logo: "longi-logo" },
        { name: "JA Solar", slug: "ja-solar", logo: "ja-logo" },
      ],
    },
    {
      category: "Inverters",
      brands: [
        { name: "Growatt", slug: "growatt", logo: "growatt-logo" },
        { name: "SMA", slug: "sma", logo: "sma-logo" },
        { name: "Fronius", slug: "fronius", logo: "fronius-logo" },
        { name: "Huawei", slug: "huawei", logo: "huawei-logo" },
      ],
    },
    {
      category: "Batteries",
      brands: [
        { name: "Tesla", slug: "tesla", logo: "tesla-logo" },
        { name: "Pylontech", slug: "pylontech", logo: "pylontech-logo" },
        { name: "LG Chem", slug: "lg-chem", logo: "lg-chem-logo" },
        { name: "BYD", slug: "byd", logo: "byd-logo" },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <img src="/solar-express-logo-07.png" alt="Solar Express" className="h-10 md:h-12" />
        <h1 className="text-3xl font-bold text-[#1a5ca4]">Our Brands</h1>
      </div>
      <p className="text-lg text-gray-700 mb-8 max-w-3xl">
        Solar Express partners with the world's leading manufacturers to bring you the highest quality solar products.
        Explore our brand partners below.
      </p>

      {brandCategories.map((category, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.brands.map((brand) => (
              <Link key={brand.slug} href={`/brand/${brand.slug}`}>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#1a5ca4] transition-colors cursor-pointer">
                  <div className="h-32 flex items-center justify-center mb-4">
                    <div className="text-gray-400">[{brand.logo}]</div>
                  </div>
                  <h3 className="text-xl font-bold text-center text-[#1a5ca4]">{brand.name}</h3>
                  <div className="mt-4 text-center">
                    <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a]">View Products</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
