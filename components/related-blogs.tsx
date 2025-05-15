import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface RelatedBlog {
  title: string
  excerpt: string
  date: string
  image: string
  category: string
  slug: string
}

interface RelatedBlogsProps {
  blogs: RelatedBlog[]
}

export default function RelatedBlogs({ blogs }: RelatedBlogsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#1a5ca4]">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
            <div className="h-48 relative">
              <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
              <div className="absolute top-3 right-3 bg-[#1a5ca4] text-white text-xs px-2 py-1 rounded">
                {blog.category}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                <Calendar className="h-4 w-4" />
                <span>{blog.date}</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-[#1a5ca4]">{blog.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
              <Button variant="outline" className="w-full border-[#1a5ca4] text-[#1a5ca4]" asChild>
                <Link href={`/blogs/${blog.slug}`}>Read More</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
