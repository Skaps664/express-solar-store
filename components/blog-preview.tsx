"use client"

import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { client } from "@/lib/sanity"

type HeadingData = {
  topBlogsHeading: string
}

type Blog = {
  _id: string
  title: {
    en: string
    ur?: string
    ps?: string
  }
  excerpt: {
    en: string
    ur?: string
    ps?: string
  }
  slug: string
  featuredImage: {
    url: string
    alt?: {
      en: string
      ur?: string
      ps?: string
    }
  }
  category: {
    name: {
      en: string
      ur?: string
      ps?: string
    }
    slug: string
  }
  publishedAt: string
  readingTime?: number
  viewCount?: number
}

type FeaturedBlogsResponse = {
  success: boolean
  blogs: Blog[]
}

export default function BlogPreview() {
  const [headingData, setHeadingData] = useState<HeadingData | null>(null)
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const data: HeadingData = await client.fetch(
          `*[_type == "homePageContent"][0]{ topBlogsHeading }`
        );
        setHeadingData(data);
        
      } catch (error) {
        console.error("Failed to fetch Sanity heading:", error);
      }
    };

    fetchHeading();
  }, [])

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        setLoading(true)
  const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || ''
  const API_BASE = RAW_API_BASE ? RAW_API_BASE.replace(/\/$/, '') : ''
  const buildUrl = (path: string) => API_BASE ? `${API_BASE}${path.startsWith('/') ? path : `/${path}`}` : (path.startsWith('/') ? path : `/${path}`)

  const response = await fetch(buildUrl(`/api/blogs/featured?limit=3`))
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data: FeaturedBlogsResponse = await response.json()
        
        if (data.success && data.blogs) {
          setFeaturedBlogs(data.blogs)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error("Failed to fetch featured blogs:", error)
        setError("Failed to load featured blogs")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedBlogs()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  // Fallback static blogs for when API fails or no featured blogs exist
  const fallbackBlogs = [
    {
      _id: "fallback-1",
      title: { en: "How to Choose the Right Solar Panels for Your Home" },
      excerpt: { en: "Learn about the different types of solar panels available and how to select the best option for your specific needs and budget." },
      slug: "how-to-choose-solar-panels",
      featuredImage: { 
        url: "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: { en: "Solar panels on roof" }
      },
      category: { name: { en: "Guides" }, slug: "guides" },
      publishedAt: "2023-05-10T00:00:00.000Z",
      readingTime: 5,
      viewCount: 150
    },
    {
      _id: "fallback-2", 
      title: { en: "Understanding Net Metering in Pakistan" },
      excerpt: { en: "Everything you need to know about net metering policies in Pakistan and how they can help you maximize your solar investment." },
      slug: "understanding-net-metering",
      featuredImage: { 
        url: "https://images.unsplash.com/photo-1662601272351-f119c97395ef?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: { en: "Solar meter" }
      },
      category: { name: { en: "Policy" }, slug: "policy" },
      publishedAt: "2023-04-25T00:00:00.000Z",
      readingTime: 7,
      viewCount: 200
    },
    {
      _id: "fallback-3",
      title: { en: "Solar Battery Storage: Is It Worth the Investment?" },
      excerpt: { en: "Explore the pros and cons of adding battery storage to your solar system and determine if it's the right choice for your energy needs." },
      slug: "solar-battery-storage-worth-investment",
      featuredImage: { 
        url: "https://images.unsplash.com/photo-1592318348310-f31b61a931c8?q=80&w=1000&auto=format&fit=crop",
        alt: { en: "Solar battery" }
      },
      category: { name: { en: "Technology" }, slug: "technology" },
      publishedAt: "2023-04-12T00:00:00.000Z",
      readingTime: 6,
      viewCount: 120
    },
  ]

  const blogsToShow = featuredBlogs.length > 0 ? featuredBlogs : fallbackBlogs

  if (loading) {
    return (
      <div className="my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1a5ca4]">Loading Featured Blogs...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="h-32 md:h-48 bg-gray-200" />
              <div className="p-3 md:p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a5ca4]">
          {headingData?.topBlogsHeading || "Latest from Our Blog"}
        </h2>
        <Link href="/blog" className="text-[#f26522] font-medium flex items-center gap-1 hover:underline">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">{error}. Showing sample content below.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {blogsToShow.map((blog) => (
          <div
            key={blog._id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-all"
          >
            <div className="h-32 md:h-48 bg-gray-100 relative">
              <Image 
                src={blog.featuredImage?.url || "/placeholder.svg"} 
                alt={blog.featuredImage?.alt?.en || blog.title.en} 
                fill 
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              <div className="absolute top-3 right-3 bg-[#1a5ca4] text-white text-xs px-2 py-1 rounded">
                {blog.category?.name?.en || "General"}
              </div>
            </div>
            <div className="p-3 md:p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-2">
                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                <span>{formatDate(blog.publishedAt)}</span>
                {blog.readingTime && (
                  <>
                    <span>•</span>
                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{blog.readingTime} min read</span>
                  </>
                )}
              </div>
              <h3 className="font-bold text-sm md:text-lg mb-2 text-[#1a5ca4] line-clamp-2">
                {blog.title.en}
              </h3>
              <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                {blog.excerpt.en}
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline" className="flex-1 mr-2 border-[#1a5ca4] text-[#1a5ca4] text-xs md:text-sm" asChild>
                  <Link href={`/blog/${blog.slug}`}>Read More</Link>
                </Button>
                {blog.viewCount && (
                  <span className="text-xs text-gray-500">{blog.viewCount} views</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
