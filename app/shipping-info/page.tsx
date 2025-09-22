"use client"

import { Truck, MapPin, Clock, Package, Shield, CheckCircle, AlertTriangle, Phone } from "lucide-react"

export default function ShippingInformation() {
  const shippingOptions = [
    {
      icon: Truck,
      title: "Standard Delivery",
      time: "5-7 Business Days",
      cost: "Free",
      description: "Free shipping on orders above PKR 25,000",
      features: [
        "Professional handling",
        "Insurance included",
        "SMS & email tracking",
        "Doorstep delivery"
      ]
    },
    {
      icon: Clock,
      title: "Express Delivery",
      time: "2-3 Business Days",
      cost: "PKR 2,500",
      description: "Faster delivery for urgent requirements",
      features: [
        "Priority processing",
        "Express courier service",
        "Real-time tracking",
        "Call before delivery"
      ]
    },
    {
      icon: Package,
      title: "Installation Service",
      time: "7-14 Business Days",
      cost: "Varies",
      description: "Complete delivery and professional installation",
      features: [
        "Expert installation team",
        "Site survey included",
        "Testing & commissioning",
        "1-year service warranty"
      ]
    }
  ]

  const deliveryZones = [
    {
      zone: "Zone 1 - Major Cities",
      cities: "Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad",
      standardTime: "3-5 days",
      expressTime: "1-2 days",
      cost: "Free above PKR 25,000"
    },
    {
      zone: "Zone 2 - Secondary Cities",
      cities: "Multan, Peshawar, Quetta, Sialkot, Gujranwala, Hyderabad",
      standardTime: "5-7 days",
      expressTime: "2-3 days",
      cost: "Free above PKR 30,000"
    },
    {
      zone: "Zone 3 - Other Cities",
      cities: "All other cities and towns across Pakistan",
      standardTime: "7-10 days",
      expressTime: "3-5 days",
      cost: "Free above PKR 40,000"
    }
  ]

  const packagingInfo = [
    {
      title: "Solar Panels",
      description: "Wooden crates with foam padding",
      protection: "Weather-resistant packaging, shock absorption"
    },
    {
      title: "Inverters & Electronics",
      description: "Anti-static bubble wrap in reinforced boxes",
      protection: "ESD protection, moisture control"
    },
    {
      title: "Mounting Hardware",
      description: "Plastic bins with compartments",
      protection: "Rust prevention, organized packaging"
    },
    {
      title: "Cables & Accessories",
      description: "Coiled and secured in protective sleeves",
      protection: "Prevents tangling and damage"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a5ca4] to-[#2563eb] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Shipping Information</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Reliable delivery of your solar equipment across Pakistan
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.5%</div>
              <div className="text-blue-200">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-200">Tracking Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Shipping Options</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the delivery option that best suits your timeline and requirements
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {shippingOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a5ca4] mb-2">{option.title}</h3>
                  <div className="text-2xl font-bold text-[#f26522] mb-1">{option.time}</div>
                  <div className="text-lg font-semibold text-gray-700 mb-3">{option.cost}</div>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
                <div className="space-y-3">
                  {option.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#f26522] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Delivery Zones</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Delivery times and costs vary by location across Pakistan
            </p>
          </div>

          <div className="space-y-6">
            {deliveryZones.map((zone, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold text-[#1a5ca4] mb-2">{zone.zone}</h3>
                    <p className="text-gray-600 text-sm">{zone.cities}</p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-700">Standard</div>
                    <div className="text-[#f26522]">{zone.standardTime}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-700">Express</div>
                    <div className="text-[#f26522]">{zone.expressTime}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-700">Free Shipping</div>
                    <div className="text-green-600">{zone.cost}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packaging & Safety */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Packaging & Protection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional packaging ensures your solar equipment arrives in perfect condition
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              {packagingInfo.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="font-semibold text-[#1a5ca4] mb-2">{item.title}</h3>
                  <p className="text-gray-700 mb-3">{item.description}</p>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#f26522] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{item.protection}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-[#1a5ca4] mb-6">Quality Assurance</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] p-3 rounded-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a5ca4] mb-2">Pre-shipment Inspection</h4>
                    <p className="text-gray-600">Every product is tested and inspected before packaging</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a5ca4] mb-2">Insurance Coverage</h4>
                    <p className="text-gray-600">All shipments are insured against damage and loss</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a5ca4] mb-2">Real-time Tracking</h4>
                    <p className="text-gray-600">Track your shipment from warehouse to your doorstep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="bg-yellow-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Important Shipping Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-[#1a5ca4]">Delivery Requirements</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Someone must be present to receive the delivery</li>
                <li>• Valid CNIC required for high-value shipments</li>
                <li>• Delivery address must match billing address</li>
                <li>• Access road suitable for delivery vehicles</li>
                <li>• Unloading assistance may be required for heavy items</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Phone className="h-6 w-6 text-[#f26522] mt-1 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-[#1a5ca4]">Delivery Support</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Call 1 hour before delivery</li>
                <li>• Reschedule if not available</li>
                <li>• Photo proof of delivery</li>
                <li>• Damage reporting within 24 hours</li>
                <li>• Customer service: +92 3330505000</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#1a5ca4] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Questions About Shipping?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our logistics team is here to help with any shipping-related queries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/support" className="bg-[#f26522] hover:bg-[#e55511] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact Support
            </a>
            <a href="tel:+92300000000" className="border-2 border-white hover:bg-white hover:text-[#1a5ca4] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Track Your Order
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
