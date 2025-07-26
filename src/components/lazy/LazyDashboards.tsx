
import { Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Lazy load dashboard components for better code splitting
const FarmerDashboard = lazy(() => import('@/components/farmer/FarmerDashboard'));
const FarmerAnonymousDashboard = lazy(() => import('@/components/farmer/FarmerAnonymousDashboard'));
const BuyerAnonymousDashboard = lazy(() => import('@/components/buyer/BuyerAnonymousDashboard'));

// Optimized Error Boundary for dashboard components
class DashboardErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Dashboard Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" variant="agricultural" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper components with optimized loading
export const LazyFarmerDashboard = () => (
  <DashboardErrorBoundary>
    <Suspense fallback={<DashboardSkeleton />}>
      <FarmerDashboard />
    </Suspense>
  </DashboardErrorBoundary>
);

export const LazyFarmerAnonymousDashboard = () => (
  <DashboardErrorBoundary>
    <Suspense fallback={<DashboardSkeleton />}>
      <FarmerAnonymousDashboard />
    </Suspense>
  </DashboardErrorBoundary>
);

export const LazyBuyerAnonymousDashboard = () => (
  <DashboardErrorBoundary>
    <Suspense fallback={<DashboardSkeleton />}>
      <BuyerAnonymousDashboard />
    </Suspense>
  </DashboardErrorBoundary>
);
