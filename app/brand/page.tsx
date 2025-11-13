import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || ''

async function fetchCategoriesWithBrands() {
  const endpoints = []
  if (API_BASE) endpoints.push(`${API_BASE.replace(/\/$/, '')}/api/category/navigation`)
  if (SITE_BASE) endpoints.push(`${SITE_BASE.replace(/\/$/, '')}/api/category/navigation`)
  // common local fallbacks in case env isn't set during dev
  endpoints.push('http://localhost:3000/api/category/navigation')
  endpoints.push('http://localhost:5000/api/category/navigation')

  for (const url of endpoints) {
    try {
      // Try to fetch from the candidate endpoint
      // Use no-store so we always get fresh navigation data
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.warn('categories/navigation returned', res.status, 'for', url)
        continue
      }
      const json = await res.json()
      const data = json?.categories || json?.data || json || []
      if (Array.isArray(data) && data.length > 0) return data
      // If empty array, keep trying next endpoint
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to fetch categories with brands from', url, err)
      continue
    }
  }

  return []
}

export default async function BrandsPage() {
  const brandCategories = await fetchCategoriesWithBrands()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <img src="/solar-express-logo-07.png" alt="Solar Express" className="h-10 md:h-12" />
        <h1 className="text-3xl font-bold text-[#1a5ca4]">Brands Available at SolarExpress</h1>
      </div>
      <p className="text-lg text-gray-700 mb-8 max-w-3xl">
        Solar Express partners with the world's leading manufacturers to bring you the highest quality solar products.
        Explore our brand partners below.
      </p>

      {brandCategories.length === 0 && (
        <div className="text-center text-muted-foreground">No brands found.</div>
      )}

      {brandCategories.map((category: any, index: number) => (
        <div key={category._id || category.category || index} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{category.name || category.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(category.brands || []).map((brand: any) => {
              // Ensure logo is absolute URL when possible
              const logoUrl = brand.logo && typeof brand.logo === 'string'
                ? (brand.logo.startsWith('http') ? brand.logo : `/uploads/${brand.logo}`)
                : '/default-brand-logo.png'

              return (
                <Link key={brand.slug || brand._id} href={`/brand/${brand.slug}`}>
                  <div className="border rounded-lg p-6 hover:border-[#1a5ca4] transition-colors cursor-pointer">
                    <div className="h-32 flex items-center justify-center mb-4">
                      <div className="w-40 h-20 relative">
                        <Image src={logoUrl} alt={`${brand.name} Logo`} fill style={{ objectFit: 'contain' }} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-center text-[#1a5ca4]">{brand.name}</h3>
                    <div className="mt-4 text-center">
                      <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a]">View Products</Button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

  export async function generateMetadata(): Promise<Metadata> {
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL || ''
    const title = 'Brands at Solar Express'
    const description = 'Explore brand partners and their product ranges at Solar Express.'
    const canonical = siteBase ? `${siteBase.replace(/\/$/, '')}/brand` : undefined
    const image = siteBase ? `${siteBase.replace(/\/$/, '')}/solar-express-logo-07.png` : '/solar-express-logo-07.png'

    return {
      title,
      description,
      openGraph: { title, description, url: canonical, images: [{ url: image }], type: 'website' },
      twitter: { title, description, card: 'summary_large_image', images: [image] },
      alternates: canonical ? { canonical } : undefined,
      robots: { index: true, follow: true }
    }
  }

