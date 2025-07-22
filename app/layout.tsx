import type React from "react"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "react-hot-toast"
import { CartProvider } from "@/context/CartContext"
import AnalyticsProvider from "@/components/analytics-provider"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { ToastProvider } from "@/components/ui/toast"
import { QueryProvider } from "@/providers/QueryProvider"
import { ErrorBoundary } from '@/components/error-boundary'

export const metadata = {
  title: "Solar Express - Renewable Energy Products",
  description: "Your one-stop shop for solar and renewable energy products",
  generator: 'skordl'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" />
      <body className="font-inter">
        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider>
              <AuthProvider>
                <CartProvider>
                  <AnalyticsProvider>
                    <Toaster position="top-center" />
                    <Header />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                    <FloatingCartButton />
                  </AnalyticsProvider>
                </CartProvider>
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
