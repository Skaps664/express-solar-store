"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Truck, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Jinko Solar 550W Mono PERC Panel",
      brand: "Jinko Solar",
      price: 45000,
      originalPrice: 50000,
      quantity: 2,
      image: "/placeholder.svg?height=120&width=120",
      inStock: true,
      warranty: "25 Years",
      category: "Solar Panels",
    },
    {
      id: 2,
      name: "Growatt 5kW Hybrid Inverter",
      brand: "Growatt",
      price: 85000,
      originalPrice: 90000,
      quantity: 1,
      image: "/placeholder.svg?height=120&width=120",
      inStock: true,
      warranty: "5 Years",
      category: "Inverters",
    },
    {
      id: 3,
      name: "Pylontech US3000C 3.5kWh Battery",
      brand: "Pylontech",
      price: 120000,
      originalPrice: 125000,
      quantity: 2,
      image: "/placeholder.svg?height=120&width=120",
      inStock: false,
      warranty: "10 Years",
      category: "Batteries",
    },
  ])

  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [loading, setLoading] = useState(false)

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)
  const shipping = subtotal > 100000 ? 0 : 2500 // Free shipping over 100k
  const promoDiscount = promoApplied ? subtotal * 0.05 : 0 // 5% discount
  const total = subtotal + shipping - promoDiscount

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "solar10") {
      setPromoApplied(true)
      setPromoCode("")
    }
  }

  const handleCheckout = () => {
    setLoading(true)
    // Simulate checkout process
    setTimeout(() => {
      setLoading(false)
      // Redirect to checkout page
      console.log("Proceeding to checkout...")
    }, 2000)
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
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Brand: {item.brand}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-xs bg-[#1a5ca4]/10 text-[#1a5ca4] px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {item.warranty} Warranty
                          </span>
                          {!item.inStock && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Out of Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Price and Controls */}
                      <div className="flex flex-col items-end">
                        <div className="text-right mb-3">
                          <div className="text-xl font-bold text-[#1a5ca4]">PKR {item.price.toLocaleString()}</div>
                          {item.originalPrice > item.price && (
                            <div className="text-sm text-gray-500 line-through">
                              PKR {item.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mb-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-300"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-300"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                    <div className="text-sm text-gray-600">Orders over PKR 100,000</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#1a5ca4]/10 rounded-full p-2">
                    <Clock className="h-5 w-5 text-[#1a5ca4]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Fast Delivery</div>
                    <div className="text-sm text-gray-600">3-5 business days</div>
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
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>

              {/* Checkout Button - Coming Soon */}
              <div className="mt-6">
                <Button className="w-full bg-gray-400 text-white py-3 text-lg font-medium cursor-not-allowed" disabled>
                  Checkout Page Coming Soon
                </Button>
                <p className="text-center text-sm text-gray-500 mt-2">
                  For now, please use WhatsApp to complete your order
                </p>
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
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Your Solar System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Solar Mounting Kit", price: "15,000", image: "/placeholder.svg?height=80&width=80" },
                { name: "DC/AC Cables Set", price: "8,500", image: "/placeholder.svg?height=80&width=80" },
                { name: "Monitoring System", price: "25,000", image: "/placeholder.svg?height=80&width=80" },
              ].map((product, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#1a5ca4] transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-[#1a5ca4] font-semibold">PKR {product.price}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#f26522] text-[#f26522] hover:bg-[#f26522] hover:text-white"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
