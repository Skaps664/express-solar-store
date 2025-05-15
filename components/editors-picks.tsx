import { Button } from "@/components/ui/button"
import { Award, ShoppingCart } from "lucide-react"

export default function EditorsPicks() {
  const editorsPicks = [
    {
      id: 1,
      name: "Complete 10kW Solar System Package",
      brand: "Solar Express",
      price: 1500000,
      description:
        "Our premium 10kW solar system includes 20x Jinko 550W panels, Growatt 10kW hybrid inverter, mounting structure, and complete installation. Perfect for large homes with high energy consumption.",
      whyWeLoveIt: "All-in-one solution with premium components and 25-year warranty",
      image: "complete-system",
    },
    {
      id: 2,
      name: "Tesla Powerwall 2 with Gateway",
      brand: "Tesla",
      price: 950000,
      description:
        "The Tesla Powerwall 2 provides 13.5kWh of energy storage, perfect for backup power during outages. Includes the Tesla Gateway for seamless integration with your solar system and home energy management.",
      whyWeLoveIt: "Industry-leading battery technology with smart features",
      image: "tesla-powerwall",
    },
    {
      id: 3,
      name: "Growatt SPF 5000ES Hybrid Inverter",
      brand: "Growatt",
      price: 185000,
      description:
        "This versatile 5kW hybrid inverter works with or without batteries and supports both on-grid and off-grid applications. Features built-in MPPT charge controller and smart monitoring capabilities.",
      whyWeLoveIt: "Exceptional flexibility for various solar setups",
      image: "growatt-inverter",
    },
  ]

  // Format price in PKR with commas
  const formatPrice = (price) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  return (
    <div className="my-16">
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-3xl font-bold text-[#1a5ca4]">Editor's Picks</h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Our experts' selection of premium solar products, featuring exceptional quality and performance
        </p>
      </div>

      <div className="space-y-8">
        {editorsPicks.map((product, index) => (
          <div
            key={product.id}
            className={`overflow-hidden rounded-lg border-2 border-dashed border-gray-300 ${
              index % 2 === 0 ? "" : "bg-gray-50"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div
                className={`flex h-64 md:h-80 items-center justify-center bg-gray-100 p-6 md:p-8 ${
                  index % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <div className="text-center text-gray-400 text-sm md:text-base">
                  [Premium Image: {product.image}]
                  <br />
                  High-quality product photo
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <div className="mb-1 text-xs md:text-sm font-semibold text-[#1a5ca4]">{product.brand}</div>
                <h3 className="mb-2 text-xl md:text-2xl font-bold text-[#1a5ca4]">{product.name}</h3>
                <div className="mb-3 md:mb-4 text-lg md:text-xl font-bold text-gray-800">
                  {formatPrice(product.price)}
                </div>
                <p className="mb-3 md:mb-4 text-sm md:text-base text-gray-600">{product.description}</p>
                <div className="mb-4 md:mb-6 flex items-center gap-2 rounded-lg bg-blue-50 p-2 md:p-3 text-sm md:text-base">
                  <Award className="h-4 w-4 md:h-5 md:w-5 text-[#f26522]" />
                  <span className="font-medium text-[#1a5ca4]">Why We Love It: {product.whyWeLoveIt}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button className="gap-2 text-sm md:text-base bg-[#1a5ca4] hover:bg-[#0e4a8a]">
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>
                  <Button variant="outline" className="text-sm md:text-base border-[#1a5ca4] text-[#1a5ca4]">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
