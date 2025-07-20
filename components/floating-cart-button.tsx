"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/context/CartContext"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingCartButton() {
  const { cart, cartTotal } = useCart()
  const [isVisible, setIsVisible] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [prevCartCount, setPrevCartCount] = useState(0)

  useEffect(() => {
    // Only show floating cart when items exist
    if (cart.length > 0) {
      setIsVisible(true)
      
      // If cart count increased, trigger animation
      if (cart.length > prevCartCount) {
        setShowAnimation(true)
        const timer = setTimeout(() => setShowAnimation(false), 1000)
        return () => clearTimeout(timer)
      }
    } else {
      setIsVisible(false)
    }
    
    setPrevCartCount(cart.length)
  }, [cart, prevCartCount])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showAnimation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute -top-2 -left-2 w-24 h-24 bg-green-100 rounded-full"
          />
        )}
      </AnimatePresence>
      
      <Link href="/cart">
        <Button 
          className={cn(
            "flex items-center gap-2 py-6 px-4 bg-[#1a5ca4] shadow-lg hover:bg-[#0e4a8a]",
            "transition-all duration-300 ease-in-out",
            showAnimation && "scale-110"
          )}
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <span className="font-medium">
            {cartTotal ? formatPrice(cartTotal) : "PKR 0"}
          </span>
        </Button>
      </Link>
    </div>
  )
}
