export default function Introduction() {
  return (
    <div className="my-16 text-center">
      <h2 className="text-3xl font-bold mb-6">Welcome to Solar Express</h2>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-6 text-gray-700">
          Solar Express is your premier destination for high-quality solar and renewable energy products. We're
          committed to making sustainable energy solutions accessible, affordable, and straightforward for homeowners
          and businesses alike.
        </p>
        <p className="text-lg mb-6 text-gray-700">
          With over a decade of experience in the renewable energy sector, we've helped thousands of customers reduce
          their carbon footprint while saving on energy costs. Our curated selection of solar panels, inverters,
          batteries, and accessories represents the best in class from leading manufacturers worldwide.
        </p>
        <p className="text-lg text-gray-700">
          Whether you're looking to power your home, business, or off-grid project, our team of experts is here to guide
          you every step of the way—from product selection to installation support and beyond.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[
          { number: "10K+", label: "Happy Customers" },
          { number: "15+", label: "Years Experience" },
          { number: "30MW+", label: "Solar Installed" },
        ].map((stat, index) => (
          <div key={index} className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-4xl font-bold text-amber-500 mb-2">{stat.number}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
