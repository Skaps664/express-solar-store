import { Battery, Sun, Zap, Shield, Wrench, Leaf } from "lucide-react"

export default function FeatureHighlights() {
  const features = [
    {
      icon: Sun,
      title: "Premium Solar Panels",
      description:
        "High-efficiency monocrystalline and polycrystalline panels from leading manufacturers, designed for maximum energy harvest in all conditions.",
    },
    {
      icon: Battery,
      title: "Advanced Battery Storage",
      description:
        "Store excess energy for use during peak hours or outages with our range of lithium-ion and lead-acid battery solutions for residential and commercial use.",
    },
    {
      icon: Zap,
      title: "Smart Inverters",
      description:
        "Convert DC power from your panels to usable AC electricity with our selection of string, microinverters, and hybrid inverters with advanced monitoring capabilities.",
    },
    {
      icon: Shield,
      title: "Comprehensive Warranties",
      description:
        "All our products come with industry-leading warranties, ensuring your investment is protected for decades to come.",
    },
    {
      icon: Wrench,
      title: "Installation Support",
      description:
        "Connect with our network of certified installers or access detailed guides for DIY installation of your solar system components.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Solutions",
      description:
        "Reduce your carbon footprint with clean, renewable energy solutions that help protect the environment for future generations.",
    },
  ]

  return (
    <div className="my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Premium Solar Solutions</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Discover our comprehensive range of high-quality solar and renewable energy products designed to meet your
          specific energy needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <feature.icon className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
