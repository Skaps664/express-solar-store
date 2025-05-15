"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Info, Leaf, Sun, Lightbulb } from "lucide-react"

export default function InterestingFacts() {
  const [isOpen, setIsOpen] = useState(false)

  const facts = [
    {
      icon: Sun,
      title: "Did You Know?",
      content:
        "A typical 5kW solar system in Pakistan can generate around 20-25 units (kWh) of electricity per day, saving approximately PKR 10,000-15,000 monthly on electricity bills.",
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      content:
        "Each 1kW of solar power installed prevents approximately 1.5 tons of carbon emissions annually, equivalent to planting 30-40 trees.",
    },
    {
      icon: Lightbulb,
      title: "Energy Independence",
      content:
        "Pakistan receives among the highest solar irradiation in the world, with over 300 sunny days per year and 5-7 peak sun hours daily in most regions.",
    },
    {
      icon: Info,
      title: "Technology",
      content:
        "Modern solar panels can last 25-30 years, with many manufacturers guaranteeing at least 80% efficiency even after 25 years of continuous operation.",
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
          <Info className="h-4 w-4 md:h-5 md:w-5 text-[#1a5ca4]" />
          <span className="text-base md:text-xl font-bold text-[#1a5ca4]">
            Discover Interesting Facts About Solar Energy
          </span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />}
      </Button>

      {isOpen && (
        <div className="grid grid-cols-1 gap-4 md:gap-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 md:p-6 md:grid-cols-2">
          {facts.map((fact, index) => (
            <div key={index} className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
              <div className="mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                <div className="rounded-full bg-blue-100 p-1.5 md:p-2">
                  <fact.icon className="h-4 w-4 md:h-5 md:w-5 text-[#1a5ca4]" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#1a5ca4]">{fact.title}</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600">{fact.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
