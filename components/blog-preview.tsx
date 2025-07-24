"use client"

import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { client } from "@/lib/sanity"

type HeadingData = {
  topBlogsHeading: string
}


export default function BlogPreview() {

  const [headingData, setHeadingData] = useState<HeadingData | null>(null)
  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const data: HeadingData = await client.fetch(
          `*[_type == "homePageContent"][0]{ topBlogsHeading }`
        );
        setHeadingData(data);
        
      } catch (error) {
        console.error("Failed to fetch Sanity heading:", error);
      }
    };

    fetchHeading();
  }, [])

  const blogPosts = [
    {
      title: "How to Choose the Right Solar Panels for Your Home",
      excerpt:
        "Learn about the different types of solar panels available and how to select the best option for your specific needs and budget.",
      date: "May 10, 2023",
      image: "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Guides",
      slug: "how-to-choose-solar-panels",
    },
    {
      title: "Understanding Net Metering in Pakistan",
      excerpt:
        "Everything you need to know about net metering policies in Pakistan and how they can help you maximize your solar investment.",
      date: "April 25, 2023",
      image:
        "https://images.unsplash.com/photo-1662601272351-f119c97395ef??auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Policy",
      slug: "understanding-net-metering",
    },
    {
      title: "Solar Battery Storage: Is It Worth the Investment?",
      excerpt:
        "Explore the pros and cons of adding battery storage to your solar system and determine if it's the right choice for your energy needs.",
      date: "April 12, 2023",
      image: "https://images.unsplash.com/photo-1592318348310-f31b61a931c8?q=80&w=1000&auto=format&fit=crop",
      category: "Technology",
      slug: "solar-battery-storage-worth-investment",
    },
  ]

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a5ca4]">{ headingData?.topBlogsHeading || "Latesst from Our Blog"}</h2>
        <Link href="/blogs" className="text-[#f26522] font-medium flex items-center gap-1 hover:underline">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {blogPosts.map((blog, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-all"
          >
            <div className="h-32 md:h-48 bg-gray-100 relative">
              <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
              <div className="absolute top-3 right-3 bg-[#1a5ca4] text-white text-xs px-2 py-1 rounded">
                {blog.category}
              </div>
            </div>
            <div className="p-3 md:p-4">
              <div className="flex items-center gap-1 text-gray-500 text-xs md:text-sm mb-2">
                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                <span>{blog.date}</span>
              </div>
              <h3 className="font-bold text-sm md:text-lg mb-2 text-[#1a5ca4] line-clamp-2">{blog.title}</h3>
              <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">{blog.excerpt}</p>
              <Button variant="outline" className="w-full border-[#1a5ca4] text-[#1a5ca4] text-xs md:text-sm" asChild>
                <Link href={`/blogs/${blog.slug}`}>Read More</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
