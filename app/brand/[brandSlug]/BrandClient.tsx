"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Filter, ChevronDown  } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import InBrandAd from "@/components/inBrandAd"
import { useState, useEffect } from "react"
import { useBrandAnalytics } from "@/hooks/useAnalyticTracking"
import AnalyticsClient from "@/lib/analytics"
import { useCart } from "@/context/CartContext"
import { toast } from "@/hooks/use-toast"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type Props = {
  initialBrand: any | null,
  initialFeaturedProducts?: any[]
  initialAllProducts?: any[]
}

// Format price in PKR with commas
const formatPrice = (price: number) => {
  return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export default function BrandClient({ initialBrand, initialFeaturedProducts = [], initialAllProducts = [] }: Props) {
  const [brand, setBrand] = useState<any>(initialBrand)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(initialFeaturedProducts)
  const [allProducts, setAllProducts] = useState<any[]>(initialAllProducts)
  const [loading, setLoading] = useState(!initialBrand)
  const [error, setError] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [brandSlug, setBrandSlug] = useState<string>("")
  const [filters, setFilters] = useState<any[]>([])
  const [defaultFilters, setDefaultFilters] = useState<any[]>([])
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({})
  const [sortBy, setSortBy] = useState("featured")
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 12 })
  
  const { addToCart, loading: cartLoading } = useCart()
  
  // Handle Add to Cart
  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (cartLoading) return
    
    try {
      await addToCart({ productId, quantity: 1 })
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive"
      })
    }
  }
  
  // Track product click
  const handleProductClick = (productId: string, productSlug: string) => {
    const analytics = AnalyticsClient.getInstance()
    analytics.trackProductClick(productId, productSlug)
  }

  // Determine brandSlug from initialBrand or URL
  useEffect(() => {
    if (initialBrand && initialBrand.slug) {
      setBrandSlug(initialBrand.slug)
    } else {
      const path = typeof window !== 'undefined' ? window.location.pathname : ''
      const slug = path.split('/').filter(Boolean).pop() || ''
      setBrandSlug(slug)
    }
  }, [initialBrand])

  useEffect(() => {
    if (!brandSlug) return;

    async function fetchBrandData() {
      setLoading(true)
      setError(null)
      try {
        // If we don't have brand from server, fetch it. If we do have it,
        // keep it but still proceed to fetch filters and products so the
        // UI (filters tab and All Products) show correctly.
        if (!brand) {
          const brandResponse = await fetch(`${API_BASE}/api/brands/${brandSlug}`, {
            headers: {
              'Accept': 'application/json'
            }
          })

          const brandData = await brandResponse.json()

          if (!brandResponse.ok) {
            throw new Error(`Failed to load brand data: Status ${brandResponse.status}`)
          }

          setBrand(brandData.data || brandData)
          setFeaturedProducts((brandData.data || brandData).featuredProducts || [])

          // Track brand view once we have the brand ID
          if (brandData._id) {
            const analytics = await import('@/lib/analytics').then(mod => mod.default.getInstance());
            analytics.trackBrandView(brandData._id, brandSlug);
          }
        } else {
          // we have a server-provided brand; ensure featured products state
          setFeaturedProducts((initialBrand?.featuredProducts) || brand.featuredProducts || [])
          if (brand._id) {
            const analytics = await import('@/lib/analytics').then(mod => mod.default.getInstance());
            analytics.trackBrandView(brand._id, brandSlug);
          }
        }

        // Fetch brand page filters (always fetch so filters tab has data)
        try {
          const filtersResponse = await fetch(`${API_BASE}/api/products/filters/brand`)
          if (filtersResponse.ok) {
            const filtersData = await filtersResponse.json()
            setFilters(filtersData.filters || [])
            setDefaultFilters(filtersData.filters || [])
            setAppliedFilters(prev => {
              if (prev && prev.brand) return prev
              return { ...prev, brand: brandSlug }
            })
          }
        } catch (err) {
          // non-fatal: filters may be optional
          console.warn('Failed to load filters for brand page:', err)
        }

        // Fetch all products for this brand - this is a separate API call
        fetchBrandProducts()
      } catch (err) {
        console.error("Error fetching brand data:", err)
        setError("Failed to load brand data.")
      } finally {
        setLoading(false)
      }
    }
    fetchBrandData()
  }, [brandSlug])

  // Fetch brand products with filters
  const fetchBrandProducts = async () => {
    try {
      const extras: Record<string, string | number> = {}
      const effectiveBrand = appliedFilters?.brand ?? brandSlug
      if (effectiveBrand) extras.brand = effectiveBrand
      extras.sort = sortBy
      extras.page = pagination.page
      extras.limit = pagination.limit || 12

      const { buildProductQueryParams } = await import('@/lib/utils/filterUtils')
      const params = buildProductQueryParams(appliedFilters, extras)

      const productsResponse = await fetch(`${API_BASE}/api/products?${params.toString()}`)
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        if (productsData.success) {
          setAllProducts(productsData.products || [])
          setPagination(productsData.pagination || { page: 1, pages: 1, total: 0, limit: 12 })
        } else {
          setAllProducts([])
        }
      } else {
        setAllProducts([])
      }
    } catch (error) {
      console.error('Error in fetchBrandProducts:', error)
      setAllProducts([])
    }
  }

  // Handle filter change
  const handleFilterChange = (field: string, value: any) => {
    setAppliedFilters(prev => ({
      ...prev,
      [field]: value === "" ? undefined : value
    }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Special handler for category filter change - needs to reload filters
  const handleCategoryFilterChange = (newCategorySlug: string | undefined) => {
    handleFilterChange('category', newCategorySlug)
    setAppliedFilters({ category: newCategorySlug })
    let filterCategory = 'brand'
    if (newCategorySlug) {
      filterCategory = newCategorySlug
    }
    fetch(`${API_BASE}/api/products/filters/${filterCategory}`)
      .then((res) => res.json())
      .then((data) => {
        let newFilters = data.filters || []

        const normalizeCategoryOptions = (opts: any[]) => {
          return (opts || []).map((opt: any) => {
            if (opt && typeof opt === 'object' && opt.slug) return opt
            if (typeof opt === 'string') {
              const slug = opt.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
              return { name: opt, slug }
            }
            return opt
          })
        }

        newFilters = newFilters.filter((f: any) => f.field !== 'brand')
        newFilters = newFilters.map((f: any) => {
          if (f.field === 'category' && Array.isArray(f.options)) {
            return { ...f, options: normalizeCategoryOptions(f.options) }
          }
          return f
        })

        const defaultCategoryFilter = defaultFilters.find((f: any) => f.field === 'category')
        if (defaultCategoryFilter) {
          const normalizedDefault = { ...defaultCategoryFilter }
          if (Array.isArray(normalizedDefault.options)) {
            normalizedDefault.options = normalizeCategoryOptions(normalizedDefault.options)
          }
          newFilters = newFilters.filter((f: any) => f.field !== 'category')
          newFilters = [normalizedDefault, ...newFilters]
        }

        if (!newCategorySlug) {
          setFilters(defaultFilters.filter((f: any) => f.field !== 'brand'))
        } else {
          setFilters(newFilters)
        }
      })
      .catch(err => console.error('Error fetching filters:', err))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setAppliedFilters({})
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Fetch products when filters or sort change
  useEffect(() => {
    if (brandSlug) {
      fetchBrandProducts()
    }
  }, [appliedFilters, sortBy, pagination.page, pagination.limit])

  // Compute start/end indexes for the current page display
  const startIndex = (pagination.page - 1) * (pagination.limit || 12) + 1
  const endIndex = startIndex + allProducts.length - 1

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Loading brand information...</div>
  }
  if (error || !brand) {
    return <div className="py-16 text-center text-destructive">{error || "Brand not found."}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-[#1a5ca4]">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <Link href="/store" className="text-gray-500 hover:text-[#1a5ca4]">
          Store
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-[#1a5ca4]">{brand.name}</span>
      </div>

      {/* Brand Cover Photo/Banner - Two different banners for mobile and desktop */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 mb-6 overflow-hidden rounded-lg shadow-md">
        {/* Desktop banner - hidden on mobile */}
        <div className="absolute inset-0 hidden sm:block">
          <Image 
              src={brand.banner || '/default-brand-banner.jpg'} 
              alt={`${brand.name} Banner`} 
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
          />
        </div>
        
        {/* Mobile banner - hidden on desktop */}
        <div className="absolute inset-0 block sm:hidden">
          <Image 
              src={brand.banner || '/default-brand-banner.jpg'} 
              alt={`${brand.name} Mobile Banner`} 
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
          />
        </div>
        
        {/* Semi-transparent overlay for text readability */}
        <div className="absolute inset-0"></div>
      </div>

      {/* Brand Header - Optimized for mobile */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mb-6 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Logo - Smaller on mobile */}
        <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gray-100 rounded-lg relative flex-shrink-0">
          <Image 
            src={brand.logo || '/default-brand-logo.png'}
            alt={`${brand.name} Logo`}
            fill
            style={{ objectFit: 'contain' }}
            className="p-2 sm:p-4"
          />
        </div>
        {/* Brand Info - Compact on mobile */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-[#1a5ca4]">{brand.name}</h1>
          {/* Description - Shorter on mobile */}
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-none">
            {brand.description}
          </p>
          {/* Info Grid - Stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="text-center sm:text-left">
              <span className="font-medium text-gray-700">Est:</span> {brand.establishedYear}
            </div>
            <div className="text-center sm:text-left">
              <span className="font-medium text-gray-700">HQ:</span> {brand.headquarters}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="w-full justify-start border-b overflow-x-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All Products</TabsTrigger>
          <TabsTrigger value="featured" className="text-xs sm:text-sm">Featured</TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">About</TabsTrigger>
          <TabsTrigger value="support" className="text-xs sm:text-sm">Support & Warranty</TabsTrigger>
        </TabsList>

        {/* All Products Tab */}
        <TabsContent value="all" className="pt-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile filter toggle button - only shown on mobile */}
            <div className="lg:hidden">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Dynamic filters sidebar - Hidden on mobile by default, shown when toggled */}
            {(showMobileFilters || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
              <div className="w-full lg:w-1/4">
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm sm:text-base">Filters</h3>
                    {Object.keys(appliedFilters).length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                        Clear All
                      </Button>
                    )}
                  </div>
                  
                  {/* Note about automatic filter application */}
                  <div className="text-xs text-gray-500 mb-4 lg:hidden">
                    Filters apply automatically as you select them
                  </div>

                  {/* Dynamic filters based on configuration */}
                  <div className="space-y-6">
                    {filters
                      .filter(f => f.field !== 'brand')
                      .map((filter: any) => (
                        <div key={filter.field}>
                          {filter.type === 'select' && (
                            <div>
                              <h4 className="font-medium mb-2 text-sm">{filter.label}</h4>
                              <select 
                                className="w-full border rounded p-2 text-sm"
                                value={appliedFilters[filter.field] || ''}
                                onChange={(e) => {
                                  // Use special handler for category filter
                                  if (filter.field === 'category') {
                                    handleCategoryFilterChange(e.target.value || undefined)
                                  } else {
                                    handleFilterChange(filter.field, e.target.value)
                                  }
                                }}
                              >
                                <option value="">All {filter.label}s</option>
                                {filter.options?.map((option: any) => {
                                  const isObj = option && typeof option === 'object'
                                  const key = isObj ? option.slug || option.name : String(option)
                                  const value = isObj ? option.slug || option.name : option
                                  const label = isObj ? option.name || option.slug : String(option)
                                  return (
                                    <option key={key} value={value}>
                                      {label}
                                    </option>
                                  )
                                })}
                              </select>
                            </div>
                          )}

                          {filter.type === 'range' && (
                            <div>
                              <h4 className="font-medium mb-2 text-sm">{filter.label}</h4>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  placeholder="Min"
                                  className="flex-1 border rounded p-2 text-sm"
                                  value={appliedFilters[`${filter.field}_min`] || ''}
                                  onChange={(e) => handleFilterChange(`${filter.field}_min`, e.target.value || undefined)}
                                  min={filter.min}
                                  max={filter.max}
                                  step={filter.step}
                                />
                                <input
                                  type="number"
                                  placeholder="Max"
                                  className="flex-1 border rounded p-2 text-sm"
                                  value={appliedFilters[`${filter.field}_max`] || ''}
                                  onChange={(e) => handleFilterChange(`${filter.field}_max`, e.target.value || undefined)}
                                  min={filter.min}
                                  max={filter.max}
                                  step={filter.step}
                                />
                              </div>
                            </div>
                          )}

                          {filter.type === 'boolean' && (
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id={filter.field} 
                                className="mr-2"
                                checked={appliedFilters[filter.field] || false}
                                onChange={(e) => handleFilterChange(filter.field, e.target.checked)}
                              />
                              <label htmlFor={filter.field} className="text-sm">{filter.label}</label>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <div className="w-full lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                <div>
                  <span className="text-gray-600 text-sm">
                    Showing 1-{Math.min(allProducts.length, pagination.limit)} of {pagination.total} products
                  </span>
                  {Object.keys(appliedFilters).length > 0 && (
                    <span className="text-sm text-blue-600 ml-2">
                      ({Object.keys(appliedFilters).length} filter{Object.keys(appliedFilters).length > 1 ? 's' : ''} applied)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort by:</span>
                  <select 
                    className="border rounded p-1 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="popularity">Most Popular</option>
                    <option value="top_selling">Best Selling</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {allProducts.map((product: any) => (
                  <Link key={product._id} href={`/product/${product.slug}`} onClick={() => handleProductClick(product._id, product.slug)}>
                    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-colors group">
                      <div className="h-32 sm:h-48 bg-gray-100 relative overflow-hidden">
                        {/* Primary image */}
                        <Image 
                          src={product.images?.[0] || '/default-product.jpg'}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'contain' }}
                          className="transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                        />
                        {/* Secondary image (hover) */}
                        <Image 
                          src={product.images?.[1] || product.images?.[0] || '/default-product.jpg'}
                          alt={`${product.name} - 2`}
                          fill
                          style={{ objectFit: 'contain' }}
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-2 sm:p-4">
                        <h3 className="font-medium mb-2 line-clamp-2 text-xs sm:text-sm h-8 sm:h-12">{product.name}</h3>
                        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                          {product.originalPrice && product.originalPrice < product.price ? (
                            <>
                              <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.originalPrice)}</span>
                              <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
                            </>
                          ) : (
                            <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.price)}</span>
                          )}
                        </div>
                        <Button 
                          className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] text-xs sm:text-sm py-1 sm:py-2"
                          onClick={(e) => handleAddToCart(e, product._id)}
                          disabled={cartLoading}
                        >
                          {cartLoading ? "Adding..." : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    className="text-xs sm:text-sm"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(pagination.pages || 1, 7) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={pagination.page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                        className="text-xs sm:text-sm"
                      >
                        {page}
                      </Button>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages || 1, prev.page + 1) }))}
                    className="text-xs sm:text-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Featured Products Tab */}
        <TabsContent value="featured" className="pt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Featured Products from {brand.name}</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {(brand.pageSettings?.featuredProducts?.length > 0 ? brand.pageSettings.featuredProducts : featuredProducts).map((product: any) => (
              <Link key={product._id} href={`/product/${product.slug}`} onClick={() => handleProductClick(product._id, product.slug)}>
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-colors group">
                  <div className="h-32 sm:h-48 bg-gray-100 relative overflow-hidden">
                    <Image 
                      src={product.images?.[0] || '/default-product.jpg'}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                    />
                    <Image 
                      src={product.images?.[1] || product.images?.[0] || '/default-product.jpg'}
                      alt={`${product.name} - 2`}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2 sm:p-4">
                    <h3 className="font-medium mb-2 line-clamp-2 text-xs sm:text-sm h-8 sm:h-12">{product.name}</h3>
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      {product.originalPrice && product.originalPrice < product.price ? (
                        <>
                          <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.originalPrice)}</span>
                          <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <Button 
                      className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] text-xs sm:text-sm py-1 sm:py-2"
                      onClick={(e) => handleAddToCart(e, product._id)}
                      disabled={cartLoading}
                    >
                      {cartLoading ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Display active promotions for featured tab */}
          {brand.pageSettings?.activePromotions?.filter((promo: any) => promo.displayTab === 'featured').map((promo: any) => (
            <div key={promo._id} className="my-8 group">
              <div className="relative overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
                <div className="relative h-[300px] md:h-[400px]">
                  <Image 
                    src={promo.imageUrl}
                    alt={promo.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 rounded-full mb-3">
                        {promo.displayTab.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">{promo.title}</h3>
                    <p className="text-gray-200 mb-4 line-clamp-2 text-sm md:text-base">{promo.description}</p>
                    {promo.linkUrl && promo.linkText && (
                      <Link href={promo.linkUrl}>
                        <Button 
                          variant="outline" 
                          className="text-white border-white hover:bg-white hover:text-black transition-colors"
                        >
                          {promo.linkText}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="pt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">About {brand.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              {/* Render HTML content if it's HTML formatted */}
              {brand.pageSettings?.aboutContent ? (
                <div 
                  className="text-gray-700 mb-4 text-sm sm:text-base prose prose-sm sm:prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: brand.pageSettings.aboutContent }}
                />
              ) : (
                <>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    {brand.description}
                  </p>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    With a strong commitment to quality and innovation, {brand.name} has established itself as a leading
                    manufacturer in the solar industry since {brand.establishedYear}.
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Headquartered in {brand.headquarters}, {brand.name} products are known for their reliability,
                    efficiency, and excellent warranty terms.
                  </p>
                </>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg h-48 sm:h-64 relative">
              <Image 
                src={brand.thumbnail}
                alt={`${brand.name} Story`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Why Choose {brand.name}?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {brand.pageSettings?.whyChooseReasons?.length > 0 ? (
                brand.pageSettings.whyChooseReasons.map((reason: any, index: number) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-bold mb-2 text-sm sm:text-base">{reason.title}</h4>
                    <p className="text-gray-700 text-sm sm:text-base">{reason.description}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-bold mb-2 text-sm sm:text-base">Quality Assurance</h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      Rigorous testing and quality control processes ensure that all {brand.name} products meet the highest
                      standards of performance and durability.
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-bold mb-2 text-sm sm:text-base">Innovation</h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      Continuous investment in R&D keeps {brand.name} at the forefront of solar technology, delivering
                      cutting-edge solutions to customers worldwide.
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-bold mb-2 text-sm sm:text-base">Global Presence</h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      With operations in multiple countries, {brand.name} has a strong global network that ensures reliable
                      service and support wherever you are.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Display active promotions for about tab */}
          {brand.pageSettings?.activePromotions?.filter((promo: any) => promo.displayTab === 'about' || promo.displayTab === 'all').map((promo: any) => (
            <div key={promo._id} className="my-8 group">
              <div className="relative overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
                <div className="relative h-[300px] md:h-[400px]">
                  <Image 
                    src={promo.imageUrl}
                    alt={promo.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 rounded-full mb-3">
                        {promo.displayTab.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">{promo.title}</h3>
                    <p className="text-gray-200 mb-4 line-clamp-2 text-sm md:text-base">{promo.description}</p>
                    {promo.linkUrl && promo.linkText && (
                      <Link href={promo.linkUrl}>
                        <Button 
                          variant="outline" 
                          className="text-white border-white hover:bg-white hover:text-black transition-colors"
                        >
                          {promo.linkText}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="pt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{brand.name} Support</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Warranty Information</h3>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                {brand.pageSettings?.warrantyInformation || 
                `${brand.name} products come with comprehensive warranty coverage that varies by product line and model. Please refer to the specific product details for exact warranty terms and coverage information.`}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-800 text-sm">
                  Note: Warranty terms, conditions, and coverage periods vary by product. Please check individual product specifications or contact our support team for detailed warranty information specific to your chosen product.
                </p>
              </div>
            </div>
            <div className="p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Technical Support</h3>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                {brand.pageSettings?.technicalSupportInfo ||
                `Need help with your ${brand.name} products? Our technical support team is here to assist you with
                installation, troubleshooting, and maintenance.`}
              </p>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] text-sm sm:text-base">Contact Support</Button>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {brand.pageSettings?.faqs?.length > 0 ? (
                brand.pageSettings.faqs.map((faq: any, index: number) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-bold mb-2 text-sm sm:text-base">{faq.question}</h4>
                    <p className="text-gray-700 text-sm sm:text-base">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-bold mb-2 text-sm sm:text-base">How do I register my {brand.name} product?</h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      You can register your product on the official {brand.name} website or through our customer service
                      portal. Registration is important to activate your warranty.
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-bold mb-2 text-sm sm:text-base">What maintenance do {brand.name} products require?</h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      Most {brand.name} products require minimal maintenance. Regular cleaning to remove dust and debris is
                      recommended to maintain optimal performance.
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-bold mb-2 text-sm sm:text-base">How can I verify if my {brand.name} product is genuine?</h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      All {brand.name} products come with unique serial numbers that can be verified through the official
                      website or by contacting authorized dealers like Solar Express.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Display active promotions for support tab */}
          {brand.pageSettings?.activePromotions?.filter((promo: any) => promo.displayTab === 'support' || promo.displayTab === 'all').map((promo: any) => (
            <div key={promo._id} className="my-8 group">
              <div className="relative overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
                <div className="relative h-[300px] md:h-[400px]">
                  <Image 
                    src={promo.imageUrl}
                    alt={promo.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 rounded-full mb-3">
                        {promo.displayTab.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">{promo.title}</h3>
                    <p className="text-gray-200 mb-4 line-clamp-2 text-sm md:text-base">{promo.description}</p>
                    {promo.linkUrl && promo.linkText && (
                      <Link href={promo.linkUrl}>
                        <Button 
                          variant="outline" 
                          className="text-white border-white hover:bg-white hover:text-black transition-colors"
                        >
                          {promo.linkText}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
