import React, { memo, Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { StatsSkeleton } from '@/components/ui/dashboard-skeleton';

// Lazy load heavy components
const FarmerStats = lazy(() => import('./FarmerStats'));
const ProductStatusList = lazy(() => import('./ProductStatusList'));
const FarmerNotificationCenter = lazy(() => import('./FarmerNotificationCenter'));
const FeedbackSection = lazy(() => import('@/components/feedback/FeedbackSection'));

// Memoized component wrappers
export const OptimizedFarmerStats = memo(() => (
  <ErrorBoundary>
    <Suspense fallback={<StatsSkeleton />}>
      <FarmerStats />
    </Suspense>
  </ErrorBoundary>
));

export const OptimizedProductStatusList = memo(({ products }: { products: any[] }) => (
  <ErrorBoundary>
    <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
      <ProductStatusList products={products} />
    </Suspense>
  </ErrorBoundary>
));

export const OptimizedFarmerNotificationCenter = memo(({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDeleteNotification,
  isLoading,
  error 
}: any) => (
  <ErrorBoundary>
    <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
      <FarmerNotificationCenter
        notifications={notifications}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onDeleteNotification={onDeleteNotification}
        isLoading={isLoading}
        error={error}
      />
    </Suspense>
  </ErrorBoundary>
));

export const OptimizedFeedbackSection = memo(({ userType }: { userType: 'farmer' | 'buyer' }) => (
  <ErrorBoundary>
    <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
      <FeedbackSection userType={userType} />
    </Suspense>
  </ErrorBoundary>
));

OptimizedFarmerStats.displayName = 'OptimizedFarmerStats';
OptimizedProductStatusList.displayName = 'OptimizedProductStatusList';
OptimizedFarmerNotificationCenter.displayName = 'OptimizedFarmerNotificationCenter';
OptimizedFeedbackSection.displayName = 'OptimizedFeedbackSection';