import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Michael Johnson",
      role: "Homeowner",
      image: "person-1",
      stars: 5,
      quote:
        "Installing solar panels from Solar Express was the best decision we made for our home. The system has exceeded our expectations, and we're now generating more electricity than we use most months. The customer service was exceptional throughout the entire process.",
    },
    {
      name: "Sarah Williams",
      role: "Small Business Owner",
      image: "person-2",
      stars: 5,
      quote:
        "As a small business owner, I was looking for ways to reduce our operating costs. The commercial solar system from Solar Express has cut our electricity bills by 70%. The ROI has been incredible, and the installation was smooth and professional.",
    },
    {
      name: "David Chen",
      role: "DIY Enthusiast",
      image: "person-3",
      stars: 4,
      quote:
        "I purchased components for my off-grid cabin, and the technical support from Solar Express was invaluable. They helped me design the perfect system for my needs and were always available to answer my questions during installation.",
    },
    {
      name: "Emily Rodriguez",
      role: "Sustainability Director",
      image: "person-4",
      stars: 5,
      quote:
        "Our company committed to reducing our carbon footprint, and Solar Express helped us achieve that goal. Their team provided a comprehensive solution that included solar panels, battery storage, and smart monitoring. Highly recommended!",
    },
  ]

  return (
    <div className="my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Don't just take our word for it. Here's what our satisfied customers have to say about their experience with
          Solar Express.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < testimonial.stars ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <div className="text-gray-400 text-xs">[{testimonial.image}]</div>
              </div>
              <div>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
