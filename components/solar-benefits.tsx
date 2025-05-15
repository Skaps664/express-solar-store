import { Leaf, DollarSign, Shield, BarChart2 } from "lucide-react"

export default function SolarBenefits() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Save Money",
      description: "Reduce your electricity bills by up to 70% with solar power",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Reduce your carbon footprint with clean, renewable energy",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Shield,
      title: "Energy Independence",
      description: "Protect yourself from rising utility rates and power outages",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: BarChart2,
      title: "Increase Property Value",
      description: "Solar installations can increase your property's market value",
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  return (
    <div className="my-8">
      <div className="bg-gradient-to-r from-[#1a5ca4]/10 to-[#f26522]/10 rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-[#1a5ca4] mb-6 text-center">Why Go Solar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-5 shadow-sm">
              <div className={`w-12 h-12 rounded-full ${benefit.color} flex items-center justify-center mb-4`}>
                <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-[#1a5ca4] mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
