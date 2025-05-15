import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
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
          <p className="text-gray-600">info@solarexpress.com</p>
          <p className="text-gray-600">support@solarexpress.com</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <Phone className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-bold mb-2">Phone</h3>
          <p className="text-gray-600">+1 (888) 123-4567</p>
          <p className="text-gray-600">+1 (888) 765-4321</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <MapPin className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-bold mb-2">Address</h3>
          <p className="text-gray-600">123 Solar Way</p>
          <p className="text-gray-600">Renewable City, 12345</p>
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
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input id="name" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your Email" />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <Input id="subject" placeholder="Subject" />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <Textarea id="message" placeholder="Your Message" rows={5} />
            </div>
            <Button className="w-full bg-amber-500 hover:bg-amber-600">Send Message</Button>
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
