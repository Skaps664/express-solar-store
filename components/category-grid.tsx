import Link from "next/link"
import { Sun, Battery, Zap, Home, Wrench, ShieldCheck } from "lucide-react"

const categories = [
  {
    name: "Solar Panels",
    icon: Sun,
    color: "bg-blue-100",
    iconColor: "text-[#1a5ca4]",
    link: "/store?category=solar-panels",
  },
  {
    name: "Batteries",
    icon: Battery,
    color: "bg-green-100",
    iconColor: "text-green-600",
    link: "/store?category=batteries",
  },
  {
    name: "Inverters",
    icon: Zap,
    color: "bg-amber-100",
    iconColor: "text-amber-600",
    link: "/store?category=inverters",
  },
  {
    name: "Complete Systems",
    icon: Home,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    link: "/store?category=complete-systems",
  },
  {
    name: "Installation",
    icon: Wrench,
    color: "bg-red-100",
    iconColor: "text-red-600",
    link: "/store?category=installation",
  },
  {
    name: "Accessories",
    icon: ShieldCheck,
    color: "bg-teal-100",
    iconColor: "text-teal-600",
    link: "/store?category=accessories",
  },
]

export default function CategoryGrid() {
  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4 text-[#1a5ca4]">Shop by Category</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.link}
            className="flex flex-col items-center p-3 md:p-4 rounded-lg border border-gray-200 hover:border-[#1a5ca4] hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mb-2 relative flex items-center justify-center bg-gray-100">
              <category.icon className={`h-6 w-6 ${category.iconColor}`} />
            </div>
            <span className="text-xs md:text-sm text-center font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
