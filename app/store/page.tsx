"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import AnalyticsClient from "@/lib/analytics"
import { Grid, List, SlidersHorizontal, Filter, X, ChevronRight, Star, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

interface Filter {
  field: string;
  label?: string;
  type: "select" | "range" | "boolean";
  options?: Array<string | { name?: string; slug?: string }>;
  min?: number;
  max?: number;
  step?: number;
}

interface Product {
  _id: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  brand?: {
    name: string;
    slug: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  reviews?: {
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

export default function StorePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StorePageWithParams />
    </Suspense>
  )
}

function StorePageWithParams() {
  const searchParams = useSearchParams()
  const category = searchParams?.get('category') || undefined
  const search = searchParams?.get('search') || undefined
  
  console.log('🔍 Store search params:', { category, search })
  
  return <StorePageContent category={category} search={search} />
}

function StorePageContent({ category, search }: { category?: string; search?: string }) {
  console.log('🏪 Store component mounted. API_BASE:', API_BASE, 'category:', category, 'search:', search)
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [lastFetchUrl, setLastFetchUrl] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filter[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  })
  const [sort, setSort] = useState('name')
  const [limit, setLimit] = useState(12)
  const [filterState, setFilterState] = useState<Record<string, any>>({})
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch filters for the selected category or general filters
  useEffect(() => {
    const filterCategory = category || 'general'
    console.log('🎯 Fetching filters for category:', filterCategory, 'API_BASE:', API_BASE)
    fetch(`${API_BASE}/api/products/filters/${filterCategory}`)
      .then((res) => {
        console.log('📊 Filters API response status:', res.status)
        return res.json()
      })
      .then((data) => {
        console.log('📊 Filters API response data:', data)
        setFilters(data.filters || [])
        console.log('📊 Filters state set to:', data.filters || [])
      })
      .catch(err => console.error('❌ Error fetching filters:', err))
  }, [category])

  // Fetch products when category, filters, sort, or pagination changes
  useEffect(() => {
    setLoading(true)
    // Build params using shared helper to ensure consistent encoding
    const extras: Record<string, string | number> = {}
    if (category) extras.category = category
    if (search) extras.search = search
    extras.sort = sort
    extras.page = pagination.page
    extras.limit = limit

    // Use dynamic import to load the filter utility
    import('@/lib/utils/filterUtils').then(({ buildProductQueryParams }) => {
      const params = buildProductQueryParams(filterState, extras)
      const fetchUrl = `${API_BASE}/api/products?${params.toString()}`
      console.log('🔍 Fetching products with URL:', fetchUrl)
      console.log('🔍 Search term being sent:', search)
      setLastFetchUrl(fetchUrl)
      fetch(fetchUrl)
        .then((res) => {
          console.log('🔍 Products API response status:', res.status)
          return res.json()
        })
        .then((data) => {
          console.log('🔍 Products API response data:', data)
          console.log('🔍 Number of products returned:', data.products?.length || 0)
          setProducts(data.products || [])
          setPagination(data.pagination || { page: 1, pages: 1, total: 0, limit: 12 })
          setLoading(false)
        })
        .catch((err) => {
          console.error('❌ Failed to fetch products:', err)
          setLoading(false)
        })
    }).catch(err => {
      console.error('❌ Failed to build query params:', err)
      setLoading(false)
    })
  }, [category, filterState, sort, pagination.page, limit, search])

  // Reset pagination on category, filter, or sort change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [category, filterState, sort])

  // Handle filter changes (normalize booleans/numbers/empty)
  const handleFilterChange = (field: string, value: string | number | boolean | undefined) => {
    console.log('🎯 Store Filter Change:', { field, value, type: typeof value })

    let normalized: any = value
    if (value === "" || value === undefined) {
      normalized = undefined
    } else if (value === 'true' || value === true) {
      normalized = true
    } else if (value === 'false' || value === false) {
      normalized = false
    } else if (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value)) {
      // numeric string -> number
      normalized = Number(value)
    }

    setFilterState((prev) => { 
      const newState = { ...prev, [field]: normalized }
      console.log('🎯 New Filter State:', newState)
      return newState
    })
  }

  // Special handler for category filter change - needs to reload filters
  const handleCategoryFilterChange = (newCategory: string | undefined) => {
    // Update the filter state with the selected category value
    handleFilterChange('category', newCategory)

    // Remove previous category-specific filter entries from the filter state
    // so that old category fields (eg. inverterType, panelType_min, etc.) do not linger
    setFilterState((prev) => {
      const prevFields = (filters || []).map(f => f.field)
      const newState = { ...prev, category: newCategory }
      prevFields.forEach((f) => {
        if (f && f !== 'category' && f !== 'brand') {
          delete newState[f]
          delete newState[`${f}_min`]
          delete newState[`${f}_max`]
        }
      })
      return newState
    })

    // Fetch new filters for the selected category and merge them into sidebar
    const filterCategory = newCategory || 'general'
    fetch(`${API_BASE}/api/products/filters/${filterCategory}`)
      .then((res) => res.json())
      .then((data) => {
        try {
          let newFilters: Filter[] = data.filters || []

          // Helper to normalize category options to objects { name, slug }
          const normalizeCategoryOptions = (opts: any[] = []) => {
            return opts.map((opt) => {
              if (opt && typeof opt === 'object' && (opt.slug || opt.name)) return opt
              if (typeof opt === 'string') {
                const slug = opt.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                return { name: opt, slug }
              }
              return opt
            })
          }

          // Normalize options for category field or other object-ish options
          newFilters = newFilters.map((f: any) => {
            if (f.field === 'category' && Array.isArray(f.options)) {
              return { ...f, options: normalizeCategoryOptions(f.options) }
            }
            // If options are strings for other fields, leave as-is but keep consistent shape
            if (Array.isArray(f.options)) {
              return { ...f, options: f.options }
            }
            return f
          })

          // Ensure we keep a top-level category selector if the previous filters included one
          const defaultCategoryFilter = (filters || []).find(f => f.field === 'category')
          if (defaultCategoryFilter) {
            // remove duplicate category entries from newFilters
            newFilters = newFilters.filter((f: any) => f.field !== 'category')
            newFilters = [defaultCategoryFilter, ...newFilters]
          }

          setFilters(newFilters)
        } catch (err) {
          console.error('Error processing category filters:', err)
          setFilters(data.filters || [])
        }
      })
      .catch(err => console.error('Error fetching filters:', err))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilterState({})
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Remove specific filter
  const removeFilter = (field: string) => {
    setFilterState(prev => {
      const newFilters = { ...prev }
      delete newFilters[field]
      return newFilters
    })
  }

  // Count active filters
  const activeFilterCount = Object.keys(filterState).filter(key => 
    filterState[key] !== undefined && filterState[key] !== '' && filterState[key] !== false
  ).length

  // Handle sort and limit changes
  const handleSortChange = (value: string) => setSort(value)
  const handleLimitChange = (value: string) => setLimit(Number(value))

  // Handle pagination
  const goToPage = (page: number) => setPagination((prev) => ({ ...prev, page }))

  // Handle product click (prevents undefined error and can be extended for analytics)
  const handleProductClick = (id: string, slug: string) => {
    try {
      // Example: simple navigation to product page; keep preventDefault behavior in callers
      console.log('🧭 Product clicked:', { id, slug })
      // If you want client-side navigation uncomment the next line
      // window.location.href = `/product/${slug || id}`
    } catch (err) {
      console.error('Error handling product click:', err)
    }
  }

  // Render filter component
  const renderFilter = (filter: Filter) => {
    const value = filterState[filter.field]

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.field} className="space-y-2">
            <label className="text-sm font-medium">{filter.label || filter.field}</label>
            <Select value={value || 'all'} onValueChange={(val) => {
              // Use special handler for category filter
              if (filter.field === 'category') {
                handleCategoryFilterChange(val === 'all' ? undefined : val)
              } else {
                handleFilterChange(filter.field, val === 'all' ? undefined : val)
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${filter.label || filter.field}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label || filter.field}s</SelectItem>
                {filter.options?.map((option, idx) => {
                  // option can be a string or an object like { name, slug }
                  const value = typeof option === 'string' ? option : (option.slug || option.name || String(idx))
                  const label = typeof option === 'string' ? option : (option.name || option.slug || String(option))
                  return (
                    <SelectItem key={value + '-' + idx} value={value}>{label}</SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        )

      case 'range':
        return (
          <div key={filter.field} className="space-y-2">
            <label className="text-sm font-medium">{filter.label || filter.field}</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filterState[`${filter.field}_min`] || ''}
                onChange={(e) => handleFilterChange(`${filter.field}_min`, e.target.value || undefined)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filterState[`${filter.field}_max`] || ''}
                onChange={(e) => handleFilterChange(`${filter.field}_max`, e.target.value || undefined)}
                className="flex-1"
              />
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
            <label htmlFor={filter.field} className="text-sm font-medium">
              {filter.label || filter.field}
            </label>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div key={category || 'store-root'} className="container mx-auto px-4 py-8">
      {/* Debug panel for troubleshooting filter issues */}
      {/* <div className="mb-4 p-4 bg-yellow-50 border rounded">
        <div className="text-sm text-gray-700">API Base: <strong>{API_BASE || 'NOT SET'}</strong></div>
        <div className="text-sm text-gray-700">Current Filters: <code>{JSON.stringify(filterState)}</code></div>
        <div className="text-sm text-gray-700">Last Fetch URL: <code>{lastFetchUrl || 'none'}</code></div>
      </div> */}
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/" className="text-gray-500 hover:text-[#1a5ca4]">Home</Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-[#1a5ca4]">Store</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a5ca4]">
          Solar Express Store
        </h1>
        <p className="text-gray-600 text-lg">
          Discover our complete range of solar products from trusted brands worldwide
        </p>
      </div>

      {/* Quick Category Links */}
    

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setShowMobileFilters(true)}
            className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] text-white flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </div>

        {/* Mobile Filter Modal/Overlay */}
        {showMobileFilters && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Filter Products</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)} className="text-gray-500">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="overflow-y-auto max-h-[60vh] p-4 space-y-6">
                {filters.map(renderFilter)}
              </div>
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearAllFilters}
                  >
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
        <div className="hidden md:block w-full md:w-1/4">
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
                    {Object.entries(filterState).map(([key, value]) => {
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

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          {/* Sort and View Options */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 border rounded-lg bg-gray-50 gap-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-sm text-gray-600">
                {pagination.total} products found
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm">Sort:</span>
                <Select onValueChange={handleSortChange} value={sort}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="top_selling">Top Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm">Show:</span>
                <Select onValueChange={handleLimitChange} value={String(limit)}>
                  <SelectTrigger className="w-full sm:w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              {/* <div className="flex gap-1">
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
              </div> */}
            </div>
          </div>

          {/* Products */}
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
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-4"
              }>
                {products.map((product, index) => (
                  <ProductCard
                    key={product._id || index}
                    product={product}
                    viewMode={viewMode}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => goToPage(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className={pagination.page === i + 1 ? "bg-[#1a5ca4] text-white" : ""}
                        onClick={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => goToPage(pagination.page + 1)}
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
  onProductClick 
}: { 
  product: Product
  viewMode: 'grid' | 'list'
  onProductClick: (id: string, slug: string) => void 
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
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{product.brand?.name}</p>
                  <Link
                    href={`/product/${product.slug || product._id}`}
                    onClick={() => onProductClick(product._id, product.slug || product._id)}
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
                  {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
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
        <Link href={`/product/${product.slug || product._id}`} onClick={() => onProductClick(product._id, product.slug || product._id)}>
          <div className="relative">
            <div className="aspect-square relative bg-gray-100 overflow-hidden">
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
                onClick={(e) => e.preventDefault()}
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
            <p className="text-xs text-gray-500 mb-1">{product.brand?.name}</p>
            <h3 className="font-medium hover:text-[#1a5ca4] line-clamp-2 mb-2">
              {product.name}
            </h3>

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
              <span className="text-lg font-bold text-[#1a5ca4]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-xs text-orange-600 mb-2">
                Only {product.stock} left!
              </p>
            )}
          </div>
        </Link>
        
        <div className="px-4 pb-4">
          <Button
            className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a]"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault()
              // Add to cart logic here
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}