"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Eye, Search, Tag, ArrowRight, TrendingUp, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  author: {
    _id: string
    name: string
  }
  category: {
    _id: string
    name: {
      en: string
      ur: string
      ps: string
    }
    slug: string
  }
  featuredImage: {
    url: string
    alt: {
      en: string
      ur: string
      ps: string
    }
  }
  isFeatured: boolean
  isSticky: boolean
  viewCount: number
  readingTime: number
  publishedAt: string
}

interface BlogCategory {
  _id: string
  name: {
    en: string
    ur: string
    ps: string
  }
  slug: string
  isActive: boolean
  blogCount: number
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [language, setLanguage] = useState<'en' | 'ur' | 'ps'>('en')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const blogsPerPage = 9

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch featured blogs
        const featuredResponse = await fetch(`/api/blogs/featured?limit=3`)
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json()
          setFeaturedBlogs(featuredData.blogs || [])
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/blog-categories?active=true')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || [])
        }

        // Fetch regular blogs
        await fetchBlogs()
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchBlogs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: blogsPerPage.toString(),
        status: 'published'
      })

      if (searchTerm) params.set('search', searchTerm)
      if (selectedCategory && selectedCategory !== "all") params.set('category', selectedCategory)

      const response = await fetch(`/api/blogs?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs || [])
        setTotalPages(data.pagination?.pages || 1)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [currentPage, searchTerm, selectedCategory])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const BlogCard = ({ blog, featured = false }: { blog: Blog; featured?: boolean }) => (
    <Card className={`group h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${featured ? 'bg-gradient-to-br from-[#1a5ca4] to-[#0e4a8a] text-white' : 'bg-white hover:bg-gray-50'}`}>
      {blog.featuredImage?.url && (
        <div className={`${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'} relative overflow-hidden`}>
          <Image
            src={blog.featuredImage.url}
            alt={blog.featuredImage.alt?.[language] || blog.title[language] || blog.title.en}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {blog.isFeatured && (
            <Badge className="absolute top-3 left-3 bg-[#f26522] text-white border-0 shadow-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {blog.isSticky && (
            <Badge className="absolute top-3 right-3 bg-[#1a5ca4] text-white border-0 shadow-lg">
              Pinned
            </Badge>
          )}
        </div>
      )}
      <CardHeader className={`${featured ? 'pb-3' : 'pb-2'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={`text-xs border-[#1a5ca4] ${featured ? 'text-white border-white/30 bg-white/10' : 'text-[#1a5ca4] bg-[#1a5ca4]/5'}`}>
            <Tag className="w-3 h-3 mr-1" />
            {blog.category.name[language] || blog.category.name.en}
          </Badge>
          <div className={`flex items-center gap-1 text-xs ${featured ? 'text-white/80' : 'text-gray-500'}`}>
            <Eye className="w-3 h-3" />
            <span>{blog.viewCount}</span>
          </div>
        </div>
        <CardTitle className={`${featured ? 'text-xl text-white' : 'text-lg text-gray-900'} line-clamp-2 group-hover:text-[#f26522] transition-colors ${language === 'ur' || language === 'ps' ? 'text-right' : 'text-left'}`}>
          <Link 
            href={`/blog/${blog.slug}`} 
            className="hover:underline decoration-2 underline-offset-2"
          >
            {blog.title[language] || blog.title.en}
          </Link>
        </CardTitle>
        <CardDescription className={`line-clamp-3 ${featured ? 'text-white/90' : 'text-gray-600'} ${language === 'ur' || language === 'ps' ? 'text-right' : 'text-left'}`}>
          {blog.excerpt[language] || blog.excerpt.en}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1 text-sm ${featured ? 'text-white/80' : 'text-gray-500'}`}>
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
            <div className={`flex items-center gap-1 text-sm ${featured ? 'text-white/80' : 'text-gray-500'}`}>
              <Clock className="w-4 h-4" />
              <span>{blog.readingTime} min</span>
            </div>
          </div>
          <Button 
            variant={featured ? "secondary" : "ghost"} 
            size="sm" 
            className={`${featured ? 'bg-white/10 text-white hover:bg-white/20' : 'text-[#1a5ca4] hover:text-[#f26522] hover:bg-[#1a5ca4]/5'} group/btn`}
            asChild
          >
            <Link href={`/blog/${blog.slug}`}>
              Read More
              <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-14 lg:px-16 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a5ca4] mb-4"></div>
              <div className="text-lg text-[#1a5ca4]">Loading awesome content...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-14 lg:px-16 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a5ca4] to-[#0e4a8a] p-8 md:p-12 mb-12">
          {/* Solar Panel Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-1 h-full">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="bg-white/20 rounded-sm" />
              ))}
            </div>
          </div>

          {/* Content Pattern */}
          <div className="absolute top-4 right-4 w-32 h-32 opacity-20">
            <div className="grid grid-cols-3 gap-2 h-full">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-[#f26522] rounded flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-3xl">
            <Badge className="mb-4 bg-[#f26522] text-white border-0 shadow-lg">
              <BookOpen className="mr-1 h-3 w-3" />
              Solar Knowledge Hub
            </Badge>
            <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white">
              Solar Insights & Expert Advice
            </h1>
            <p className="mb-6 text-lg text-white/90 max-w-2xl">
              Discover the latest trends, technical guides, and industry insights from Pakistan's leading solar energy experts.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-white/80">
                <Users className="w-4 h-4" />
                <span className="text-sm">Expert Authors</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Latest Updates</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">{blogs.length}+ Articles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-8 flex justify-center">
          <div className="flex gap-2 p-1 bg-white rounded-lg shadow-md border">
            <Button
              variant={language === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'bg-[#1a5ca4] text-white' : 'text-[#1a5ca4] hover:bg-[#1a5ca4]/10'}
            >
              English
            </Button>
            <Button
              variant={language === 'ur' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('ur')}
              className={language === 'ur' ? 'bg-[#1a5ca4] text-white' : 'text-[#1a5ca4] hover:bg-[#1a5ca4]/10'}
            >
              اردو
            </Button>
            <Button
              variant={language === 'ps' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('ps')}
              className={language === 'ps' ? 'bg-[#1a5ca4] text-white' : 'text-[#1a5ca4] hover:bg-[#1a5ca4]/10'}
            >
              پښتو
            </Button>
          </div>
        </div>

        {/* Featured Blogs */}
        {featuredBlogs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1 bg-[#f26522] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#1a5ca4]">Featured Articles</h2>
              <TrendingUp className="w-6 h-6 text-[#f26522]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} featured />
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 p-6 bg-white rounded-xl shadow-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#1a5ca4]" />
            <Input
              placeholder="Search articles, topics, guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#1a5ca4]/20 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px] border-[#1a5ca4]/20 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.filter(category => category._id && category._id.trim() !== '').map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name[language] || category.name.en} ({category.blogCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Blog Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 bg-[#1a5ca4] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#1a5ca4]">Latest Articles</h2>
            <BookOpen className="w-6 h-6 text-[#f26522]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>

        {/* No Results */}
        {blogs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#1a5ca4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#1a5ca4]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a5ca4] mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any articles matching your search criteria. Try adjusting your filters or browse all categories.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setCurrentPage(1)
                }}
                className="bg-[#f26522] hover:bg-[#e55511] text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Clear Filters & Browse All
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white"
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`w-10 ${currentPage === page ? 'bg-[#1a5ca4] text-white' : 'border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white'}`}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
