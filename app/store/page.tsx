"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, SlidersHorizontal } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export default function StorePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StorePage />
    </Suspense>
  )
}

function StorePage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const key = pathname + "?" + searchParams.toString()

  const category = searchParams.get("category") || ""
  const search = searchParams.get("search") || ""
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 })
  const [filterState, setFilterState] = useState({})
  const [sort, setSort] = useState("newest")
  const [limit, setLimit] = useState(20)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Fetch filters for the selected category
  useEffect(() => {
    if (category) {
      fetch(`${API_BASE}/api/products/filters/${category}`)
        .then((res) => res.json())
        .then((data) => setFilters(data.filters || []))
    } else {
      setFilters([])
    }
  }, [category])

  // Fetch products when category, filters, sort, or pagination changes
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (search) params.append("search", search)
    Object.entries(filterState).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== false) params.append(key, value)
    })
    params.append("sort", sort)
    params.append("page", String(pagination.page))
    params.append("limit", String(limit))

    console.log("Fetching:", `/api/products?${params.toString()}`)

    fetch(`${API_BASE}/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data)
        setProducts(data.products || [])
        setPagination(data.pagination || { page: 1, pages: 1, total: 0, limit: 20 })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category, filterState, sort, pagination.page, limit])

  // Reset pagination on category, filter, or sort change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [category, filterState, sort])

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilterState((prev) => ({ ...prev, [field]: value }))
    setPagination((prev) => ({ ...prev, page: 1 })) // Reset to first page on filter change
  }

  // Handle sort and limit changes
  const handleSortChange = (value) => setSort(value)
  const handleLimitChange = (value) => setLimit(Number(value))

  // Handle pagination
  const goToPage = (page) => setPagination((prev) => ({ ...prev, page }))

  return (
    <div key={key} className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setShowMobileFilters(true)}
            className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] text-white flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {Object.keys(filterState).length > 0 && `(${Object.keys(filterState).length})`}
          </Button>
        </div>

        {/* Mobile Filter Modal/Overlay */}
        {showMobileFilters && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Filter Products</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)} className="text-gray-500">
                  ✕
                </Button>
              </div>
              <div className="overflow-y-auto max-h-[60vh] p-4">
                {/* Render dynamic filters */}
                {filters.map((filter) => (
                  <div className="mb-6" key={filter.field}>
                    <h3 className="font-medium mb-2">{filter.label || filter.field}</h3>
                    {filter.type === "select" && (
                      <Select onValueChange={(v) => handleFilterChange(filter.field, v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${filter.label || filter.field}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Brand1">Brand1</SelectItem>
                          <SelectItem value="Brand2">Brand2</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {filter.type === "range" && (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          className="flex-1"
                          onBlur={(e) => handleFilterChange(`${filter.field}_min`, e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          className="flex-1"
                          onBlur={(e) => handleFilterChange(`${filter.field}_max`, e.target.value)}
                        />
                      </div>
                    )}
                    {filter.type === "boolean" && (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={filter.field}
                          onChange={(e) => handleFilterChange(filter.field, e.target.checked)}
                        />
                        <label htmlFor={filter.field}>{filter.label || filter.field}</label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setFilterState({})
                      goToPage(1)
                    }}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1 bg-[#f26522] hover:bg-[#e55511]"
                    onClick={() => {
                      setShowMobileFilters(false)
                      goToPage(1)
                    }}
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Filter Products</h2>
            {/* Render dynamic filters */}
            {filters.map((filter) => (
              <div className="mb-6" key={filter.field}>
                <h3 className="font-medium mb-2">{filter.label || filter.field}</h3>
                {filter.type === "select" && (
                  <Select onValueChange={(v) => handleFilterChange(filter.field, v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${filter.label || filter.field}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brand1">Brand1</SelectItem>
                      <SelectItem value="Brand2">Brand2</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {filter.type === "range" && (
                  <div>
                    <Input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 mb-2"
                      onBlur={(e) => handleFilterChange(`${filter.field}_min`, e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      className="w-1/2"
                      onBlur={(e) => handleFilterChange(`${filter.field}_max`, e.target.value)}
                    />
                  </div>
                )}
                {filter.type === "boolean" && (
                  <div>
                    <input
                      type="checkbox"
                      id={filter.field}
                      onChange={(e) => handleFilterChange(filter.field, e.target.checked)}
                    />
                    <label htmlFor={filter.field}> {filter.label || filter.field}</label>
                  </div>
                )}
              </div>
            ))}
            <Button className="w-full bg-amber-500 hover:bg-amber-600" onClick={() => goToPage(1)}>
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          {/* Sort and View Options */}
          <div className="flex flex-wrap justify-between items-center mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <span>Sort By:</span>
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Show:</span>
                <Select onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder={String(limit)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div>Loading...</div>
            ) : products.length === 0 ? (
              <div>No products found.</div>
            ) : (
              products.map((product, index) => (
                <div
                  key={product._id || index}
                  className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="object-contain h-full"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{product.brand?.name}</div>
                    <h3 className="font-medium mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-amber-600 font-bold">PKR {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">PKR {product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
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
              {Array.from({ length: pagination.pages }, (_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className={pagination.page === i + 1 ? "bg-amber-500 text-white" : ""}
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
        </div>
      </div>
    </div>
  )
}
