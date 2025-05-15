import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqSection() {
  const faqs = [
    {
      question: "How much does a solar system cost?",
      answer:
        "The cost of a solar system depends on several factors including system size, equipment quality, and installation complexity. Residential systems typically range from $15,000 to $25,000 before incentives. Commercial systems vary widely based on energy requirements. Federal tax credits and local incentives can reduce costs by 30% or more.",
    },
    {
      question: "How long does installation take?",
      answer:
        "For most residential installations, the physical installation takes 1-3 days. However, the entire process including permits, inspections, and utility approval can take 2-3 months. Commercial installations typically take longer depending on the system size and complexity.",
    },
    {
      question: "Will solar panels work during power outages?",
      answer:
        "Standard grid-tied solar systems will shut down during a power outage for safety reasons. To maintain power during outages, you'll need a system with battery storage or a special transfer switch that isolates your system from the grid.",
    },
    {
      question: "How much maintenance do solar panels require?",
      answer:
        "Solar panels require minimal maintenance. Occasional cleaning to remove dust and debris is recommended, typically 1-2 times per year depending on your location. Most manufacturers recommend a professional inspection every 3-5 years to ensure optimal performance.",
    },
    {
      question: "Do you offer financing options?",
      answer:
        "Yes, we offer several financing options including solar loans, leases, and power purchase agreements (PPAs). Our solar experts can help you determine which option best suits your financial situation and goals.",
    },
    {
      question: "What happens if I produce more electricity than I use?",
      answer:
        "In most areas with net metering, excess electricity is fed back to the grid, and you receive credits on your utility bill. These credits can offset electricity you draw from the grid when your system isn't producing enough, such as at night.",
    },
  ]

  return (
    <div className="my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Find answers to common questions about solar energy, installation, and our products.
        </p>
      </div>

      <div className="max-w-4xl mx-auto border-2 border-dashed border-gray-300 rounded-lg p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-bold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
