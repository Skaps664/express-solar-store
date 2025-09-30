"use client"

import { useState } from "react"
import { Phone, Mail, MessageCircle, Clock, MapPin, Send, CheckCircle, AlertCircle, HelpCircle } from "lucide-react"
import emailjs from '@emailjs/browser'

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
    orderNumber: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const supportChannels = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      details: "+92 3330505000",
      hours: "9 AM - 6 PM (Mon-Sat)",
      response: "Immediate"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us detailed queries via email",
      details: "support@solarexpress.pk",
      hours: "24/7 Monitoring",
      response: "Within 2 hours"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Real-time chat with support agents",
      details: "Available on website",
      hours: "9 AM - 11 PM Daily",
      response: "Under 5 minutes"
    }
  ]

  const supportCategories = [
    { value: "general", label: "General Inquiry" },
    { value: "orders", label: "Order Status & Tracking" },
    { value: "payment", label: "Payment & Billing" },
    { value: "technical", label: "Technical Support" },
    { value: "installation", label: "Installation Services" },
    { value: "warranty", label: "Warranty Claims" },
    { value: "returns", label: "Returns & Refunds" },
    { value: "partnership", label: "Business Partnership" }
  ]

  const commonIssues = [
    {
      title: "Order Tracking",
      description: "Track your order status and delivery updates",
      link: "/track-order"
    },
    {
      title: "Installation Scheduling",
      description: "Schedule or reschedule your installation appointment",
      link: "/installation"
    },
    {
      title: "Product Information",
      description: "Get detailed specifications and compatibility info",
      link: "/products"
    },
    {
      title: "Payment Issues",
      description: "Resolve payment problems and billing questions",
      link: "/payment-info"
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const templateParams = {
        form_type: 'Support Request',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        category: formData.category,
        subject: formData.subject || 'Support Inquiry',
        message: formData.message,
        orderNumber: formData.orderNumber || 'Not provided',
        // Additional parameters for better email formatting
        to_name: 'Solar Express Support Team',
        from_name: formData.name,
        reply_to: formData.email,
        // Override subject line
        email_subject: `New Support Request - ${formData.category || formData.subject || 'General Support'}`
      }

      console.log('EmailJS Config:', {
        serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        templateId: process.env.NEXT_PUBLIC_SUPPORT_TEMPLATE_ID,
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'Present' : 'Missing',
        templateParams
      })

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_SUPPORT_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      console.log('EmailJS Success:', result)
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        subject: "",
        message: "",
        orderNumber: ""
      })
    } catch (error: any) {
      console.error('EmailJS Error Details:', {
        error,
        message: error?.message,
        text: error?.text,
        status: error?.status,
        stack: error?.stack
      })
      
      let errorMessage = 'Failed to send message. Please try again.'
      
      if (error?.text) {
        errorMessage = `Error: ${error.text}`
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <h2 className="text-2xl font-bold text-[#1a5ca4] mb-4">Message Sent Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. Our support team will get back to you within 2 hours.
          </p>
          <button 
            onClick={() => {setSubmitted(false); setFormData({name: "", email: "", phone: "", category: "", subject: "", message: "", orderNumber: ""})}}
            className="bg-[#1a5ca4] hover:bg-[#144a87] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a5ca4] to-[#2563eb] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Support Center</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            We're here to help you with all your solar energy needs
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2hr</div>
              <div className="text-blue-200">Average Response</div>
            </div>
            <div>
              <div className="text-3xl font-bold">98%</div>
              <div className="text-blue-200">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Get in Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the contact method that works best for you
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <channel.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1a5ca4] mb-3">{channel.title}</h3>
                <p className="text-gray-600 mb-4">{channel.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-[#f26522]">{channel.details}</div>
                  <div className="text-gray-600">{channel.hours}</div>
                  <div className="text-green-600">Response: {channel.response}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Form */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Send Us a Message</h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
                  placeholder="+92 3330505000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order Number (if applicable)
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
                  placeholder="SE-2025-XXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
              >
                <option value="">Select a category</option>
                {supportCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
                placeholder="Brief description of your inquiry"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
                placeholder="Please provide detailed information about your inquiry..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1a5ca4] hover:bg-[#144a87] disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Quick Help</h2>
            <p className="text-gray-600">
              Common issues and quick solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commonIssues.map((issue, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="font-semibold text-[#1a5ca4] mb-3">{issue.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{issue.description}</p>
                <a 
                  href={issue.link}
                  className="text-[#f26522] hover:text-[#e55511] font-semibold text-sm flex items-center gap-2"
                >
                  Get Help
                  <HelpCircle className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Information */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Visit Our Office</h2>
            <p className="text-gray-600">
              Meet our team in person at any of our locations
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-6 w-6 text-[#f26522] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#1a5ca4] mb-2">Peshawar Office</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Safroon Plaza 1st floor, Street 6 United Housing Society Opposite HBK Hypermarket Achini Chowk Ring road Hayatabad, Peshawar, Pakistan
                  </p>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4" />
                      Mon-Sat: 9 AM - 6 PM
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      +92 3330505000
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
