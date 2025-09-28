// Helper function to map priceRange select values to price_min/price_max
function mapPriceRange(priceRange: string): { price_min?: number; price_max?: number } {
  switch (priceRange) {
    case "Under 10K":
      return { price_max: 10000 }
    case "10K-50K":
      return { price_min: 10000, price_max: 50000 }
    case "50K-100K":
      return { price_min: 50000, price_max: 100000 }
    case "100K-500K":
      return { price_min: 100000, price_max: 500000 }
    case "500K+":
      return { price_min: 500000 }
    default:
      return {}
  }
}

export function buildProductQueryParams(filterObj: Record<string, any>, extras?: Record<string, string | number>) {
  const params = new URLSearchParams()

  // Add any extras first (category, sort, page, limit, brand, etc.)
  if (extras) {
    Object.entries(extras).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.append(k, String(v))
    })
  }

  Object.entries(filterObj || {}).forEach(([key, value]) => {
    // Skip empty/undefined values and explicit false (do not send false)
    if (value === undefined || value === null || value === "" || value === false) return

    // Special handling for priceRange - convert to price_min/price_max
    if (key === 'priceRange' && typeof value === 'string') {
      const priceParams = mapPriceRange(value)
      if (priceParams.price_min) params.append('price_min', String(priceParams.price_min))
      if (priceParams.price_max) params.append('price_max', String(priceParams.price_max))
      return
    }

    // If it's an array, append each item
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== "") params.append(key, String(v))
      })
      return
    }

    // For boolean true, explicitly send "true"
    if (typeof value === 'boolean') {
      if (value === true) params.append(key, 'true')
      return
    }

    // For numeric range inputs we often use suffixes like _min/_max - send as-is
    params.append(key, String(value))
  })

  // Debug logging
  console.log('🔍 Filter Debug:', {
    filterObj,
    extras,
    finalUrl: params.toString()
  })

  return params
}
