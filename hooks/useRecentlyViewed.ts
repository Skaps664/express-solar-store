"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  images: string[]
  brand?: {
    _id: string
    name: string
  }
}

export const useRecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        // Get recently viewed product IDs from localStorage
        const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        
        if (recentlyViewedIds.length === 0) {
          setLoading(false)
          return
        }

        // Fetch product details for the recently viewed IDs
        const productPromises = recentlyViewedIds.slice(0, 8).map(async (productId: string) => {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/products/${productId}`, {
              withCredentials: true
            })
            return (response.data as any).product
          } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error)
            return null
          }
        })

        const products = await Promise.all(productPromises)
        // Filter out null results from failed requests
        const validProducts = products.filter(product => product !== null)
        setRecentProducts(validProducts)
      } catch (error) {
        console.error('Error fetching recently viewed products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyViewed()
  }, [])

  const addToRecentlyViewed = (productId: string) => {
    try {
      const existingViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      
      // Remove if already exists to avoid duplicates
      const filteredViewed = existingViewed.filter((id: string) => id !== productId)
      
      // Add to beginning of array
      const updatedViewed = [productId, ...filteredViewed].slice(0, 8) // Keep only 8 most recent
      
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed))
      
      // Refresh the recently viewed products
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/products/${productId}`, {
            withCredentials: true
          })
          const newProduct = (response.data as any).product
          
          setRecentProducts(prev => {
            const filtered = prev.filter(p => p._id !== productId)
            return [newProduct, ...filtered].slice(0, 8)
          })
        } catch (error) {
          console.error('Error fetching new product for recently viewed:', error)
        }
      }
      
      fetchProduct()
    } catch (error) {
      console.error('Error adding to recently viewed:', error)
    }
  }

  const clearRecentlyViewed = () => {
    localStorage.removeItem('recentlyViewed')
    setRecentProducts([])
  }

  return {
    recentProducts,
    loading,
    addToRecentlyViewed,
    clearRecentlyViewed
  }
}
