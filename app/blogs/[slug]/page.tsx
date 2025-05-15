import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// This would come from your API in a real implementation
const getBlogBySlug = (slug: string) => {
  // Sample blog data
  const blogs = [
    {
      slug: "how-to-choose-solar-panels",
      title: "How to Choose the Right Solar Panels for Your Home",
      excerpt:
        "Learn about the different types of solar panels available and how to select the best option for your specific needs and budget.",
      content: `
        <p>Choosing the right solar panels for your home is a significant decision that can impact your energy production and savings for decades to come. This comprehensive guide will walk you through the key factors to consider when selecting solar panels.</p>
        
        <h2>Types of Solar Panels</h2>
        
        <p>There are three main types of solar panels available for residential use:</p>
        
        <h3>Monocrystalline Solar Panels</h3>
        <p>Monocrystalline panels are made from a single crystal structure, giving them a uniform black appearance. They are the most efficient type of solar panel, typically converting 20-22% of sunlight into electricity. They also have the longest lifespan, often coming with 25-year warranties.</p>
        
        <h3>Polycrystalline Solar Panels</h3>
        <p>Polycrystalline panels are made from multiple crystal structures, giving them a blueish speckled appearance. They are slightly less efficient than monocrystalline panels (15-17% efficiency) but are more affordable. They typically come with 25-year warranties as well.</p>
        
        <h3>Thin-Film Solar Panels</h3>
        <p>Thin-film panels are made by depositing a thin layer of photovoltaic material onto a substrate. They are the least efficient (10-13% efficiency) but are flexible and lightweight. They are less common for residential installations but may be suitable for certain applications.</p>
        
        <h2>Key Factors to Consider</h2>
        
        <h3>Efficiency</h3>
        <p>Panel efficiency refers to how much of the sun's energy the panel can convert into electricity. Higher efficiency panels will generate more electricity in the same amount of space, which is particularly important if you have limited roof space.</p>
        
        <h3>Power Output (Wattage)</h3>
        <p>Solar panels are rated by their power output in watts. Most residential panels range from 250W to 400W. Higher wattage panels will generate more electricity, but they may also be larger and more expensive.</p>
        
        <h3>Temperature Coefficient</h3>
        <p>Solar panels become less efficient as they heat up. The temperature coefficient tells you how much the panel's efficiency will decrease for each degree above 25°C (77°F). Look for panels with a lower temperature coefficient, especially if you live in a hot climate.</p>
        
        <h3>Warranty</h3>
        <p>Most solar panels come with two warranties: a product warranty (typically 10-12 years) and a performance warranty (typically 25 years). The performance warranty guarantees that the panel will still produce at least 80% of its rated power after 25 years.</p>
        
        <h3>Brand and Manufacturer</h3>
        <p>Choose panels from reputable manufacturers with a proven track record. Some of the top solar panel brands include SunPower, LG, Panasonic, Canadian Solar, and Jinko Solar.</p>
        
        <h3>Cost and Value</h3>
        <p>While it may be tempting to choose the cheapest panels, consider the long-term value. More efficient panels may cost more upfront but could save you more money over their lifetime by generating more electricity.</p>
        
        <h2>Sizing Your Solar System</h2>
        
        <p>To determine how many solar panels you need, you'll need to consider:</p>
        
        <ul>
          <li>Your energy consumption (in kWh)</li>
          <li>The amount of sunlight your location receives</li>
          <li>The efficiency and wattage of the panels you choose</li>
          <li>The available space on your roof</li>
        </ul>
        
        <p>A professional solar installer can help you calculate the optimal system size for your needs.</p>
        
        <h2>Conclusion</h2>
        
        <p>Selecting the right solar panels involves balancing efficiency, cost, quality, and your specific energy needs. By understanding the different types of panels and key factors to consider, you can make an informed decision that will provide clean, renewable energy for your home for decades to come.</p>
        
        <p>At Solar Express, we offer a wide range of high-quality solar panels from top manufacturers. Our solar experts can help you choose the perfect panels for your home and budget. Contact us today for a free consultation!</p>
      `,
      date: "May 10, 2023",
      author: {
        name: "Ahmed Khan",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        title: "Solar Energy Specialist",
      },
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop",
      category: "Guides",
      tags: ["Solar Panels", "Residential Solar", "Energy Efficiency", "Buying Guide"],
      relatedPosts: [
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
      ],
    },
    {
      slug: "understanding-net-metering",
      title: "Understanding Net Metering in Pakistan",
      excerpt:
        "Everything you need to know about net metering policies in Pakistan and how they can help you maximize your solar investment.",
      content: `
        <p>Net metering is a billing mechanism that credits solar energy system owners for the electricity they add to the grid. This guide explains how net metering works in Pakistan and how it can benefit homeowners with solar installations.</p>
        
        <h2>What is Net Metering?</h2>
        
        <p>Net metering allows residential and commercial customers who generate their own electricity from solar power to feed electricity they do not use back into the grid. This billing arrangement credits solar customers against their electricity consumption, effectively using the grid as a giant battery.</p>
        
        <h2>Net Metering in Pakistan</h2>
        
        <p>Pakistan introduced net metering regulations in 2015, allowing solar system owners to sell excess electricity back to the grid. The National Electric Power Regulatory Authority (NEPRA) oversees these regulations, which have been updated several times to improve the process.</p>
        
        <h3>How Net Metering Works in Pakistan</h3>
        
        <ol>
          <li><strong>Installation:</strong> A bidirectional meter is installed that can measure both the electricity you consume from the grid and the excess electricity your solar system feeds back into the grid.</li>
          <li><strong>Billing:</strong> At the end of each billing cycle, you are charged only for the "net" energy used. If you generated more electricity than you consumed, you receive a credit on your next bill.</li>
          <li><strong>Rate:</strong> The rate at which you are credited for excess electricity is determined by NEPRA and is typically around 19.32 PKR per kWh (as of 2023).</li>
        </ol>
        
        <h2>Benefits of Net Metering</h2>
        
        <h3>Financial Savings</h3>
        <p>Net metering can significantly reduce your electricity bills by offsetting your consumption with the electricity you generate. In some cases, customers may even receive payments from the utility company if they consistently generate more than they consume.</p>
        
        <h3>Faster Return on Investment</h3>
        <p>With net metering, your solar investment can pay for itself more quickly because you're getting value for every kilowatt-hour your system produces, even when you're not using the electricity yourself.</p>
        
        <h3>Environmental Benefits</h3>
        <p>By feeding clean, renewable energy back into the grid, you're helping to reduce the overall carbon footprint of Pakistan's electricity generation.</p>
        
        <h2>How to Apply for Net Metering in Pakistan</h2>
        
        <p>The process to apply for net metering in Pakistan involves several steps:</p>
        
        <ol>
          <li>Submit an application to your local Distribution Company (DISCO)</li>
          <li>Technical feasibility study by the DISCO</li>
          <li>Approval and signing of the net metering agreement</li>
          <li>Installation of the bidirectional meter</li>
          <li>Inspection and commissioning of the system</li>
        </ol>
        
        <p>The entire process typically takes 30-45 days from application to commissioning.</p>
        
        <h2>Requirements for Net Metering</h2>
        
        <p>To qualify for net metering in Pakistan, you need:</p>
        
        <ul>
          <li>A grid-connected solar system (not off-grid)</li>
          <li>System capacity between 1 kW and 1 MW</li>
          <li>Compliance with technical standards set by NEPRA</li>
          <li>A three-phase connection (for systems above 5 kW)</li>
        </ul>
        
        <h2>Challenges and Considerations</h2>
        
        <h3>Bureaucratic Process</h3>
        <p>The application process can be bureaucratic and time-consuming. Working with an experienced solar installer who can handle the paperwork can make this process smoother.</p>
        
        <h3>Technical Requirements</h3>
        <p>Your solar system must meet specific technical requirements to be eligible for net metering. Ensure your installer is familiar with these requirements.</p>
        
        <h3>Grid Reliability</h3>
        <p>Net metering works best when the grid is reliable. In areas with frequent power outages, you might want to consider adding battery storage to your system.</p>
        
        <h2>Conclusion</h2>
        
        <p>Net metering is a valuable policy that makes solar power more economically attractive for homeowners and businesses in Pakistan. By understanding how net metering works and how to apply for it, you can maximize the benefits of your solar investment.</p>
        
        <p>At Solar Express, we handle the entire net metering application process for our customers, making it easy to start saving with solar. Contact us today to learn more about how net metering can benefit you.</p>
      `,
      date: "April 25, 2023",
      author: {
        name: "Fatima Ahmed",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        title: "Energy Policy Analyst",
      },
      image:
        "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Policy",
      tags: ["Net Metering", "Solar Policy", "Grid Connection", "Electricity Bills"],
      relatedPosts: [
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
          title: "Solar Battery Storage: Is It Worth the Investment?",
          excerpt:
            "Explore the pros and cons of adding battery storage to your solar system and determine if it's the right choice for your energy needs.",
          date: "April 12, 2023",
          image: "https://images.unsplash.com/photo-1637159125633-de3d95ab1c4c?q=80&w=1000&auto=format&fit=crop",
          category: "Technology",
          slug: "solar-battery-storage-worth-investment",
        },
      ],
    },
    {
      slug: "solar-battery-storage-worth-investment",
      title: "Solar Battery Storage: Is It Worth the Investment?",
      excerpt:
        "Explore the pros and cons of adding battery storage to your solar system and determine if it's the right choice for your energy needs.",
      content: `
        <p>As solar energy becomes more popular in Pakistan, many homeowners are considering adding battery storage to their solar systems. But is it worth the additional investment? This article explores the benefits and drawbacks of solar batteries to help you make an informed decision.</p>
        
        <h2>Understanding Solar Battery Storage</h2>
        
        <p>Solar battery storage allows you to store excess electricity generated by your solar panels for use when the sun isn't shining or during power outages. Instead of feeding excess electricity back to the grid (as with net metering), you can store it in batteries for later use.</p>
        
        <h2>Types of Solar Batteries</h2>
        
        <h3>Lithium-Ion Batteries</h3>
        <p>Lithium-ion batteries are the most common type used for residential solar storage. They offer high energy density, longer lifespans (10-15 years), and deeper discharge capabilities. Popular options include Tesla Powerwall, LG Chem RESU, and Sonnen batteries.</p>
        
        <h3>Lead-Acid Batteries</h3>
        <p>Lead-acid batteries are a more affordable option but have shorter lifespans (5-10 years) and lower depth of discharge. They require more maintenance and take up more space than lithium-ion batteries.</p>
        
        <h3>Flow Batteries</h3>
        <p>Flow batteries are a newer technology with very long lifespans (20+ years) and the ability to be fully discharged without damage. However, they are currently more expensive and less compact than lithium-ion batteries.</p>
        
        <h2>Benefits of Solar Battery Storage</h2>
        
        <h3>Energy Independence</h3>
        <p>With battery storage, you can use your own solar-generated electricity day and night, reducing your reliance on the grid and increasing your energy independence.</p>
        
        <h3>Backup Power During Outages</h3>
        <p>In areas with unreliable grid electricity (a common issue in many parts of Pakistan), battery storage provides backup power during outages. This can be invaluable for keeping essential appliances running.</p>
        
        <h3>Maximizing Self-Consumption</h3>
        <p>Batteries allow you to maximize the use of your solar-generated electricity. Instead of exporting excess electricity to the grid during the day and buying it back at night, you can store and use it yourself.</p>
        
        <h3>Time-of-Use Optimization</h3>
        <p>If your utility has time-of-use rates (where electricity costs more during peak hours), batteries can help you avoid using grid electricity during these expensive periods.</p>
        
        <h2>Drawbacks of Solar Battery Storage</h2>
        
        <h3>High Initial Cost</h3>
        <p>The biggest drawback of solar batteries is their cost. A quality lithium-ion battery system can add 500,000 to 1,500,000 PKR to your solar installation, depending on capacity and features.</p>
        
        <h3>Limited Lifespan</h3>
        <p>Even the best batteries have limited lifespans and will need replacement eventually. Most lithium-ion batteries last 10-15 years, while solar panels typically last 25+ years.</p>
        
        <h3>Maintenance Requirements</h3>
        <p>Some battery types (particularly lead-acid) require regular maintenance to ensure optimal performance and longevity.</p>
        
        <h3>Space Requirements</h3>
        <p>Batteries take up physical space, which can be a consideration for homes with limited installation areas.</p>
        
        <h2>When Battery Storage Makes Sense</h2>
        
        <p>Battery storage is most likely to be worth the investment in these scenarios:</p>
        
        <ul>
          <li><strong>Frequent Power Outages:</strong> If you experience regular grid outages, the value of having backup power may justify the cost.</li>
          <li><strong>No Net Metering:</strong> If net metering isn't available in your area, batteries allow you to make use of excess solar production.</li>
          <li><strong>High Electricity Rates:</strong> In areas with very expensive grid electricity, especially during peak hours, batteries can provide significant savings.</li>
          <li><strong>Energy Independence Goals:</strong> If reducing your reliance on the grid is a priority for environmental or personal reasons.</li>
        </ul>
        
        <h2>When Battery Storage May Not Be Worth It</h2>
        
        <ul>
          <li><strong>Reliable Grid with Net Metering:</strong> If you have reliable grid access and favorable net metering policies, the financial case for batteries is weaker.</li>
          <li><strong>Budget Constraints:</strong> If adding batteries would strain your budget, it might be better to invest in a larger solar system first.</li>
          <li><strong>Limited Energy Usage at Night:</strong> If your household uses minimal electricity during non-sunlight hours, batteries provide less benefit.</li>
        </ul>
        
        <h2>Calculating the Return on Investment</h2>
        
        <p>To determine if batteries make financial sense for your situation, consider:</p>
        
        <ol>
          <li>The cost of the battery system</li>
          <li>The amount of additional self-generated electricity you'll be able to use</li>
          <li>The cost of grid electricity you'll avoid purchasing</li>
          <li>The value of having backup power during outages</li>
          <li>Available incentives or subsidies</li>
        </ol>
        
        <p>A professional solar installer can help you run these calculations based on your specific energy usage patterns and local electricity rates.</p>
        
        <h2>Conclusion</h2>
        
        <p>Solar battery storage can be a valuable addition to your solar system, particularly if you experience frequent power outages or want to maximize your energy independence. However, the high upfront cost means it's not the right choice for everyone.</p>
        
        <p>At Solar Express, we can help you evaluate whether battery storage makes sense for your specific situation and recommend the best battery options if you decide to proceed. Contact us today for a personalized consultation.</p>
      `,
      date: "April 12, 2023",
      author: {
        name: "Zain Malik",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        title: "Solar Technology Expert",
      },
      image: "https://images.unsplash.com/photo-1637159125633-de3d95ab1c4c?q=80&w=1000&auto=format&fit=crop",
      category: "Technology",
      tags: ["Battery Storage", "Energy Independence", "Solar Technology", "Power Backup"],
      relatedPosts: [
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
      ],
    },
  ]

  return blogs.find((blog) => blog.slug === slug)
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug)

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the blog post you're looking for.</p>
        <Button asChild>
          <Link href="/blogs">Return to Blogs</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="text-[#1a5ca4]">
          <Link href="/blogs" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>

      {/* Blog Header */}
      <div className="mb-8">
        <div className="bg-[#1a5ca4] text-white inline-block px-3 py-1 rounded text-sm font-medium mb-3">
          {blog.category}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a5ca4]">{blog.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{blog.author.name}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden mb-8">
        <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" priority />
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-8">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image src={blog.author.avatar || "/placeholder.svg"} alt={blog.author.name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-[#1a5ca4]">{blog.author.name}</h3>
          <p className="text-gray-600 text-sm">{blog.author.title}</p>
        </div>
      </div>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* Tags */}
      <div className="mb-8">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <Link
              key={index}
              href={`/blogs?tag=${encodeURIComponent(tag)}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Share */}
      <div className="mb-12">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share this article
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Linkedin className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Related Posts */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-6 text-[#1a5ca4]">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blog.relatedPosts.map((post, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
            >
              <div className="h-48 relative">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                <div className="absolute top-3 right-3 bg-[#1a5ca4] text-white text-xs px-2 py-1 rounded">
                  {post.category}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#1a5ca4]">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <Button variant="outline" className="w-full border-[#1a5ca4] text-[#1a5ca4]" asChild>
                  <Link href={`/blogs/${post.slug}`}>Read More</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
