"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function MiniCart() {
  const { cart = [], cartTotal = 0, loading = false, removeFromCart } = useCart()
  const [removing, setRemoving] = React.useState<string | null>(null)

  const handleRemoveItem = async (itemId: string) => {
    setRemoving(itemId)
    try {
      await removeFromCart(itemId)
    } finally {
      setRemoving(null)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="p-3 border-b">
          <div className="font-medium">Your Cart ({cart.length})</div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : cart.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/store">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-auto py-2">
              {cart.map((item) => {
                const product = item.product ?? {}
                const img = Array.isArray(product.images) && product.images.length ? product.images[0] : null
                const productName = product?.name ?? item.name ?? "Product"
                const productId = product?._id ?? product?.id ?? (typeof item.product === "string" ? item.product : "")
                const unitPrice = item.price ?? product?.price ?? 0
                const variantLabel = item.selectedVariant
                  ? (typeof item.selectedVariant === "object"
                      ? (item.selectedVariant["name"] || item.selectedVariant["label"] || JSON.stringify(item.selectedVariant))
                      : String(item.selectedVariant))
                  : null

                return (
                  <div key={item._id ?? productId} className="flex items-center p-3 hover:bg-gray-50">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                      {img ? (
                        <Image src={img} alt={productName} width={48} height={48} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${productId}`} className="text-sm font-medium line-clamp-1 hover:underline">
                        {productName}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.quantity} × {formatPrice(unitPrice)}
                        {variantLabel && <span className="block">{variantLabel}</span>}
                      </div>
                    </div>

                    <div className="ml-2">
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={removing === item._id}
                        className={cn(
                          "text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors",
                          removing === item._id && "opacity-50 cursor-not-allowed"
                        )}
                        aria-label="Remove item"
                      >
                        {removing === item._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t p-3">
              <div className="flex justify-between mb-3 font-medium">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="grid">
                <Button asChild variant="outline" size="sm">
                  <Link href="/cart">View Full Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
