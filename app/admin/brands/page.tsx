"use client"

import React, { useEffect, useState } from "react"
import { api } from "@/lib/services/api"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Plus, Search, Edit, Trash2, Building2, Home, Star } from "lucide-react"

// For multi-select
import Select from "react-select"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("brands")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editBrand, setEditBrand] = useState<any | null>(null)

  // Categories for multi-select
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategories, setSelectedCategories] = useState<any[]>([])
  const [editSelectedCategories, setEditSelectedCategories] = useState<any[]>([])

  // Home Brand Promotion states
  const [products, setProducts] = useState<any[]>([])
  const [homePromotion, setHomePromotion] = useState<any>(null)
  const [isAddPromotionDialogOpen, setIsAddPromotionDialogOpen] = useState(false)
  const [isEditPromotionDialogOpen, setIsEditPromotionDialogOpen] = useState(false)
  
  // Home promotion form states
  const [selectedBrand, setSelectedBrand] = useState<any>(null)
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [promotionForm, setPromotionForm] = useState({
    title: "Power up!",
    subtitle: "Panels, inverters & much more.",
    redirectLink: "",
    isActive: true
  })

  // Form state for controlled inputs in edit dialog
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editTagline, setEditTagline] = useState("")
  const [editEstablishedYear, setEditEstablishedYear] = useState("")
  const [editHeadquarters, setEditHeadquarters] = useState("")
  const [editIsFeatured, setEditIsFeatured] = useState(false)
  const [editIsActive, setEditIsActive] = useState(true)

  // Fetch brands from API
  useEffect(() => {
    setLoading(true)
    // Fetch brands
    api.get('/api/brands/admin/all')
      .then(res => setBrands(res.data as any[]))
      .catch(err => {
        console.error("Error fetching brands:", err)
      })
    
    // Fetch categories (use public endpoint for all active main categories)
    api.get('/api/category/')
      .then(res => {
        setCategories((res.data as any[]).map((cat: any) => ({ value: cat._id, label: cat.name })))
      })
      .catch(err => {
        console.error("Error fetching categories:", err)
      })
    
    // Fetch ALL products for home promotion using admin endpoint (without pagination)
    api.get('/api/products/admin/all?limit=1000')
      .then(res => {
        // Handle both direct array and paginated response
        const responseData = res.data as any
        const productsArray = responseData.products || responseData
        const productOptions = (productsArray as any[]).map((product: any) => ({
          value: product._id,
          label: `${product.name} - PKR ${product.price?.toLocaleString() || 'N/A'}`,
          product: product
        }))
        console.log('Fetched products:', productOptions.length, 'products with brands:', productOptions.filter(p => p.product.brand).length)
        setProducts(productOptions)
      })
      .catch(err => {
        console.error("Error fetching products:", err)
      })
    
    // Fetch existing home promotion from server, fallback to localStorage
    ;(async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_BASE || '')
        const endpoint = base ? `${base.replace(/\/$/, '')}/api/home-promotion/active` : '/api/home-promotion/active'
        const res = (await api.get(endpoint)) as any
        const data = res.data as any
        if (data && data.promotion) {
          setHomePromotion(data.promotion)
        } else {
          const savedPromotion = localStorage.getItem('homePromotion')
          if (savedPromotion) setHomePromotion(JSON.parse(savedPromotion))
        }
      } catch (err) {
        console.error('Failed to fetch home promotion from server, falling back to localStorage', err)
        const savedPromotion = localStorage.getItem('homePromotion')
        if (savedPromotion) setHomePromotion(JSON.parse(savedPromotion))
      }
    })()
    
    setLoading(false)
  }, [])

  // Filter products based on selected brand - simplified and more robust
  const filteredProducts = React.useMemo(() => {
    if (!selectedBrand) {
      console.log('No brand selected, showing all products')
      return products
    }

    const filtered = products.filter(product => {
      const productData = product.product
      if (!productData || !productData.brand) {
        console.log('Product has no brand:', productData?.name)
        return false
      }

      // Handle both populated object and string ID
      let brandId = null
      if (typeof productData.brand === 'string') {
        brandId = productData.brand
      } else if (productData.brand && typeof productData.brand === 'object') {
        brandId = productData.brand._id
      }

      const matches = brandId === selectedBrand.value
      if (matches) {
        console.log('✓ Product matches brand:', productData.name, 'Brand ID:', brandId)
      }
      return matches
    })

    console.log(`Filtered ${filtered.length} products for brand ${selectedBrand.label} (${selectedBrand.value})`)
    return filtered
  }, [products, selectedBrand])

  // Add effect to reset products when brand changes
  useEffect(() => {
    if (selectedBrand) {
      console.log('Brand changed, resetting selected products')
      setSelectedProducts([])
    }
  }, [selectedBrand])

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getBrandStats = () => {
    return {
      total: brands.length,
      active: brands.filter((b) => b.isActive === true).length,
      featured: brands.filter((b) => b.isFeatured === true).length,
      totalProducts: brands.reduce((sum, b) => sum + (b.allProductCount || 0), 0),
      homePromotion: homePromotion ? 1 : 0,
      activePromotion: homePromotion?.isActive ? 1 : 0,
    }
  }

  const stats = getBrandStats()

  const brandOptions = brands.filter(b => b.isActive).map(brand => ({
    value: brand._id,
    label: brand.name,
    brand: brand
  }))

  const handleAddBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Get boolean values properly
    const isFeatured = (form.querySelector('#isFeatured') as HTMLInputElement)?.checked || false
    const isActive = (form.querySelector('#isActive') as HTMLInputElement)?.checked || false

    formData.set("isFeatured", isFeatured.toString())
    formData.set("isActive", isActive.toString())

    // Add selected categories as array
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((cat: any) => {
        formData.append("categories[]", cat.value)
      })
    }

    setLoading(true)
    try {
      await api.post('/api/brands/new/create', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setIsAddDialogOpen(false)
      form.reset()
      setSelectedCategories([])
      // Refetch brands
      const res = await api.get('/api/brands/admin/all')
      setBrands(res.data as any[])
    } catch (err) {
      alert("Failed to add brand")
      console.error("Add brand error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editBrand) return

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add controlled form data
    formData.set("name", editName)
    formData.set("description", editDescription)
    formData.set("tagline", editTagline)
    formData.set("establishedYear", editEstablishedYear)
    formData.set("headquarters", editHeadquarters)
    formData.set("isFeatured", editIsFeatured ? "true" : "false")
    formData.set("isActive", editIsActive ? "true" : "false")

    // Add selected categories as array
    if (editSelectedCategories.length > 0) {
      editSelectedCategories.forEach((cat: any) => {
        formData.append("categories[]", cat.value)
      })
    }

    setLoading(true)
    try {
      // Always use the brand's slug for update
      await api.put(`/api/brands/update/${editBrand.slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setIsEditDialogOpen(false)
      setEditBrand(null)
      clearEditForm()
      setEditSelectedCategories([])
      // Refetch brands
      const res = await api.get('/api/brands/admin/all')
      setBrands(res.data as any[])
    } catch (err) {
      alert("Failed to update brand")
      console.error("Update brand error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBrand = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this brand? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/api/brands/del/${slug}`);
      // Refetch brands after deletion
      const res = await api.get('/api/brands/admin/all')
      setBrands(res.data as any[])
      alert("Brand deleted successfully.");
    } catch (err) {
      console.error("Failed to delete brand:", err);
      alert("Failed to delete brand. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Home promotion management functions
  const handleAddHomePromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedBrand) {
      alert("Please select a brand")
      return
    }

    if (selectedProducts.length < 2 || selectedProducts.length > 4) {
      alert("Please select between 2 and 4 products")
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    
    const desktopImage = formData.get('desktopImage') as File
    const mobileImage = formData.get('mobileImage') as File

    if (!desktopImage || !mobileImage) {
      alert("Please upload both desktop and mobile images")
      return
    }

    setLoading(true)
    try {
      // Upload images to backend (which uploads to Cloudinary)
      const images = await uploadToBackend(desktopImage, mobileImage)

      const promotion = {
        id: Date.now().toString(),
        title: promotionForm.title,
        subtitle: promotionForm.subtitle,
        redirectLink: promotionForm.redirectLink,
        isActive: promotionForm.isActive,
        selectedBrand: selectedBrand,
        featuredProducts: selectedProducts,
        images: {
          desktop: images.desktopImage,
          mobile: images.mobileImage
        },
        createdAt: new Date().toISOString()
      }

      // Persist to backend so promotion is visible to all users
      try {
        const payload = {
          title: promotion.title,
          subtitle: promotion.subtitle,
          redirectLink: promotion.redirectLink,
          isActive: promotion.isActive,
          selectedBrand: JSON.stringify(promotion.selectedBrand || {}),
          featuredProducts: JSON.stringify(promotion.featuredProducts || []),
          images: JSON.stringify(promotion.images || {}),
        }

        const response = (await api.post('/api/home-promotion', payload)) as any
        const respData = response.data as any
        if (respData && respData.promotion) {
          setHomePromotion(respData.promotion)
        } else {
          // fallback to localStorage if server didn't return promotion
          localStorage.setItem('homePromotion', JSON.stringify(promotion))
          setHomePromotion(promotion)
        }

        setIsAddPromotionDialogOpen(false)
        resetPromotionForm()
        alert('Home promotion created successfully!')
      } catch (err) {
        console.error('Failed to save home promotion to server, saving locally as fallback', err)
        localStorage.setItem('homePromotion', JSON.stringify(promotion))
        setHomePromotion(promotion)
        setIsAddPromotionDialogOpen(false)
        resetPromotionForm()
        alert('Home promotion created locally (server error)')
      }
      
    } catch (error) {
      console.error("Error creating home promotion:", error)
      alert("Failed to create home promotion. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHomePromotion = async () => {
    if (!confirm("Are you sure you want to delete this promotion?")) return

    // Delete from server if persisted, otherwise remove localStorage
    if (homePromotion && homePromotion._id) {
      try {
        const delResp = (await api.delete(`/api/home-promotion/${homePromotion._id}`)) as any
        if (delResp && delResp.data && delResp.data.success) {
          setHomePromotion(null)
          alert('Promotion deleted successfully!')
        } else {
          localStorage.removeItem('homePromotion')
          setHomePromotion(null)
          alert('Promotion removed locally (server returned unexpected response)')
        }
      } catch (err) {
        console.error('Failed to delete promotion from server, removing locally', err)
        localStorage.removeItem('homePromotion')
        setHomePromotion(null)
        alert('Promotion removed locally (server error)')
      }
    } else {
      localStorage.removeItem('homePromotion')
      setHomePromotion(null)
      alert('Promotion deleted successfully!')
    }
  }

  const handleEditHomePromotion = () => {
    if (homePromotion) {
      setPromotionForm({
        title: homePromotion.title,
        subtitle: homePromotion.subtitle,
        redirectLink: homePromotion.redirectLink,
        isActive: homePromotion.isActive
      })
      setSelectedBrand(homePromotion.selectedBrand)
      setSelectedProducts(homePromotion.featuredProducts)
      setIsEditPromotionDialogOpen(true)
    }
  }

  const handleUpdateHomePromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedBrand) {
      alert("Please select a brand")
      return
    }

    if (selectedProducts.length < 2 || selectedProducts.length > 4) {
      alert("Please select between 2 and 4 products")
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    
    setLoading(true)
    try {
      let images = homePromotion.images
      
      // Check if new images were uploaded
      const desktopImage = formData.get('desktopImage') as File
      const mobileImage = formData.get('mobileImage') as File
      
      // Only upload if both images are provided (for simplicity)
      if (desktopImage && desktopImage.size > 0 && mobileImage && mobileImage.size > 0) {
        const uploadedImages = await uploadToBackend(desktopImage, mobileImage)
        images = {
          desktop: uploadedImages.desktopImage,
          mobile: uploadedImages.mobileImage
        }
      } else if (desktopImage && desktopImage.size > 0) {
        // If only desktop image, create a placeholder for mobile
        const uploadedImages = await uploadToBackend(desktopImage, desktopImage)
        images.desktop = uploadedImages.desktopImage
      } else if (mobileImage && mobileImage.size > 0) {
        // If only mobile image, create a placeholder for desktop
        const uploadedImages = await uploadToBackend(mobileImage, mobileImage)
        images.mobile = uploadedImages.mobileImage
      }

      const updatedPromotion = {
        ...homePromotion,
        title: promotionForm.title,
        subtitle: promotionForm.subtitle,
        redirectLink: promotionForm.redirectLink,
        isActive: promotionForm.isActive,
        selectedBrand: selectedBrand,
        featuredProducts: selectedProducts,
        images: images,
        updatedAt: new Date().toISOString()
      }

      // Try to persist update to server: create new promotion and delete old one if exists
      try {
        const payload = {
          title: updatedPromotion.title,
          subtitle: updatedPromotion.subtitle,
          redirectLink: updatedPromotion.redirectLink,
          isActive: updatedPromotion.isActive,
          selectedBrand: JSON.stringify(updatedPromotion.selectedBrand || {}),
          featuredProducts: JSON.stringify(updatedPromotion.featuredProducts || []),
          images: JSON.stringify(updatedPromotion.images || {}),
        }
        const response = (await api.post('/api/home-promotion', payload)) as any
        const respData = response.data as any
        if (respData && respData.promotion) {
          // remove old promotion if it existed on server
          if (homePromotion && homePromotion._id) {
            try { await api.delete(`/api/home-promotion/${homePromotion._id}`) } catch (e) { console.warn('Failed to delete old promotion', e) }
          }
          setHomePromotion(respData.promotion)
        } else {
          // fallback to local update
          localStorage.setItem('homePromotion', JSON.stringify(updatedPromotion))
          setHomePromotion(updatedPromotion)
        }

        setIsEditPromotionDialogOpen(false)
        resetPromotionForm()
        alert('Home promotion updated successfully!')
      } catch (err) {
        console.error('Failed to update home promotion on server, saving locally', err)
        localStorage.setItem('homePromotion', JSON.stringify(updatedPromotion))
        setHomePromotion(updatedPromotion)
        setIsEditPromotionDialogOpen(false)
        resetPromotionForm()
        alert('Home promotion updated locally (server error)')
      }
      
    } catch (error) {
      console.error("Error updating home promotion:", error)
      alert("Failed to update home promotion. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetPromotionForm = () => {
    setPromotionForm({
      title: "Power up!",
      subtitle: "Panels, inverters & much more.",
      redirectLink: "",
      isActive: true
    })
    setSelectedBrand(null)
    setSelectedProducts([])
  }

  // Helper function to upload images via backend
  const uploadToBackend = async (desktopImage: File, mobileImage: File) => {
    const formData = new FormData()
    formData.append('desktopImage', desktopImage)
    formData.append('mobileImage', mobileImage)
    
    try {
      const response = await api.post('/api/upload/home-promotion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      const resp = response as any
      if (resp.data && resp.data.success) {
        return resp.data.images
      } else {
        throw new Error((resp.data && resp.data.message) || 'Upload failed')
      }
    } catch (error) {
      console.error('Backend upload error:', error)
      throw error
    }
  }

  // Populate edit form when brand is selected
  const populateEditForm = (brand: any) => {
    setEditName(brand.name || "")
    setEditDescription(brand.description || "")
    setEditTagline(brand.tagline || "")
    setEditEstablishedYear(brand.establishedYear ? String(brand.establishedYear) : "")
    setEditHeadquarters(brand.headquarters || "")
    setEditIsFeatured(brand.isFeatured === true)
    setEditIsActive(brand.isActive === true)
    setEditSelectedCategories(
      Array.isArray(brand.categories)
        ? brand.categories.map((cat: any) => ({ value: cat._id || cat, label: cat.name || cat }))
        : []
    )
  }

  // Clear edit form
  const clearEditForm = () => {
    setEditName("")
    setEditDescription("")
    setEditTagline("")
    setEditEstablishedYear("")
    setEditHeadquarters("")
    setEditIsFeatured(false)
    setEditIsActive(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Management</h1>
          <p className="text-muted-foreground">Manage product brands and their information.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>Create a new brand for your product catalog.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBrand} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input id="brand-name" name="name" required placeholder="Enter brand name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-description">Description</Label>
                <Textarea id="brand-description" name="description" required placeholder="Brief description of the brand" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-tagline">Tagline</Label>
                <Input id="brand-tagline" name="tagline" placeholder="Brand tagline" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-categories">Categories</Label>
                <Select
                  isMulti
                  options={categories}
                  value={selectedCategories}
                  onChange={(value) => setSelectedCategories(value as any[])}
                  placeholder="Select categories..."
                  classNamePrefix="react-select"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-logo">Logo Upload</Label>
                <Input id="brand-logo" name="logo" type="file" accept="image/*" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-banner">Banner Upload</Label>
                <Input id="brand-banner" name="banner" type="file" accept="image/*" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-thumbnail">Thumbnail Upload</Label>
                <Input id="brand-thumbnail" name="thumbnail" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-establishedYear">Established Year</Label>
                <Input id="brand-establishedYear" name="establishedYear" type="number" min="1800" max={new Date().getFullYear()} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-headquarters">Headquarters</Label>
                <Input id="brand-headquarters" name="headquarters" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isFeatured" name="isFeatured" />
                <Label htmlFor="isFeatured">Featured Brand</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" defaultChecked />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>Add Brand</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Brand Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registered brands</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently selling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Brands</CardTitle>
            <Star className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">Homepage featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all brands</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Home Promotion</CardTitle>
            <Home className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.homePromotion}</div>
            <p className="text-xs text-muted-foreground">Setup complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotion</CardTitle>
            <Home className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activePromotion}</div>
            <p className="text-xs text-muted-foreground">Currently showing</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different management areas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brands" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Brand Directory
          </TabsTrigger>
          <TabsTrigger value="home-promotion" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home Page Promotion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Brand Directory</CardTitle>
          <CardDescription>Manage all product brands and their information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <div>
                        <div className="font-medium">{brand.name}</div>
                        <div className="text-sm text-muted-foreground">{brand.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{brand.allProductCount ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={brand.isActive ? "default" : "secondary"}>
                      {brand.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {brand.isFeatured ? (
                      <Badge variant="outline">Featured</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(brand.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditBrand(brand);
                            populateEditForm(brand);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit Brand
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteBrand(brand.slug)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Brand
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

      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Edit brand details.</DialogDescription>
          </DialogHeader>
          {editBrand && (
            <form onSubmit={handleEditBrand} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input id="brand-name" name="name" required placeholder="Enter brand name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-description">Description</Label>
                <Textarea id="brand-description" name="description" required placeholder="Brief description of the brand" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-tagline">Tagline</Label>
                <Input id="brand-tagline" name="tagline" placeholder="Brand tagline" value={editTagline} onChange={(e) => setEditTagline(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-categories">Categories</Label>
                <Select
                  isMulti
                  options={categories}
                  value={editSelectedCategories}
                  onChange={(value) => setEditSelectedCategories(value as any[])}
                  placeholder="Select categories..."
                  classNamePrefix="react-select"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-logo">Logo Upload</Label>
                <Input id="brand-logo" name="logo" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-banner">Banner Upload</Label>
                <Input id="brand-banner" name="banner" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-thumbnail">Thumbnail Upload</Label>
                <Input id="brand-thumbnail" name="thumbnail" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-establishedYear">Established Year</Label>
                <Input id="brand-establishedYear" name="establishedYear" type="number" min="1800" max={new Date().getFullYear()} value={editEstablishedYear} onChange={(e) => setEditEstablishedYear(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-headquarters">Headquarters</Label>
                <Input id="brand-headquarters" name="headquarters" value={editHeadquarters} onChange={(e) => setEditHeadquarters(e.target.value)} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isFeatured" name="isFeatured" checked={editIsFeatured} onCheckedChange={(checked) => setEditIsFeatured(checked)} />
                <Label htmlFor="isFeatured">Featured Brand</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" checked={editIsActive} onCheckedChange={(checked) => setEditIsActive(checked)} />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
        </TabsContent>

        <TabsContent value="home-promotion" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Home Page Brand Promotion</CardTitle>
                <CardDescription>Manage featured brand promotion displayed on the home page.</CardDescription>
              </div>
              {!homePromotion && (
                <Dialog open={isAddPromotionDialogOpen} onOpenChange={setIsAddPromotionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Home Promotion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Home Page Brand Promotion</DialogTitle>
                      <DialogDescription>Set up a featured brand promotion for the home page.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddHomePromotion} className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="promotion-title">Section Title</Label>
                        <Input 
                          id="promotion-title" 
                          value={promotionForm.title}
                          onChange={(e) => setPromotionForm({...promotionForm, title: e.target.value})}
                          required 
                          placeholder="e.g., Power up!" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="promotion-subtitle">Section Subtitle</Label>
                        <Input 
                          id="promotion-subtitle" 
                          value={promotionForm.subtitle}
                          onChange={(e) => setPromotionForm({...promotionForm, subtitle: e.target.value})}
                          placeholder="e.g., Panels, inverters & much more." 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="selected-brand">Featured Brand</Label>
                        <Select
                          options={brandOptions}
                          value={selectedBrand}
                          onChange={(brand) => {
                            setSelectedBrand(brand)
                            setSelectedProducts([]) // Reset products when brand changes
                          }}
                          placeholder="Select a brand..."
                          classNamePrefix="react-select"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="promotion-redirect-link">Redirect Link</Label>
                        <Input 
                          id="promotion-redirect-link" 
                          value={promotionForm.redirectLink}
                          onChange={(e) => setPromotionForm({...promotionForm, redirectLink: e.target.value})}
                          required
                          placeholder="e.g., /brand/jinko-solar" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="desktop-image">Desktop Image (400x400px recommended)</Label>
                        <Input id="desktop-image" name="desktopImage" type="file" accept="image/*" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="mobile-image">Mobile Image (335x200px recommended)</Label>
                        <Input id="mobile-image" name="mobileImage" type="file" accept="image/*" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="featured-products">Featured Products (2-4 products)</Label>
                        <div className="text-xs text-gray-500 mb-2">
                          Debug: Total products: {products.length}, Filtered: {filteredProducts.length}
                          {selectedBrand && (
                            <span>, Selected brand: {selectedBrand.label} ({selectedBrand.value})</span>
                          )}
                        </div>
                        <Select
                          isMulti
                          options={filteredProducts}
                          value={selectedProducts}
                          onChange={(value) => setSelectedProducts(value as any[])}
                          placeholder={selectedBrand ? "Select 2-4 products..." : "Select a brand first"}
                          isDisabled={!selectedBrand}
                          classNamePrefix="react-select"
                        />
                        <p className="text-sm text-gray-500">
                          {selectedBrand 
                            ? `Select between 2 and 4 products from ${selectedBrand.label}` 
                            : "Please select a brand to see available products"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="promotion-active" 
                          checked={promotionForm.isActive}
                          onCheckedChange={(checked) => setPromotionForm({...promotionForm, isActive: checked})}
                        />
                        <Label htmlFor="promotion-active">Active</Label>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={loading}>Create Promotion</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              {homePromotion ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {homePromotion.images?.desktop && (
                        <Image
                          src={homePromotion.images.desktop}
                          alt={homePromotion.title}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{homePromotion.title}</h3>
                        <p className="text-sm text-gray-500">{homePromotion.subtitle}</p>
                        <p className="text-sm">Brand: {homePromotion.selectedBrand?.label}</p>
                        <p className="text-sm">Products: {homePromotion.featuredProducts?.length}</p>
                        <Badge variant={homePromotion.isActive ? "default" : "secondary"}>
                          {homePromotion.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={handleEditHomePromotion}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteHomePromotion}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Desktop Image</h4>
                      {homePromotion.images?.desktop && (
                        <Image
                          src={homePromotion.images.desktop}
                          alt="Desktop promotion"
                          width={200}
                          height={200}
                          className="rounded-lg object-cover border"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Mobile Image</h4>
                      {homePromotion.images?.mobile && (
                        <Image
                          src={homePromotion.images.mobile}
                          alt="Mobile promotion"
                          width={200}
                          height={120}
                          className="rounded-lg object-cover border"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Featured Products ({homePromotion.featuredProducts?.length})</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {homePromotion.featuredProducts?.map((product: any, index: number) => (
                        <div key={index} className="text-sm p-2 border rounded">
                          {product.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No home promotion</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new home page promotion.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Home Promotion Dialog */}
          <Dialog open={isEditPromotionDialogOpen} onOpenChange={setIsEditPromotionDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Home Page Brand Promotion</DialogTitle>
                <DialogDescription>Update the featured brand promotion for the home page.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateHomePromotion} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-promotion-title">Section Title</Label>
                  <Input 
                    id="edit-promotion-title" 
                    value={promotionForm.title}
                    onChange={(e) => setPromotionForm({...promotionForm, title: e.target.value})}
                    required 
                    placeholder="e.g., Power up!" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-promotion-subtitle">Section Subtitle</Label>
                  <Input 
                    id="edit-promotion-subtitle" 
                    value={promotionForm.subtitle}
                    onChange={(e) => setPromotionForm({...promotionForm, subtitle: e.target.value})}
                    placeholder="e.g., Panels, inverters & much more." 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-selected-brand">Featured Brand</Label>
                  <Select
                    options={brandOptions}
                    value={selectedBrand}
                    onChange={(brand) => {
                      setSelectedBrand(brand)
                      setSelectedProducts([]) // Reset products when brand changes
                    }}
                    placeholder="Select a brand..."
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-promotion-redirect-link">Redirect Link</Label>
                  <Input 
                    id="edit-promotion-redirect-link" 
                    value={promotionForm.redirectLink}
                    onChange={(e) => setPromotionForm({...promotionForm, redirectLink: e.target.value})}
                    required
                    placeholder="e.g., /brand/jinko-solar" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-desktop-image">Desktop Image (leave empty to keep current)</Label>
                  <Input id="edit-desktop-image" name="desktopImage" type="file" accept="image/*" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-mobile-image">Mobile Image (leave empty to keep current)</Label>
                  <Input id="edit-mobile-image" name="mobileImage" type="file" accept="image/*" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-featured-products">Featured Products (2-4 products)</Label>
                  <div className="text-xs text-gray-500 mb-2">
                    Debug: Total products: {products.length}, Filtered: {filteredProducts.length}
                    {selectedBrand && (
                      <span>, Selected brand: {selectedBrand.label} ({selectedBrand.value})</span>
                    )}
                  </div>
                  <Select
                    isMulti
                    options={filteredProducts}
                    value={selectedProducts}
                    onChange={(value) => setSelectedProducts(value as any[])}
                    placeholder={selectedBrand ? "Select 2-4 products..." : "Select a brand first"}
                    isDisabled={!selectedBrand}
                    classNamePrefix="react-select"
                  />
                  <p className="text-sm text-gray-500">
                    {selectedBrand 
                      ? `Select between 2 and 4 products from ${selectedBrand.label}` 
                      : "Please select a brand to see available products"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="edit-promotion-active" 
                    checked={promotionForm.isActive}
                    onCheckedChange={(checked) => setPromotionForm({...promotionForm, isActive: checked})}
                  />
                  <Label htmlFor="edit-promotion-active">Active</Label>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>Update Promotion</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
