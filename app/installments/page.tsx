"use client"

import type React from "react"
import { useState } from "react"
import {
  CreditCard,
  Calculator,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Award,
  Star,
  DollarSign,
  TrendingUp,
  Shield,
  Banknote,
  Home,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

export default function InstallmentPlansPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    systemCost: "",
    downPayment: "",
    preferredTerm: "",
    monthlyIncome: "",
    message: "",
  })

  const [calculatorData, setCalculatorData] = useState({
    systemCost: [500000],
    downPayment: [100000],
    term: [36],
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
      alert("Thank you! We'll contact you soon with financing options.")
    }, 2000)
  }

  // Calculate monthly payment
  const monthlyPayment = (calculatorData.systemCost[0] - calculatorData.downPayment[0]) / calculatorData.term[0]

  const financingFeatures = [
    {
      icon: Banknote,
      title: "Sharia-Compliant Financing",
      description: "Halal installment plans through Meezan Bank's Islamic financing solutions",
    },
    {
      icon: DollarSign,
      title: "Low Profit Rates",
      description: "Competitive rates starting from 12% annually with no hidden charges",
    },
    {
      icon: Clock,
      title: "Quick Approval",
      description: "Get approved in 24-48 hours with minimal documentation required",
    },
    {
      icon: Home,
      title: "Retail Partnerships",
      description: "Special offers through Ays Electronics, Mian Brothers & Azal Electronics",
    },
  ]

  const installmentPlans = [
    {
      title: "Meezan Easy Home",
      term: "3-5 Years",
      interestRate: "12%",
      downPayment: "25%",
      features: [
        "Islamic financing solution",
        "Longest payment period",
        "Ideal for complete home systems",
        "Property as collateral",
      ],
      popular: true,
    },
    {
      title: "Third Party",
      term: "1-3 Years",
      interestRate: "14%",
      downPayment: "30%",
      features: [
        "Vehicle financing structure",
        "Medium-term solution",
        "Good for medium systems",
        "Popular choice",
      ],
      popular: false,
    },
    {
      title: "Retail Partner Plans",
      term: "6-12 Months",
      interestRate: "40%",
      downPayment: "0%",
      features: [
        "Interest-free through retailers",
        "Short payment period",
        "Perfect for small systems",
        "Quick processing",
      ],
      popular: false,
    },
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: "Immediate Savings",
      description: "Start saving on electricity bills from day one, even while paying installments",
    },
    {
      icon: Shield,
      title: "Islamic Compliance",
      description: "All financing options are Sharia-compliant with transparent terms",
    },
    {
      icon: Calculator,
      title: "Predictable Payments",
      description: "Fixed monthly payments make budgeting easy and predictable",
    },
    {
      icon: Building,
      title: "Bank Partnerships",
      description: "Direct processing through Meezan Bank's network of branches",
    },
  ]

  const testimonials = [
    {
      name: "Ahmed Raza",
      location: "Karachi",
      rating: 5,
      systemSize: "10kW",
      comment: "Meezan's Islamic financing made solar affordable while keeping it halal. Highly recommended!",
    },
    {
      name: "Fatima Khan",
      location: "Lahore",
      rating: 5,
      systemSize: "8kW",
      comment: "Got my system through Ays Electronics with 6-month interest-free installments. Great deal!",
    },
    {
      name: "Bilal Ahmed",
      location: "Islamabad",
      rating: 5,
      systemSize: "15kW",
      comment: "Meezan's 5-year plan made our solar dream possible. Now our bills are almost zero.",
    },
  ]

  const partnerLogos = [
    { name: "Meezan Bank", logo: "/meezan-logo.webp" },
    { name: "Ays Electronics", logo: "/ays-logo.jpg.webp" },
    { name: "Mian Brothers", logo: "/mian-logo.png" },
    { name: "Afzal Electronics", logo: "/afzal-logo.webp" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1a5ca4] to-[#0e4a8a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-14 lg:px-16 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Islamic Solar Financing Solutions</h1>
              <p className="text-xl mb-8 text-blue-100">
                Halal installment plans through Meezan Bank and interest-free options from leading electronics retailers. 
                Start your solar journey today with Sharia-compliant financing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#f26522] hover:bg-[#e55511] text-white px-8 py-3"
                  onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Calculate Payment
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white px-8 py-3"
                  onClick={() => document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Apply Now
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">12%</div>
                    <div className="text-sm text-blue-100">Starting Profit Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">5</div>
                    <div className="text-sm text-blue-100">Max Years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">0%</div>
                    <div className="text-sm text-blue-100">Processing Fee</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">24hrs</div>
                    <div className="text-sm text-blue-100">Quick Approval</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="container mx-auto px-4 md:px-14 lg:px-16 py-8 bg-white">
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-gray-600">In partnership with</h3>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partnerLogos.map((partner, index) => (
            <div key={index} className="w-32 h-16 flex items-center justify-center">
              {/* Replace with actual logo components or images */}
              <div className="text-lg font-semibold text-gray-800">{partner.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 md:px-14 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Islamic Financing?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sharia-compliant solar financing solutions designed for Pakistani homeowners and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {financingFeatures.map((feature, index) => (
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

      {/* Payment Calculator */}
      <div id="calculator" className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-14 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Islamic Payment Calculator</h2>
            <p className="text-xl text-gray-600">Calculate your monthly payments under Diminishing Musharakah</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        System Cost: PKR {calculatorData.systemCost[0].toLocaleString()}
                      </label>
                      <Slider
                        value={calculatorData.systemCost}
                        onValueChange={(value) => setCalculatorData((prev) => ({ ...prev, systemCost: value }))}
                        max={2000000}
                        min={200000}
                        step={50000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>PKR 200K</span>
                        <span>PKR 2M</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Down Payment: PKR {calculatorData.downPayment[0].toLocaleString()}
                      </label>
                      <Slider
                        value={calculatorData.downPayment}
                        onValueChange={(value) => setCalculatorData((prev) => ({ ...prev, downPayment: value }))}
                        max={calculatorData.systemCost[0] * 0.5}
                        min={0}
                        step={10000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>PKR 0</span>
                        <span>PKR {(calculatorData.systemCost[0] * 0.5).toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Payment Term: {calculatorData.term[0]} Months
                      </label>
                      <Slider
                        value={calculatorData.term}
                        onValueChange={(value) => setCalculatorData((prev) => ({ ...prev, term: value }))}
                        max={60}
                        min={6}
                        step={6}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>6 Months</span>
                        <span>60 Months</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">System Cost:</span>
                        <span className="font-semibold">PKR {calculatorData.systemCost[0].toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Down Payment:</span>
                        <span className="font-semibold">PKR {calculatorData.downPayment[0].toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Financed Amount:</span>
                        <span className="font-semibold">
                          PKR {(calculatorData.systemCost[0] - calculatorData.downPayment[0]).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Term:</span>
                        <span className="font-semibold">{calculatorData.term[0]} Months</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-gray-900">Estimated Monthly Payment:</span>
                        <span className="font-bold text-[#1a5ca4] text-xl">PKR {monthlyPayment.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      * This is an estimate. Final payment plan will be provided by Meezan Bank after approval.
                    </div>
                    <Button className="w-full mt-6 bg-[#f26522] hover:bg-[#e55511] text-white">
                      Apply for Islamic Financing
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Installment Plans */}
      <div className="container mx-auto px-4 md:px-14 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Islamic Payment Plan</h2>
          <p className="text-xl text-gray-600">
            Sharia-compliant options through Meezan Bank and retail partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {installmentPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-2 ${
                plan.popular ? "border-[#f26522] shadow-lg scale-105" : "border-gray-200 hover:border-[#1a5ca4]"
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#f26522] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</CardTitle>
                <div className="text-3xl font-bold text-[#1a5ca4] mb-2">{plan.term}</div>
                <div className="text-lg text-gray-600">{plan.interestRate} Profit Rate</div>
                <div className="text-sm text-gray-500">{plan.downPayment} Down Payment</div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular ? "bg-[#f26522] hover:bg-[#e55511]" : "bg-[#1a5ca4] hover:bg-[#0e4a8a]"
                  } text-white`}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 md:px-14 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Benefits of Islamic Solar Financing</h2>
            <p className="text-xl text-gray-600">Why financing your solar system through Islamic banking is the right choice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-gray-200 text-center">
                <CardContent className="p-6">
                  <div className="bg-[#f26522]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-[#f26522]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 md:px-14 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Customer Experiences</h2>
          <p className="text-xl text-gray-600">
            Real customers who chose our Islamic financing options
          </p>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a5ca4] rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-[#1a5ca4]">{testimonial.systemSize}</div>
                    <div className="text-xs text-gray-500">System Size</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Form */}
      <div id="apply-form" className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-14 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Apply for Islamic Solar Financing</h2>
              <p className="text-xl text-gray-600">Fill out the application form and get approved in 24-48 hours</p>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">System Cost (PKR) *</label>
                      <Input
                        type="text"
                        value={formData.systemCost}
                        onChange={(e) => handleInputChange("systemCost", e.target.value)}
                        className="border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                        placeholder="e.g., 500,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment (PKR)</label>
                      <Input
                        type="text"
                        value={formData.downPayment}
                        onChange={(e) => handleInputChange("downPayment", e.target.value)}
                        className="border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                        placeholder="e.g., 100,000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Payment Term</label>
                      <select
                        value={formData.preferredTerm}
                        onChange={(e) => handleInputChange("preferredTerm", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      >
                        <option value="">Select Term</option>
                        <option value="6">6 Months (Retail Partner)</option>
                        <option value="12">12 Months (Retail Partner)</option>
                        <option value="24">24 Months (Meezan)</option>
                        <option value="36">36 Months (Meezan)</option>
                        <option value="60">60 Months (Meezan)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income (PKR) *</label>
                      <Input
                        type="text"
                        value={formData.monthlyIncome}
                        onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                        className="border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                        placeholder="e.g., 150,000"
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
                        placeholder="Tell us about your employment, any specific requirements, or questions..."
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Required Documents for Meezan Financing:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Copy of CNIC (front & back)</li>
                      <li>• Salary certificate or business proof</li>
                      <li>• Bank statements (last 6 months)</li>
                      <li>• Utility bills (electricity & gas)</li>
                      <li>• Property documents (for Easy Home)</li>
                    </ul>
                    <div className="mt-2 text-sm text-blue-800">
                      For retail partner financing, only CNIC and initial deposit required.
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#f26522] hover:bg-[#e55511] text-white py-3 text-lg font-medium"
                    disabled={loading}
                  >
                    {loading ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[#1a5ca4] text-white py-16">
        <div className="container mx-auto px-4 md:px-14 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help with Islamic Financing?</h2>
            <p className="text-xl text-blue-100">
              Our financing experts are here to help you find the perfect Sharia-compliant solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-blue-100">021-111-333-786</p>
              <p className="text-sm text-blue-200">Meezan Solar Helpline</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-blue-100">solar@meezanbank.com</p>
              <p className="text-sm text-blue-200">For Meezan financing inquiries</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Partner Stores</h3>
              <p className="text-blue-100">Ays, Mian Bros, Azal</p>
              <p className="text-sm text-blue-200">For interest-free retail plans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}