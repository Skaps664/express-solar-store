import { Shield, Truck, RotateCcw, Zap } from "lucide-react"

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "All products backed by manufacturer warranties",
    },
    {
      icon: Truck,
      title: "Nationwide Delivery",
      description: "Fast shipping to all major cities in Pakistan",
    },
    {
      icon: RotateCcw,
      title: "Professional Installation",
      description: "Expert installation teams across the country",
    },
    {
      icon: Zap,
      title: "After-Sales Support",
      description: "Dedicated technical support for all systems",
    },
  ]

  return (
    <div className="my-12 md:my-16 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 md:py-8">
      <div className="grid grid-cols-1 gap-4 md:gap-6 px-4 md:px-8 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-3 md:gap-4">
            <div className="rounded-full bg-white p-2 md:p-3 shadow-sm">
              <badge.icon className="h-5 w-5 md:h-6 md:w-6 text-[#1a5ca4]" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-[#1a5ca4]">{badge.title}</h3>
              <p className="text-xs md:text-sm text-gray-600">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
