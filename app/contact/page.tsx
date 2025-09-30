"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import emailjs from '@emailjs/browser'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const templateParams = {
        form_type: 'Contact Request',
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        // Additional parameters for better email formatting
        to_name: 'Solar Express Team',
        from_name: formData.name,
        reply_to: formData.email,
        // Override subject line
        email_subject: `New Contact Request - ${formData.subject || 'General Inquiry'}`
      }

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_CONTACT_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Email send failed:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button 
            onClick={() => {setSubmitted(false)}}
            className="bg-[#1a5ca4] hover:bg-[#144a87] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <Mail className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-bold mb-2">Email</h3>
          <p className="text-gray-600">info@solarexpress.pk</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <Phone className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-bold mb-2">Phone</h3>
          <p className="text-gray-600">+92 3330505000</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <MapPin className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-bold mb-2">Address</h3>
          <p className="text-gray-600">Safroon Plaza 1st floor, Street 6 United Housing Society Opposite HBK Hypermarket </p>
          <p className="text-gray-600">Achini Chowk Ring road Hayatabad</p>
          <p className="text-gray-600">Peshawar, Pakistan 25000</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-bold mb-2">Working Hours</h3>
          <p className="text-gray-600">Mon-Fri: 9AM - 6PM</p>
          <p className="text-gray-600">Sat: 10AM - 4PM</p>
        </div>
      </div>

      {/* Map and Contact Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Map */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
          <div className="text-gray-400">[Map Location]</div>
        </div>

        {/* Contact Form */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions about our solar products or services? Fill out the form below and we'll get back to you as
            soon as possible.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name *
                </label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email" 
                  required 
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject *
              </label>
              <Input 
                id="subject" 
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject" 
                required 
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message *
              </label>
              <Textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message" 
                rows={5} 
                required 
              />
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 flex items-center gap-2 justify-center"
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
            </Button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "How do I determine what size solar system I need?",
              a: "We assess your energy usage, roof space, and budget to recommend the optimal system size for your needs.",
            },
            {
              q: "What payment options do you offer?",
              a: "We accept credit cards, bank transfers, and offer financing options with competitive rates.",
            },
            {
              q: "Do you provide installation services?",
              a: "Yes, we have certified installers who handle the complete setup of your solar system.",
            },
            {
              q: "What warranty do your products have?",
              a: "Our solar panels come with a 25-year performance warranty and a 10-year product warranty.",
            },
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// <!--
//   Copyright 2023 Google LLC

//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at

//       https://www.apache.org/licenses/LICENSE-2.0

//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
// -->
// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Locator</title>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width,initial-scale=1">
//     <style>
//       html,
//       body {
//         height: 100%;
//         margin: 0;
//       }

//       gmpx-store-locator {
//         width: 100%;
//         height: 100%;

//         /* These parameters customize the appearance of Locator Plus. See the documentation at
//            https://github.com/googlemaps/extended-component-library/blob/main/src/store_locator/README.md
//            for more information. */
//         --gmpx-color-surface: #fff;
//         --gmpx-color-on-surface: #212121;
//         --gmpx-color-on-surface-variant: #757575;
//         --gmpx-color-primary: #1967d2;
//         --gmpx-color-outline: #e0e0e0;
//         --gmpx-fixed-panel-width-row-layout: 28.5em;
//         --gmpx-fixed-panel-height-column-layout: 65%;
//         --gmpx-font-family-base: "Roboto", sans-serif;
//         --gmpx-font-family-headings: "Roboto", sans-serif;
//         --gmpx-font-size-base: 0.875rem;
//         --gmpx-hours-color-open: #188038;
//         --gmpx-hours-color-closed: #d50000;
//         --gmpx-rating-color: #ffb300;
//         --gmpx-rating-color-empty: #e0e0e0;
//       }
//     </style>
//     <script>
//       const CONFIGURATION = {
//         "locations": [
//           {"title":"Solar Express","address1":"Safroon Plaza 1st floor, Street 6 United Housing Society Opposite HBK ","address2":"Peshawar, Pakistan","coords":{"lat":33.9765,"lng":71.4735711},"placeId":"ChIJgwNGrIkR2TgRP1ruOMA7mRs"}
//         ],
//         "mapOptions": {"center":{"lat":38.0,"lng":-100.0},"fullscreenControl":true,"mapTypeControl":false,"streetViewControl":false,"zoom":4,"zoomControl":true,"maxZoom":17,"mapId":""},
//         "mapsApiKey": "YOUR_API_KEY_HERE",
//         "capabilities": {"input":false,"autocomplete":false,"directions":false,"distanceMatrix":false,"details":false,"actions":false}
//       };

//     </script>
//     <script type="module">
//       document.addEventListener('DOMContentLoaded', async () => {
//         await customElements.whenDefined('gmpx-store-locator');
//         const locator = document.querySelector('gmpx-store-locator');
//         locator.configureFromQuickBuilder(CONFIGURATION);
//       });
//     </script>
//   </head>
//   <body>
//     <script type="module" src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js"></script>

//     <!-- Uses components from the Extended Component Library; see
//          https://github.com/googlemaps/extended-component-library for more information
//          on these HTML tags and how to configure them. -->
//     <gmpx-api-loader key="YOUR_API_KEY_HERE" solution-channel="GMP_QB_locatorplus_v11_c"></gmpx-api-loader>
//     <gmpx-store-locator map-id="DEMO_MAP_ID"></gmpx-store-locator>
//   </body>
// </html>