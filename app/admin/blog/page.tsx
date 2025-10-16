"use client"

import React, { useState, useEffect } from "react"
import RichTextEditor from './components/rich-text-editor'
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
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur' | 'ps'>('en')
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
          api.get('/api/products/admin/all?limit=1000'),
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

  // Generate a transliterated slug for non-English titles
  const generateNonEnglishSlug = (title: string, lang: 'ur' | 'ps') => {
    // For Urdu/Pashto, create a slug with timestamp and language prefix
    const timestamp = Date.now()
    const langPrefix = lang === 'ur' ? 'urdu' : 'pashto'
    // Remove all non-ASCII and special characters, keep only basic alphanumeric
    const cleaned = title.replace(/[^a-zA-Z0-9\s]/g, '').trim()
    const shortTitle = cleaned.substring(0, 20).toLowerCase().replace(/\s+/g, '-').replace(/-+$/, '')
    // If no ASCII characters remain, just use blog
    const titlePart = shortTitle && shortTitle.length > 0 ? shortTitle : 'blog'
    return `${langPrefix}-${titlePart}-${timestamp}`
  }

  // Handle title change and auto-generate slug
  const handleTitleChange = (value: string) => {
    let newSlug = formData.slug
    
    // Auto-generate slug based on language
    if (selectedLanguage === 'en') {
      newSlug = generateSlug(value)
    } else if (value.trim() && !formData.slug) {
      // For Urdu/Pashto, generate slug on first title entry
      newSlug = generateNonEnglishSlug(value, selectedLanguage)
    }
    
    setFormData((prev: any) => ({
      ...prev,
      title: {
        ...prev.title!,
        [selectedLanguage]: value
      },
      slug: newSlug
    }))
  }

  // Save blog
  const handleSaveBlog = async () => {
    try {
      if (!formData.title?.[selectedLanguage].trim()) {
        const langName = selectedLanguage === 'en' ? 'English' : selectedLanguage === 'ur' ? 'Urdu' : 'Pashto'
        toast.error(`Please enter a title in ${langName}`)
        return
      }

      if (!formData.category) {
        toast.error('Please select a category')
        return
      }

      // Prepare payload: convert empty strings to null for primary fields
      // Set primaryLanguage and availableLanguages
      // For non-English blogs, copy Urdu/Pashto content to English fields (backend requirement)
      const blogData = {
        ...formData,
        title: {
          en: selectedLanguage === 'en' ? formData.title.en : formData.title[selectedLanguage], // Fallback for backend validation
          ur: formData.title.ur,
          ps: formData.title.ps
        },
        excerpt: {
          en: selectedLanguage === 'en' ? formData.excerpt.en : formData.excerpt[selectedLanguage], // Fallback for backend validation
          ur: formData.excerpt.ur,
          ps: formData.excerpt.ps
        },
        content: {
          en: selectedLanguage === 'en' ? formData.content.en : formData.content[selectedLanguage], // Fallback for backend validation
          ur: formData.content.ur,
          ps: formData.content.ps
        },
        slug: formData.slug || generateNonEnglishSlug(formData.title[selectedLanguage], selectedLanguage as 'ur' | 'ps'),
        primaryLanguage: selectedLanguage,
        availableLanguages: [selectedLanguage],
        primaryProduct: formData.primaryProduct === '' ? null : formData.primaryProduct,
        primaryBrand: formData.primaryBrand === '' ? null : formData.primaryBrand,
        relatedProducts: formData.relatedProducts || []
      };

      // If editing an existing blog, send PUT to /api/blogs/:id, else POST to create
      let response
      if (selectedBlog && selectedBlog._id) {
        response = await api.put(`/api/blogs/${selectedBlog._id}`, blogData)
      } else {
        response = await api.post('/api/blogs', blogData)
      }
      toast.success('Blog saved successfully')

      handleCloseDialog()
      
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
  // Function to handle dialog closing and cleanup
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setSelectedBlog(null);
    setSelectedLanguage('en'); // Reset language selection
    // Reset form data to default state
    setFormData({
      title: { en: '', ur: '', ps: '' },
      slug: '',
      excerpt: { en: '', ur: '', ps: '' },
      content: { en: '', ur: '', ps: '' },
      category: '',
      status: 'draft',
      featuredImage: {
        url: '',
        alt: { en: '', ur: '', ps: '' }
      },
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
    });
    // Clear focus issues
    setTimeout(() => {
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }
      document.body.focus();
    }, 100);

    // Also ensure any leftover TinyMCE dialogs/backdrops are removed and
    // pointer-events on the body are restored. TinyMCE may append modal
    // elements to the document body and sometimes they remain after
    // closing, blocking clicks until a full refresh.
    setTimeout(() => {
      try {
        // Try to close any open TinyMCE window manager dialogs
        const win: any = window as any
        if (win?.tinymce?.activeEditor?.windowManager) {
          try {
            win.tinymce.activeEditor.windowManager.close();
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        // ignore
      }

      // Remove common TinyMCE modal/backdrop nodes if they were left behind
      document.querySelectorAll('.tox-dialog__backdrop, .tox-dialog, .tox-collection, .tox-collection__menu').forEach(el => {
        try { el.parentNode?.removeChild(el); } catch (e) { /* ignore */ }
      });

      // Restore pointer events on body just in case
      try { document.body.style.pointerEvents = 'auto'; } catch (e) { /* ignore */ }
    }, 200);
  };

  const handleCreateNewBlog = () => {
    setSelectedBlog(null)
    setSelectedLanguage('en') // Reset to English by default
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
    
    // Detect which language this blog is in (check which fields are populated)
    const detectedLanguage = blog.title.ur ? 'ur' : blog.title.ps ? 'ps' : 'en'
    setSelectedLanguage(detectedLanguage)
    
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
      relatedProducts: (blog.relatedProducts || []).map((product: any) => 
        typeof product === 'object' && product._id ? product._id : product
      ),
      relatedBrands: (blog.relatedBrands || []).map((brand: any) => 
        typeof brand === 'object' && brand._id ? brand._id : brand
      ),
      primaryProduct: typeof blog.primaryProduct === 'object' && (blog.primaryProduct as any)?._id 
        ? (blog.primaryProduct as any)._id 
        : blog.primaryProduct || undefined,
      primaryBrand: typeof blog.primaryBrand === 'object' && (blog.primaryBrand as any)?._id 
        ? (blog.primaryBrand as any)._id 
        : blog.primaryBrand || undefined,
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
        [selectedLanguage]: value
      }
    }))
  }, [selectedLanguage])

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
        const currentContent = formData.content?.[selectedLanguage] || ''
        
        setFormData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            [selectedLanguage]: currentContent + '\n\n' + imageMarkdown + '\n\n'
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
      {/* <WarningBanner /> */}
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
          <Dialog 
            open={isAddDialogOpen} 
            onOpenChange={(open) => {
              if (!open) {
                handleCloseDialog();
              } else {
                setIsAddDialogOpen(true);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={handleCreateNewBlog}>
                <Plus className="mr-2 h-4 w-4" />
                New Blog
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto"
              onPointerDownOutside={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>{selectedBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
                <DialogDescription>
                  Create blog content with SEO optimization and product/brand associations.
                </DialogDescription>
              </DialogHeader>
              
              {/* Language Selection - Only when creating new blog */}
              {!selectedBlog && (
                <div className="border-b pb-4 mb-4">
                  
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant={selectedLanguage === 'en' ? 'default' : 'outline'}
                      onClick={() => setSelectedLanguage('en')}
                      className="h-20 flex flex-col items-center justify-center gap-2"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="font-medium">English</span>
                    </Button>
                    <Button
                      type="button"
                      variant={selectedLanguage === 'ur' ? 'default' : 'outline'}
                      onClick={() => setSelectedLanguage('ur')}
                      className="h-20 flex flex-col items-center justify-center gap-2 font-urdu"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="font-medium">اردو</span>
                    </Button>
                    <Button
                      type="button"
                      variant={selectedLanguage === 'ps' ? 'default' : 'outline'}
                      onClick={() => setSelectedLanguage('ps')}
                      className="h-20 flex flex-col items-center justify-center gap-2 font-urdu"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="font-medium">پښتو</span>
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Show selected language indicator when editing */}
              {selectedBlog && (
                <div className="border-b pb-4 mb-4">
                  <Label className="text-base font-semibold mb-2 block">Blog Language</Label>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {selectedLanguage === 'en' ? '🌐 English' : selectedLanguage === 'ur' ? '🇵🇰 اردو (Urdu)' : '🇦🇫 پښتو (Pashto)'}
                  </Badge>
                </div>
              )}
              
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="relations">Relations</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">
                        Title {selectedLanguage === 'en' ? '' : `(${selectedLanguage === 'ur' ? 'اردو' : 'پښتو'})`}
                      </Label>
                      <Input
                        id="title"
                        value={formData.title?.[selectedLanguage] || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder={selectedLanguage === 'en' ? 'Enter blog title in English' : selectedLanguage === 'ur' ? 'عنوان درج کریں' : 'سرلیک دلته ولیکئ'}
                        className={selectedLanguage !== 'en' ? 'font-urdu text-right' : ''}
                        dir={selectedLanguage !== 'en' ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="slug">Slug {selectedLanguage !== 'en' && '(Auto-generated)'}</Label>
                      <Input
                        id="slug"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder={selectedLanguage === 'en' ? 'blog-post-url' : 'Auto-generated from title'}
                        readOnly={selectedLanguage !== 'en'}
                        className={selectedLanguage !== 'en' ? 'bg-muted cursor-not-allowed' : ''}
                      />
                      {selectedLanguage !== 'en' && (
                        <p className="text-xs text-muted-foreground">
                          Slug will be automatically generated when you save the blog
                        </p>
                      )}
                    </div>

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
                      <Label htmlFor="excerpt">
                        Excerpt {selectedLanguage === 'en' ? '' : `(${selectedLanguage === 'ur' ? 'اردو' : 'پښتو'})`}
                      </Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt?.[selectedLanguage] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          excerpt: {
                            ...prev.excerpt!,
                            [selectedLanguage]: e.target.value
                          }
                        }))}
                        placeholder={selectedLanguage === 'en' ? 'Brief description of your blog post' : selectedLanguage === 'ur' ? 'مختصر تفصیل' : 'لنډ تفصیل'}
                        className={selectedLanguage !== 'en' ? 'font-urdu text-right' : ''}
                        dir={selectedLanguage !== 'en' ? 'rtl' : 'ltr'}
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="content">
                        Content {selectedLanguage === 'en' ? '' : `(${selectedLanguage === 'ur' ? 'اردو' : 'پښتو'})`}
                      </Label>
                      <RichTextEditor
                        value={formData.content?.[selectedLanguage] || ''}
                        onChange={handleContentChange}
                        placeholder={selectedLanguage === 'en' ? 'Write your blog content...' : selectedLanguage === 'ur' ? 'اپنا مضمون یہاں لکھیں...' : 'خپل مضمون دلته ولیکئ...'}
                        contentImageUploading={contentImageUploading}
                        setContentImageUploading={setContentImageUploading}
                        activeLanguage={selectedLanguage}
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
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="metaTitle">
                        Meta Title {selectedLanguage === 'en' ? '' : `(${selectedLanguage === 'ur' ? 'اردو' : 'پښتو'})`}
                      </Label>
                      <Input
                        id="metaTitle"
                        value={formData.seo?.metaTitle?.[selectedLanguage] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            metaTitle: {
                              ...prev.seo?.metaTitle,
                              [selectedLanguage]: e.target.value
                            }
                          }
                        }))}
                        placeholder={selectedLanguage === 'en' ? 'SEO title (max 60 characters)' : 'SEO عنوان'}
                        className={selectedLanguage !== 'en' ? 'font-urdu text-right' : ''}
                        dir={selectedLanguage !== 'en' ? 'rtl' : 'ltr'}
                        maxLength={60}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="metaDescription">
                        Meta Description {selectedLanguage === 'en' ? '' : `(${selectedLanguage === 'ur' ? 'اردو' : 'پښتو'})`}
                      </Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.seo?.metaDescription?.[selectedLanguage] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            metaDescription: {
                              ...prev.seo?.metaDescription,
                              [selectedLanguage]: e.target.value
                            }
                          }
                        }))}
                        placeholder={selectedLanguage === 'en' ? 'SEO description (max 160 characters)' : 'SEO تفصیل'}
                        className={selectedLanguage !== 'en' ? 'font-urdu text-right' : ''}
                        dir={selectedLanguage !== 'en' ? 'rtl' : 'ltr'}
                        maxLength={160}
                        rows={3}
                      />
                    </div>

                    {selectedLanguage === 'en' && (
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
                    
                    {selectedLanguage !== 'en' && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          ℹ️ Focus Keyword and Canonical URL are only available for English blogs for SEO best practices.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="relations" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="primaryProduct">Primary Product</Label>
                      <Select
                        value={formData.primaryProduct || 'none'}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, primaryProduct: value === 'none' ? null : value }))}
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

                    <Separator />

                    <div className="grid gap-2">
                      <Label>Related Products</Label>
                      <p className="text-sm text-gray-600">Select multiple products that this blog relates to. The blog will appear in the Resources tab of these products.</p>
                      <div className="grid gap-2">
                        <Select
                          onValueChange={(value) => {
                            if (value !== 'none' && !formData.relatedProducts.includes(value)) {
                              setFormData(prev => ({
                                ...prev,
                                relatedProducts: [...prev.relatedProducts, value]
                              }))
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Add related products" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Select a product...</SelectItem>
                            {products.filter(product => !formData.relatedProducts.includes(product._id)).map((product) => (
                              <SelectItem key={product._id} value={product._id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {formData.relatedProducts.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.relatedProducts.map((productId) => {
                              const product = products.find(p => p._id === productId);
                              if (!product) {
                                console.warn(`Product with ID ${productId} not found`);
                                // Remove invalid product ID from formData
                                setTimeout(() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    relatedProducts: prev.relatedProducts.filter(id => id !== productId)
                                  }));
                                }, 0);
                                return null;
                              }
                              return (
                                <Badge key={productId} variant="secondary" className="flex items-center gap-1">
                                  {product.name}
                                  <X 
                                    size={14} 
                                    className="cursor-pointer hover:text-red-500" 
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      relatedProducts: prev.relatedProducts.filter(id => id !== productId)
                                    }))}
                                  />
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Related Brands</Label>
                      <p className="text-sm text-gray-600">Select multiple brands that this blog relates to.</p>
                      <div className="grid gap-2">
                        <Select
                          onValueChange={(value) => {
                            if (value !== 'none' && !formData.relatedBrands.includes(value)) {
                              setFormData(prev => ({
                                ...prev,
                                relatedBrands: [...prev.relatedBrands, value]
                              }))
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Add related brands" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Select a brand...</SelectItem>
                            {brands.filter(brand => !formData.relatedBrands.includes(brand._id)).map((brand) => (
                              <SelectItem key={brand._id} value={brand._id}>
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {formData.relatedBrands.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.relatedBrands.map((brandId) => {
                              const brand = brands.find(b => b._id === brandId);
                              if (!brand) {
                                console.warn(`Brand with ID ${brandId} not found`);
                                // Remove invalid brand ID from formData
                                setTimeout(() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    relatedBrands: prev.relatedBrands.filter(id => id !== brandId)
                                  }));
                                }, 0);
                                return null;
                              }
                              return (
                                <Badge key={brandId} variant="secondary" className="flex items-center gap-1">
                                  {brand.name}
                                  <X 
                                    size={14} 
                                    className="cursor-pointer hover:text-red-500" 
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      relatedBrands: prev.relatedBrands.filter(id => id !== brandId)
                                    }))}
                                  />
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                      </div>
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
                <Button variant="outline" onClick={handleCloseDialog}>
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
