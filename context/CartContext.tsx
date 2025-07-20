"use client"
import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"

type CartItem = {
  _id: string
  product: any
  quantity: number
  selectedVariant?: string
  price?: number
  name?: string
  image?: string
}

type CartContextType = {
  cart: CartItem[]
  cartTotal: number
  loading: boolean
  fetchCart: () => Promise<void>
  addToCart: (params: {
    productId: string
    quantity?: number
    selectedVariant?: string
  }) => Promise<boolean>
  updateCartItem: (cartItemId: string, quantity: number) => Promise<boolean>
  removeFromCart: (cartItemId: string) => Promise<boolean>
  clearCart: () => Promise<boolean>
  createOrder: (params?: {
    shippingAddress?: any;
    paymentMethod?: string;
    orderNotes?: string;
  }) => Promise<{ success: boolean; orderId?: string; order?: any; whatsappURL?: string }>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth() // <-- Use AuthContext's user
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([])
      setCartTotal(0)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart`, {
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setCart(data.cart || [])
      
      // Use cartTotal from API if available, otherwise calculate it
      if (typeof data.cartTotal === 'number') {
        setCartTotal(data.cartTotal)
      } else {
        // Fallback calculation
        const total = (data.cart || []).reduce((sum: number, item: CartItem) => {
          const price = item.product?.price || item.price || 0
          return sum + (price * item.quantity)
        }, 0)
        setCartTotal(total)
      }
      
      console.log("Cart data loaded:", { items: data.cart?.length, total: data.cartTotal })
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart([])
      setCartTotal(0)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addToCart = useCallback(async ({
    productId,
    quantity = 1,
    selectedVariant
  }: {
    productId: string
    quantity?: number
    selectedVariant?: string
  }) => {
    if (!user) {
      toast.error("Please login to add items to cart")
      return false
    }

    try {
      console.log(`Sending cart request to ${process.env.NEXT_PUBLIC_API_BASE}/api/cart`)
      
      // First check if the API base URL is correctly configured
      if (!process.env.NEXT_PUBLIC_API_BASE) {
        console.error("API base URL is not configured")
        toast.error("Configuration error: API URL not set")
        return false
      }
      
      // Log the actual request being made
      console.log("Cart request data:", { productId, quantity, selectedVariant })
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ productId, quantity, selectedVariant }),
      })

      // Log the response status to help debug
      console.log(`Cart API response status: ${res.status}`)
      
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please login again to add items to cart")
          // Redirect to login page
          window.location.href = '/auth'
          return false
        }
        
        // Try to get more information from the error response
        try {
          const errorData = await res.json()
          console.error("Server error details:", errorData)
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
        } catch (parseError) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
      }

      const data = await res.json()
      console.log("Cart API response data:", data)
      
      if (data.success) {
        setCart(data.cart)
        // Update the cart total from the response if available
        if (data.cartTotal !== undefined) {
          setCartTotal(data.cartTotal)
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to cart:', error)
      return false
    }
  }, [user])

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    try {
      console.log(`Updating cart item ${cartItemId} to quantity ${quantity}`)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      })
      
      if (!res.ok) {
        console.error(`Error updating cart item: HTTP ${res.status}`)
        return false
      }
      
      const data = await res.json()
      console.log("Update cart response:", data)
      
      if (data.success) {
        setCart(data.cart)
        // Use cartTotal from API if available, otherwise calculate it
        if (typeof data.cartTotal === 'number') {
          console.log(`Setting cart total to ${data.cartTotal} from API`)
          setCartTotal(data.cartTotal)
        } else {
          // Fallback calculation
          const total = data.cart.reduce((sum: number, item: CartItem) => {
            const price = item.product?.price || item.price || 0
            return sum + (price * item.quantity)
          }, 0)
          console.log(`Calculated cart total: ${total}`)
          setCartTotal(total)
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating cart item:', error)
      return false
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      console.log(`Removing cart item ${cartItemId}`)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      
      if (!res.ok) {
        console.error(`Error removing cart item: HTTP ${res.status}`)
        return false
      }
      
      const data = await res.json()
      console.log("Remove cart item response:", data)
      
      if (data.success) {
        setCart(data.cart || [])
        
        // Use cartTotal from API if available, otherwise calculate it
        if (typeof data.cartTotal === 'number') {
          console.log(`Setting cart total to ${data.cartTotal} from API`)
          setCartTotal(data.cartTotal)
        } else if (data.cart?.length === 0) {
          // If cart is empty, total is 0
          setCartTotal(0)
        } else {
          // Fallback calculation
          const total = (data.cart || []).reduce((sum: number, item: CartItem) => {
            const price = item.product?.price || item.price || 0
            return sum + (price * item.quantity)
          }, 0)
          console.log(`Calculated cart total: ${total}`)
          setCartTotal(total)
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Error removing from cart:', error)
      return false
    }
  }
  
  const clearCart = async () => {
    try {
      console.log("Clearing cart")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/cart`, {
        method: "DELETE",
        credentials: "include",
      })
      
      if (!res.ok) {
        console.error(`Error clearing cart: HTTP ${res.status}`)
        return false
      }
      
      const data = await res.json()
      console.log("Clear cart response:", data)
      
      if (data.success) {
        setCart([])
        setCartTotal(0)
        return true
      }
      return false
    } catch (error) {
      console.error('Error clearing cart:', error)
      return false
    }
  }
  
  const createOrder = async (params?: {
    shippingAddress?: any
    paymentMethod?: string
    orderNotes?: string
  }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(params || {}),
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Clear cart on successful order creation
        setCart([])
        setCartTotal(0)
        return {
          success: true,
          orderId: data.order?._id,
          order: data.order,
          whatsappURL: data.whatsappURL
        }
      }
      
      return { success: false }
    } catch (error) {
      console.error('Error creating order:', error)
      return { success: false }
    }
  }

  useEffect(() => {
    fetchCart()
  }, [fetchCart])
  
  // Ensure cartTotal is always in sync with cart items
  useEffect(() => {
    if (cart.length === 0) {
      setCartTotal(0)
      return
    }
    
    // Only recalculate if cartTotal is 0 but we have items
    // This is a failsafe for when the API doesn't return cartTotal
    if (cartTotal === 0 && cart.length > 0) {
      const calculatedTotal = cart.reduce((sum, item) => {
        const price = item.product?.price || item.price || 0
        return sum + (price * item.quantity)
      }, 0)
      
      if (calculatedTotal > 0) {
        console.log(`Recalculated cart total: ${calculatedTotal}`)
        setCartTotal(calculatedTotal)
      }
    }
  }, [cart, cartTotal])

  const contextValue: CartContextType = {
    cart,
    cartTotal,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}