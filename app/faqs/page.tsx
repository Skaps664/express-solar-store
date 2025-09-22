"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search, HelpCircle, Zap, Sun, Shield } from "lucide-react"

export default function FAQs() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const faqCategories = [
    {
      title: "General Questions",
      icon: HelpCircle,
      faqs: [
        {
          question: "What is Solar Express?",
          answer: "Solar Express is Pakistan's leading online marketplace for solar energy products. We connect customers with verified vendors, offering everything from individual solar panels to complete commercial installations with transparent pricing and professional support."
        },
        {
          question: "How does Solar Express work?",
          answer: "Simply browse our extensive catalog of solar products, compare prices from different vendors, place your order online, and choose your preferred delivery option. Our team handles the rest, including quality checks and professional installation if required."
        },
        {
          question: "Is Solar Express available throughout Pakistan?",
          answer: "Yes, we deliver to 50+ cities across Pakistan. Our main coverage includes major cities like Karachi, Lahore, Islamabad, with extended delivery to smaller cities and towns nationwide."
        },
        {
          question: "Are all vendors on Solar Express verified?",
          answer: "Absolutely. Every vendor goes through a strict verification process including business registration checks, product quality assessments, and customer service evaluations before joining our platform."
        }
      ]
    },
    {
      title: "Solar Products",
      icon: Sun,
      faqs: [
        {
          question: "What types of solar products do you offer?",
          answer: "We offer a complete range including monocrystalline and polycrystalline solar panels, string and micro inverters, mounting systems, batteries, charge controllers, cables, and all necessary accessories for residential and commercial installations."
        },
        {
          question: "How do I choose the right solar system size?",
          answer: "System size depends on your electricity consumption, roof space, and budget. Our solar calculator tool helps estimate your needs, or you can consult with our experts for a personalized recommendation based on your electricity bills."
        },
        {
          question: "What brands do you carry?",
          answer: "We partner with leading international and local brands including Jinko Solar, Canadian Solar, JA Solar, Growatt, Solis, Huawei, and many more. All products come with manufacturer warranties."
        },
        {
          question: "Do you offer solar batteries?",
          answer: "Yes, we offer various battery options including lithium-ion, gel, and AGM batteries from trusted brands. Our experts can help you choose the right battery capacity for your backup power needs."
        }
      ]
    },
    {
      title: "Installation & Service",
      icon: Zap,
      faqs: [
        {
          question: "Do you provide installation services?",
          answer: "Yes, we have a network of certified installation partners across Pakistan. Installation includes site survey, system design, professional installation, testing, and commissioning with a 1-year service warranty."
        },
        {
          question: "How long does installation take?",
          answer: "Residential installations typically take 1-2 days, while commercial projects may take 3-7 days depending on system size and complexity. We'll provide a detailed timeline during the site survey."
        },
        {
          question: "What's included in the installation service?",
          answer: "Complete installation includes mounting system setup, panel installation, electrical connections, inverter configuration, grid connection (if applicable), system testing, and commissioning. We also provide system monitoring setup and user training."
        },
        {
          question: "Do you provide maintenance services?",
          answer: "Yes, we offer annual maintenance packages including system cleaning, performance monitoring, electrical checks, and preventive maintenance to ensure optimal system performance throughout its lifetime."
        }
      ]
    },
    {
      title: "Pricing & Payment",
      icon: Shield,
      faqs: [
        {
          question: "How competitive are your prices?",
          answer: "Our marketplace model ensures competitive pricing as vendors compete for your business. You can compare prices from multiple sellers and choose the best deal that meets your quality and budget requirements."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, bank transfers, mobile wallets (JazzCash, Easypaisa), and offer flexible installment plans ranging from 3 to 24 months for larger purchases."
        },
        {
          question: "Do you offer financing options?",
          answer: "Yes, we provide flexible financing with installment plans from 3-24 months. Interest rates vary from 0% (3 months) to 8% (24 months) depending on the plan selected and credit approval."
        },
        {
          question: "Are there any hidden costs?",
          answer: "No hidden costs. All prices include applicable taxes. Delivery charges apply for orders below the free shipping threshold. Installation costs are quoted separately and clearly disclosed upfront."
        }
      ]
    },
    {
      title: "Warranty & Support",
      icon: Shield,
      faqs: [
        {
          question: "What warranties are provided?",
          answer: "Solar panels come with 25-year power output warranties and 10-12 year product warranties. Inverters have 5-10 year warranties. Installation work includes a 1-year service warranty covering workmanship and system performance."
        },
        {
          question: "What if something goes wrong with my system?",
          answer: "Contact our support team immediately. We provide troubleshooting support and coordinate warranty claims with manufacturers. For installation-related issues, our service team provides on-site support."
        },
        {
          question: "How do I claim warranty?",
          answer: "Simply contact our customer support with your order number and description of the issue. We'll guide you through the warranty process and coordinate with manufacturers or installers as needed."
        },
        {
          question: "Do you provide technical support?",
          answer: "Yes, our technical team provides ongoing support including system monitoring guidance, troubleshooting, performance optimization tips, and answers to any technical questions about your solar system."
        }
      ]
    }
  ]

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a5ca4] to-[#2563eb] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Find answers to common questions about solar energy and our services
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border-0 text-gray-900 focus:ring-2 focus:ring-[#f26522] text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No FAQs found</h3>
              <p className="text-gray-500">Try searching with different keywords or browse all categories below.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredFAQs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-[#f26522] p-3 rounded-lg">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#1a5ca4]">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex
                      const isOpen = openFAQ === globalIndex
                      
                      return (
                        <div key={faqIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
                          <button
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="text-lg font-semibold text-[#1a5ca4] pr-4">{faq.question}</h3>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-[#f26522] flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-[#f26522] flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Still Need Help?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a5ca4] mb-3">Contact Support</h3>
              <p className="text-gray-600 mb-4">Get personalized help from our expert team</p>
              <a href="/support" className="bg-[#1a5ca4] hover:bg-[#144a87] text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Get Help
              </a>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a5ca4] mb-3">Solar Calculator</h3>
              <p className="text-gray-600 mb-4">Estimate your solar system requirements</p>
              <a href="/calculator" className="bg-[#1a5ca4] hover:bg-[#144a87] text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Calculate
              </a>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a5ca4] mb-3">Free Consultation</h3>
              <p className="text-gray-600 mb-4">Speak with our solar experts</p>
              <a href="tel:+92300000000" className="bg-[#1a5ca4] hover:bg-[#144a87] text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#1a5ca4] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Have a Different Question?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team is available 24/7 to help you with any questions about solar energy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@solarexpress.pk" className="bg-[#f26522] hover:bg-[#e55511] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Email Support
            </a>
            <a href="tel:+923330505000" className="border-2 border-white hover:bg-white hover:text-[#1a5ca4] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Call: +92 3330505000
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
