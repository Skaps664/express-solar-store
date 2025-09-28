"use client"

import type React from "react"

import { useState } from "react"
import { Shield, CheckCircle, Phone, Mail, MapPin, Clock, Users, Award, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InsurancePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    systemSize: "",
    location: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      alert("Thank you! We'll contact you soon with insurance details.")
    }, 2000)
  }

  const insuranceFeatures = [
    {
      icon: Shield,
      title: "Comprehensive Coverage",
      description: "Complete protection against weather damage, theft, and equipment failure",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support and emergency assistance",
    },
    {
      icon: Users,
      title: "Expert Claims Team",
      description: "Dedicated solar insurance specialists to handle your claims quickly",
    },
    {
      icon: Award,
      title: "Industry Leading",
      description: "Partnered with top insurance providers for maximum reliability",
    },
  ]

  const coverageTypes = [
    {
      title: "Equipment Protection",
      features: [
        "Solar panels and inverters",
        "Mounting systems and hardware",
        "Monitoring equipment",
        "Electrical components",
      ],
      popular: false,
    },
    {
      title: "Performance Guarantee",
      features: [
        "Power output protection",
        "Efficiency degradation coverage",
        "System downtime compensation",
        "Revenue loss protection",
      ],
      popular: true,
    },
    {
      title: "Property Protection",
      features: [
        "Roof damage coverage",
        "Fire and lightning protection",
        "Theft and vandalism",
        "Natural disaster coverage",
      ],
      popular: false,
    },
  ]

  const testimonials = [
    {
      name: "Ahmed Hassan",
      location: "Lahore",
      rating: 5,
      comment:
        "Solar Express insurance saved us when hailstorm damaged our panels. Quick claim process and full replacement!",
    },
    {
      name: "Fatima Khan",
      location: "Karachi",
      rating: 5,
      comment: "Peace of mind knowing our solar investment is protected. Professional service and competitive rates.",
    },
    {
      name: "Muhammad Ali",
      location: "Islamabad",
      rating: 5,
      comment: "Excellent coverage and support. They handled everything when our inverter failed.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1a5ca4] to-[#0e4a8a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-14 lg:px-16 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Protect Your Solar Investment</h1>
              <p className="text-xl mb-8 text-blue-100">
                Comprehensive insurance coverage for your solar energy system. Safeguard your investment against
                weather, theft, and equipment failure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#f26522] hover:bg-[#e55511] text-white px-8 py-3"
                  onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Get Free Quote
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white px-8 py-3"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">99.8%</div>
                    <div className="text-sm text-blue-100">Claim Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-sm text-blue-100">Support Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">5000+</div>
                    <div className="text-sm text-blue-100">Systems Insured</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">15 Days</div>
                    <div className="text-sm text-blue-100">Average Claim Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 md:px-14 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Solar Insurance?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand the unique risks and requirements of solar energy systems. Our specialized coverage ensures
            your investment is protected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {insuranceFeatures.map((feature, index) => (
            <Card key={index} className="border-gray-200 hover:border-[#1a5ca4] transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-[#1a5ca4]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-[#1a5ca4]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coverage Types */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-14 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comprehensive Coverage Options</h2>
            <p className="text-xl text-gray-600">
              Choose the protection level that best fits your solar system and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coverageTypes.map((coverage, index) => (
              <Card
                key={index}
                className={`relative border-2 ${
                  coverage.popular ? "border-[#f26522] shadow-lg scale-105" : "border-gray-200 hover:border-[#1a5ca4]"
                } transition-all`}
              >
                {coverage.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#f26522] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">{coverage.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {coverage.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 ${
                      coverage.popular ? "bg-[#f26522] hover:bg-[#e55511]" : "bg-[#1a5ca4] hover:bg-[#0e4a8a]"
                    } text-white`}
                  >
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="container mx-auto px-4 md:px-14 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple Insurance Process</h2>
          <p className="text-xl text-gray-600">Getting your solar system insured is quick and straightforward</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Get Quote", description: "Fill out our simple form to get a personalized quote" },
            { step: "2", title: "System Review", description: "Our experts review your solar system specifications" },
            { step: "3", title: "Policy Setup", description: "Choose your coverage and complete the application" },
            { step: "4", title: "Protection Active", description: "Your solar system is now fully protected" },
          ].map((process, index) => (
            <div key={index} className="text-center relative">
              <div className="bg-[#1a5ca4] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                {process.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{process.title}</h3>
              <p className="text-gray-600">{process.description}</p>
              {index < 3 && <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-[#f26522]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 md:px-14 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from solar system owners who trust our insurance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a5ca4] rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Form */}
      <div id="quote-form" className="container mx-auto px-4 md:px-14 lg:px-16 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get Your Free Insurance Quote</h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll provide you with a customized insurance quote
            </p>
          </div>

          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System Size (kW)</label>
                    <Input
                      type="text"
                      value={formData.systemSize}
                      onChange={(e) => handleInputChange("systemSize", e.target.value)}
                      className="border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      placeholder="e.g., 10kW"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Installation Location *</label>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      placeholder="City, Province"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      rows={4}
                      placeholder="Tell us about your solar system, any specific concerns, or questions..."
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#f26522] hover:bg-[#e55511] text-white py-3 text-lg font-medium"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Get Free Quote"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[#1a5ca4] text-white py-16">
        <div className="container mx-auto px-4 md:px-14 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help? Contact Our Insurance Experts</h2>
            <p className="text-xl text-blue-100">Our team is ready to help you find the perfect insurance solution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-blue-100">+92 33305050007</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-blue-100">info@solarexpress.pk</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-blue-100">Safroon Plaza 1st floor, Street 6 United Housing Society Opposite HBK Hypermarket Achini Chowk Ring road Hayatabad, Peshawar, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
