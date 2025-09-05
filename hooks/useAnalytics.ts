"use client";

import { useCallback, useEffect } from 'react';
import axios from 'axios';

// Safe API base resolution - avoid localhost fallback in production
const rawBase = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || ''
const ANALYTICS_BASE_URL = rawBase ? rawBase.replace(/\/$/, '') : '';

export function useAnalytics() {
  // Track page view
  const trackPageView = useCallback(async (page: string) => {
    try {
      await axios.post(`${ANALYTICS_BASE_URL}/api/analytics/track/visit`, {
        page,
        visitorId: getVisitorId()
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }, []);

  // Track brand view
  const trackBrandView = useCallback(async (brandId: string, brandSlug: string) => {
    try {
      await axios.post(`${ANALYTICS_BASE_URL}/api/analytics/track/brand/view`, {
        brandId,
        brandSlug,
        visitorId: getVisitorId()
      });
    } catch (error) {
      console.error('Failed to track brand view:', error);
    }
  }, []);

  // Track brand click
  const trackBrandClick = useCallback(async (brandId: string, brandSlug: string) => {
    try {
      await axios.post(`${ANALYTICS_BASE_URL}/api/analytics/track/brand/click`, {
        brandId,
        brandSlug,
        visitorId: getVisitorId()
      });
    } catch (error) {
      console.error('Failed to track brand click:', error);
    }
  }, []);

  // Track product view
  const trackProductView = useCallback(async (productId: string, productSlug: string) => {
    try {
      await axios.post(`${ANALYTICS_BASE_URL}/api/analytics/track/product/view`, {
        productId,
        productSlug,
        visitorId: getVisitorId()
      });
    } catch (error) {
      console.error('Failed to track product view:', error);
    }
  }, []);

  // Track product click
  const trackProductClick = useCallback(async (productId: string, productSlug: string, action: 'detail' | 'cart-add' | 'purchase') => {
    try {
      await axios.post(`${ANALYTICS_BASE_URL}/api/analytics/track/product/${action}`, {
        productId,
        productSlug,
        visitorId: getVisitorId()
      });
    } catch (error) {
      console.error(`Failed to track product ${action}:`, error);
    }
  }, []);

  return {
    trackPageView,
    trackBrandView,
    trackBrandClick,
    trackProductView,
    trackProductClick
  };
}

// Helper to generate/get visitor ID
function getVisitorId(): string {
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + '_' + Date.now();
    localStorage.setItem('visitorId', visitorId);
  }
  return visitorId;
}
