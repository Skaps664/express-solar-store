"use client"

import { useState, useEffect } from 'react';
import StarRating from '@/components/ui/star-rating';
import { ThumbsUp, User, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type Review = {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  likes: {
    count: number;
    users: string[];
  };
  verified: boolean;
};

type ReviewStats = {
  avgRating: number;
  totalReviews: number;
  distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
};

// Removed ReviewEligibility type as it's no longer used

type ProductReviewsProps = {
  productId: string;
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
  // Immediate debug check for productId
  console.log("ProductReviews MOUNTED - productId:", productId, "type:", typeof productId);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    avgRating: 0,
    totalReviews: 0,
    distribution: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('newest');
  
  // Load reviews on mount and when sort changes
  useEffect(() => {
    console.log("ProductReviews - useEffect triggered with productId:", productId);
    
    if (productId) {
      console.log("ProductReviews - Valid productId found, fetching reviews");
      fetchReviews();
    } else {
      console.log("ProductReviews - No valid productId, setting loading to false immediately");
      setLoading(false);
    }
    
    // Safety timeout to ensure loading state is reset even if fetch fails completely
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.log("ProductReviews - Safety timeout triggered, forcing loading to false");
        setLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(safetyTimer);
  }, [productId, sortOption]);
  
  // Debug current state
  useEffect(() => {
    console.log("ProductReviews - Current state:", {
      productId,
      loading,
      reviewCount: reviews.length,
      error
    });
  }, [productId, loading, reviews, error]);
  
  const fetchReviews = async () => {
    console.log('fetchReviews - START with productId:', productId);
    setLoading(true);
    setError(null); // Reset error state before fetching
    
    // If no productId is provided, don't try to fetch
    if (!productId) {
      console.log('fetchReviews - No productId provided, skipping fetch');
      setLoading(false);
      
      // Set empty reviews state
      setReviews([]);
      setStats({
        avgRating: 0,
        totalReviews: 0,
        distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      });
      return;
    }
    
    // Add a small delay for debugging visibility
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const apiUrl = `${API_BASE}/api/reviews/product/${productId}?sort=${sortOption}`;
      console.log(`fetchReviews - Fetching from URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      console.log(`fetchReviews - Response status:`, response.status);
      
      if (!response.ok) {
        // If we get a 404, it might mean there are no reviews yet, which isn't an error
        if (response.status === 404) {
          console.log("fetchReviews - No reviews found (404), setting empty state");
          setReviews([]);
          setStats({
            avgRating: 0,
            totalReviews: 0,
            distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
          });
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("fetchReviews - Reviews data:", data);
      
      if (data && data.success) {
        console.log(`fetchReviews - Successfully loaded ${data.reviews?.length || 0} reviews`);
        setReviews(data.reviews || []);
        setStats(data.stats || {
          avgRating: 0,
          totalReviews: 0,
          distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
        });
      } else {
        console.error("fetchReviews - API returned success: false", data);
        setError(data?.message || 'Failed to fetch reviews');
        // Set empty reviews even if there's an error to avoid stuck UI
        setReviews([]);
        setStats({
          avgRating: 0,
          totalReviews: 0,
          distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
        });
      }
    } catch (err) {
      console.error('fetchReviews - Error:', err);
      // Set empty reviews state rather than showing an error
      setReviews([]);
      setStats({
        avgRating: 0,
        totalReviews: 0,
        distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      });
    } finally {
      // Ensure loading state is always set to false when done
      console.log('fetchReviews - Finished, setting loading to false');
      setLoading(false);
    }
  };
  
  // Helper function for handling likes - replaced with placeholder
  const handleLikeReview = (reviewId: string) => {
    console.log('Like functionality removed', reviewId);
    // We'll implement this elsewhere later
  };

  // Calculate percentages for the distribution bars
  const getDistributionPercentage = (count: number) => {
    if (stats.totalReviews === 0) return 0;
    return (count / stats.totalReviews) * 100;
  };
  
  // If there's no productId, return a simplified version without trying to load anything
  if (!productId) {
    console.log("ProductReviews - Rendering without a productId");
    return (
      <div className="space-y-8">
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <p className="text-gray-600">
            No product selected to display reviews.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-blue-50 p-4 rounded-md">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold mb-2">Customer Reviews</h3>
          <div className="flex items-center mb-1">
            <span className="text-3xl font-bold mr-2">
              {stats.avgRating.toFixed(1)}
            </span>
            <StarRating rating={stats.avgRating} size={24} />
          </div>
          <p className="text-gray-600">Based on {stats.totalReviews} reviews</p>
        </div>
        
        <div className="col-span-2">
          <h4 className="text-lg font-medium mb-3">Rating Distribution</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const starKey = String(star) as keyof typeof stats.distribution;
              return (
                <div key={star} className="flex items-center">
                  <span className="w-16 text-sm font-medium">{star} stars</span>
                  <div className="w-full mx-2">
                    <Progress value={getDistributionPercentage(stats.distribution[starKey])} />
                  </div>
                  <span className="w-10 text-sm text-gray-600">
                    {stats.distribution[starKey]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Sort Options */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium">
          {stats.totalReviews} Reviews
        </h3>
        <div className="flex items-center">
          <span className="text-sm mr-2">Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="likes">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Reviews List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="flex items-center mb-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a5ca4]"></div>
            <span className="ml-2 text-[#1a5ca4]">Loading reviews for product ID: {productId}...</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            If this takes too long, please refresh the page.
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <p className="text-gray-600">
            No reviews yet for this product.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={review.rating} />
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <Check size={12} className="mr-1" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h4 className="font-medium">{review.title}</h4>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
              
              <div className="flex items-center mt-1 mb-2">
                <User size={18} className="mr-1 text-gray-500" />
                <span className="text-sm font-medium">{review.user.name}</span>
              </div>
              
              <p className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</p>
              
              <div className="flex items-center text-sm text-gray-600">
                <ThumbsUp size={16} className="mr-1" />
                <span>{review.likes.count} {review.likes.count === 1 ? 'person found this helpful' : 'people found this helpful'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
