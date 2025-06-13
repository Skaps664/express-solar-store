"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Minus } from "lucide-react"

export default function ProductResources({ resources }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedResources, setExpandedResources] = useState({})
  const [showAskForm, setShowAskForm] = useState(false)
  const [newResourceRequest, setNewResourceRequest] = useState({
    question: "",
    name: "",
    email: "",
  })

  const toggleResource = (index) => {
    setExpandedResources((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleAskSubmit = (e) => {
    e.preventDefault()
    console.log("Resource request submitted:", newResourceRequest)
    setShowAskForm(false)
    setNewResourceRequest({
      question: "",
      name: "",
      email: "",
    })
  }

  const filteredResources = resources.filter(
    (res) =>
      res.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-2/3">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search manuals, blogs, or reviews..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Resources */}
          <h2 className="text-xl font-bold mb-4">Looking for manuals, blogs, or video reviews?</h2>
          <div className="space-y-4">
            {filteredResources.length > 0 ? (
              filteredResources.map((res, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
                >
                  <button
                    className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-50"
                    onClick={() => toggleResource(index)}
                  >
                    <span className="font-medium">{res.question}</span>
                    {expandedResources[index] ? (
                      <Minus className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Plus className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  {expandedResources[index] && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{res.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No resources match your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Ask for a resource */}
        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Need a specific resource?</h3>
            {showAskForm ? (
              <form onSubmit={handleAskSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">What are you looking for?</label>
                  <Textarea
                    value={newResourceRequest.question}
                    onChange={(e) =>
                      setNewResourceRequest({ ...newResourceRequest, question: e.target.value })
                    }
                    placeholder="Ask for a manual, blog, or review..."
                    rows={4}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={newResourceRequest.name}
                    onChange={(e) =>
                      setNewResourceRequest({ ...newResourceRequest, name: e.target.value })
                    }
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={newResourceRequest.email}
                    onChange={(e) =>
                      setNewResourceRequest({ ...newResourceRequest, email: e.target.value })
                    }
                    placeholder="Your email (for updates)"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-[#1a5ca4] hover:bg-[#0e4a8a]">
                    Submit Request
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAskForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Can't find a manual, blog, or video you need? Let us know, and we’ll help!
                </p>
                <Button className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a]" onClick={() => setShowAskForm(true)}>
                  Request a Resource
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
