import React, { lazy, Suspense } from 'react';
import { StatsSkeleton } from '@/components/ui/dashboard-skeleton';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Lazy load heavy dashboard components for better performance
const FarmerDashboard = lazy(() => 
  import('@/components/farmer/FarmerDashboard').then(module => ({ 
    default: module.default 
  }))
);

const BuyerDashboardContent = lazy(() => 
  import('@/components/buyer/BuyerDashboardContent').then(module => ({ 
    default: module.default 
  }))
);

const AdminDashboard = lazy(() => 
  import('@/components/admin/AdminDashboard').then(module => ({
    default: module.AdminDashboard
  }))
);

// Enhanced loading fallback with agricultural theme
const DashboardLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" variant="agricultural" />
      <div className="text-muted-foreground">Loading dashboard...</div>
    </div>
  </div>
);

// Optimized FarmerDashboard wrapper
export const OptimizedFarmerDashboard = React.memo(() => (
  <ErrorBoundary>
    <Suspense fallback={<DashboardLoadingFallback />}>
      <FarmerDashboard />
    </Suspense>
  </ErrorBoundary>
));

// Optimized BuyerDashboard wrapper
export const OptimizedBuyerDashboard = React.memo((props: any) => (
  <ErrorBoundary>
    <Suspense fallback={<DashboardLoadingFallback />}>
      <BuyerDashboardContent {...props} />
    </Suspense>
  </ErrorBoundary>
));

// Optimized AdminDashboard wrapper
export const OptimizedAdminDashboard = React.memo(() => (
  <ErrorBoundary>
    <Suspense fallback={<DashboardLoadingFallback />}>
      <AdminDashboard />
    </Suspense>
  </ErrorBoundary>
));

OptimizedFarmerDashboard.displayName = 'OptimizedFarmerDashboard';
OptimizedBuyerDashboard.displayName = 'OptimizedBuyerDashboard';
OptimizedAdminDashboard.displayName = 'OptimizedAdminDashboard';