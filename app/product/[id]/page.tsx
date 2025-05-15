"use client"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, ChevronRight, Star, Share2 } from "lucide-react"
import ProductSpecifications from "@/components/product-specifications"
import ProductReviews from "@/components/product-reviews"
import ProductFAQ from "@/components/product-faq"
import RelatedProducts from "@/components/related-products"

// Sample product data - in a real app, this would come from a database or API
const productsData = {
  "jinko-tiger-neo": {
    name: "Jinko 550W Tiger Neo N-Type Solar Panel",
    brand: "Jinko Solar",
    brandSlug: "jinko-solar",
    price: 42500,
    discountPrice: 39999,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    description:
      "The Tiger Neo is Jinko Solar's premium N-type TOPCon solar panel, offering higher efficiency, better performance in low light, and superior temperature coefficient compared to conventional P-type panels.",
    features: [
      "550W maximum power output",
      "21.5% module efficiency",
      "N-type TOPCon technology",
      "Lower degradation rate",
      "Better performance in high temperatures",
      "30-year performance warranty",
    ],
    images: ["jinko-tiger-neo-front", "jinko-tiger-neo-angle", "jinko-tiger-neo-back", "jinko-tiger-neo-detail"],
    variants: [
      { id: "550w", name: "550W", price: 39999 },
      { id: "535w", name: "535W", price: 38500 },
      { id: "520w", name: "520W", price: 37000 },
    ],
    specifications: {
      "Electrical Data": {
        "Maximum Power (Pmax)": "550W",
        "Open Circuit Voltage (Voc)": "49.5V",
        "Short Circuit Current (Isc)": "14.02A",
        "Maximum Power Voltage (Vmp)": "41.65V",
        "Maximum Power Current (Imp)": "13.21A",
        "Module Efficiency": "21.5%",
      },
      "Mechanical Data": {
        Dimensions: "2278 × 1134 × 35mm",
        Weight: "32.3kg",
        "Front Glass": "3.2mm tempered glass with AR coating",
        "Frame Material": "Anodized aluminum alloy",
        "Junction Box": "IP68 rated",
        "Cable Length": "1200mm",
      },
      "Temperature Ratings": {
        "Operating Temperature": "-40°C to +85°C",
        "Temperature Coefficient (Pmax)": "-0.30%/°C",
        "Temperature Coefficient (Voc)": "-0.24%/°C",
        "Temperature Coefficient (Isc)": "0.04%/°C",
      },
      Warranty: {
        "Product Warranty": "12 years",
        "Performance Warranty": "30 years linear warranty",
        "First Year Degradation": "≤1%",
        "Annual Degradation": "≤0.4%",
      },
    },
    relatedProducts: ["jinko-eagle-bifacial", "longi-himo5", "canadian-bihiku"],
  },
  "jinko-eagle-bifacial": {
    name: "Jinko 535W Eagle Bifacial Solar Panel",
    brand: "Jinko Solar",
    brandSlug: "jinko-solar",
    price: 41000,
    discountPrice: null,
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    description:
      "The Eagle Bifacial series from Jinko Solar features double-glass design that allows light absorption from both sides, increasing total energy yield by up to 25% depending on installation conditions.",
    features: [
      "535W front side power output",
      "Up to 25% additional power from rear side",
      "Bifacial technology",
      "Double-glass construction for durability",
      "PID resistance",
      "30-year performance warranty",
    ],
    images: ["jinko-eagle-bifacial-front", "jinko-eagle-bifacial-angle", "jinko-eagle-bifacial-back"],
    variants: [
      { id: "535w", name: "535W", price: 41000 },
      { id: "520w", name: "520W", price: 39500 },
      { id: "505w", name: "505W", price: 38000 },
    ],
    specifications: {
      "Electrical Data": {
        "Maximum Power (Pmax)": "535W",
        "Open Circuit Voltage (Voc)": "49.2V",
        "Short Circuit Current (Isc)": "13.85A",
        "Maximum Power Voltage (Vmp)": "41.30V",
        "Maximum Power Current (Imp)": "12.95A",
        "Module Efficiency": "20.8%",
        "Bifaciality Factor": "70±5%",
      },
      "Mechanical Data": {
        Dimensions: "2274 × 1134 × 35mm",
        Weight: "32.6kg",
        "Front/Back Glass": "2.0mm tempered glass",
        "Frame Material": "Anodized aluminum alloy",
        "Junction Box": "IP68 rated",
        "Cable Length": "1200mm",
      },
      "Temperature Ratings": {
        "Operating Temperature": "-40°C to +85°C",
        "Temperature Coefficient (Pmax)": "-0.35%/°C",
        "Temperature Coefficient (Voc)": "-0.28%/°C",
        "Temperature Coefficient (Isc)": "0.048%/°C",
      },
      Warranty: {
        "Product Warranty": "12 years",
        "Performance Warranty": "30 years linear warranty",
        "First Year Degradation": "≤2%",
        "Annual Degradation": "≤0.55%",
      },
    },
    relatedProducts: ["jinko-tiger-neo", "longi-himo5", "canadian-bihiku"],
  },
  "longi-himo5": {
    name: "Longi 500W Hi-MO 5 Mono PERC Module",
    brand: "Longi Solar",
    brandSlug: "longi-solar",
    price: 39999,
    discountPrice: 37500,
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    description:
      "The Hi-MO 5 is LONGi's flagship module for utility-scale projects, designed for maximum power density and reliability. With advanced mono PERC technology, it delivers excellent performance even in low light conditions.",
    features: [
      "500W maximum power output",
      "21.1% module efficiency",
      "Mono PERC technology",
      "Low temperature coefficient",
      "High shade tolerance",
      "25-year performance warranty",
    ],
    images: ["longi-himo5-front", "longi-himo5-angle", "longi-himo5-back"],
    variants: [
      { id: "500w", name: "500W", price: 37500 },
      { id: "490w", name: "490W", price: 36500 },
      { id: "480w", name: "480W", price: 35500 },
    ],
    specifications: {
      "Electrical Data": {
        "Maximum Power (Pmax)": "500W",
        "Open Circuit Voltage (Voc)": "49.3V",
        "Short Circuit Current (Isc)": "13.09A",
        "Maximum Power Voltage (Vmp)": "41.5V",
        "Maximum Power Current (Imp)": "12.05A",
        "Module Efficiency": "21.1%",
      },
      "Mechanical Data": {
        Dimensions: "2256 × 1133 × 35mm",
        Weight: "27.5kg",
        "Front Glass": "2.0mm tempered glass with AR coating",
        "Frame Material": "Anodized aluminum alloy",
        "Junction Box": "IP68 rated",
        "Cable Length": "1200mm",
      },
      "Temperature Ratings": {
        "Operating Temperature": "-40°C to +85°C",
        "Temperature Coefficient (Pmax)": "-0.34%/°C",
        "Temperature Coefficient (Voc)": "-0.27%/°C",
        "Temperature Coefficient (Isc)": "0.05%/°C",
      },
      Warranty: {
        "Product Warranty": "12 years",
        "Performance Warranty": "25 years linear warranty",
        "First Year Degradation": "≤2%",
        "Annual Degradation": "≤0.55%",
      },
    },
    relatedProducts: ["jinko-tiger-neo", "jinko-eagle-bifacial", "canadian-bihiku"],
  },
  "canadian-bihiku": {
    name: "Canadian Solar 540W BiHiKu Bifacial Panel",
    brand: "Canadian Solar",
    brandSlug: "canadian-solar",
    price: 45000,
    discountPrice: 42500,
    rating: 4.7,
    reviewCount: 112,
    inStock: true,
    description:
      "The BiHiKu is Canadian Solar's high-power bifacial module that combines the advantages of bifacial technology with half-cell design. It's ideal for utility-scale installations where space is limited and maximum power density is required.",
    features: [
      "540W front side power output",
      "Up to 20% additional power from rear side",
      "Bifacial technology with half-cell design",
      "Lower LCOE for utility projects",
      "Enhanced performance in high temperature",
      "30-year performance warranty",
    ],
    images: ["canadian-bihiku-front", "canadian-bihiku-angle", "canadian-bihiku-back"],
    variants: [
      { id: "540w", name: "540W", price: 42500 },
      { id: "530w", name: "530W", price: 41500 },
      { id: "520w", name: "520W", price: 40500 },
    ],
    specifications: {
      "Electrical Data": {
        "Maximum Power (Pmax)": "540W",
        "Open Circuit Voltage (Voc)": "49.5V",
        "Short Circuit Current (Isc)": "13.9A",
        "Maximum Power Voltage (Vmp)": "41.7V",
        "Maximum Power Current (Imp)": "12.95A",
        "Module Efficiency": "21.3%",
        "Bifaciality Factor": "70±5%",
      },
      "Mechanical Data": {
        Dimensions: "2260 × 1130 × 35mm",
        Weight: "31.5kg",
        "Front/Back Glass": "2.0mm tempered glass",
        "Frame Material": "Anodized aluminum alloy",
        "Junction Box": "IP68 rated",
        "Cable Length": "1200mm",
      },
      "Temperature Ratings": {
        "Operating Temperature": "-40°C to +85°C",
        "Temperature Coefficient (Pmax)": "-0.35%/°C",
        "Temperature Coefficient (Voc)": "-0.27%/°C",
        "Temperature Coefficient (Isc)": "0.05%/°C",
      },
      Warranty: {
        "Product Warranty": "12 years",
        "Performance Warranty": "30 years linear warranty",
        "First Year Degradation": "≤2%",
        "Annual Degradation": "≤0.5%",
      },
    },
    relatedProducts: ["jinko-tiger-neo", "jinko-eagle-bifacial", "longi-himo5"],
  },
  "mounting-systems": {
    name: "Solar Panel Roof Mounting System",
    brand: "Solar Express",
    brandSlug: "solar-express",
    price: 45000,
    discountPrice: null,
    rating: 4.6,
    reviewCount: 78,
    inStock: true,
    description:
      "Our premium roof mounting system is designed for durability and ease of installation. Made from high-quality aluminum and stainless steel, it can withstand harsh weather conditions while securely holding your solar panels in place.",
    features: [
      "Compatible with all major solar panel brands",
      "Corrosion-resistant aluminum rails",
      "Stainless steel hardware",
      "Adjustable tilt angle",
      "Easy installation with minimal tools",
      "10-year warranty",
    ],
    images: ["mounting-system-full", "mounting-system-detail", "mounting-system-installed"],
    variants: [
      { id: "small", name: "Small (4-6 panels)", price: 45000 },
      { id: "medium", name: "Medium (8-12 panels)", price: 65000 },
      { id: "large", name: "Large (16-20 panels)", price: 85000 },
    ],
    specifications: {
      "Material Specifications": {
        "Rail Material": "Anodized aluminum alloy",
        "Hardware Material": "304 stainless steel",
        "Roof Attachments": "Galvanized steel with EPDM washers",
        Finish: "Mill finish / Clear anodized",
        Grounding: "Integrated grounding capabilities",
      },
      "Mechanical Data": {
        "Wind Load Rating": "Up to 180 km/h",
        "Snow Load Rating": "Up to 5400 Pa",
        "Tilt Angle": "Adjustable 10-45 degrees",
        "Rail Length": "4.2m standard (customizable)",
        Compatibility: "Works with framed modules 30-50mm thick",
      },
      Installation: {
        "Tools Required": "Basic hand tools",
        "Installation Time": "Approximately 30 minutes per panel",
        "Roof Types": "Compatible with tile, metal, and asphalt shingle roofs",
        Attachments: "Includes all necessary roof attachments and hardware",
      },
      Warranty: {
        "Product Warranty": "10 years",
        "Expected Lifespan": "25+ years",
        Certification: "TUV, UL certified",
      },
    },
    relatedProducts: ["charge-controllers", "solar-water-heaters", "off-grid-kits"],
  },
  "charge-controllers": {
    name: "MPPT Solar Charge Controller 60A",
    brand: "Solar Express",
    brandSlug: "solar-express",
    price: 35000,
    discountPrice: null,
    rating: 4.8,
    reviewCount: 92,
    inStock: true,
    description:
      "Our advanced MPPT (Maximum Power Point Tracking) charge controller maximizes the energy harvest from your solar panels and efficiently charges your battery bank. With 99% tracking efficiency, it ensures optimal charging even in changing weather conditions.",
    features: [
      "60A maximum charging current",
      "12V/24V/48V auto recognition",
      "99% MPPT tracking efficiency",
      "LCD display with user-friendly interface",
      "Multiple battery type settings",
      "Built-in data logging and Bluetooth connectivity",
    ],
    images: ["charge-controller-front", "charge-controller-angle", "charge-controller-display"],
    variants: [
      { id: "30a", name: "30A", price: 22000 },
      { id: "60a", name: "60A", price: 35000 },
      { id: "100a", name: "100A", price: 55000 },
    ],
    specifications: {
      "Electrical Specifications": {
        "Maximum PV Open Circuit Voltage": "150V DC",
        "Nominal Battery Voltage": "12V/24V/48V auto recognition",
        "Maximum Charging Current": "60A",
        "Maximum PV Input Power": "12V: 800W / 24V: 1600W / 48V: 3200W",
        "Maximum Efficiency": ">98%",
        "MPPT Tracking Efficiency": "99%",
      },
      "Protection Features": {
        "PV Short Circuit": "Protected",
        "PV Reverse Polarity": "Protected",
        "Battery Reverse Polarity": "Protected with fuse",
        "Over Temperature": "Automatically reduces charging current",
        "Battery Over Voltage": "Disconnects when voltage exceeds safe limit",
      },
      "Display and Communication": {
        "Display Type": "Backlit LCD display",
        Communication: "Bluetooth, RS485, USB (optional)",
        "Mobile App": "Available for iOS and Android",
        "Data Logging": "30 days internal storage",
      },
      "Environmental and Mechanical": {
        "Operating Temperature": "-20°C to +50°C",
        "Storage Temperature": "-30°C to +70°C",
        Humidity: "95% non-condensing",
        Cooling: "Natural convection",
        Dimensions: "295 × 220 × 95mm",
        Weight: "3.5kg",
      },
    },
    relatedProducts: ["mounting-systems", "solar-water-heaters", "off-grid-kits"],
  },
  "solar-water-heaters": {
    name: "Solar Water Heating System - 200L",
    brand: "Solar Express",
    brandSlug: "solar-express",
    price: 120000,
    discountPrice: null,
    rating: 4.7,
    reviewCount: 65,
    inStock: true,
    description:
      "Our solar water heating system provides an eco-friendly and cost-effective solution for your hot water needs. Using evacuated tube collectors, it efficiently captures solar energy to heat water, even on cloudy days, reducing your energy bills by up to 70%.",
    features: [
      "200L stainless steel storage tank",
      "20 evacuated tube collectors",
      "Integrated electric backup heater",
      "Intelligent controller with temperature display",
      "Freeze protection system",
      "Low maintenance design",
    ],
    images: ["solar-water-heater-full", "solar-water-heater-tubes", "solar-water-heater-tank"],
    variants: [
      { id: "150l", name: "150L (3-4 people)", price: 95000 },
      { id: "200l", name: "200L (4-6 people)", price: 120000 },
      { id: "300l", name: "300L (6-8 people)", price: 160000 },
    ],
    specifications: {
      "Tank Specifications": {
        Capacity: "200 liters",
        Material: "SUS304 food-grade stainless steel",
        Insulation: "55mm high-density polyurethane foam",
        "Inner Tank Thickness": "1.5mm",
        "Outer Casing": "Powder-coated steel",
        "Working Pressure": "6 bar",
      },
      "Collector Specifications": {
        Type: "Evacuated tube collectors",
        "Number of Tubes": "20",
        "Tube Dimensions": "58mm × 1800mm",
        "Absorption Rate": ">92%",
        "Heat Loss Coefficient": "<0.8 W/(m²·K)",
        "Stagnation Temperature": "250°C",
      },
      "Backup Heating": {
        "Electric Element": "2kW",
        "Thermostat Range": "30-75°C",
        "Safety Cut-out": "85°C",
        Voltage: "220-240V AC",
      },
      Performance: {
        "Daily Hot Water Output": "Up to 200L at 45°C",
        "Energy Savings": "Up to 70% of water heating costs",
        "Suitable Climate": "Works effectively in all climates",
        "Freeze Protection": "Automatic drain-back system",
      },
    },
    relatedProducts: ["mounting-systems", "charge-controllers", "off-grid-kits"],
  },
  "off-grid-kits": {
    name: "Complete Off-Grid Solar Kit - 5kW",
    brand: "Solar Express",
    brandSlug: "solar-express",
    price: 650000,
    discountPrice: null,
    rating: 4.9,
    reviewCount: 42,
    inStock: true,
    description:
      "Our comprehensive off-grid solar kit provides everything you need for energy independence. Designed for reliability and ease of installation, this system can power a typical household with essential appliances, including refrigeration, lighting, and electronics.",
    features: [
      "5kW system capacity",
      "16 × 330W high-efficiency solar panels",
      "5kW hybrid inverter with built-in MPPT controller",
      "10kWh lithium battery storage",
      "Complete mounting hardware and cables",
      "Pre-configured system design",
    ],
    images: ["off-grid-kit-full", "off-grid-kit-panels", "off-grid-kit-batteries"],
    variants: [
      { id: "3kw", name: "3kW System", price: 450000 },
      { id: "5kw", name: "5kW System", price: 650000 },
      { id: "10kw", name: "10kW System", price: 1200000 },
    ],
    specifications: {
      "System Overview": {
        "Total Capacity": "5kW",
        "Daily Energy Production": "~20kWh (location dependent)",
        "Battery Backup": "~10kWh usable capacity",
        Autonomy: "1-2 days without sun (typical usage)",
        Expandable: "Yes, modular design allows future expansion",
      },
      "Solar Array": {
        Panels: "16 × 330W monocrystalline panels",
        "Total Array Size": "5.28kW",
        "Panel Efficiency": "20.4%",
        "Panel Dimensions": "1640 × 992 × 35mm each",
        "Array Area Required": "~32m²",
      },
      "Inverter and Power Management": {
        "Inverter Type": "5kW hybrid inverter/charger",
        Output: "230V AC, 50Hz pure sine wave",
        "MPPT Channels": "2 × 80A MPPT charge controllers",
        "Maximum PV Input": "500V DC, 12kW",
        "Transfer Time": "<10ms",
        Monitoring: "Wi-Fi and mobile app included",
      },
      "Battery System": {
        "Battery Type": "Lithium iron phosphate (LiFePO4)",
        Capacity: "10kWh (200Ah @ 48V)",
        "Cycle Life": ">6000 cycles @ 80% DoD",
        "Expected Lifespan": "10+ years",
        "Battery Management": "Built-in BMS with cell balancing",
      },
    },
    relatedProducts: ["mounting-systems", "charge-controllers", "solar-water-heaters"],
  },
  // Add more products as needed
}

