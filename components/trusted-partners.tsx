export default function TrustedPartners() {
  return (
    <div className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Trusted By Industry Leaders</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          We partner with leading organizations and institutions in the renewable energy sector.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map((partner) => (
          <div
            key={partner}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 h-24 flex items-center justify-center"
          >
            <div className="text-gray-400 text-center">[Partner Logo {partner}]</div>
          </div>
        ))}
      </div>
    </div>
  )
}
