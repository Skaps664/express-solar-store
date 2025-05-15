export default function BrandSection() {
  return (
    <div className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Featured Brands</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          We partner with the world's leading manufacturers to bring you the highest quality solar products.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {["SunPower", "LG Solar", "Tesla", "Canadian Solar", "Enphase", "SolarEdge", "Jinko Solar", "Q CELLS"].map(
          (brand, index) => (
            <div
              key={index}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 h-40 flex items-center justify-center"
            >
              <div className="text-gray-400 text-center">
                [Brand Logo]
                <br />
                {brand}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
