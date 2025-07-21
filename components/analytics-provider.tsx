'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnalyticsClient } from '@/lib/analytics';

/**
 * Internal component that handles analytics tracking
 */
function AnalyticsTracker() {
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
  
  return null; // This component doesn't render anything
}

/**
 * Analytics provider component to be used at the app root level
 * This will automatically track page views
 */
export default function AnalyticsProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
