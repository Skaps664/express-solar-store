import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-[#1a5ca4] text-white pt-10 md:pt-12 pb-6 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-8 mx-4 md:px-10 lg:px-12">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img src="/logo-crop.png" alt="Solar Express Logo" className="h-12 md:h-12" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 text-[#f26522] flex-shrink-0" />
                <span className="text-sm md:text-base">Office #24, 2nd Floor, Johar Business Center, Main University Road, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#f26522] flex-shrink-0" />
                <span className="text-sm md:text-base">+92 331 6801200</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#f26522] flex-shrink-0" />
                <span className="text-sm md:text-base">info@solarexpress.pk</span>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/brand-partnership" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Brand Partnership
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/payment-info" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Payment Information
                </Link>
              </li>
              <li>
                <Link href="/shipping-info" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Policy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/exchanges" className="text-sm md:text-base hover:text-[#f26522] transition-colors">
                  Exchange Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Socials */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Connect</h3>
            <p className="mb-4 text-sm md:text-base">Follow us on social media for updates</p>
            <div className="flex gap-4 mb-6">
              <a href="https://facebook.com/solarexpress.pk" target="_blank" rel="noopener noreferrer" className="hover:text-[#f26522] transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com/solarexpress.pk" target="_blank" rel="noopener noreferrer" className="hover:text-[#f26522] transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://youtube.com/@solarexpress" target="_blank" rel="noopener noreferrer" className="hover:text-[#f26522] transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://tiktok.com/@solarexpress.pk" target="_blank" rel="noopener noreferrer" className="hover:text-[#f26522] transition-colors">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            <div className="space-y-2">
              <Input type="email" placeholder="Subscribe to Newsletter" className="text-white bg-white/10 border-white/20 text-sm" />
              <Button className="w-full bg-[#f26522] hover:bg-[#e55511] text-sm">Subscribe</Button>
            </div>
          </div>
        </div>

        <hr className="border-white/20 mb-6" />

        <div className="text-center text-white/70 text-xs md:text-sm">
          &copy; {new Date().getFullYear()} Solar Express. All rights reserved.
          <p>
        Designed & developed with <span className="text-[#39FF14]">♥</span> by <strong>Team <a href="https://skordl.com" className="text-[#39FF14] hover:text-[#e55511]">skordl</a></strong>
      </p>
        </div>
      </div>
    </footer>
  )
}
