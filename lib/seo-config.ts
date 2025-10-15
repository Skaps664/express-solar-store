// SEO Configuration for Solar Express

export const siteConfig = {
  name: 'Solar Express',
  description: 'Leading supplier of solar panels, inverters, batteries, and renewable energy solutions in Pakistan',
  url: 'https://www.solarexpress.pk',
  ogImage: 'https://www.solarexpress.pk/og-image.jpg',
  links: {
    facebook: 'https://facebook.com/solarexpress',
    instagram: 'https://instagram.com/solarexpress',
  },
  keywords: [
    'solar panels Pakistan',
    'solar inverters',
    'solar batteries',
    'renewable energy Pakistan',
    'solar products',
    'solar installation',
    'solar energy Pakistan',
    'solar power systems',
    'solar equipment',
    'solar solutions',
    'green energy',
    'sustainable energy',
  ],
}

export const defaultMetadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [siteConfig.ogImage],
  },
}

// Generate product metadata
export function generateProductMetadata(product: any) {
  const title = `${product.name} - Best Price in Pakistan`
  const description = product.description?.slice(0, 160) || `Buy ${product.name} at the best price in Pakistan. Premium quality solar products from Solar Express.`
  
  return {
    title,
    description,
    keywords: [product.name, product.brand?.name, ...siteConfig.keywords],
    openGraph: {
      title,
      description,
      type: 'product' as const,
      images: [
        {
          url: product.images?.[0] || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [product.images?.[0] || siteConfig.ogImage],
    },
  }
}

// Generate blog metadata
export function generateBlogMetadata(blog: any, language: 'en' | 'ur' | 'ps' = 'en') {
  const title = blog.title[language] || blog.title.en
  const description = blog.excerpt[language] || blog.excerpt.en
  
  return {
    title,
    description,
    keywords: [...(blog.seo?.keywords || []), ...siteConfig.keywords],
    openGraph: {
      title,
      description,
      type: 'article' as const,
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author?.name],
      images: [
        {
          url: blog.featuredImage?.url || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [blog.featuredImage?.url || siteConfig.ogImage],
    },
  }
}

// Generate brand metadata
export function generateBrandMetadata(brand: any) {
  const title = `${brand.name} Products - Best Prices in Pakistan`
  const description = brand.description?.slice(0, 160) || `Shop ${brand.name} solar products at the best prices in Pakistan. Premium quality from Solar Express.`
  
  return {
    title,
    description,
    keywords: [brand.name, 'solar products', ...siteConfig.keywords],
    openGraph: {
      title,
      description,
      type: 'website' as const,
      images: [
        {
          url: brand.logo || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: brand.name,
        },
      ],
    },
  }
}
