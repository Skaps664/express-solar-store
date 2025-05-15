import Link from "next/link"

// Format price in PKR with commas
const formatPrice = (price) => {
  return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export default function RelatedProducts({ productIds, productsData }) {
  // Filter out any product IDs that don't exist in the data
  const validProductIds = productIds.filter((id) => productsData[id])

  if (validProductIds.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {validProductIds.map((productId) => {
        const product = productsData[productId]
        return (
          <Link key={productId} href={`/product/${productId}`} className="block">
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-all">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400">[{product.images[0]}]</div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2 line-clamp-2 h-12">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  {product.discountPrice ? (
                    <>
                      <span className="text-[#1a5ca4] font-bold">{formatPrice(product.discountPrice)}</span>
                      <span className="text-gray-500 line-through text-sm">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-[#1a5ca4] font-bold">{formatPrice(product.price)}</span>
                  )}
                </div>
                <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium">
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
