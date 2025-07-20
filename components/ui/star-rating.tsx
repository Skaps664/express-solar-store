"use client"

import { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
};

export default function StarRating({ 
  rating, 
  size = 20, 
  interactive = false,
  onChange,
  className = ""
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  // Create an array of 5 stars
  const stars = [1, 2, 3, 4, 5];
  
  const handleClick = (starNumber: number) => {
    if (interactive && onChange) {
      onChange(starNumber);
    }
  };
  
  const handleMouseEnter = (starNumber: number) => {
    if (interactive) {
      setHoverRating(starNumber);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      {stars.map((starNumber) => {
        const displayRating = hoverRating || rating;
        const filled = displayRating >= starNumber;
        const halfFilled = !filled && displayRating > starNumber - 1;
        
        return (
          <span 
            key={starNumber}
            onClick={() => handleClick(starNumber)}
            onMouseEnter={() => handleMouseEnter(starNumber)}
            onMouseLeave={handleMouseLeave}
            className={`${interactive ? 'cursor-pointer' : ''} text-yellow-400`}
          >
            {filled ? (
              <Star fill="currentColor" size={size} />
            ) : halfFilled ? (
              <StarHalf fill="currentColor" size={size} />
            ) : (
              <Star size={size} />
            )}
          </span>
        );
      })}
    </div>
  );
}
