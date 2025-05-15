"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HowToChoose() {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    {
      name: "Solar Panels",
      tips: [
        "Consider efficiency ratings - higher efficiency means more power in limited space",
        "Check temperature coefficient - lower is better for hot Pakistani climate",
        "Look for tier-1 manufacturers with solid warranties (25+ years)",
        "Monocrystalline panels generally outperform polycrystalline in efficiency",
      ],
    },
    {
      name: "Inverters",
      tips: [
        "Size your inverter appropriately for your solar array (typically 75-100% of panel capacity)",
        "Consider hybrid inverters if you plan to add batteries in the future",
        "Check for grid-tie capability if you want net metering",
        "Look for models with monitoring capabilities to track system performance",
      ],
    },
    {
      name: "Batteries",
      tips: [
        "Calculate your backup needs based on critical loads and desired backup time",
        "Lithium batteries cost more upfront but last longer than lead-acid",
        "Check depth of discharge ratings - lithium can typically discharge 80-90% vs 50% for lead-acid",
        "Consider temperature management features for Pakistan's hot climate",
      ],
    },
  ]

  return (
    <div className="my-16">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="mb-4 w-full justify-between border-2 border-dashed border-gray-300 p-4 md:p-6 text-left"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 md:h-5 md:w-5 text-[#1a5ca4]" />
          <span className="text-base md:text-xl font-bold text-[#1a5ca4]">How to Choose the Right Solar Products</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />}
      </Button>

      {isOpen && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 md:p-6">
          <p className="mb-4 md:mb-6 text-sm md:text-base text-gray-600">
            Investing in solar energy is a significant decision. Use our expert guidelines to select the right
            components for your specific needs and location in Pakistan.
          </p>

          <Accordion type="single" collapsible className="w-full">
            {categories.map((category, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-base md:text-lg font-bold text-[#1a5ca4]">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="ml-4 md:ml-6 list-disc space-y-1 md:space-y-2 text-sm md:text-base text-gray-600">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-4 md:mt-6 rounded-lg bg-blue-50 p-3 md:p-4 text-sm md:text-base text-[#1a5ca4]">
            <p className="font-medium">
              Still not sure? Our solar specialists are available to help you design the perfect system for your needs.
              Contact us for a free consultation and site assessment.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
