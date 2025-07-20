"use client"

import { useCart } from "@/context/CartContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CartSummary() {
  const { cart, cartTotal } = useCart()

  // Prevent errors if cart is empty or not yet loaded
  if (!cart || cart.length === 0) {
    return null
  }

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const savings = cart.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0
    const originalPrice = item.product?.originalPrice || price
    return sum + Math.max(0, originalPrice - price) * (item.quantity || 0)
  }, 0)

  return (
    <Card className="bg-white shadow-sm border-gray-100">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-base font-medium">Cart Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-2 px-4 text-sm">
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>PKR {(cartTotal || 0).toLocaleString()}</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Savings:</span>
              <span>PKR {savings.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-medium pt-1.5 border-t border-gray-100 mt-1.5">
            <span>Total:</span>
            <span>PKR {(cartTotal || 0).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
