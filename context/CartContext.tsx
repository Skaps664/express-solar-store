"use client"
import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/services/api"
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
    customerInfo?: any;
    paymentMethod?: string;
    orderNotes?: string;
  }) => Promise<{ success: boolean; orderId?: string; order?: any; whatsappURL?: string }>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([])
      setCartTotal(0)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await api.get('/api/cart')
      const data = response.data as any
      
      console.log("Raw cart API response:", data)
      setCart(data.cart || [])
      
      // Use cartTotal from API if available, otherwise calculate it
      if (typeof data.cartTotal === 'number') {
        setCartTotal(data.cartTotal)
        console.log("Using API cartTotal:", data.cartTotal)
      } else {
        // Fallback calculation
        const total = (data.cart || []).reduce((sum: number, item: CartItem) => {
          const price = item.product?.price || item.price || 0
          console.log("Item price calculation:", { item: item.name || item.product?.name, price, quantity: item.quantity })
          return sum + (price * item.quantity)
        }, 0)
        setCartTotal(total)
        console.log("Calculated cartTotal:", total)
      }
      
      console.log("Cart data loaded:", { items: data.cart?.length, total: data.cartTotal, calculatedTotal: cartTotal })
    } catch (error: any) {
      console.error('Error fetching cart:', error)
      // If it's a 401 error, the user is not authenticated
      if (error?.response?.status === 401) {
        console.log('User not authenticated, clearing cart')
      }
      setCart([])
      setCartTotal(0)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const addToCart = useCallback(async ({
    productId,
    quantity = 1,
    selectedVariant
  }: {
    productId: string
    quantity?: number
    selectedVariant?: string
  }) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      // Redirect to login page with current path
      const currentPath = window.location.pathname;
      window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`
      return false
    }

    try {
      console.log("Adding to cart:", { productId, quantity, selectedVariant })
      
      const response = await api.post('/api/cart', { 
        productId, 
        quantity, 
        selectedVariant 
      })
      const data = response.data as any
      
      console.log("Cart API response data:", data)
      
      if (data.success) {
        setCart(data.cart)
        // Update the cart total from the response if available
        if (typeof data.cartTotal === 'number') {
          setCartTotal(data.cartTotal)
        }
        toast.success("Item added to cart!")
        return true
      } else {
        toast.error(data.message || "Failed to add item to cart")
        return false
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error)
      
      if (error?.response?.status === 401) {
        toast.error("Please login again to add items to cart")
        // Redirect to login page with current path
        const currentPath = window.location.pathname;
        window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`
        return false
      }
      
      const errorMessage = error?.response?.data?.message || "Failed to add item to cart"
      toast.error(errorMessage)
      return false
    }
  }, [isAuthenticated])

  const updateCartItem = useCallback(async (cartItemId: string, quantity: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to update cart")
      return false
    }

    try {
      console.log(`Updating cart item ${cartItemId} to quantity ${quantity}`)
      const response = await api.put(`/api/cart/${cartItemId}`, { quantity })
      const data = response.data as any
      
      if (data.success) {
        setCart(data.cart)
        if (typeof data.cartTotal === 'number') {
          setCartTotal(data.cartTotal)
        }
        return true
      }
      return false
    } catch (error: any) {
      console.error('Error updating cart item:', error)
      toast.error(error?.response?.data?.message || "Failed to update cart item")
      return false
    }
  }, [isAuthenticated])

  const removeFromCart = useCallback(async (cartItemId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to remove items from cart")
      return false
    }

    try {
      console.log(`Removing cart item: ${cartItemId}`)
      const response = await api.delete(`/api/cart/${cartItemId}`)
      const data = response.data as any
      
      if (data.success) {
        setCart(data.cart || [])
        if (typeof data.cartTotal === 'number') {
          setCartTotal(data.cartTotal)
        } else {
          setCartTotal(0)
        }
        toast.success("Item removed from cart")
        return true
      }
      return false
    } catch (error: any) {
      console.error('Error removing from cart:', error)
      toast.error(error?.response?.data?.message || "Failed to remove item from cart")
      return false
    }
  }, [isAuthenticated])

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please login to clear cart")
      return false
    }

    try {
      await api.delete('/api/cart/clear')
      setCart([])
      setCartTotal(0)
      toast.success("Cart cleared")
      return true
    } catch (error: any) {
      console.error('Error clearing cart:', error)
      toast.error(error?.response?.data?.message || "Failed to clear cart")
      return false
    }
  }, [isAuthenticated])

  const createOrder = useCallback(async (params?: {
    customerInfo?: any;
    paymentMethod?: string;
    orderNotes?: string;
  }) => {
    if (!isAuthenticated) {
      toast.error("Please login to create an order")
      return { success: false }
    }

    try {
      // Show a loading toast
      // toast.loading("Creating your order...")
      
      const response = await api.post('/api/orders', {
        customerInfo: params?.customerInfo,
        paymentMethod: params?.paymentMethod || "WhatsApp",
        orderNotes: params?.orderNotes
      })
      
      // Dismiss all toasts and show success
      toast.dismiss()
      
      const data = response.data as any
      
      if (data.success) {
        // Clear cart after successful order
        setCart([])
        setCartTotal(0)
        toast.success("Order created successfully!")
        return {
          success: true,
          orderId: data.order?._id,
          order: data.order,
          whatsappURL: data.whatsappURL
        }
      }
      
      return { success: false }
    } catch (error: any) {
      console.error('Error creating order:', error)
      
      // Handle specific error cases
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error("Order is taking longer than expected, but may still be processing. Please check your orders page.")
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Your order may have been created. Please check your orders page.")
      } else {
        toast.error(error?.response?.data?.message || "Failed to create order")
      }
      
      return { success: false }
    }
  }, [isAuthenticated])

  // Fetch cart when user authentication changes
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Calculate total if cart changes but total is 0
  useEffect(() => {
    if (cart.length === 0) {
      setCartTotal(0)
      return
    }

    // Recalculate total if needed
    if (cartTotal === 0 && cart.length > 0) {
      const total = cart.reduce((sum, item) => {
        const price = item.product?.price || item.price || 0
        return sum + (price * item.quantity)
      }, 0)
      setCartTotal(total)
    }
  }, [cart, cartTotal])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
