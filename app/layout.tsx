import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "react-hot-toast"
import { CartProvider } from "@/context/CartContext"
import AnalyticsProvider from "@/components/analytics-provider"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Solar Express - Renewable Energy Products",
  description: "Your one-stop shop for solar and renewable energy products",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <AnalyticsProvider>
              <ToastProvider>
                <Toaster position="top-center" />
                <Header />
                <main>{children}</main>
                <Footer />
                <FloatingCartButton />
              </ToastProvider>
            </AnalyticsProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
