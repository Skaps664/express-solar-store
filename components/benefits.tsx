import { DollarSign, Leaf, Shield, Clock, Zap, Home } from "lucide-react"

export default function Benefits() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Save Money",
      description:
        "Reduce or eliminate your electricity bills with solar power, enjoying significant savings over the lifetime of your system.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description:
        "Reduce your carbon footprint by generating clean, renewable energy that doesn't produce harmful emissions.",
    },
    {
      icon: Shield,
      title: "Energy Independence",
      description:
        "Protect yourself from rising utility rates and power outages by generating and storing your own electricity.",
    },
    {
      icon: Clock,
      title: "Long-Term Investment",
      description:
        "Solar systems typically last 25-30 years, providing decades of reliable energy and excellent return on investment.",
    },
    {
      icon: Zap,
      title: "Increased Property Value",
      description:
        "Homes and businesses with solar installations typically command higher resale values in the market.",
    },
    {
      icon: Home,
      title: "Tax Incentives",
      description:
        "Take advantage of federal, state, and local tax credits and incentives that significantly reduce the cost of going solar.",
    },
  ]

  return (
    <div className="my-16 bg-gray-50 py-16 px-8 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Benefits of Going Solar</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Switching to solar energy offers numerous advantages for homeowners, businesses, and the environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="p-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <benefit.icon className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
            <p className="text-gray-700">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
