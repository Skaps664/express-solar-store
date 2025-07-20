"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/CartContext"

interface QuickBuyCardProps {
  product: {
    _id: string
    name: string
    slug?: string
    price: number
    images: string[]
    description?: string
    brand?: {
      name: string
      slug?: string
    }
  }
}

export function QuickBuyCard({ product }: QuickBuyCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const success = await addToCart({ productId: product._id, quantity: 1 })
      
      if (success) {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`
        })
      } else {
        toast({
          title: "Error",
          description: "Could not add item to cart.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart.",
        variant: "destructive"
      })
    } finally {
      setIsAdding(false)
    }
  }


  return (
    <div className="rounded-lg border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">
              {formatPrice(product.price)}
            </span>
            <Link href={`/product/${product._id}`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-black hover:bg-gray-100"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product._id}`} className="hover:underline">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
        </Link>
        
        {product.brand?.name && (
          <p className="text-sm text-gray-500 mt-1">
            {product.brand.name}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <Button
            variant="outline" 
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
          
          <Link href={`/product/${product._id}`} className="ml-2">
            <Button size="sm" variant="ghost">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View Details</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
