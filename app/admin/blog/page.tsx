"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Plus, Search, Edit, Trash2, Eye, Save, Globe, Calendar, Tag, Image, Link as LinkIcon, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Upload, X, Camera } from "lucide-react"
import WarningBanner from "@/components/warning-banner"
import { toast } from "sonner"
import { api } from "@/lib/services/api"

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
  author: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  category: {
    _id: string
    name: {
      en: string
      ur: string
      ps: string
    }
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
  relatedProducts: string[]
  relatedBrands: string[]
  primaryProduct?: string
  primaryBrand?: string
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
    canonicalUrl: string
    focusKeyword: string
  }
  isFeatured: boolean
  isSticky: boolean
  allowComments: boolean
  viewCount: number
  readingTime: number
  publishedAt?: string
  scheduledAt?: string
  createdAt: string
  updatedAt: string
}

interface BlogCategory {
  _id: string
  name: {
    en: string
    ur: string
    ps: string
  }
  slug: string
  description: {
    en: string
    ur: string
    ps: string
  }
  parent?: string
  isActive: boolean
  blogCount: number
}

interface Product {
  _id: string
  name: string
  description: string
}

interface Brand {
  _id: string
  name: string
  description: string
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'ur' | 'ps'>('en')
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [contentImageUploading, setContentImageUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState<any>({
    title: { en: '', ur: '', ps: '' },
    slug: '',
    excerpt: { en: '', ur: '', ps: '' },
    content: { en: '', ur: '', ps: '' },
    featuredImage: {
      url: '',
      alt: { en: '', ur: '', ps: '' }
    },
    status: 'draft',
    tags: [],
    seo: {
      metaTitle: { en: '', ur: '', ps: '' },
      metaDescription: { en: '', ur: '', ps: '' },
      keywords: [],
      canonicalUrl: '',
      focusKeyword: ''
    },
    isFeatured: false,
    isSticky: false,
    allowComments: true,
    relatedProducts: [],
    relatedBrands: []
  })

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const timestamp = Date.now()
        const [blogsRes, categoriesRes, productsRes, brandsRes] = await Promise.all([
          api.get(`/api/blogs?status=all&_t=${timestamp}`),
          api.get('/api/blog-categories?includeInactive=true'),
          api.get('/api/products'),
          api.get('/api/brands/admin/all')
        ])

        const blogsData = blogsRes.data as any
        console.log('📄 Blogs loaded:', blogsData.blogs?.length || 0, 'total blogs')
        setBlogs(blogsData.blogs || [])

        const categoriesData = categoriesRes.data as any
        setCategories(categoriesData.categories || [])

        const productsData = productsRes.data as any
        setProducts(productsData.products || [])

        const brandsData = brandsRes.data as any
        console.log('🏢 Brands loaded:', brandsData)
        setBrands(Array.isArray(brandsData) ? brandsData : brandsData.brands || [])
        
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Handle title change and auto-generate slug
  const handleTitleChange = (value: string, lang: 'en' | 'ur' | 'ps') => {
    setFormData(prev => ({
      ...prev,
      title: {
        ...prev.title!,
        [lang]: value
      },
      slug: lang === 'en' ? generateSlug(value) : prev.slug
    }))
  }

  // Save blog
  const handleSaveBlog = async () => {
    try {
      if (!formData.title?.en.trim()) {
        toast.error('Please enter a title in English')
        return
      }

      if (!formData.category) {
        toast.error('Please select a category')
        return
      }

      if (selectedBlog) {
        // Update existing blog
        await api.put(`/api/blogs/${selectedBlog._id}`, formData)
        toast.success('Blog updated successfully')
      } else {
        // Create new blog
        await api.post('/api/blogs', formData)
        toast.success('Blog created successfully')
      }

      setIsAddDialogOpen(false)
      setSelectedBlog(null)
      setFormData({
        title: { en: '', ur: '', ps: '' },
        slug: '',
        excerpt: { en: '', ur: '', ps: '' },
        content: { en: '', ur: '', ps: '' },
        featuredImage: {
          url: '',
          alt: { en: '', ur: '', ps: '' }
        },
        status: 'draft',
        tags: [],
        seo: {
          metaTitle: { en: '', ur: '', ps: '' },
          metaDescription: { en: '', ur: '', ps: '' },
          keywords: [],
          canonicalUrl: '',
          focusKeyword: ''
        },
        isFeatured: false,
        isSticky: false,
        allowComments: true,
        relatedProducts: [],
        relatedBrands: []
      })
      
      // Refresh blogs list with cache busting
      // Add a small delay to ensure backend has processed the changes
      setTimeout(async () => {
        const timestamp = Date.now()
        const blogsRes = await api.get(`/api/blogs?status=all&_t=${timestamp}`)
        const blogsData = blogsRes.data as any
        console.log('📄 Refreshed blogs after save:', blogsData.blogs?.length || 0, 'blogs')
        setBlogs(blogsData.blogs || [])
      }, 500) // 500ms delay
      
    } catch (error: any) {
      console.error('Error saving blog:', error)
      toast.error(error.response?.data?.message || 'Failed to save blog')
    }
  }

  // Delete blog
  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      await api.delete(`/api/blogs/${blogId}`)
      toast.success('Blog deleted successfully')
      
      // Refresh blogs list with delay and cache busting
      setTimeout(async () => {
        const timestamp = Date.now()
        const blogsRes = await api.get(`/api/blogs?status=all&_t=${timestamp}`)
        const blogsData = blogsRes.data as any
        console.log('📄 Refreshed blogs after delete:', blogsData.blogs?.length || 0, 'blogs')
        setBlogs(blogsData.blogs || [])
      }, 500)
      
    } catch (error: any) {
      console.error('Error deleting blog:', error)
      toast.error(error.response?.data?.message || 'Failed to delete blog')
    }
  }

  // Edit blog
  const handleCreateNewBlog = () => {
    setSelectedBlog(null)
    setFormData({
      title: { en: '', ur: '', ps: '' },
      slug: '',
      excerpt: { en: '', ur: '', ps: '' },
      content: { en: '', ur: '', ps: '' },
      featuredImage: {
        url: '',
        alt: { en: '', ur: '', ps: '' }
      },
      status: 'draft',
      tags: [],
      seo: {
        metaTitle: { en: '', ur: '', ps: '' },
        metaDescription: { en: '', ur: '', ps: '' },
        keywords: [],
        canonicalUrl: '',
        focusKeyword: ''
      },
      isFeatured: false,
      isSticky: false,
      allowComments: true,
      relatedProducts: [],
      relatedBrands: []
    })
    setIsAddDialogOpen(true)
  }

  const handleEditBlog = (blog: Blog) => {
    console.log('🔍 Editing blog:', blog)
    setSelectedBlog(blog)
    
    // Ensure all required fields are properly populated
    const populatedFormData = {
      ...blog,
      title: {
        en: blog.title?.en || '',
        ur: blog.title?.ur || '',
        ps: blog.title?.ps || ''
      },
      excerpt: {
        en: blog.excerpt?.en || '',
        ur: blog.excerpt?.ur || '',
        ps: blog.excerpt?.ps || ''
      },
      content: {
        en: blog.content?.en || '',
        ur: blog.content?.ur || '',
        ps: blog.content?.ps || ''
      },
      featuredImage: {
        url: blog.featuredImage?.url || '',
        alt: {
          en: blog.featuredImage?.alt?.en || '',
          ur: blog.featuredImage?.alt?.ur || '',
          ps: blog.featuredImage?.alt?.ps || ''
        }
      },
      seo: {
        metaTitle: {
          en: blog.seo?.metaTitle?.en || '',
          ur: blog.seo?.metaTitle?.ur || '',
          ps: blog.seo?.metaTitle?.ps || ''
        },
        metaDescription: {
          en: blog.seo?.metaDescription?.en || '',
          ur: blog.seo?.metaDescription?.ur || '',
          ps: blog.seo?.metaDescription?.ps || ''
        },
        keywords: blog.seo?.keywords || [],
        canonicalUrl: blog.seo?.canonicalUrl || '',
        focusKeyword: blog.seo?.focusKeyword || ''
      },
      tags: blog.tags || [],
      relatedProducts: blog.relatedProducts || [],
      relatedBrands: blog.relatedBrands || [],
      primaryProduct: blog.primaryProduct || '',
      primaryBrand: blog.primaryBrand || '',
      category: typeof blog.category === 'object' ? blog.category._id : blog.category,
      status: blog.status || 'draft',
      isFeatured: blog.isFeatured || false,
      isSticky: blog.isSticky || false,
      allowComments: blog.allowComments !== false // Default to true unless explicitly false
    }
    
    console.log('📋 Populated form data:', populatedFormData)
    setFormData(populatedFormData)
    setIsAddDialogOpen(true)
  }

  // Memoized callback for content changes to prevent re-renders
  const handleContentChange = React.useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [activeLanguage]: value
      }
    }))
  }, [activeLanguage])

  // Handle thumbnail upload
  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    try {
      setThumbnailUploading(true)
      const formData = new FormData()
      formData.append('thumbnail', file)

      const response = await api.post('/api/blogs/upload/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          featuredImage: {
            url: response.data.image.url,
            alt: {
              en: prev.title?.en || 'Blog thumbnail',
              ur: prev.title?.ur || '',
              ps: prev.title?.ps || ''
            }
          }
        }))
        toast.success('Thumbnail uploaded successfully!')
      }
    } catch (error: any) {
      console.error('Thumbnail upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload thumbnail')
    } finally {
      setThumbnailUploading(false)
      // Reset input
      event.target.value = ''
    }
  }

  // Handle content image upload
  const handleContentImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    try {
      setContentImageUploading(true)
      const formData = new FormData()
      formData.append('image', file)

      const response = await api.post('/api/blogs/upload/content-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        // Insert the markdown image syntax at the current cursor position
        const imageMarkdown = response.data.image.markdown
        const currentContent = formData.content?.[activeLanguage] || ''
        
        setFormData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            [activeLanguage]: currentContent + '\n\n' + imageMarkdown + '\n\n'
          }
        }))
        
        toast.success('Image uploaded and inserted into content!')
      }
    } catch (error: any) {
      console.error('Content image upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload image')
    } finally {
      setContentImageUploading(false)
      // Reset input
      event.target.value = ''
    }
  }

  // Rich text editor toolbar - memoized to prevent unnecessary re-renders
  const RichTextEditor = React.memo(({ value, onChange, placeholder }: { value: string, onChange: (value: string) => void, placeholder: string }) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    // Memoize the onChange handler to prevent re-creation on every render
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    }, [onChange])

    const insertText = (before: string, after: string = '') => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
      
      onChange(newText)
      
      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + before.length + selectedText.length + after.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }

    const formatText = (format: string) => {
      switch (format) {
        case 'bold':
          insertText('**', '**')
          break
        case 'italic':
          insertText('*', '*')
          break
        case 'underline':
          insertText('<u>', '</u>')
          break
        case 'h1':
          insertText('\n# ', '\n')
          break
        case 'h2':
          insertText('\n## ', '\n')
          break
        case 'h3':
          insertText('\n### ', '\n')
          break
        case 'ul':
          insertText('\n- ')
          break
        case 'ol':
          insertText('\n1. ')
          break
        case 'quote':
          insertText('\n> ', '\n')
          break
        case 'code':
          insertText('`', '`')
          break
        case 'codeblock':
          insertText('\n```\n', '\n```\n')
          break
        case 'link':
          insertText('[', '](https://)')
          break
        case 'image':
          insertText('![alt text](', ')')
          break
        case 'hr':
          insertText('\n---\n')
          break
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Handle common shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault()
            formatText('bold')
            break
          case 'i':
            e.preventDefault()
            formatText('italic')
            break
          case 'k':
            e.preventDefault()
            formatText('link')
            break
        }
      }
      
      // Auto-adjust height
      const textarea = e.target as HTMLTextAreaElement
      setTimeout(() => {
        textarea.style.height = 'auto'
        textarea.style.height = Math.min(textarea.scrollHeight, 500) + 'px'
      }, 0)
    }

    return (
      <div className={`border rounded-lg overflow-hidden transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'}`}>
        {/* Enhanced Toolbar */}
        <div className="flex flex-wrap gap-1 p-3 bg-gray-50 border-b">
          {/* Text Formatting */}
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => formatText('bold')} type="button" title="Bold (Ctrl+B)" className="h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('italic')} type="button" title="Italic (Ctrl+I)" className="h-8 w-8 p-0">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('underline')} type="button" title="Underline" className="h-8 w-8 p-0">
              <Underline className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Headings */}
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => formatText('h1')} type="button" title="Heading 1" className="h-8 px-2 text-xs font-bold">
              H1
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('h2')} type="button" title="Heading 2" className="h-8 px-2 text-xs font-bold">
              H2
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('h3')} type="button" title="Heading 3" className="h-8 px-2 text-xs font-bold">
              H3
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Lists */}
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => formatText('ul')} type="button" title="Bullet List" className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('ol')} type="button" title="Numbered List" className="h-8 w-8 p-0">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('quote')} type="button" title="Quote" className="h-8 px-2 text-xs">
              "
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Code */}
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => formatText('code')} type="button" title="Inline Code" className="h-8 px-2 text-xs font-mono">
              {`<>`}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => formatText('codeblock')} type="button" title="Code Block" className="h-8 px-2 text-xs font-mono">
              {`{}`}
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Links & Media */}
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => formatText('link')} type="button" title="Link (Ctrl+K)" className="h-8 w-8 p-0">
              <LinkIcon className="h-4 w-4" />
            </Button>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleContentImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={contentImageUploading}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                type="button" 
                title={contentImageUploading ? "Uploading..." : "Upload Image"} 
                className="h-8 w-8 p-0"
                disabled={contentImageUploading}
              >
                {contentImageUploading ? (
                  <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => formatText('hr')} type="button" title="Horizontal Rule" className="h-8 px-2 text-xs">
              ---
            </Button>
          </div>
        </div>
        
        {/* Text Area */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="min-h-[300px] max-h-[500px] resize-none border-0 rounded-none bg-white font-mono text-sm leading-relaxed focus:ring-0 focus:border-0"
            style={{ 
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              lineHeight: '1.6'
            }}
          />
          
          {/* Character Count */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/90 px-2 py-1 rounded">
            {value.length} characters
          </div>
        </div>
        
        {/* Preview Toggle & Help */}
        <div className="flex justify-between items-center p-2 bg-gray-50 border-t text-xs text-gray-500">
          <div>
            Markdown supported • Use **bold**, *italic*, [links](url), `code`
          </div>
          <div className="flex gap-2">
            <span>Ctrl+B Bold</span>
            <span>•</span>
            <span>Ctrl+I Italic</span>
            <span>•</span>
            <span>Ctrl+K Link</span>
          </div>
        </div>
      </div>
    )
  })

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.title.ur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.title.ps.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <WarningBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage multilingual blog content with SEO optimization.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Tag className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Blog Categories</DialogTitle>
                <DialogDescription>Manage your blog categories</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{category.name.en}</div>
                      <div className="text-sm text-muted-foreground">{category.blogCount} blogs</div>
                    </div>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateNewBlog}>
                <Plus className="mr-2 h-4 w-4" />
                New Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
                <DialogDescription>
                  Create multilingual blog content with SEO optimization and product/brand associations.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="relations">Relations</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Label>Language:</Label>
                    <Select value={activeLanguage} onValueChange={(value: 'en' | 'ur' | 'ps') => setActiveLanguage(value)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                        <SelectItem value="ps">Pashto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                    <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title ({activeLanguage.toUpperCase()})</Label>
                      <Input
                        id="title"
                        value={formData.title?.[activeLanguage] || ''}
                        onChange={(e) => handleTitleChange(e.target.value, activeLanguage)}
                        placeholder={`Enter title in ${activeLanguage === 'en' ? 'English' : activeLanguage === 'ur' ? 'Urdu' : 'Pashto'}`}
                      />
                    </div>

                    {activeLanguage === 'en' && (
                      <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="blog-post-url"
                        />
                      </div>
                    )}

                    {/* Thumbnail Upload Section */}
                    <div className="grid gap-2">
                      <Label htmlFor="thumbnail">Featured Image / Thumbnail</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={thumbnailUploading}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex items-center gap-2"
                            disabled={thumbnailUploading}
                          >
                            {thumbnailUploading ? (
                              <>
                                <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Upload Thumbnail
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {formData.featuredImage?.url && (
                          <div className="flex items-center gap-2">
                            <div className="relative w-16 h-16 border rounded-lg overflow-hidden">
                              <img
                                src={formData.featuredImage.url}
                                alt="Thumbnail preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                featuredImage: { url: '', alt: { en: '', ur: '', ps: '' } }
                              }))}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Upload a high-quality image (max 5MB) that represents your blog post. Recommended size: 1200x630px
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="excerpt">Excerpt ({activeLanguage.toUpperCase()})</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt?.[activeLanguage] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          excerpt: {
                            ...prev.excerpt!,
                            [activeLanguage]: e.target.value
                          }
                        }))}
                        placeholder={`Brief description in ${activeLanguage === 'en' ? 'English' : activeLanguage === 'ur' ? 'Urdu' : 'Pashto'}`}
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="content">Content ({activeLanguage.toUpperCase()})</Label>
                      <RichTextEditor
                        value={formData.content?.[activeLanguage] || ''}
                        onChange={handleContentChange}
                        placeholder={`Write your blog content in ${activeLanguage === 'en' ? 'English' : activeLanguage === 'ur' ? 'Urdu' : 'Pashto'}...`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={typeof formData.category === 'string' ? formData.category : formData.category?._id}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(cat => cat.isActive).map((category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: 'draft' | 'published' | 'scheduled' | 'archived') => 
                            setFormData(prev => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Label>Language:</Label>
                    <Select value={activeLanguage} onValueChange={(value: 'en' | 'ur' | 'ps') => setActiveLanguage(value)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                        <SelectItem value="ps">Pashto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="metaTitle">Meta Title ({activeLanguage.toUpperCase()})</Label>
                      <Input
                        id="metaTitle"
                        value={formData.seo?.metaTitle?.[activeLanguage] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            metaTitle: {
                              ...prev.seo?.metaTitle,
                              [activeLanguage]: e.target.value
                            }
                          }
                        }))}
                        placeholder="SEO title (max 60 characters)"
                        maxLength={60}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="metaDescription">Meta Description ({activeLanguage.toUpperCase()})</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.seo?.metaDescription?.[activeLanguage] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            metaDescription: {
                              ...prev.seo?.metaDescription,
                              [activeLanguage]: e.target.value
                            }
                          }
                        }))}
                        placeholder="SEO description (max 160 characters)"
                        maxLength={160}
                        rows={3}
                      />
                    </div>

                    {activeLanguage === 'en' && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="focusKeyword">Focus Keyword</Label>
                          <Input
                            id="focusKeyword"
                            value={formData.seo?.focusKeyword || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              seo: {
                                ...prev.seo!,
                                focusKeyword: e.target.value
                              }
                            }))}
                            placeholder="Main SEO keyword"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="canonicalUrl">Canonical URL</Label>
                          <Input
                            id="canonicalUrl"
                            value={formData.seo?.canonicalUrl || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              seo: {
                                ...prev.seo!,
                                canonicalUrl: e.target.value
                              }
                            }))}
                            placeholder="https://example.com/blog/post"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="relations" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="primaryProduct">Primary Product</Label>
                      <Select
                        value={formData.primaryProduct || 'none'}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, primaryProduct: value === 'none' ? undefined : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary product (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {products.map((product) => (
                            <SelectItem key={product._id} value={product._id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="primaryBrand">Primary Brand</Label>
                      <Select
                        value={formData.primaryBrand || 'none'}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, primaryBrand: value === 'none' ? undefined : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary brand (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {brands.length === 0 ? (
                            <SelectItem value="no-brands" disabled>No brands available</SelectItem>
                          ) : (
                            brands.map((brand) => (
                              <SelectItem key={brand._id} value={brand._id}>
                                {brand.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                      />
                      <Label htmlFor="isFeatured">Featured Blog</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isSticky"
                        checked={formData.isSticky}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSticky: checked }))}
                      />
                      <Label htmlFor="isSticky">Sticky Post</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allowComments"
                        checked={formData.allowComments}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowComments: checked }))}
                      />
                      <Label htmlFor="allowComments">Allow Comments</Label>
                    </div>

                    {formData.status === 'scheduled' && (
                      <div className="grid gap-2">
                        <Label htmlFor="scheduledAt">Scheduled Date</Label>
                        <Input
                          id="scheduledAt"
                          type="datetime-local"
                          value={formData.scheduledAt ? new Date(formData.scheduledAt).toISOString().slice(0, 16) : ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveBlog}>
                  <Save className="mr-2 h-4 w-4" />
                  {selectedBlog ? 'Update Blog' : 'Create Blog'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage all your multilingual blog posts and content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{blog.title.en}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{blog.excerpt.en}</div>
                      {blog.isFeatured && <Badge variant="secondary" className="mt-1">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{blog.category?.name.en || 'No Category'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        blog.status === "published" ? "default" : 
                        blog.status === "draft" ? "secondary" : 
                        blog.status === "scheduled" ? "outline" : "destructive"
                      }
                    >
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {blog.title.en && <Badge variant="outline" className="text-xs">EN</Badge>}
                      {blog.title.ur && <Badge variant="outline" className="text-xs">UR</Badge>}
                      {blog.title.ps && <Badge variant="outline" className="text-xs">PS</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{blog.viewCount || 0}</TableCell>
                  <TableCell>
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 
                     blog.status === 'scheduled' && blog.scheduledAt ? `Scheduled: ${new Date(blog.scheduledAt).toLocaleDateString()}` :
                     'Not published'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditBlog(blog)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteBlog(blog._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
