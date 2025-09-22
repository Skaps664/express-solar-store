"use client"

import { MapPin, Clock, Users, Building, Send, Star } from "lucide-react"

export default function Careers() {
  const jobs = [
    
  ]

  const benefits = [
    {
      title: "Competitive Salary",
      description: "Market-competitive compensation packages with performance bonuses",
      icon: Star
    },
    {
      title: "Health Insurance",
      description: "Comprehensive health coverage for you and your family",
      icon: Users
    },
    {
      title: "Professional Growth",
      description: "Continuous learning opportunities and career advancement",
      icon: Building
    },
    {
      title: "Flexible Hours",
      description: "Work-life balance with flexible working arrangements",
      icon: Clock
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a5ca4] to-[#2563eb] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Build the future of renewable energy in Pakistan with Solar Express
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5+</div>
              <div className="text-blue-200">Office Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-blue-200">Employee Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Why Work at Solar Express?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join a team that's passionate about making a positive impact on Pakistan's energy future
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-semibold text-[#1a5ca4] mb-6">Our Culture</h3>
              <p className="text-gray-700 mb-4">
                At Solar Express, we believe in fostering a culture of innovation, collaboration, and 
                continuous learning. Our team is our greatest asset, and we're committed to creating 
                an environment where everyone can thrive and make a meaningful impact.
              </p>
              <p className="text-gray-700 mb-4">
                We value diversity, encourage creative thinking, and support professional growth. 
                Whether you're just starting your career or you're an experienced professional, 
                you'll find opportunities to learn, grow, and make a difference.
              </p>
              <p className="text-gray-700">
                Join us in our mission to accelerate Pakistan's transition to clean, renewable energy 
                while building a rewarding career in one of the fastest-growing industries.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <benefit.icon className="h-12 w-12 text-[#f26522] mx-auto mb-4" />
                  <h4 className="font-semibold text-[#1a5ca4] mb-2">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Open Positions</h2>
            <p className="text-gray-600">
              Explore exciting career opportunities across different departments
              
            </p>
            <h3>TO BE UPDATED SOON</h3>
          </div>

          <div className="grid gap-6">
            {jobs.map((job, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-[#1a5ca4]">{job.title}</h3>
                      <span className="bg-[#f26522] text-white px-3 py-1 rounded-full text-sm">
                        {job.department}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.experience}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <button className="bg-[#1a5ca4] hover:bg-[#144a87] text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">Application Process</h2>
            <p className="text-gray-600">
              Our streamlined hiring process is designed to find the best fit for both you and our team
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Apply Online</h3>
              <p className="text-gray-600 text-sm">
                Submit your application through our online portal with your resume and cover letter
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Initial Review</h3>
              <p className="text-gray-600 text-sm">
                Our HR team reviews your application and conducts an initial screening call
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Technical Interview</h3>
              <p className="text-gray-600 text-sm">
                Meet with department heads and team members for role-specific discussions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#f26522] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Final Decision</h3>
              <p className="text-gray-600 text-sm">
                We'll make a decision within a week and extend an offer to successful candidates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#1a5ca4] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Don't See the Right Role?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and let us know how you'd like to contribute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:careers@solarexpress.pk" className="bg-[#f26522] hover:bg-[#e55511] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Send Your Resume
            </a>
            <a href="/about" className="border-2 border-white hover:bg-white hover:text-[#1a5ca4] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Learn More About Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
