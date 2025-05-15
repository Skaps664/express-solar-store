import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calculator } from "lucide-react"

export default function SolarCalculator() {
  return (
    <div className="my-8">
      <div className="bg-[#1a5ca4]/5 rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-6 w-6 text-[#1a5ca4]" />
              <h2 className="text-2xl font-bold text-[#1a5ca4]">Solar Savings Calculator</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Estimate how much you could save by switching to solar energy. Fill in the details below to get started.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Monthly Electricity Bill (PKR)</label>
                <Input type="number" placeholder="25000" className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Roof Area (sq. ft)</label>
                <Input type="number" placeholder="1000" className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lahore">Lahore</SelectItem>
                    <SelectItem value="karachi">Karachi</SelectItem>
                    <SelectItem value="islamabad">Islamabad</SelectItem>
                    <SelectItem value="peshawar">Peshawar</SelectItem>
                    <SelectItem value="quetta">Quetta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Roof Shading</label>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>No Shade</span>
                    <span>Partially Shaded</span>
                    <span>Heavily Shaded</span>
                  </div>
                  <Slider defaultValue={[0]} max={2} step={1} />
                </div>
              </div>

              <Button className="w-full bg-[#f26522] hover:bg-[#e55511]">Calculate Savings</Button>
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-white p-6 md:p-8">
            <h3 className="text-xl font-bold text-[#1a5ca4] mb-6">Your Estimated Savings</h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Recommended System Size:</span>
                <span>7.5 kW</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Estimated Monthly Savings:</span>
                <span className="text-green-600 font-bold">PKR 18,750</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Estimated Annual Savings:</span>
                <span className="text-green-600 font-bold">PKR 225,000</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">25-Year Savings:</span>
                <span className="text-green-600 font-bold">PKR 5,625,000</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Payback Period:</span>
                <span>5.3 years</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">CO₂ Reduction:</span>
                <span>6.2 tons/year</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Note:</span> This is an estimate based on the information provided. Contact
                our solar experts for a detailed assessment and customized solution.
              </p>
            </div>

            <Button className="w-full mt-6 bg-[#1a5ca4] hover:bg-[#0e4a8a]">Get a Detailed Quote</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
