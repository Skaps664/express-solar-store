export default function BrandShowcase() {
  const brands = [
    { name: "Jinko Solar", category: "Solar Panels" },
    { name: "Canadian Solar", category: "Solar Panels" },
    { name: "Longi Solar", category: "Solar Panels" },
    { name: "JA Solar", category: "Solar Panels" },
    { name: "Growatt", category: "Inverters" },
    { name: "SMA", category: "Inverters" },
    { name: "Tesla", category: "Batteries" },
    { name: "Pylontech", category: "Batteries" },
  ]

  return (
    <div className="my-16">
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-3xl font-bold text-[#1a5ca4]">Shop by Brand</h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Discover premium solar products from the world's most trusted manufacturers, all in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="group cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 md:p-6 transition-all hover:border-[#1a5ca4] hover:shadow-md"
          >
            <div className="flex h-24 md:h-32 flex-col items-center justify-center text-center">
              <div className="mb-3 md:mb-4 h-12 w-12 md:h-16 md:w-16 rounded-full bg-blue-50 p-2 md:p-3 transition-transform group-hover:scale-110">
                <div className="flex h-full w-full items-center justify-center text-[#1a5ca4]">[Logo]</div>
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#1a5ca4]">{brand.name}</h3>
              <p className="text-xs md:text-sm text-gray-500">{brand.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
