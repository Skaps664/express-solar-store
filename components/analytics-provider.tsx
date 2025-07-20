'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnalyticsClient } from '@/lib/analytics';

/**
 * Analytics provider component to be used at the app root level
 * This will automatically track page views
 */
export default function AnalyticsProvider({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track page views on initial load and route changes
  useEffect(() => {
    // Wait for client-side rendering to complete
    if (typeof window !== 'undefined') {
      const analytics = AnalyticsClient.getInstance();
      analytics.trackPageView();
      console.log('Page view tracked:', pathname);
    }
  }, [pathname, searchParams]);
  
  // Just render children, the tracking happens in the hook
  return <>{children}</>;
}
