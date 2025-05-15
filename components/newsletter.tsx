import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
  return (
    <div className="my-12 md:my-16 rounded-lg border-2 border-dashed border-gray-300 bg-[#1a5ca4] px-4 md:px-8 py-8 md:py-12 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold">Stay Updated with Solar Express</h2>
        <p className="mb-6 md:mb-8 text-base md:text-lg">
          Subscribe to our newsletter for the latest solar technology updates, special offers, and energy-saving tips.
        </p>

        <div className="mx-auto flex max-w-xl flex-col gap-3 md:gap-4 sm:flex-row">
          <Input
            type="email"
            placeholder="Your email address"
            className="border-gray-600 bg-white/10 text-white placeholder:text-gray-300"
          />
          <Button className="whitespace-nowrap bg-[#f26522] hover:bg-[#e55511]">Subscribe Now</Button>
        </div>

        <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-200">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  )
}
