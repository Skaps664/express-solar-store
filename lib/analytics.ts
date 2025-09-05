import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import * as UAParser from 'ua-parser-js';

/**
 * Analytics utility for tracking user interactions
 */
export class AnalyticsClient {
  private static instance: AnalyticsClient;
  private visitorId: string;
  private baseUrl: string;

  constructor() {
    // Generate or retrieve visitor ID
    let visitorId = Cookies.get('visitorId');
    if (!visitorId) {
      visitorId = uuidv4();
      // Set cookie to expire in 1 year
      Cookies.set('visitorId', visitorId, { expires: 365 });
    }
    this.visitorId = visitorId;
    
    // Set the base URL for API calls - avoid localhost fallback in production
    const rawBase = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || ''
    this.baseUrl = rawBase ? rawBase.replace(/\/$/, '') : '';
  }

  public static getInstance(): AnalyticsClient {
    if (!AnalyticsClient.instance) {
      AnalyticsClient.instance = new AnalyticsClient();
    }
    return AnalyticsClient.instance;
  }

  /**
   * Track page view
   */
  public async trackPageView(page?: string) {
    try {
      const parser = new UAParser.UAParser();
      const result = parser.getResult();
      const url = new URL(page || window.location.href);
      const path = url.pathname;
      
      // Extract brand or product slug from URL if present
      const segments = path.split('/').filter(Boolean);
      const pageType = segments[0]; // e.g., 'brand' or 'product'
      const entitySlug = segments[1]; // The actual slug
      
      const data = {
        visitorId: this.visitorId,
        page: path,
        referrer: document.referrer,
        device: result.device.type || 'desktop',
        browser: result.browser.name || 'unknown',
        timestamp: new Date().toISOString(),
        pageType,
        entitySlug
      };
      
      await fetch(`${this.baseUrl}/api/analytics/track/visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
      // Don't throw - analytics shouldn't break the application
    }
  }

  /**
   * Track brand view
   * @param brandId - Brand ID
   * @param brandSlug - Brand slug
   */
  public async trackBrandView(brandId: string, brandSlug: string) {
    try {
      const data = {
        brandId,
        brandSlug,
        visitorId: this.visitorId
      };
      
      await fetch(`${this.baseUrl}/api/analytics/track/brand/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error tracking brand view:', error);
    }
  }

  /**
   * Track brand click
   * @param brandId - Brand ID
   * @param brandSlug - Brand slug
   */
  public async trackBrandClick(brandId: string, brandSlug: string) {
    try {
      const data = {
        brandId,
        brandSlug,
        visitorId: this.visitorId
      };
      
      await fetch(`${this.baseUrl}/api/analytics/track/brand/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error tracking brand click:', error);
    }
  }

  /**
   * Track product view
   * @param productId - Product ID
   * @param productSlug - Product slug
   * @param brandId - Brand ID (optional)
   */
  public async trackProductView(productId: string, productSlug: string, brandId?: string) {
    try {
      const data = {
        productId,
        productSlug,
        brandId,
        visitorId: this.visitorId
      };
      
      const response = await fetch(`${this.baseUrl}/api/analytics/track/product/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.warn(`Analytics tracking failed with status: ${response.status}`);
        // We don't throw here as analytics failures shouldn't break the user experience
      }
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }

  /**
   * Track product click
   * @param productId - Product ID
   * @param productSlug - Product slug
   * @param brandId - Brand ID (optional)
   */
  public async trackProductClick(productId: string, productSlug: string, brandId?: string) {
    try {
      const data = {
        productId,
        productSlug,
        brandId,
        visitorId: this.visitorId
      };
      
      await fetch(`${this.baseUrl}/api/analytics/track/product/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error tracking product click:', error);
    }
  }

  /**
   * Track product add to cart
   * @param productId - Product ID
   * @param productSlug - Product slug
   * @param brandId - Brand ID (optional)
   * @param quantity - Quantity added (default: 1)
   */
  public async trackProductAddToCart(
    productId: string, 
    productSlug: string, 
    brandId?: string, 
    quantity: number = 1
  ) {
    try {
      const data = {
        productId,
        productSlug,
        brandId,
        quantity,
        visitorId: this.visitorId
      };
      
      await fetch(`${this.baseUrl}/api/analytics/track/product/cart-add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error tracking product add to cart:', error);
    }
  }

  /**
   * Track brand view or interaction
   */
  public async trackBrandInteraction(brandId: string, brandSlug: string, action: 'view' | 'click') {
    try {
      const data = {
        visitorId: this.visitorId,
        brandId,
        brandSlug,
        timestamp: new Date().toISOString(),
        action
      };

      const response = await fetch(`${this.baseUrl}/api/analytics/track/brand/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to track brand ${action}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Failed to track brand ${action}:`, error);
    }
  }

  /**
   * Track product view or interaction
   */
  public async trackProductInteraction(productId: string, productSlug: string, action: 'view' | 'click' | 'cart-add') {
    try {
      const data = {
        visitorId: this.visitorId,
        productId,
        productSlug,
        timestamp: new Date().toISOString(),
        action
      };

      await fetch(`${this.baseUrl}/api/analytics/track/product/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
    } catch (error) {
      console.error(`Failed to track product ${action}:`, error);
    }
  }
}

// Hook to automatically track page views (deprecated - use AnalyticsProvider component instead)
export const usePageViewTracking = () => {
  useEffect(() => {
    // Track page view on mount only - for Next.js App Router use the AnalyticsProvider instead
    const trackPageView = async () => {
      const analytics = AnalyticsClient.getInstance();
      await analytics.trackPageView();
    };
    
    trackPageView();
  }, []);
};

export default AnalyticsClient;
