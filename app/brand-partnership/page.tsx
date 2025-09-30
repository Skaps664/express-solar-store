"use client"

import { useState } from "react"
import { Handshake, Target, TrendingUp, Globe, Award, Users, CheckCircle, Star, Send } from "lucide-react"
import emailjs from '@emailjs/browser'

export default function BrandPartnership() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    partnershipType: 'Product Vendors',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a5ca4] mb-4">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your partnership application. Our partnerships team will get back to you within 2 business days.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false)
              setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                partnershipType: 'Product Vendors',
                message: ''
              })
            }}
            className="bg-[#1a5ca4] hover:bg-[#144a87] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    )
  }
  const benefits = [
    {
      icon: TrendingUp,
      title: "Expand Market Reach",
      description: "Access Pakistan's growing solar market through our established platform"
    },
    {
      icon: Users,
      title: "Customer Base",
      description: "Connect with our 10,000+ verified customers actively seeking solar solutions"
    },
    {
      icon: Globe,
      title: "Nationwide Network",
      description: "Leverage our distribution network spanning 50+ cities across Pakistan"
    },
    {
      icon: Award,
      title: "Brand Credibility",
      description: "Enhance your brand reputation through association with Pakistan's trusted solar marketplace"
    }
  ]

  const partnershipTypes = [
    {
      title: "Product Vendors",
      description: "Solar panel manufacturers, inverter suppliers, and equipment providers",
      features: [
        "Featured product listings",
        "Priority search placement",
        "Dedicated vendor dashboard",
        "Sales analytics and reporting",
        "Marketing support"
      ]
    },
    {
      title: "Installation Partners",
      description: "Professional installation companies and certified technicians",
      features: [
        "Customer referrals",
        "Installation project management",
        "Quality assurance programs",
        "Technical training support",
        "Performance tracking"
      ]
    },
    {
      title: "Technology Partners",
      description: "Software providers, IoT companies, and tech innovators",
      features: [
        "API integration opportunities",
        "Co-development projects",
        "Technical documentation",
        "Beta testing programs",
        "Joint marketing initiatives"
      ]
    }
  ]

  const requirements = [
    "Proven track record in the solar/renewable energy industry",
    "Valid business registration and necessary certifications",
    "Commitment to quality products and customer service",
    "Ability to meet delivery and installation timelines",
    "Competitive pricing and warranty terms",
    "Technical support capabilities"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a5ca4] to-[#2563eb] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Partner With Us</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join Pakistan's leading solar marketplace and grow your business with Solar Express
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">20+</div>
              <div className="text-blue-200">Trusted Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Rs.5M+</div>
              <div className="text-blue-200">Annual Revenue</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-200">Partner Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Why Partner With Solar Express?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlock new opportunities and accelerate your business growth in Pakistan's renewable energy sector
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-semibold text-[#1a5ca4] mb-6">Partnership Benefits</h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-[#f26522] p-3 rounded-lg">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1a5ca4] mb-2">{benefit.title}</h4>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-[#1a5ca4] mb-6">Success Stories</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-[#f26522] pl-4">
                  <p className="text-gray-700 italic mb-2">
                    "Partnering with Solar Express increased our sales by 300% in just 6 months. 
                    Their platform and support team are exceptional."
                  </p>
                  <p className="font-semibold">- Ahmed Solar Solutions</p>
                </div>
                <div className="border-l-4 border-[#f26522] pl-4">
                  <p className="text-gray-700 italic mb-2">
                    "The referral system and quality leads from Solar Express have transformed 
                    our installation business."
                  </p>
                  <p className="font-semibold">- Green Energy Installers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Partnership Opportunities</h2>
            <p className="text-gray-600">
              Choose the partnership model that best fits your business
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {partnershipTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-[#1a5ca4] mb-4">{type.title}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <div className="space-y-3">
                  {type.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#f26522] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1a5ca4] mb-6">Partnership Requirements</h2>
              <p className="text-gray-700 mb-6">
                To ensure quality and reliability for our customers, we have established 
                specific criteria for our partners. These requirements help maintain the 
                high standards that Solar Express is known for.
              </p>
              <div className="space-y-3">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#f26522] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-[#1a5ca4] mb-6">Application Process</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Submit Application</h4>
                    <p className="text-gray-600 text-sm">Complete our partnership application form</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Review & Verification</h4>
                    <p className="text-gray-600 text-sm">We verify your credentials and business details</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Partnership Agreement</h4>
                    <p className="text-gray-600 text-sm">Sign partnership terms and onboarding</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Launch & Support</h4>
                    <p className="text-gray-600 text-sm">Start selling with dedicated support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a5ca4] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Partner With Us?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Pakistan's most trusted solar marketplace and take your business to the next level
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => { const el = document.getElementById('partnership-form'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }} className="bg-[#f26522] hover:bg-[#e55511] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Apply for Partnership
            </button>
            <a href="/about" className="border-2 border-white hover:bg-white hover:text-[#1a5ca4] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Learn More About Us
            </a>
          </div>
          <div className="mt-8 text-center">
            <p className="text-blue-200">
              For partnership inquiries: <a href="mailto:info@solarexpress.pk" className="underline">info@solarexpress.pk</a> | 
              <a href="tel:+92300000000" className="underline ml-2">+92 3330505000</a>
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section id="partnership-form" className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-[#1a5ca4] mb-4">Apply for Partnership</h3>
            <p className="text-gray-600 mb-6">Fill the form below and our partnerships team will reach out within 2 business days.</p>

            <form id="brand-partnership-form" onSubmit={async (e) => {
              e.preventDefault()
              setIsSubmitting(true)

              // Debug environment variables in production
              console.log('=== PARTNERSHIP FORM PRODUCTION DEBUG START ===')
              console.log('Node Environment:', process.env.NODE_ENV)
              console.log('EmailJS Service ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID)
              console.log('Partnership Template ID:', process.env.NEXT_PUBLIC_PARTNERSHIP_TEMPLATE_ID)
              console.log('EmailJS Public Key:', process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'Present' : 'Missing')
              console.log('=== PARTNERSHIP FORM PRODUCTION DEBUG END ===')

              if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill name, email and message')
                setIsSubmitting(false)
                return
              }

              try {
                const templateParams = {
                  name: formData.name,
                  company: formData.company || 'Not specified',
                  email: formData.email,
                  phone: formData.phone || 'Not provided',
                  partnershipType: formData.partnershipType,
                  message: formData.message,
                  // Additional parameters for better email formatting
                  to_name: 'Solar Express Partnership Team',
                  from_name: formData.name,
                  reply_to: formData.email,
                  subject: `Partnership Application - ${formData.company || formData.name}`,
                  // Override subject line
                  email_subject: `New Partnership Application - ${formData.company || formData.name} (${formData.partnershipType})`
                }

                console.log('EmailJS Config:', {
                  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                  templateId: process.env.NEXT_PUBLIC_PARTNERSHIP_TEMPLATE_ID,
                  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'Present' : 'Missing',
                  templateParams
                })

                const result = await emailjs.send(
                  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                  process.env.NEXT_PUBLIC_PARTNERSHIP_TEMPLATE_ID!,
                  templateParams,
                  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
                )

                console.log('EmailJS Success:', result)
                setSubmitted(true)
              } catch (error: any) {
                console.error('EmailJS Error Details:', {
                  error,
                  message: error?.message,
                  text: error?.text,
                  status: error?.status,
                  stack: error?.stack
                })
                
                let errorMessage = 'Failed to submit application. Please try again.'
                
                if (error?.text) {
                  errorMessage = `Error: ${error.text}`
                } else if (error?.message) {
                  errorMessage = `Error: ${error.message}`
                }
                
                alert(errorMessage)
              } finally {
                setIsSubmitting(false)
              }
            }} className="grid grid-cols-1 gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name" 
                  className="border rounded-md p-3" 
                  required 
                />
                <input 
                  name="company" 
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company" 
                  className="border rounded-md p-3" 
                  required 
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email" 
                  className="border rounded-md p-3" 
                  required 
                />
                <input 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone" 
                  className="border rounded-md p-3" 
                />
              </div>
              <select 
                name="partnershipType" 
                value={formData.partnershipType}
                onChange={handleInputChange}
                className="border rounded-md p-3"
              >
                <option value="Product Vendors">Product Vendors</option>
                <option value="Installation Partners">Installation Partners</option>
                <option value="Technology Partners">Technology Partners</option>
                <option value="Other">Other</option>
              </select>
              <textarea 
                name="message" 
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your company and interest" 
                className="border rounded-md p-3 h-28" 
                required 
              />
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#1a5ca4] hover:bg-[#144a87] disabled:bg-gray-400 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
