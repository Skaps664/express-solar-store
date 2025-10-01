"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"

interface EligibleReviewItem {
  orderItemId: string
  orderId: string
  orderNumber: string
  product: {
    _id: string
    name: string
    slug: string
    image?: string
  }
  purchaseDate: string
  deliveryDate: string
  quantity: number
  price: number
}

interface ReviewFormProps {
  isOpen: boolean
  onClose: () => void
  item: EligibleReviewItem | null
  onSubmit: (reviewData: { rating: number; title: string; comment: string; images?: string[] }) => Promise<void>
}

export function ReviewForm({ isOpen, onClose, item, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert("Please select a rating")
      return
    }
    
    if (!title.trim()) {
      alert("Please enter a title")
      return
    }
    
    if (!comment.trim()) {
      alert("Please enter a comment")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        rating,
        title: title.trim(),
        comment: comment.trim()
      })
      // Reset form
      setRating(0)
      setHoveredRating(0)
      setTitle("")
      setComment("")
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setHoveredRating(0)
    setTitle("")
    setComment("")
    onClose()
  }

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {item.product.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            {item.product.image && (
              <img 
                src={item.product.image} 
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.product.name}</h3>
              <p className="text-xs text-muted-foreground">
                Order #{item.orderNumber}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-muted-foreground">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                maxLength={100}
                required
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Review *</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell others about your experience with this product..."
                rows={4}
                maxLength={1000}
                required
              />
              <p className="text-xs text-muted-foreground">
                {comment.length}/1000 characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || rating === 0 || !title.trim() || !comment.trim()}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}