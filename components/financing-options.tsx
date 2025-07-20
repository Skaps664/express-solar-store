import { Button } from "@/components/ui/button"
import { Banknote, Handshake, Building2, Calendar } from "lucide-react"
import Link from "next/link"

export default function FinancingOptions() {
  const options = [
    {
      icon: Banknote,
      title: "Meezan Bank Solar Financing",
      description:
        "Avail Shariah-compliant solar financing through Meezan Bank with easy monthly installments and up to 5 years tenure.",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Handshake,
      title: "Ays Electronics Installment Plan",
      description:
        "Buy solar panels and inverters with 0% markup installment plans from Ays Electronics — available in major cities.",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Building2,
      title: "Afzal Electronics Solar Packages",
      description:
        "Flexible solar financing through Afzal Electronics for complete residential and commercial solar solutions.",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Calendar,
      title: "Mian Brothers Monthly Plans",
      description:
        "Affordable monthly installment options through Mian Brothers with competitive pricing and warranty support.",
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  return (
    <div className="my-8">
      <div className="bg-gradient-to-r from-[#1a5ca4]/10 to-[#f26522]/10 rounded-lg p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#1a5ca4] mb-2">Solar Financing in Pakistan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Go solar without the financial burden. We’ve partnered with trusted banks and electronics dealers across
            Pakistan to bring you flexible and convenient financing options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {options.map((option, index) => (
            <div key={index} className="bg-white rounded-lg p-5 shadow-sm">
              <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center mb-4`}>
                <option.icon className={`h-6 w-6 ${option.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-[#1a5ca4] mb-2">{option.title}</h3>
              <p className="text-gray-600 text-sm">{option.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/installments">
  <Button className="bg-[#f26522] hover:bg-[#e55511]">
    View Financing Partners
  </Button>
</Link>
        </div>
      </div>
    </div>
  )
}
