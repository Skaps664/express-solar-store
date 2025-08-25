"use client"

import { useEffect, useState } from 'react'
import { api } from '@/lib/services/api'

export default function DebugPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching brands...')
        const brandsRes = await api.get('/api/brands/admin/all')
        console.log('Brands response:', brandsRes.data)
        setBrands(brandsRes.data as any[])

        console.log('Fetching products...')
        const productsRes = await api.get('/api/products/')
        const responseData = productsRes.data as any
        console.log('Products response structure:', {
          isArray: Array.isArray(responseData),
          hasProducts: !!responseData.products,
          dataType: typeof responseData,
          keys: Object.keys(responseData),
          sampleData: responseData
        })
        
        const productsArray = responseData.products || responseData
        console.log('Products array length:', productsArray.length)
        
        if (productsArray.length > 0) {
          console.log('First product:', productsArray[0])
          console.log('First product brand:', productsArray[0].brand)
        }
        
        setProducts(productsArray)
      } catch (error) {
        console.error('API Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug API Data</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Brands ({brands.length})</h2>
        <pre className="bg-gray-100 p-4 text-sm overflow-auto max-h-60">
          {JSON.stringify(brands.slice(0, 2), null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Products ({products.length})</h2>
        <pre className="bg-gray-100 p-4 text-sm overflow-auto max-h-60">
          {JSON.stringify(products.slice(0, 2), null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Brand-Product Matching Test</h2>
        {brands.slice(0, 3).map(brand => {
          const matchingProducts = products.filter(product => {
            const productBrandId = typeof product.brand === 'string' 
              ? product.brand 
              : product.brand?._id
            return productBrandId === brand._id
          })
          
          return (
            <div key={brand._id} className="mb-2">
              <strong>{brand.name}</strong> (ID: {brand._id}): {matchingProducts.length} products
              {matchingProducts.slice(0, 2).map(p => (
                <div key={p._id} className="ml-4 text-sm">
                  - {p.name} (Brand ID: {typeof p.brand === 'string' ? p.brand : p.brand?._id})
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
