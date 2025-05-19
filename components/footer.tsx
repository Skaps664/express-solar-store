import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-[#1a5ca4] text-white pt-10 md:pt-12 pb-6 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 mx-4 md:px-10 lg:px-12">
          {/* Contact Info */}
          <div>
            <div className="mb-6">
              <img src="/logo-crop.PNG" alt="Solar Express Logo" className="h-12 md:h-12" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 text-[#f26522] flex-shrink-0" />
                <span className="text-sm md:text-base">123 Solar Way, Gulberg III, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#f26522] flex-shrink-0" />
                <span className="text-sm md:text-base">+92 (42) 3571-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#f26522] flex-shrink-0" />
                <span className="text-sm md:text-base">info@solarexpress.pk</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <Facebook className="h-5 w-5" />
              <Twitter className="h-5 w-5" />
              <Instagram className="h-5 w-5" />
              <Youtube className="h-5 w-5" />
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Warranty Information
                </a>
              </li>
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Solar Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Solar Panels
                </a>
              </li>
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Inverters
                </a>
              </li>
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Batteries
                </a>
              </li>
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Complete Systems
                </a>
              </li>
              <li>
                <a href="#" className="text-sm md:text-base hover:text-[#f26522]">
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Subscribe</h3>
            <p className="mb-4 text-sm md:text-base">Subscribe to our newsletter for the latest updates and offers</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input type="email" placeholder="Your Email" className="bg-white/10 border-white/20" />
              <Button className="bg-[#f26522] hover:bg-[#e55511] whitespace-nowrap">Subscribe</Button>
            </div>
          </div>
        </div>

        <hr className="border-white/20 mb-6" />

        <div className="text-center text-white/70 text-xs md:text-sm">
          &copy; {new Date().getFullYear()} Solar Express. All rights reserved. |  Designed & Developed by Team <a href="https://skordl.com" className="text-[#f26522] hover:text-[#e55511]">skordl</a>
        </div>
      </div>
    </footer>
  )
}
