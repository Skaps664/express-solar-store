import { Button } from "@/components/ui/button"
import { Wrench, Users, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function InstallationServices() {
  const services = [
    {
      icon: Wrench,
      title: "Professional Installation",
      description: "Our certified technicians ensure your solar system is installed correctly and safely",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Experienced professionals with thousands of successful installations across Pakistan",
    },
    {
      icon: Clock,
      title: "Quick Turnaround",
      description: "Most residential installations completed within 2-3 days",
    },
    {
      icon: CheckCircle,
      title: "Quality Guarantee",
      description: "All installations backed by our comprehensive warranty and service guarantee",
    },
  ]

  return (
    <div className="my-8">
      <div className="bg-gradient-to-r from-[#0e4a8a] to-[#1a5ca4] rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 md:p-8 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Professional Installation Services</h2>
            <p className="mb-6">
              Our expert installation team ensures your solar system performs at its best. We handle everything from
              initial assessment to final setup and testing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {services.map((service, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-white/10 rounded-full p-2 mt-1">
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{service.title}</h3>
                    <p className="text-white/80 text-sm">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="bg-white text-[#1a5ca4] hover:bg-gray-100">Schedule Installation</Button>
          </div>

          <div className="w-full md:w-1/2 bg-white/10 flex items-center justify-center p-6 md:p-0">
            <Image
              src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1000&auto=format&fit=crop"
              alt="Solar Installation Team"
              width={400}
              height={300}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
