"use client"

import { useEffect, useState } from 'react'

export default function DebugPromotionPage() {
  const [promotionData, setPromotionData] = useState<any>(null)

  useEffect(() => {
    const promotion = localStorage.getItem('homePromotion')
    if (promotion) {
      const data = JSON.parse(promotion)
      setPromotionData(data)
      console.log('Promotion data:', data)
    }
  }, [])

  if (!promotionData) {
    return <div className="p-8">No promotion data found in localStorage</div>
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Debug Promotion Data</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Basic Info</h2>
        <p><strong>Title:</strong> {promotionData.title}</p>
        <p><strong>Subtitle:</strong> {promotionData.subtitle}</p>
        <p><strong>Active:</strong> {promotionData.isActive ? 'Yes' : 'No'}</p>
        <p><strong>Brand:</strong> {promotionData.selectedBrand?.label}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Images</h2>
        <p><strong>Desktop:</strong> {promotionData.images?.desktop}</p>
        <p><strong>Mobile:</strong> {promotionData.images?.mobile}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Featured Products ({promotionData.featuredProducts?.length || 0})</h2>
        {promotionData.featuredProducts?.map((item: any, index: number) => (
          <div key={index} className="border-b pb-2 mb-2">
            <p><strong>Product Name:</strong> {item.product?.name || 'N/A'}</p>
            <p><strong>Product ID:</strong> {item.product?._id || item.value}</p>
            <p><strong>Price:</strong> {item.product?.price || 'N/A'}</p>
            <p><strong>Image:</strong> {item.product?.image || 'No image field'}</p>
            <p><strong>Images Array:</strong> {JSON.stringify(item.product?.images) || 'No images array'}</p>
            <p><strong>All Product Fields:</strong> {Object.keys(item.product || {}).join(', ')}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Full Data</h2>
        <pre className="text-xs overflow-auto max-h-64">
          {JSON.stringify(promotionData, null, 2)}
        </pre>
      </div>
    </div>
  )
}
