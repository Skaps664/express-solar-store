import React, { useEffect } from 'react';
import AnalyticsClient from './analytics';

// Props for tracking component
interface AnalyticsTrackingProps {
  type: 'brand' | 'product';
  id: string;
  slug: string;
  brandId?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  trackView?: boolean;
}

/**
 * Component to track interactions with brands and products
 */
export const AnalyticsTracker: React.FC<AnalyticsTrackingProps> = ({ 
  type, 
  id, 
  slug, 
  brandId, 
  children, 
  onClick,
  trackView = false 
}) => {
  const analytics = AnalyticsClient.getInstance();
  
  // Track view on mount if trackView is true
  useEffect(() => {
    if (trackView) {
      if (type === 'brand') {
        analytics.trackBrandView(id, slug);
      } else if (type === 'product') {
        analytics.trackProductView(id, slug, brandId);
      }
    }
  }, [type, id, slug, brandId, trackView]);
  
  // Handle click tracking
  const handleClick = (e: React.MouseEvent) => {
    if (type === 'brand') {
      analytics.trackBrandClick(id, slug);
    } else if (type === 'product') {
      analytics.trackProductClick(id, slug, brandId);
    }
    
    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};

/**
 * Hook to track add to cart events
 * @returns A function to call when a product is added to cart
 */
export const useTrackAddToCart = () => {
  const analytics = AnalyticsClient.getInstance();
  
  return (productId: string, productSlug: string, brandId?: string, quantity: number = 1) => {
    analytics.trackProductAddToCart(productId, productSlug, brandId, quantity);
  };
};

export default AnalyticsTracker;
