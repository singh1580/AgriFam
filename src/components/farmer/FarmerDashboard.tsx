
import { Package, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { memo, useCallback, Suspense } from 'react';
import AnimatedBackground from '@/components/ui/animated-background';
import FarmerStats from './FarmerStats';
import QuickActionsGrid from './QuickActionsGrid';
import ProductStatusList from './ProductStatusList';
import FarmerNotificationCenter from './FarmerNotificationCenter';
import FarmerDashboardSidebar from './FarmerDashboardSidebar';
import FarmerDashboardHeader from './FarmerDashboardHeader';
import { StatsSkeleton } from '@/components/ui/dashboard-skeleton';
import { useFarmerDashboard } from '@/hooks/useFarmerDashboard';
import { useFarmerNotifications } from '@/hooks/useFarmerNotifications';
import { usePerformanceMonitor } from '@/hooks/usePerformanceOptimization';

const FarmerDashboard = () => {
  usePerformanceMonitor('FarmerDashboard');
  
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

  const renderContent = useCallback(() => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Suspense fallback={<StatsSkeleton />}>
              <FarmerStats />
            </Suspense>
            <QuickActionsGrid />
          </div>
        );
      case 'products':
        return <ProductStatusList products={products} />;
      case 'notifications':
        return (
          <FarmerNotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
            isLoading={notificationsLoading}
            error={notificationsError}
          />
        );
      default:
        return null;
    }
  }, [
    activeSection, 
    products, 
    notifications, 
    handleMarkAsRead, 
    handleMarkAllAsRead, 
    handleDeleteNotification,
    notificationsLoading,
    notificationsError
  ]);

  return (
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
          />

          <main className="p-4 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default memo(FarmerDashboard);