// Format price in PKR with commas
const formatPrice = (price) => {
  return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export default function ProductPage({ params }) {
  const { id } = params
  const product = productsData[id]

  // Handle case where product doesn't exist
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild>
          <Link href="/store">Return to Store</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-[#1a5ca4]">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <Link href="/store" className="text-gray-500 hover:text-[#1a5ca4]">
          Store
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        {product.brandSlug && (
          <>
            <Link href={`/brand/${product.brandSlug}`} className="text-gray-500 hover:text-[#1a5ca4]">
              {product.brand}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </>
        )}
        <span className="text-[#1a5ca4]">{product.name}</span>
      </div>

      {/* Product Overview */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="h-96 bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400">[{product.images[0]}]</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden h-24 bg-gray-100 flex items-center justify-center"
              >
                <div className="text-gray-400 text-sm">[{image}]</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            {product.brandSlug && (
              <Link href={`/brand/${product.brandSlug}`} className="text-[#1a5ca4] hover:underline">
                By {product.brand}
              </Link>
            )}
          </div>

          <div className="mb-6">
            {product.discountPrice ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#1a5ca4]">{formatPrice(product.discountPrice)}</span>
                <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-[#1a5ca4]">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:border-[#1a5ca4] hover:bg-blue-50"
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button className="flex-1 bg-[#1a5ca4] hover:bg-[#0e4a8a]">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">Availability:</span>
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Shipping & Returns */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Free Shipping:</span>
                <span>On orders over PKR 50,000</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Estimated Delivery:</span>
                <span>3-5 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Returns:</span>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="specifications" className="mb-12">
        <TabsList className="w-full justify-start border-b">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Specifications Tab */}
        <TabsContent value="specifications" className="pt-6">
          <ProductSpecifications specifications={product.specifications} />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="pt-6">
          <ProductReviews rating={product.rating} reviewCount={product.reviewCount} />
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="pt-6">
          <ProductFAQ productName={product.name} />
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <RelatedProducts productIds={product.relatedProducts || []} productsData={productsData} />
      </div>
    </div>
  )
}
