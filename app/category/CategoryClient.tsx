"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import AnalyticsClient from "@/lib/analytics"
import { Grid, List, SlidersHorizontal, Filter, X, ChevronRight, Star, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { toast } from "react-hot-toast"

// Runtime-safe API URL builder - evaluates environment at call time
const buildApiUrl = (path: string) => {
  // Check env vars at runtime to handle SSR/client differences
  const apiBase = (typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE : process.env.NEXT_PUBLIC_API_BASE) || 'http://localhost:3000'
  return `${apiBase}${path}`
}

interface CategoryPageProps {
  params: { categorySlug: string }
}

interface Filter {
  field: string;
  label: string;
  type: "select" | "range" | "boolean";
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  brand: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
  };
  reviews: {
    rating: number;
    count: number;
  };
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
}

// Format price in PKR with commas
const formatPrice = (price: number) => {
  return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

// Get category display info dynamically from backend
const fetchCategoryInfo = async (slug: string) => {
  try {
    const response = await fetch(buildApiUrl(`/api/category/${slug}`))
    if (!response.ok) {
      // If category not found by slug, try to find by name
      const allCategoriesResponse = await fetch(buildApiUrl(`/api/category`))
      if (allCategoriesResponse.ok) {
        const allCategories = await allCategoriesResponse.json()
        const category = allCategories.find((cat: any) => 
          cat.name.toLowerCase().replace(/\s+/g, '-') === slug ||
          cat.slug === slug ||
          cat.name.toLowerCase() === slug.toLowerCase()
        )
        
        if (category) {
          return {
            title: `${category.name}`,
            description: category.description || `Browse our wide selection of ${category.name.toLowerCase()}`,
            icon: '',
            apiSlug: category.slug || category.name,
            category: category
          }
        }
      }
      throw new Error(`Category not found: ${slug}`)
    }
    
    const category = await response.json()
    return {
      title: `${category.name}`,
      description: category.description || `Browse our wide selection of ${category.name.toLowerCase()}`,
      icon: '',
      apiSlug: category.slug || category.name,
      category: category
    }
  } catch (error) {
    console.error('Error fetching category info:', error)
    // Fallback: use the slug as-is
    return {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
      description: 'Browse our wide selection of solar products',
      icon: '',
      apiSlug: slug,
      category: null
    }
  }
}

function CategoryClientComponent({ params }: CategoryPageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  // `params` is passed from the server wrapper as an object: { categorySlug }
  const categorySlug = (params as any).categorySlug
  const { addToCart, loading: cartLoading } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<Filter[]>([])
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 12 })
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [categoryInfo, setCategoryInfo] = useState<any>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  // Fetch category info from backend
  useEffect(() => {
    async function loadCategoryInfo() {
      setCategoryError(null)
      try {
        const info = await fetchCategoryInfo(categorySlug)
        setCategoryInfo(info)
      } catch (error) {
        console.error('Error loading category info:', error)
        setCategoryError('Failed to load category information')
      }
    }
    loadCategoryInfo()
  }, [categorySlug])

  const backendSlug = categoryInfo?.apiSlug || categorySlug

  // Track product click
  const handleProductClick = (productId: string, productSlug: string) => {
    const analytics = AnalyticsClient.getInstance()
    analytics.trackProductClick(productId, productSlug)
  }

  // Fetch filters for the category
  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await fetch(buildApiUrl(`/api/products/filters/${backendSlug}`))
        const data = await response.json()
        if (data.success) {
          setFilters(data.filters || [])
        }
      } catch (error) {
        console.error('Error fetching filters:', error)
      }
    }
    fetchFilters()
  }, [backendSlug])

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        // Build params using shared helper to ensure consistent encoding
        const extras: Record<string, string | number> = {}
        extras.category = backendSlug
        extras.sort = sortBy
        extras.page = pagination.page
        extras.limit = pagination.limit

        const { buildProductQueryParams } = await import('@/lib/utils/filterUtils')
        const params = buildProductQueryParams(appliedFilters, extras)

        const response = await fetch(`${buildApiUrl(`/api/products`)}?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          setProducts(data.products || [])
          setPagination(data.pagination || { page: 1, pages: 1, total: 0, limit: 12 })
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [backendSlug, appliedFilters, sortBy, pagination.page, pagination.limit])

  // Handle filter change
  const handleFilterChange = (field: string, value: any) => {
    setAppliedFilters(prev => ({
      ...prev,
      [field]: value === "" || value === undefined ? undefined : value
    }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setAppliedFilters({})
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Remove specific filter
  const removeFilter = (field: string) => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[field]
      return newFilters
    })
  }

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (cartLoading) return
    
    try {
      await addToCart({ productId, quantity: 1 })
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error('Failed to add product to cart')
    }
  }

  // Render filter component
  const renderFilter = (filter: Filter) => {
    const value = appliedFilters[filter.field]

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.field} className="space-y-2">
            <label className="text-sm font-medium">{filter.label}</label>
            <Select value={value || 'all'} onValueChange={(val) => handleFilterChange(filter.field, val === 'all' ? undefined : val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}s</SelectItem>
                {filter.options?.map((option) => {
                  const value = typeof option === 'string' ? option : option.slug || option.name || String(option)
                  const label = typeof option === 'string' ? option : option.name || option.slug || String(option)
                  return <SelectItem key={value} value={value}>{label}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
        )

      case 'range':
        return (
          <div key={filter.field} className="space-y-2">
            <label className="text-sm font-medium">{filter.label}</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={appliedFilters[`${filter.field}_min`] || ''}
                  onChange={(e) => handleFilterChange(`${filter.field}_min`, e.target.value || undefined)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={appliedFilters[`${filter.field}_max`] || ''}
                  onChange={(e) => handleFilterChange(`${filter.field}_max`, e.target.value || undefined)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )

      case 'boolean':
        return (
          <div key={filter.field} className="flex items-center space-x-2">
            <Checkbox
              id={filter.field}
              checked={value || false}
              onCheckedChange={(checked) => handleFilterChange(filter.field, checked)}
            />
            <label htmlFor={filter.field} className="text-sm font-medium">{filter.label}</label>
          </div>
        )

      default:
        return null
    }
  }

  // Count active filters
  const activeFilterCount = Object.keys(appliedFilters).filter(key => 
    appliedFilters[key] !== undefined && appliedFilters[key] !== '' && appliedFilters[key] !== false
  ).length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-[#1a5ca4]">Home</Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <Link href="/store" className="text-gray-500 hover:text-[#1a5ca4]">Store</Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-[#1a5ca4]">{categoryInfo?.title || categorySlug || 'Category'}</span>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        {categoryError ? (
          <div className="text-red-600 p-4 border border-red-200 rounded bg-red-50">
            Error: {categoryError}
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a5ca4]">
              {categoryInfo?.title || (categorySlug ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Products` : 'Products')}
            </h1>
            <p className="text-gray-600 text-lg">
              {categoryInfo?.description || 'Browse our wide selection of solar products'}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <Button
            onClick={() => setShowMobileFilters(true)}
            className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] text-white flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Filter Products</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="overflow-y-auto max-h-[60vh] p-4 space-y-6">
                {filters.map(renderFilter)}
              </div>
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                  <Button
                    className="flex-1 bg-[#1a5ca4] hover:bg-[#0e4a8a]"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(appliedFilters).map(([key, value]) => {
                      if (value && value !== '' && value !== false) {
                        const filter = filters.find(f => f.field === key || key.startsWith(f.field))
                        const label = filter?.label || key
                        return (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {label}: {String(value)}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
                              onClick={() => removeFilter(key)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {filters.map(renderFilter)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {pagination.total} products found
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="top_selling">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a5ca4] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={clearAllFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {products.map((product: any) => {
                  const discountPercentage = product.originalPrice && product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0

                  if (viewMode === 'list') {
                    return (
                      <Link key={product._id} href={`/product/${product.slug || product._id}`} onClick={() => handleProductClick(product._id, product.slug)}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            <div className="flex">
                              <div className="w-48 h-32 relative flex-shrink-0">
                                <Image
                                  src={product.images?.[0] || '/placeholder-product.jpg'}
                                  alt={product.name}
                                  fill
                                  className="object-contain transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                                />
                                <Image
                                  src={product.images?.[1] || product.images?.[0] || '/placeholder-product.jpg'}
                                  alt={`${product.name} - 2`}
                                  fill
                                  className="absolute inset-0 object-contain opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                                />
                                {product.isNewArrival && (
                                  <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
                                )}
                                {product.isBestSeller && (
                                  <Badge className="absolute top-2 right-2 bg-orange-500">Best Seller</Badge>
                                )}
                                {discountPercentage > 0 && (
                                  <Badge className="absolute bottom-2 left-2 bg-red-500">
                                    -{discountPercentage}%
                                  </Badge>
                                )}
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">{product.brand?.name}</p>
                                    <h3 className="font-medium hover:text-[#1a5ca4] line-clamp-2">
                                      {product.name}
                                    </h3>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < Math.floor(product.reviews?.rating || 0)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    ({product.reviews?.count || 0} reviews)
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-[#1a5ca4]">
                                      {formatPrice(product.price)}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                      <span className="text-sm text-gray-500 line-through">
                                        {formatPrice(product.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    className="bg-[#1a5ca4] hover:bg-[#0e4a8a]"
                                    disabled={product.stock === 0 || cartLoading}
                                    onClick={(e) => handleAddToCart(e, product._id)}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    {product.stock === 0 ? 'Sold Out' : cartLoading ? 'Adding...' : 'Add to Cart'}
                                  </Button>
                                </div>
                                
                                {product.stock <= 5 && product.stock > 0 && (
                                  <p className="text-xs text-orange-600 mt-2">
                                    Only {product.stock} left in stock!
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  }

                  return (
                    <Link key={product._id} href={`/product/${product.slug || product._id}`} onClick={() => handleProductClick(product._id, product.slug)}>
                      <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-colors group">
                        <div className="aspect-square relative bg-gray-100 overflow-hidden">
                          {/* Primary image */}
                          <Image 
                            src={product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                          />
                          {/* Secondary image (hover) */}
                          <Image 
                            src={product.images?.[1] || product.images?.[0] || '/placeholder-product.jpg'}
                            alt={`${product.name} - 2`}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                          />

                          {product.isNewArrival && (
                            <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
                          )}
                          {product.isBestSeller && (
                            <Badge className="absolute top-8 left-2 bg-orange-500">Best Seller</Badge>
                          )}
                          {discountPercentage > 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-red-500">
                              -{discountPercentage}%
                            </Badge>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">{product.brand?.name}</p>
                          <h3 className="font-medium mb-2 line-clamp-2">{product.name}</h3>

                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.reviews?.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              ({product.reviews?.count || 0})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            {product.originalPrice && product.originalPrice > product.price ? (
                              <>
                                <span className="text-[#1a5ca4] font-bold text-sm">{formatPrice(product.originalPrice)}</span>
                                <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
                              </>
                            ) : (
                              <span className="text-[#1a5ca4] font-bold text-sm">{formatPrice(product.price)}</span>
                            )}
                          </div>

                          {product.stock <= 5 && product.stock > 0 && (
                            <p className="text-xs text-orange-600 mb-2">
                              Only {product.stock} left!
                            </p>
                          )}
                          
                          <Button 
                            className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] text-sm py-2"
                            onClick={(e) => handleAddToCart(e, product._id)}
                            disabled={product.stock === 0 || cartLoading}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.stock === 0 ? 'Sold Out' : cartLoading ? 'Adding...' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={pagination.page === page ? "default" : "outline"}
                          onClick={() => setPagination(prev => ({ ...prev, page }))}
                          className={pagination.page === page ? "bg-[#1a5ca4]" : ""}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({ 
  product, 
  viewMode, 
  onProductClick,
  onAddToCart
}: { 
  product: Product
  viewMode: 'grid' | 'list'
  onProductClick: (id: string, slug: string) => void
  onAddToCart: (product: Product, e?: React.MouseEvent) => void
}) {
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="flex">
            <div className="w-48 h-32 relative flex-shrink-0">
              <Image
                src={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-contain"
              />
              {product.isNewArrival && (
                <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
              )}
              {product.isBestSeller && (
                <Badge className="absolute top-2 right-2 bg-orange-500">Best Seller</Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute bottom-2 left-2 bg-red-500">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={() => onProductClick(product._id, product.slug)}
                    className="font-medium hover:text-[#1a5ca4] line-clamp-2"
                  >
                    {product.name}
                  </Link>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.reviews?.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviews?.count || 0} reviews)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#1a5ca4]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="bg-[#1a5ca4] hover:bg-[#0e4a8a]"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
              
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-xs text-orange-600 mt-2">
                  Only {product.stock} left in stock!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden">
            {/* Primary image */}
            <Image
              src={product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-contain transition-opacity duration-300 ease-in-out group-hover:opacity-0"
            />
            {/* Secondary image (hover) */}
            <Image
              src={product.images?.[1] || product.images?.[0] || '/placeholder-product.jpg'}
              alt={`${product.name} - 2`}
              fill
              className="absolute inset-0 object-contain opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-105"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          {product.isNewArrival && (
            <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
          )}
          {product.isBestSeller && (
            <Badge className="absolute top-8 left-2 bg-orange-500">Best Seller</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="absolute bottom-2 left-2 bg-red-500">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>
          <Link
            href={`/product/${product.slug}`}
            onClick={() => onProductClick(product._id, product.slug)}
            className="font-medium hover:text-[#1a5ca4] line-clamp-2 mb-2 block"
          >
            {product.name}
          </Link>

          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.reviews?.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews?.count || 0})
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-[#1a5ca4]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <Button
            className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a]"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-orange-600 mt-2 text-center">
              Only {product.stock} left!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CategoryClient(props: CategoryPageProps) {
  return CategoryClientComponent(props)
}
