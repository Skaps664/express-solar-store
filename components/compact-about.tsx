import { Button } from "@/components/ui/button"

export default function CompactAbout() {
  return (
    <div className="my-12 md:my-16 border-t border-gray-200 pt-8 md:pt-12 text-center">
      <div className="mx-auto max-w-3xl px-4 md:px-0">
        <div className="flex justify-center mb-4">
          <img src="/solar-express-logo-09.png" alt="Solar Express" className="h-16 md:h-20" />
        </div>
        <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-bold text-[#1a5ca4]">About Solar Express</h2>
        <p className="mb-4 md:mb-6 text-base md:text-lg text-gray-600">
          Solar Express is Pakistan's premier provider of high-quality solar energy solutions. We offer a comprehensive
          range of solar panels, inverters, batteries, and complete systems for residential, commercial, and industrial
          applications. With over a decade of experience, we're committed to helping Pakistan transition to clean,
          renewable energy.
        </p>
        <Button variant="outline" className="text-sm md:text-base border-[#1a5ca4] text-[#1a5ca4]">
          Learn More About Us
        </Button>
      </div>
    </div>
  )
}
