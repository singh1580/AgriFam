
import React, { memo, useCallback, useMemo } from 'react';
import AnimatedBackground from '@/components/ui/animated-background';
import QuickActionsGrid from './QuickActionsGrid';
import FarmerDashboardSidebar from './FarmerDashboardSidebar';
import FarmerDashboardHeader from './FarmerDashboardHeader';
import { useFarmerDashboard } from '@/hooks/useFarmerDashboard';
import { useFarmerNotifications } from '@/hooks/useFarmerNotifications';
import { usePerformanceMonitor } from '@/hooks/usePerformanceOptimization';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { 
  OptimizedFarmerStats,
  OptimizedProductStatusList,
  OptimizedFarmerNotificationCenter,
  OptimizedFeedbackSection
} from './OptimizedFarmerComponents';

const FarmerDashboard = () => {
  usePerformanceMonitor('FarmerDashboard', 100); // Increased threshold for complex dashboard
  
  const {
    activeSection,
    setActiveSection,
    sidebarOpen,
    setSidebarOpen,
    products
  } = useFarmerDashboard();

  // Use real notifications instead of mock data
  const {
    notifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    unreadCount,
    isLoading: notificationsLoading,
    error: notificationsError
  } = useFarmerNotifications();

  // Memoize expensive operations
  const memoizedProducts = useMemo(() => products, [products]);
  const memoizedNotifications = useMemo(() => notifications, [notifications]);

  const renderContent = useCallback(() => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <OptimizedFarmerStats />
            <QuickActionsGrid />
          </div>
        );
      case 'products':
        return <OptimizedProductStatusList products={memoizedProducts} />;
      case 'notifications':
        return (
          <OptimizedFarmerNotificationCenter
            notifications={memoizedNotifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
            isLoading={notificationsLoading}
            error={notificationsError}
          />
        );
      case 'feedback':
        return (
          <div className="animate-fade-in">
            <OptimizedFeedbackSection userType="farmer" />
          </div>
        );
      default:
        return null;
    }
  }, [
    activeSection, 
    memoizedProducts, 
    memoizedNotifications, 
    handleMarkAsRead, 
    handleMarkAllAsRead, 
    handleDeleteNotification,
    notificationsLoading,
    notificationsError
  ]);

  return (
    <ErrorBoundary>
      <AnimatedBackground variant="gradient" className="min-h-screen bg-background">
        <div className="flex">
          <FarmerDashboardSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setSidebarOpen={setSidebarOpen}
            unreadNotifications={unreadCount}
            sidebarOpen={sidebarOpen}
          />

          <div className="flex-1 min-w-0">
            <FarmerDashboardHeader
              setSidebarOpen={setSidebarOpen}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />

            <main className="p-4 lg:p-8">
              <ErrorBoundary>
                {renderContent()}
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </AnimatedBackground>
    </ErrorBoundary>
  );
};

export default memo(FarmerDashboard);
