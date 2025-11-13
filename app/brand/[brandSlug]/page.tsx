import BrandClient from "./BrandClient"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { brandSlug: string } }): Promise<Metadata> {
  const resolved = await params
  const slug = resolved.brandSlug

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL || ''
    if (!apiBase) return { title: 'Brand' }

    const res = await fetch(`${apiBase}/api/brands/${slug}`, { cache: 'no-store' })
    const json = await res.json()
    const b = json?.data || json
    if (b) {
      const title = b.seo?.metaTitle || b.name || 'Brand'
      const description = b.seo?.metaDescription || b.description || ''
      const image = b.seo?.ogImage || b.logo || b.banner || undefined
      const canonical = siteBase ? `${siteBase.replace(/\/$/, '')}/brand/${b.slug || slug}` : undefined

      let languages: Record<string, string> | undefined = undefined
      if (siteBase && Array.isArray(b.availableLanguages) && b.availableLanguages.length > 0) {
        languages = b.availableLanguages.reduce((acc: Record<string, string>, code: string) => {
          acc[code] = `${siteBase.replace(/\/$/, '')}/brand/${b.slug}${code === 'en' ? '' : `?lang=${code}`}`
          return acc
        }, {})
      }

      const metadata: Metadata = {
        title,
        description,
        openGraph: {
          title,
          description,
          url: canonical,
          images: image ? [{ url: image }] : undefined,
          type: 'website',
        },
        twitter: {
          title,
          description,
          card: image ? 'summary_large_image' : 'summary',
          images: image ? [image] : undefined,
        },
        alternates: canonical ? { canonical, languages } : (languages ? { languages } : undefined),
        robots: { index: true, follow: true },
      }

      return metadata
    }
  } catch (err) {
    // non-fatal
    // eslint-disable-next-line no-console
    console.warn('generateMetadata(brand) error:', err)
  }

  return { title: 'Brand' }
}

export default async function BrandPage({ params }: { params: { brandSlug: string } }) {
  const slug = (await params).brandSlug
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? ''

  let brand = null
  try {
    if (apiBase) {
      const res = await fetch(`${apiBase}/api/brands/${slug}`, { cache: 'no-store' })
      const json = await res.json()
      brand = json?.data || json
    }
  } catch (e) {
    // ignore; client will fetch as fallback
    // eslint-disable-next-line no-console
    console.warn('Server fetch brand failed:', e)
  }

  // Build JSON-LD Brand schema + BreadcrumbList
  let jsonLd: any = null
  if (brand) {
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL || ''
    const url = siteBase ? `${siteBase.replace(/\/$/, '')}/brand/${brand.slug || slug}` : undefined
    const logo = brand.logo || brand.seo?.ogImage || undefined

    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: brand.name,
          url: url,
          logo: logo ? [logo] : undefined,
          description: brand.seo?.metaDescription || brand.description || undefined,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteBase ? `${siteBase.replace(/\/$/, '')}/` : undefined },
            { '@type': 'ListItem', position: 2, name: 'Brands', item: siteBase ? `${siteBase.replace(/\/$/, '')}/brand` : undefined },
            { '@type': 'ListItem', position: 3, name: brand.name, item: url || undefined }
          ].filter(Boolean),
        }
      ]
    }
  }

  return (
    <div>
      {jsonLd && (
        <script key="ld-json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <BrandClient initialBrand={brand} initialFeaturedProducts={brand?.featuredProducts || []} initialAllProducts={[]} />
    </div>
  )
}