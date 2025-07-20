"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { formatPrice } from "@/lib/utils"

type CartItemProps = {
  id: string
  name: string
  brand: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  inStock?: boolean
  category?: string
  warranty?: string
}

export function CartItem({
  id,
  name,
  brand,
  price,
  originalPrice,
  quantity,
  image,
  inStock = true,
  category = "General",
  warranty = "Standard"
}: CartItemProps) {
  const { updateCartItem, removeFromCart } = useCart()

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return
    await updateCartItem(id, newQuantity)
  }

  const handleRemove = async () => {
    await removeFromCart(id)
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      {/* Top Row - Image and Basic Info */}
      <div className="flex gap-4 mb-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Title and Price */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{name}</h3>
          <div className="mt-1">
            <span className="text-lg font-bold text-[#1a5ca4]">
              {formatPrice(price)}
            </span>
            {originalPrice > price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row - Tags and Brand */}
      <div className="flex flex-wrap gap-2 mb-3">
        {category && (
          <span className="text-xs bg-[#1a5ca4]/10 text-[#1a5ca4] px-2 py-1 rounded-full">
            {category}
          </span>
        )}
        {warranty && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {warranty} Warranty
          </span>
        )}
        {!inStock && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        <span className="text-xs text-gray-600">Brand: {brand || "Unknown"}</span>
      </div>

      {/* Bottom Row - Controls */}
      <div className="flex items-center justify-between border-t pt-3">
        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-gray-300"
            onClick={() => handleUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-gray-300"
            onClick={() => handleUpdateQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  )
}
