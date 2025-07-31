
import { memo } from 'react';
import AnimatedBackground from '@/components/ui/animated-background';
import { usePerformanceMonitor } from '@/hooks/useOptimizedPerformance';
import { useBuyerDashboard } from '@/hooks/useBuyerDashboard';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import BuyerDashboardSidebar from './BuyerDashboardSidebar';
import BuyerDashboardTopHeader from './BuyerDashboardTopHeader';
import BuyerDashboardContent from './BuyerDashboardContent';

const BuyerAnonymousDashboard = memo(() => {
  usePerformanceMonitor('BuyerAnonymousDashboard');
  
  const {
    activeSection,
    setActiveSection,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedGrade,
    setSelectedGrade,
    selectedSort,
    setSelectedSort,
    sidebarOpen,
    setSidebarOpen,
    activeOrders,
    orderHistory,
    notifications,
    filteredProducts,
    unreadNotifications,
    clearAllFilters,
    handleViewOrderDetails,
    handleReorder,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    notificationsLoading,
    activeOrdersLoading,
    orderHistoryLoading,
    productsLoading,
    isMarkingAllAsRead
  } = useBuyerDashboard();

  return (
    <ErrorBoundary>
      <AnimatedBackground variant="gradient" className="min-h-screen bg-background">
        <div className="flex">
          <BuyerDashboardSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setSidebarOpen={setSidebarOpen}
            unreadNotifications={unreadNotifications}
            sidebarOpen={sidebarOpen}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 lg:ml-64">
            <BuyerDashboardTopHeader
              setSidebarOpen={setSidebarOpen}
              unreadNotifications={unreadNotifications}
              setActiveSection={setActiveSection}
              activeSection={activeSection}
            />

            {/* Page Content */}
            <main className="p-4 lg:p-8">
              <ErrorBoundary>
                <BuyerDashboardContent
                  activeSection={activeSection}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedGrade={selectedGrade}
                  setSelectedGrade={setSelectedGrade}
                  selectedSort={selectedSort}
                  setSelectedSort={setSelectedSort}
                  filteredProducts={filteredProducts}
                  clearAllFilters={clearAllFilters}
                  handleOrderProduct={() => {}} 
                  activeOrders={activeOrders}
                  handleViewOrderDetails={handleViewOrderDetails}
                  orderHistory={orderHistory}
                  handleReorder={handleReorder}
                  notifications={notifications}
                  handleMarkAsRead={handleMarkAsRead}
                  handleMarkAllAsRead={handleMarkAllAsRead}
                  handleDeleteNotification={handleDeleteNotification}
                  productsLoading={productsLoading}
                  activeOrdersLoading={activeOrdersLoading}
                  orderHistoryLoading={orderHistoryLoading}
                  notificationsLoading={notificationsLoading}
                  isMarkingAllAsRead={isMarkingAllAsRead}
                />
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </AnimatedBackground>
    </ErrorBoundary>
  );
});

BuyerAnonymousDashboard.displayName = 'BuyerAnonymousDashboard';

export default BuyerAnonymousDashboard;
