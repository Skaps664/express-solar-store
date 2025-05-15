import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, SlidersHorizontal } from "lucide-react"

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Filter Products</h2>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                {["Solar Panels", "Inverters", "Batteries", "Mounting Systems", "Accessories"].map((category) => (
                  <div key={category} className="flex items-center">
                    <input type="checkbox" id={category} className="mr-2" />
                    <label htmlFor={category}>{category}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Brands</h3>
              <div className="space-y-2">
                {["SunPower", "Tesla", "LG Solar", "Canadian Solar", "JinkoSolar"].map((brand) => (
                  <div key={brand} className="flex items-center">
                    <input type="checkbox" id={brand} className="mr-2" />
                    <label htmlFor={brand}>{brand}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <Slider defaultValue={[0, 1000]} min={0} max={5000} step={100} className="mb-4" />
              <div className="flex gap-2">
                <Input type="number" placeholder="Min" className="w-1/2" />
                <Input type="number" placeholder="Max" className="w-1/2" />
              </div>
            </div>

            {/* Power Output */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Power Output (W)</h3>
              <div className="space-y-2">
                {["100-200", "200-300", "300-400", "400-500", "500+"].map((range) => (
                  <div key={range} className="flex items-center">
                    <input type="checkbox" id={range} className="mr-2" />
                    <label htmlFor={range}>{range}</label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-amber-500 hover:bg-amber-600">Apply Filters</Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          {/* Sort and View Options */}
          <div className="flex flex-wrap justify-between items-center mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <span>Sort By:</span>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Show:</span>
                <Select>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="20" />
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
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400">[Product Image]</div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">Brand Name</div>
                  <h3 className="font-medium mb-2">Solar Panel {index + 1}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-600 font-bold">$499.99</span>
                    <span className="text-gray-400 line-through text-sm">$599.99</span>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Add to Cart
                    </Button>
                    <Button variant="ghost" size="sm">
                      Compare
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-amber-500 text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
