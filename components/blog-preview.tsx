import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BlogPreview() {
  const blogPosts = [
    {
      title: "How to Choose the Right Solar Panels for Your Home",
      excerpt:
        "Learn about the different types of solar panels available and how to select the best option for your specific needs and budget.",
      date: "May 10, 2023",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop",
      category: "Guides",
      slug: "how-to-choose-solar-panels",
    },
    {
      title: "Understanding Net Metering in Pakistan",
      excerpt:
        "Everything you need to know about net metering policies in Pakistan and how they can help you maximize your solar investment.",
      date: "April 25, 2023",
      image:
        "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Policy",
      slug: "understanding-net-metering",
    },
    {
      title: "Solar Battery Storage: Is It Worth the Investment?",
      excerpt:
        "Explore the pros and cons of adding battery storage to your solar system and determine if it's the right choice for your energy needs.",
      date: "April 12, 2023",
      image: "https://images.unsplash.com/photo-1637159125633-de3d95ab1c4c?q=80&w=1000&auto=format&fit=crop",
      category: "Technology",
      slug: "solar-battery-storage-worth-investment",
    },
  ]

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a5ca4]">Latest from Our Blog</h2>
        <Link href="/blogs" className="text-[#f26522] font-medium flex items-center gap-1 hover:underline">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPosts.map((blog, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-all"
          >
            <div className="h-48 bg-gray-100 relative">
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
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
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
