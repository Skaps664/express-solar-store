"use client"

import { CreditCard, Shield, Clock, CheckCircle, AlertCircle, Banknote, Smartphone } from "lucide-react"

export default function PaymentInformation() {
  const paymentMethods = [
    {
      icon: CreditCard,
      title: "Credit/Debit Cards",
      description: "Visa, Mastercard, and local bank cards",
      details: [
        "Instant payment processing",
        "3D Secure authentication",
        "Auto-saved for future purchases",
        "Refunds processed in 3-5 business days"
      ]
    },
    {
      icon: Banknote,
      title: "Bank Transfer",
      description: "Direct bank transfers and online banking",
      details: [
        "All major Pakistani banks supported",
        "Payment confirmation within 24 hours",
        "No additional processing fees",
        "Secure encrypted transactions"
      ]
    },

    // Bank details snippet for display elsewhere
    {
      icon: Smartphone,
      title: "Mobile Wallets",
      description: "JazzCash, Easypaisa, and other mobile payments",
      details: [
        "Quick mobile payments",
        "Instant payment confirmation",
        "No bank account required",
        "24/7 availability"
      ]
    }
  ]

  const installmentOptions = [
    {
      duration: "3 Months",
      rate: "0% markup",
      minAmount: "PKR 50,000",
      description: "Perfect for smaller solar systems"
    },
    {
      duration: "6 Months",
      rate: "2% markup",
      minAmount: "PKR 100,000",
      description: "Most popular option for residential systems"
    },
    {
      duration: "12 Months",
      rate: "5% markup",
      minAmount: "PKR 200,000",
      description: "Ideal for commercial installations"
    },
    {
      duration: "24 Months",
      rate: "8% markup",
      minAmount: "PKR 500,000",
      description: "Extended financing for large projects"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a5ca4] to-[#2563eb] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Payment Information</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Secure, convenient, and flexible payment options for your solar purchase
          </p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Accepted Payment Methods</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from multiple secure payment options that work best for you
            </p>
          </div>

          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-[#1a5ca4] mb-2">Bank Transfer Details</h3>
              <p className="text-sm text-gray-700 mb-2">Account Title: <strong>Solar Express LLP</strong></p>
              <p className="text-sm text-gray-700 mb-2">Account Number: <strong>6-4-54-20311-714-130309</strong></p>
              <p className="text-sm text-gray-700">IBAN: <strong>PK24MPBL0454027140130309</strong></p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a5ca4] mb-2">{method.title}</h3>
                  <p className="text-gray-600">{method.description}</p>
                </div>
                <div className="space-y-3">
                  {method.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#f26522] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installment Plans */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Flexible Installment Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Make your solar investment more affordable with our flexible financing options
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {installmentOptions.map((option, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-[#1a5ca4] mb-2">{option.duration}</h3>
                <div className="text-[#f26522] font-semibold text-lg mb-3">{option.rate}</div>
                <div className="text-gray-600 mb-3">Min: {option.minAmount}</div>
                <p className="text-gray-700 text-sm">{option.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Installment Plan Requirements</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Valid CNIC and proof of income required</li>
                  <li>• Down payment of 20% minimum</li>
                  <li>• Credit check may be required for longer terms</li>
                  <li>• Subject to approval by our financing partners</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Protection */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Security & Protection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your payment information is protected with industry-leading security measures
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-[#1a5ca4] mb-6">How We Protect You</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a5ca4] mb-2">SSL Encryption</h4>
                    <p className="text-gray-600">All transactions are encrypted with 256-bit SSL technology</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a5ca4] mb-2">PCI Compliance</h4>
                    <p className="text-gray-600">We comply with Payment Card Industry Data Security Standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#f26522] p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a5ca4] mb-2">Fraud Monitoring</h4>
                    <p className="text-gray-600">24/7 fraud detection and prevention systems</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-[#1a5ca4] mb-6">Payment FAQs</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Is my payment information secure?</h4>
                  <p className="text-gray-600 text-sm">Yes, we use bank-level encryption and never store your complete card details.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I get a refund?</h4>
                  <p className="text-gray-600 text-sm">Yes, refunds are processed according to our return policy, typically within 5-7 business days.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What if my payment fails?</h4>
                  <p className="text-gray-600 text-sm">You'll receive an instant notification. Please check your card details or try an alternative payment method.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Are there any hidden fees?</h4>
                  <p className="text-gray-600 text-sm">No, all prices include applicable taxes. Any additional charges are clearly disclosed before payment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#1a5ca4] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Payment Assistance?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our payment support team is here to help you with any questions or issues
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/support" className="bg-[#f26522] hover:bg-[#e55511] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact Support
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
