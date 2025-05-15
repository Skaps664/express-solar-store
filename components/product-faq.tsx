"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Minus } from "lucide-react"

export default function ProductFAQ({ faqs }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaqs, setExpandedFaqs] = useState({})
  const [showAskForm, setShowAskForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    name: "",
    email: "",
  })

  const toggleFaq = (index) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleAskSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would send the question to an API
    console.log("Question submitted:", newQuestion)
    setShowAskForm(false)
    // Reset form
    setNewQuestion({
      question: "",
      name: "",
      email: "",
    })
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
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
              placeholder="Search questions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
                >
                  <button
                    className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-50"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {expandedFaqs[index] ? (
                      <Minus className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Plus className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  {expandedFaqs[index] && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions match your search.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Have a Question?</h3>
            {showAskForm ? (
              <form onSubmit={handleAskSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Your Question</label>
                  <Textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    placeholder="Ask your question here..."
                    rows={4}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={newQuestion.name}
                    onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={newQuestion.email}
                    onChange={(e) => setNewQuestion({ ...newQuestion, email: e.target.value })}
                    placeholder="Your email (for notification)"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-[#1a5ca4] hover:bg-[#0e4a8a]">
                    Submit Question
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAskForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-gray-600 mb-4">Can't find the answer you're looking for? Ask our product experts.</p>
                <Button className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a]" onClick={() => setShowAskForm(true)}>
                  Ask a Question
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
