"use client"

import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/cart-item"
import { CartSummary } from "@/components/cart-summary"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, ArrowLeft, Truck, Shield, Clock } from "lucide-react"
import { useState } from "react"

type CartItem = {
  id: string
  name: string
  brand: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  inStock: boolean
  warranty: string
  category: string
}

export default function CartPage() {
  const { cart, loading, updateCartItem, removeFromCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [promoCode, setPromoCode] = useState<string>("")
  const [promoApplied, setPromoApplied] = useState<boolean>(false)
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false)

  if (!user && !loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl mb-4">Please log in to view your cart</h2>
          <button
            className="bg-[#1a5ca4] text-white px-6 py-2 rounded-lg font-medium"
            onClick={() => router.push("/auth?redirect=/cart")}
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  // Use cart from context instead of local state
const cartItems = cart
  .map((item) => ({
    id: item._id,
    name: item.product?.name,
    brand: item.product?.brand?.name || "Unknown Brand",
    price: item.product?.price || item.price,
    originalPrice: item.product?.originalPrice || item.price,
    quantity: item.quantity,
    image: item.product?.images?.[0] || "/placeholder.svg",
    inStock: item.product?.stock > 0,
    category: item.product?.category?.name || "General",
    warranty: item.product?.warranty || "Standard",
  }))

  // Use cartTotal from context when available, otherwise calculate from cartItems
  const { cartTotal } = useCart()
  const calculatedSubtotal = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0
    return sum + price * item.quantity
  }, 0)
  
  const subtotal = cartTotal || calculatedSubtotal
  
  const savings = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0
    const originalPrice = typeof item.originalPrice === 'number' ? item.originalPrice : price
    return sum + Math.max(0, originalPrice - price) * item.quantity
  }, 0)
  const shipping = subtotal > 100000 ? 0 : 2500 // Free shipping over 100k
  const promoDiscount = promoApplied ? subtotal * 0.05 : 0 // 5% discount
  const total = subtotal + shipping - promoDiscount

  // Update quantity handler
  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateCartItem(id, newQuantity)
  }

  // Remove item handler
  const handleRemoveItem = async (id: string) => {
    await removeFromCart(id)
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "solar10") {
      setPromoApplied(true)
      setPromoCode("")
    }
  }

    const handleCheckout = async () => {
    if (!user) {
      router.push('/auth')
      return
    }
    
    setCheckoutLoading(true)
    try {
      // Add checkout logic here
      setCheckoutLoading(false)
    } catch (error) {
      console.error('Checkout failed:', error)
      setCheckoutLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-14 lg:px-16 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="flex items-center text-[#1a5ca4] hover:text-[#0e4a8a] transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start building your solar system by adding products to your cart</p>
            <Link href="/store">
              <Button className="bg-[#f26522] hover:bg-[#e55511] text-white px-8 py-3 text-lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-14 lg:px-16 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center text-[#1a5ca4] hover:text-[#0e4a8a] transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-4">
              <CartSummary />
            </div>
            
            {cartItems.map((item) => (
              <CartItem 
                key={item.id}
                id={item.id}
                name={item.name || "Unnamed Product"}
                brand={item.brand || "Unknown Brand"}
                price={item.price || 0}
                originalPrice={item.originalPrice || item.price || 0}
                quantity={item.quantity}
                image={item.image}
                inStock={item.inStock}
                category={item.category}
                warranty={item.warranty}
              />
            ))}

            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#f26522]/10 rounded-full p-2">
                    <Truck className="h-5 w-5 text-[#f26522]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Free Shipping</div>
                    <div className="text-sm text-gray-600">Orders over PKR 20,000</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#1a5ca4]/10 rounded-full p-2">
                    <Clock className="h-5 w-5 text-[#1a5ca4]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Fast Delivery</div>
                    <div className="text-sm text-gray-600">4-6 business days</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Secure Packaging</div>
                    <div className="text-sm text-gray-600">Protected delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                    disabled={promoApplied}
                  />
                  <Button
                    variant="outline"
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode}
                    className="border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white"
                  >
                    Apply
                  </Button>
                </div>
                {promoApplied && <p className="text-sm text-green-600 mt-2">✓ Promo code applied successfully!</p>}
              </div>

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You Save</span>
                    <span>-PKR {savings.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `PKR ${shipping.toLocaleString()}`}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount (5%)</span>
                    <span>-PKR {promoDiscount.toLocaleString()}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>PKR {total.toLocaleString()}</span>
                </div>
              </div>

              {/* WhatsApp Order */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span className="font-medium text-green-700">Order via WhatsApp</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Get instant support and place your order directly through WhatsApp
                </p>
                <a
                  href="https://wa.me/923001234567?text=Hi! I'm interested in ordering solar products from my cart. Can you help me complete my order?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-green-500 text-green-700 hover:bg-green-500 hover:text-white"
                  >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    Order on WhatsApp
                  </Button>
                </a>
              </div>

              {/* Checkout Button */}
              <div className="mt-6">
                <Button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || checkoutLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium transition-colors"
                >
                  {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>

              {/* Security Notice */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure SSL encrypted checkout</span>
              </div>

              {/* Continue Shopping */}
              <div className="mt-4 text-center">
                <Link href="/store" className="text-[#1a5ca4] hover:text-[#0e4a8a] text-sm font-medium">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        
      </div>
    </div>
  )
}
