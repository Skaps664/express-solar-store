import Script from 'next/script'

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
}

export function OrganizationSchema({
  name = "Solar Express",
  url = "https://www.solarexpress.pk",
  logo = "https://www.solarexpress.pk/logo.png"
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": "Leading supplier of solar panels, inverters, batteries, and renewable energy solutions in Pakistan",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Urdu"]
    },
    "sameAs": [
      "https://www.facebook.com/solarexpress",
      "https://www.instagram.com/solarexpress"
    ]
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProductSchemaProps {
  product: {
    name: string
    description: string
    image: string
    price: number
    currency?: string
    availability?: string
    brand?: string
    sku?: string
  }
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Solar Express"
    },
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || "PKR",
      "availability": product.availability || "https://schema.org/InStock",
      "url": `https://www.solarexpress.pk/product/${product.sku}`
    }
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BlogSchemaProps {
  blog: {
    title: string
    description: string
    image: string
    datePublished: string
    dateModified: string
    author: string
  }
}

export function BlogSchema({ blog }: BlogSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "image": blog.image,
    "datePublished": blog.datePublished,
    "dateModified": blog.dateModified,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Solar Express",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.solarexpress.pk/logo.png"
      }
    }
  }

  return (
    <Script
      id="blog-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface LocalBusinessSchemaProps {
  name?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  phone?: string
  priceRange?: string
}

export function LocalBusinessSchema({
  name = "Solar Express",
  address = {
    country: "Pakistan"
  },
  phone,
  priceRange = "$$"
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "image": "https://www.solarexpress.pk/logo.png",
    "url": "https://www.solarexpress.pk",
    "telephone": phone,
    "priceRange": priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.state,
      "postalCode": address.zip,
      "addressCountry": address.country
    }
  }

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteSchema({
  url = "https://www.solarexpress.pk",
  name = "Solar Express",
  alternateName = "Solar Express - Solar & Renewable Energy"
}: { url?: string, name?: string, alternateName?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": url,
    "name": name,
    "alternateName": alternateName
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
