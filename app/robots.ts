import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solarexpress.pk'

  return {
    rules: [
      {
        // AI scrapers and SEO crawlers that only add load
        userAgent: ['GPTBot', 'CCBot', 'Amazonbot', 'AhrefsBot', 'SemrushBot', 'MJ12bot'],
        disallow: '/',
      },
      {
        // Everyone else (Googlebot, AdSense's Mediapartners-Google, Bing, etc.)
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/auth', '/account', '/cart', '/checkout', '/debug', '/debug-promotion', '/test', '/test-auth'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
