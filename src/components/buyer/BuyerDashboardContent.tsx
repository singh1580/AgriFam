
import React, { Suspense } from 'react';
import { StatsSkeleton, ProductGridSkeleton } from '@/components/ui/dashboard-skeleton';
import { Order, Notification } from '@/types/order';
import { Loader2 } from 'lucide-react';

const ProductFilters = React.lazy(() => import('./ProductFilters'));
const AggregatedProductGrid = React.lazy(() => import('./AggregatedProductGrid'));
const OrderTrackingSection = React.lazy(() => import('./OrderTrackingSection'));
const OrderHistorySection = React.lazy(() => import('./OrderHistorySection'));
const NotificationCenter = React.lazy(() => import('./NotificationCenter'));
// Convert dynamic import to regular import to fix loading issue
import FeedbackSection from '@/components/feedback/FeedbackSection';

type DashboardSection = 'browse' | 'orders' | 'history' | 'notifications' | 'feedback';

interface AggregatedProduct {
  id: string;
  product_name: string;
  category: string;
  total_quantity: number;
  standard_price: number;
  quality_grade: string;
  farmer_count: number;
  regions: string[];
  admin_certified: boolean;
  quality_assured: boolean;
  quantity_unit: string;
  image?: string;
}

interface BuyerDashboardContentProps {
  activeSection: DashboardSection;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  filteredProducts: AggregatedProduct[];
  clearAllFilters: () => void;
  handleOrderProduct: (productId: string) => void;
  activeOrders: Order[];
  handleViewOrderDetails: (orderId: string) => void;
  orderHistory: Order[];
  handleReorder: (orderId: string) => void;
  notifications: Notification[];
  handleMarkAsRead: (notificationId: string) => void;
  handleMarkAllAsRead: () => void;
  handleDeleteNotification: (notificationId: string) => void;
  productsLoading?: boolean;
  activeOrdersLoading?: boolean;
  orderHistoryLoading?: boolean;
  notificationsLoading?: boolean;
  isMarkingAllAsRead?: boolean;
}

const BuyerDashboardContent = React.memo(({
  activeSection,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedGrade,
  setSelectedGrade,
  selectedSort,
  setSelectedSort,
  filteredProducts,
  clearAllFilters,
  handleOrderProduct,
  activeOrders,
  handleViewOrderDetails,
  orderHistory,
  handleReorder,
  notifications,
  handleMarkAsRead,
  handleMarkAllAsRead,
  handleDeleteNotification,
  productsLoading = false,
  activeOrdersLoading = false,
  orderHistoryLoading = false,
  notificationsLoading = false,
  isMarkingAllAsRead = false
}: BuyerDashboardContentProps) => {
  const renderSection = () => {
    switch (activeSection) {
      case 'browse':
        return (
          <div className="space-y-6 animate-fade-in">
            <Suspense fallback={<div className="h-16 bg-muted animate-pulse rounded-lg" />}>
              <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedGrade={selectedGrade}
                setSelectedGrade={setSelectedGrade}
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
                clearAllFilters={clearAllFilters}
              />
            </Suspense>
            <Suspense fallback={<ProductGridSkeleton />}>
              {productsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-blue" />
                </div>
              ) : (
                <AggregatedProductGrid
                  products={filteredProducts}
                  onOrderProduct={handleOrderProduct}
                />
              )}
            </Suspense>
          </div>
        );
      case 'orders':
        return (
          <div className="animate-fade-in">
            <Suspense fallback={<StatsSkeleton />}>
              {activeOrdersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-blue" />
                </div>
              ) : (
                <OrderTrackingSection
                  activeOrders={activeOrders}
                  onViewOrderDetails={handleViewOrderDetails}
                />
              )}
            </Suspense>
          </div>
        );
      case 'history':
        return (
          <div className="animate-fade-in">
            <Suspense fallback={<StatsSkeleton />}>
              {orderHistoryLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-blue" />
                </div>
              ) : (
                <OrderHistorySection
                  orderHistory={orderHistory}
                  onViewOrderDetails={handleViewOrderDetails}
                  onReorder={handleReorder}
                />
              )}
            </Suspense>
          </div>
        );
      case 'notifications':
        return (
          <div className="animate-fade-in">
            <Suspense fallback={<StatsSkeleton />}>
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDeleteNotification={handleDeleteNotification}
                isLoading={notificationsLoading}
                isMarkingAllAsRead={isMarkingAllAsRead}
              />
            </Suspense>
          </div>
        );
      case 'feedback':
        return (
          <div className="animate-fade-in">
            <FeedbackSection userType="buyer" />
          </div>
        );
      default:
        return null;
    }
  };

  return renderSection();
});

BuyerDashboardContent.displayName = 'BuyerDashboardContent';

export default BuyerDashboardContent;
