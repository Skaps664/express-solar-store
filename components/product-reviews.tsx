"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Star, ThumbsUp, ThumbsDown, Filter } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample review data - in a real app, this would come from an API or database
const sampleReviews = [
  {
    id: 1,
    name: "Ahmed Khan",
    avatar: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
    rating: 5,
    date: "2023-04-15",
    title: "Excellent performance and quality",
    content:
      "I installed these panels on my roof in Lahore and they've been performing exceptionally well, even during the hot summer months. The efficiency is as advertised and the build quality is excellent. Highly recommended!",
    helpful: 24,
    unhelpful: 2,
    verified: true,
    images: ["https://images.unsplash.com/photo-1611365892117-00d770df8a5f?q=80&w=1000&auto=format&fit=crop"],
  },
  {
    id: 2,
    name: "Fatima Ali",
    avatar:
      "https://img.freepik.com/free-photo/portrait-young-indian-top-manager-t-shirt-tie-crossed-arms-smiling-white-isolated-wall_496169-1513.jpg",
    rating: 4,
    date: "2023-03-22",
    title: "Good panels but delivery took time",
    content:
      "The panels themselves are great and performing well. Installation was straightforward with the provided manual. My only complaint is that delivery took longer than expected. Otherwise, I'm satisfied with my purchase.",
    helpful: 15,
    unhelpful: 3,
    verified: true,
    images: [],
  },
  {
    id: 3,
    name: "Muhammad Rizwan",
    avatar:
      "https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-crossed-chest_176420-18743.jpg",
    rating: 5,
    date: "2023-02-18",
    title: "Best investment for my home",
    content:
      "These panels have significantly reduced my electricity bills. The N-type technology really does perform better in our hot climate compared to my neighbor's older P-type panels. Customer service was also excellent when I had questions about the installation process.",
    helpful: 32,
    unhelpful: 1,
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop",
    ],
  },
  {
    id: 4,
    name: "Zainab Malik",
    avatar:
      "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg",
    rating: 4,
    date: "2023-01-30",
    title: "Good quality but expensive",
    content:
      "The panels are definitely high quality and the performance is great. My only hesitation in giving 5 stars is the price point, which is a bit higher than some competitors. However, the efficiency and warranty make up for it somewhat.",
    helpful: 18,
    unhelpful: 5,
    verified: false,
    images: [],
  },
]

export default function ProductReviews({ productId, rating, reviewCount }) {
  const [reviews, setReviews] = useState(sampleReviews)
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("newest")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
    name: "",
    email: "",
  })

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++
  })

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true
    return review.rating === Number.parseInt(filter)
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sort === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sort === "highest") {
      return b.rating - a.rating
    } else if (sort === "lowest") {
      return a.rating - b.rating
    } else if (sort === "most-helpful") {
      return b.helpful - a.helpful
    }
    return 0
  })

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would send the review to an API
    console.log("Review submitted:", newReview)
    setShowReviewForm(false)
    // Reset form
    setNewReview({
      rating: 5,
      title: "",
      content: "",
      name: "",
      email: "",
    })
  }

  const handleHelpful = (reviewId, isHelpful) => {
    // In a real app, this would send the feedback to an API
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          if (isHelpful) {
            return { ...review, helpful: review.helpful + 1 }
          } else {
            return { ...review, unhelpful: review.unhelpful + 1 }
          }
        }
        return review
      }),
    )
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div>
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-[#1a5ca4] mb-2">{rating}</div>
            <div className="flex justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">Based on {reviewCount} reviews</div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <div className="w-12 text-sm">{star} stars</div>
                <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${(ratingCounts[star - 1] / reviewCount) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="w-8 text-sm text-right">{ratingCounts[star - 1]}</div>
              </div>
            ))}
          </div>

          <Button className="w-full mt-6 bg-[#1a5ca4] hover:bg-[#0e4a8a]" onClick={() => setShowReviewForm(true)}>
            Write a Review
          </Button>
        </div>

        <div className="md:col-span-2">
          {/* Review Form */}
          {showReviewForm ? (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Review Title</label>
                  <Input
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    placeholder="Summarize your experience"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Review</label>
                  <Textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    placeholder="Share your experience with this product"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={newReview.email}
                      onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                      placeholder="Your email (not published)"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-[#1a5ca4] hover:bg-[#0e4a8a]">
                    Submit Review
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          ) : null}

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filter:</span>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[120px] h-8 text-sm">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[150px] h-8 text-sm">
                  <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                  <SelectItem value="most-helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {sortedReviews.length > 0 ? (
              sortedReviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div>
                          <h4 className="font-bold">{review.name}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 sm:mt-0">{formatDate(review.date)}</div>
                      </div>

                      <h5 className="font-medium mb-2">{review.title}</h5>
                      <p className="text-gray-700 mb-4">{review.content}</p>

                      {/* Review Images */}
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                          {review.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative h-20 w-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border border-gray-200"
                            >
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Review image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Helpful buttons */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Was this review helpful?</span>
                        <button
                          className="flex items-center gap-1 text-sm hover:text-[#1a5ca4]"
                          onClick={() => handleHelpful(review.id, true)}
                        >
                          <ThumbsUp className="h-4 w-4" /> Yes ({review.helpful})
                        </button>
                        <button
                          className="flex items-center gap-1 text-sm hover:text-[#1a5ca4]"
                          onClick={() => handleHelpful(review.id, false)}
                        >
                          <ThumbsDown className="h-4 w-4" /> No ({review.unhelpful})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews match your current filter.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {sortedReviews.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-[#1a5ca4] text-white">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
