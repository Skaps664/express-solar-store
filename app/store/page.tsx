import StoreClient from "./StoreClient"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || ''
  const title = 'Solar Express Store — Solar products in Pakistan'
  const description = 'Browse Solar Express store for panels, inverters, batteries and accessories from leading brands. Fast shipping across Pakistan.'
  const canonical = siteBase ? `${siteBase.replace(/\/$/, '')}/store` : undefined
  const image = siteBase ? `${siteBase.replace(/\/$/, '')}/solar-express-logo-07.png` : '/solar-express-logo-07.png'

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: image }],
      type: 'website',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
      images: [image],
    },
    alternates: canonical ? { canonical } : undefined,
    robots: { index: true, follow: true },
  }

  return metadata
}

export default async function StorePage() {
  return <StoreClient />
}
