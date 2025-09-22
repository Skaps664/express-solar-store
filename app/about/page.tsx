"use client"

import { Users, Target, Award, Zap, Shield, Globe } from "lucide-react"

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a5ca4] to-[#2563eb] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Solar Express</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Powering Pakistan's renewable energy future with cutting-edge solar solutions
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold">20+</div>
              <div className="text-blue-200">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1,000+</div>
              <div className="text-blue-200">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1a5ca4] mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2020, Solar Express emerged from a vision to make clean, renewable energy 
                accessible to every Pakistani household and business. What started as a small team of 
                passionate engineers has grown into Pakistan's leading solar marketplace.
              </p>
              <p className="text-gray-700 mb-4">
                We recognized the gap between high-quality solar products and reliable vendors in Pakistan. 
                Our mission became clear: create a trusted platform that connects verified solar equipment 
                suppliers with customers seeking sustainable energy solutions.
              </p>
              <p className="text-gray-700">
                Today, we're proud to serve customers across Pakistan, offering everything from individual 
                solar panels to complete industrial installations, backed by our commitment to quality, 
                transparency, and exceptional service.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-[#1a5ca4] mb-4">Why Choose Solar Express?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-[#f26522] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Verified Vendors</div>
                    <div className="text-gray-600 text-sm">All our sellers are thoroughly vetted for quality and reliability</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-[#f26522] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Quality Assurance</div>
                    <div className="text-gray-600 text-sm">Premium products with manufacturer warranties</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-[#f26522] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Nationwide Delivery</div>
                    <div className="text-gray-600 text-sm">Professional installation services across Pakistan</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <Target className="h-16 w-16 text-[#f26522] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#1a5ca4] mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To democratize solar energy in Pakistan by providing a transparent, reliable, and 
                comprehensive marketplace that connects customers with the best solar solutions, 
                making renewable energy accessible, affordable, and efficient for everyone.
              </p>
            </div>
            <div className="text-center">
              <Zap className="h-16 w-16 text-[#f26522] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#1a5ca4] mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To be Pakistan's leading solar energy platform, powering a sustainable future where 
                every home and business can harness clean, renewable energy, contributing to a 
                greener Pakistan and a better world for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-[#1a5ca4] text-center mb-12">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#1a5ca4] to-[#f26522] rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safdar</h3>
              <p className="text-[#f26522] font-medium mb-2">Chief Executive Officer</p>
              <p className="text-gray-600 text-sm">
                15+ years in renewable energy sector, leading Pakistan's transition to clean energy
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#1a5ca4] to-[#f26522] rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adnan Khan</h3>
              <p className="text-[#f26522] font-medium mb-2">Chief Technology Officer</p>
              <p className="text-gray-600 text-sm">
                Technology visionary with expertise in e-commerce platforms and solar systems
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#1a5ca4] to-[#f26522] rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Haider Ali</h3>
              <p className="text-[#f26522] font-medium mb-2">Head of Operations</p>
              <p className="text-gray-600 text-sm">
                Operations expert ensuring seamless delivery and installation across Pakistan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-[#1a5ca4] text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-gray-600">
                Transparent pricing, honest communication, and ethical business practices
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                Commitment to delivering the highest quality products and services
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Your success is our priority - from consultation to after-sales support
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                Continuously improving our platform and embracing new technologies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#1a5ca4] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Go Solar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made the switch to clean, renewable energy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/store" className="bg-[#f26522] hover:bg-[#e55511] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Browse Products
            </a>
            <a href="/support" className="border-2 border-white hover:bg-white hover:text-[#1a5ca4] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
