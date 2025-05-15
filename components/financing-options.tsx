import { Button } from "@/components/ui/button"
import { DollarSign, CreditCard, Landmark, Calendar } from "lucide-react"

export default function FinancingOptions() {
  const options = [
    {
      icon: DollarSign,
      title: "Solar Loans",
      description: "Low-interest loans specifically designed for solar installations with flexible repayment terms",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: CreditCard,
      title: "Easy Installments",
      description: "0% interest installment plans available on select solar products with major banks",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Landmark,
      title: "Bank Financing",
      description: "Special financing arrangements with our partner banks for residential and commercial systems",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Calendar,
      title: "Lease Options",
      description: "Solar lease programs with no upfront cost and predictable monthly payments",
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  return (
    <div className="my-8">
      <div className="bg-[#f26522]/5 rounded-lg p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#1a5ca4] mb-2">Flexible Financing Options</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Make your transition to solar energy affordable with our range of financing solutions. We work with leading
            financial institutions to provide options that fit your budget.
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
          <Button className="bg-[#f26522] hover:bg-[#e55511]">Explore Financing Options</Button>
        </div>
      </div>
    </div>
  )
}
