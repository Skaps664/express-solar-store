"use client";

import { useCallback } from 'react';
import { AnalyticsClient } from '@/lib/analytics';

export function useBrandAnalytics(brandId: string, brandSlug: string) {
  const trackView = useCallback(async () => {
    const analytics = AnalyticsClient.getInstance();
    await analytics.trackBrandInteraction(brandId, brandSlug, 'view');
  }, [brandId, brandSlug]);

  const trackClick = useCallback(async () => {
    const analytics = AnalyticsClient.getInstance();
    await analytics.trackBrandInteraction(brandId, brandSlug, 'click');
  }, [brandId, brandSlug]);

  return { trackView, trackClick };
}

export function useProductAnalytics(productId: string, productSlug: string) {
  const trackView = useCallback(async () => {
    const analytics = AnalyticsClient.getInstance();
    await analytics.trackProductInteraction(productId, productSlug, 'view');
  }, [productId, productSlug]);

  const trackClick = useCallback(async () => {
    const analytics = AnalyticsClient.getInstance();
    await analytics.trackProductInteraction(productId, productSlug, 'click');
  }, [productId, productSlug]);

  const trackAddToCart = useCallback(async () => {
    const analytics = AnalyticsClient.getInstance();
    await analytics.trackProductInteraction(productId, productSlug, 'cart-add');
  }, [productId, productSlug]);

  return { trackView, trackClick, trackAddToCart };
}
