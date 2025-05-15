import { Button } from "@/components/ui/button"

interface CtaSectionProps {
  title: string
  description: string
  buttonText: string
  variant?: "primary" | "secondary"
}

export default function CtaSection({ title, description, buttonText, variant = "primary" }: CtaSectionProps) {
  return (
    <div
      className={`my-16 py-16 px-8 rounded-lg border-2 border-dashed border-gray-300 text-center ${variant === "secondary" ? "bg-gray-50" : "bg-amber-50"}`}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-gray-700 mb-8">{description}</p>
        <Button
          className={`px-8 py-6 text-lg ${variant === "secondary" ? "bg-gray-800 hover:bg-gray-700" : "bg-amber-500 hover:bg-amber-600"}`}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
