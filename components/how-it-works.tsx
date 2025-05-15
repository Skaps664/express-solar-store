export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Consultation",
      description:
        "Speak with our solar experts to assess your energy needs, location, and budget to determine the best solar solution for your specific requirements.",
    },
    {
      number: "02",
      title: "Custom Design",
      description:
        "Our team creates a personalized solar system design optimized for your property, taking into account factors like roof orientation, shading, and local climate conditions.",
    },
    {
      number: "03",
      title: "Product Selection",
      description:
        "Choose from our curated selection of high-quality solar panels, inverters, batteries, and mounting systems that best fit your design specifications.",
    },
    {
      number: "04",
      title: "Installation",
      description:
        "Work with our network of certified installers or follow our comprehensive DIY guides to set up your solar system correctly and safely.",
    },
    {
      number: "05",
      title: "Activation & Monitoring",
      description:
        "Once installed, your system will be activated and connected to monitoring tools so you can track performance and energy production in real-time.",
    },
  ]

  return (
    <div className="my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Our simple 5-step process makes transitioning to solar energy straightforward and hassle-free.
        </p>
      </div>

      <div className="relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-[39px] top-10 bottom-10 w-1 bg-gray-200 hidden md:block"></div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 flex items-start">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-2xl font-bold text-amber-600 z-10">
                  {step.number}
                </div>
              </div>
              <div className="flex-grow p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
