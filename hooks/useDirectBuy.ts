"use client"

import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"

// WhatsApp number with country code
const WHATSAPP_NUMBER = "923331234567" // Change this to your WhatsApp business number

interface DirectBuyOptions {
  productId: string
  productName: string
  price: number
  quantity?: number
  selectedVariant?: string
  productUrl?: string
  imageUrl?: string
}

export function useDirectBuy() {
  const { user } = useAuth()
  const { toast } = useToast()

  /**
   * Buy a product directly via WhatsApp
   */
  const buyViaWhatsApp = async ({
    productId,
    productName,
    price,
    quantity = 1,
    selectedVariant,
    productUrl,
    imageUrl
  }: DirectBuyOptions) => {
    // Create a formatted message with product details
    let message = "Hello! I would like to purchase:\\n\\n"
    
    // Add product details
    message += `*${productName}*\\n`
    message += `Quantity: ${quantity}\\n`
    if (selectedVariant) {
      message += `Variant: ${selectedVariant}\\n`
    }
    message += `Price: PKR ${price} × ${quantity} = PKR ${price * quantity}\\n\\n`
    
    // Add link back to product
    if (productUrl) {
      message += `Product Link: ${productUrl}\\n\\n`
    }
    
    // Add user info if available
    if (user) {
      message += `Name: ${user.name}\\n`
      if (user.email) message += `Email: ${user.email}\\n`
      if (user.mobile) message += `Phone: ${user.mobile}\\n\\n`
    }
    
    message += "Please let me know the next steps for payment and delivery."
    
    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    // Track analytics
    try {
      const analytics = await import('@/lib/analytics').then(mod => mod.default.getInstance())
      analytics.trackBuyNowClick(productId, productName, selectedVariant || "N/A", quantity)
    } catch (error) {
      console.error("Error tracking buy now click:", error)
    }
    
    return true
  }
  
  /**
   * Create an order in the database and redirect to WhatsApp
   */
  const createDirectOrder = async ({
    productId,
    productName,
    price,
    quantity = 1,
    selectedVariant,
    productUrl,
    imageUrl
  }: DirectBuyOptions) => {
    if (!user) {
      // If user is not logged in, use the regular WhatsApp message
      toast({
        title: "Login required",
        description: "Please login to place an order. Redirecting to WhatsApp...",
        variant: "default",
      })
      return buyViaWhatsApp({
        productId,
        productName,
        price,
        quantity,
        selectedVariant,
        productUrl,
        imageUrl
      })
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/orders/direct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId, quantity, selectedVariant }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }
      
      if (data.success && data.whatsappURL) {
        // Open WhatsApp with the order message
        window.open(data.whatsappURL, '_blank')
        
        toast({
          title: "Order created!",
          description: "Your order has been created. Check WhatsApp for details.",
        })
        
        return true
      }
      
      return false
    } catch (error) {
      console.error("Error creating direct order:", error)
      
      toast({
        title: "Failed to create order",
        description: "There was an error creating your order. Redirecting to WhatsApp...",
        variant: "destructive",
      })
      
      // Fall back to regular WhatsApp message
      return buyViaWhatsApp({
        productId,
        productName,
        price,
        quantity,
        selectedVariant,
        productUrl,
        imageUrl
      })
    }
  }
  
  return { buyViaWhatsApp, createDirectOrder }
}
