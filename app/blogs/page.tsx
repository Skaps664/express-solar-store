import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export default function BlogsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Solar Express Blog</h1>

      {/* Search and Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="relative mb-6">
            <Input type="text" placeholder="Search articles..." className="w-full pl-10" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {["All", "Solar Panels", "Batteries", "Installation", "Sustainability", "Technology"].map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={category === "All" ? "bg-amber-500 hover:bg-amber-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Article */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-64 md:h-auto bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400">[Featured Article Image]</div>
          </div>
          <div className="p-6">
            <div className="text-amber-600 font-medium mb-2">FEATURED</div>
            <h2 className="text-2xl font-bold mb-3">The Future of Solar Energy: Trends to Watch in 2025</h2>
            <p className="text-gray-600 mb-4">
              Explore the latest innovations in solar technology and how they're shaping the renewable energy landscape
              for homeowners and businesses alike.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="text-gray-400 text-xs">[A]</div>
              </div>
              <span className="text-sm">By Admin</span>
              <span className="text-sm text-gray-500">April 20, 2025</span>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600" asChild>
              <Link href="/blogs/solar-energy-trends-2025">Read More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Grid - compact on mobile (2x2 of first 4), full on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${index >= 4 ? 'hidden md:block' : ''}`}
          >
            <div className="h-28 sm:h-36 md:h-48 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-sm">[Blog Image]</div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="text-xs text-gray-500 mb-1">April {index + 15}, 2025</div>
              <h3 className="font-bold mb-1 text-sm sm:text-base">Solar Energy Article Title {index + 1}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
              <Link
                href={`/blogs/${["how-to-choose-solar-panels", "understanding-net-metering", "solar-battery-storage-worth-investment", "solar-maintenance-tips", "solar-tax-incentives", "solar-myths-debunked"][index % 6]}`}
                className="text-amber-600 text-sm font-medium"
              >
                Read More
              </Link>
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
  )
}
