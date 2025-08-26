"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Eye, Share2, Tag, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { parseMarkdown } from "@/lib/markdown"

interface Blog {
  _id: string
  title: {
    en: string
    ur: string
    ps: string
  }
  slug: string
  excerpt: {
    en: string
    ur: string
    ps: string
  }
  content: {
    en: string
    ur: string
    ps: string
  }
  author: {
    _id: string
    name: string
    avatar?: string
  }
  status: string
  category: {
    _id: string
    name: {
      en: string
      ur: string
      ps: string
    }
    slug: string
  }
  tags: Array<{
    en: string
    ur: string
    ps: string
  }>
  featuredImage: {
    url: string
    alt: {
      en: string
      ur: string
      ps: string
    }
  }
  relatedProducts: Array<{
    _id: string
    name: string
    slug: string
    image: string
  }>
  relatedBrands: Array<{
    _id: string
    name: string
    slug: string
    logo: string
  }>
  primaryProduct?: {
    _id: string
    name: string
    slug: string
    images: string[]
    price: number
    originalPrice?: number
    discountPercentage?: number
  }
  primaryBrand?: {
    _id: string
    name: string
    slug: string
    logo: string
    description?: string
  }
  seo: {
    metaTitle: {
      en: string
      ur: string
      ps: string
    }
    metaDescription: {
      en: string
      ur: string
      ps: string
    }
    keywords: string[]
  }
  viewCount: number
  readingTime: number
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<'en' | 'ur' | 'ps'>('en')

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/blogs/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setBlog(data.blog)
          setRelatedBlogs(data.relatedBlogs || [])
        }
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchBlog()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-4">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Language Selector */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('en')}
            disabled={!blog.title.en}
          >
            English
          </Button>
          <Button
            variant={language === 'ur' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('ur')}
            disabled={!blog.title.ur}
          >
            اردو
          </Button>
          <Button
            variant={language === 'ps' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('ps')}
            disabled={!blog.title.ps}
          >
            پښتو
          </Button>
        </div>
      </div>

      {/* Blog Header */}
      <header className="mb-8">
        <div className="mb-4">
          <Badge variant="secondary" className="mb-2">
            <Tag className="w-3 h-3 mr-1" />
            {blog.category.name[language] || blog.category.name.en}
          </Badge>
        </div>
        
        <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' || language === 'ps' ? 'text-right' : 'text-left'}`}>
          {blog.title[language] || blog.title.en}
        </h1>

        <p className={`text-xl text-muted-foreground mb-6 ${language === 'ur' || language === 'ps' ? 'text-right' : 'text-left'}`}>
          {blog.excerpt[language] || blog.excerpt.en}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{blog.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{blog.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{blog.viewCount} views</span>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImage?.url && (
          <div className="mb-8">
            <Image
              src={blog.featuredImage.url}
              alt={blog.featuredImage.alt?.[language] || blog.featuredImage.alt?.en || blog.title[language] || blog.title.en}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </header>

      {/* Blog Content */}
      <div className={`prose prose-lg prose-slate max-w-none mb-12 ${language === 'ur' || language === 'ps' ? 'text-right' : 'text-left'}`}>
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ 
            __html: parseMarkdown(blog.content[language] || blog.content.en) 
          }}
        />
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag[language] || tag.en}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-8" />

      {/* Primary and Related Products */}
      {(blog.primaryProduct || (blog.relatedProducts && blog.relatedProducts.length > 0)) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Featured Products</h3>
          
          {/* Primary Product */}
          {blog.primaryProduct && (
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 text-blue-600">Primary Product</h4>
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {blog.primaryProduct.images?.[0] && (
                      <Image
                        src={blog.primaryProduct.images[0]}
                        alt={blog.primaryProduct.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h5 className="font-medium text-lg">{blog.primaryProduct.name}</h5>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg font-bold text-green-600">
                          PKR {blog.primaryProduct.price?.toLocaleString()}
                        </span>
                        {blog.primaryProduct.originalPrice && blog.primaryProduct.originalPrice > blog.primaryProduct.price && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              PKR {blog.primaryProduct.originalPrice.toLocaleString()}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              {blog.primaryProduct.discountPercentage}% OFF
                            </Badge>
                          </>
                        )}
                      </div>
                      <Button asChild className="mt-3">
                        <Link href={`/product/${blog.primaryProduct.slug}`}>View Product</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Related Products */}
          {blog.relatedProducts && blog.relatedProducts.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-3">Related Products</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blog.relatedProducts.map((product) => (
                  <Card key={product._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium">{product.name}</h5>
                          <Button asChild variant="link" className="p-0 h-auto text-left">
                            <Link href={`/product/${product.slug}`}>View Product</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary and Related Brands */}
      {(blog.primaryBrand || (blog.relatedBrands && blog.relatedBrands.length > 0)) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Featured Brands</h3>
          
          {/* Primary Brand */}
          {blog.primaryBrand && (
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 text-blue-600">Primary Brand</h4>
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {blog.primaryBrand.logo && (
                      <Image
                        src={blog.primaryBrand.logo}
                        alt={blog.primaryBrand.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h5 className="font-medium text-lg">{blog.primaryBrand.name}</h5>
                      {blog.primaryBrand.description && (
                        <p className="text-sm text-gray-600 mt-2">{blog.primaryBrand.description}</p>
                      )}
                      <Button asChild className="mt-3">
                        <Link href={`/brands/${blog.primaryBrand.slug}`}>View Brand</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Related Brands */}
          {blog.relatedBrands && blog.relatedBrands.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-3">Related Brands</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blog.relatedBrands.map((brand) => (
                  <Card key={brand._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        {brand.logo && (
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={60}
                            height={60}
                            className="rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium">{brand.name}</h5>
                          <Button asChild variant="link" className="p-0 h-auto text-left">
                            <Link href={`/brands/${brand.slug}`}>View Brand</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.map((relatedBlog) => (
              <Card key={relatedBlog._id}>
                {relatedBlog.featuredImage?.url && (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={relatedBlog.featuredImage.url}
                      alt={relatedBlog.featuredImage.alt?.[language] || relatedBlog.title[language] || relatedBlog.title.en}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/blog/${relatedBlog.slug}`} className="hover:underline">
                      {relatedBlog.title[language] || relatedBlog.title.en}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {relatedBlog.excerpt[language] || relatedBlog.excerpt.en}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(relatedBlog.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{relatedBlog.readingTime} min</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
