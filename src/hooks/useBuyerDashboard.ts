
import { useState, useMemo } from 'react';
import { useAggregatedProducts } from './useAggregatedProducts';
import { useOptimizedBuyerOrders } from './useOptimizedBuyerOrders';
import { useOptimizedBuyerNotifications } from './useOptimizedBuyerNotifications';

type DashboardSection = 'browse' | 'orders' | 'history' | 'notifications';
type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest';

export const useBuyerDashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('relevance');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use optimized hooks
  const { products, isLoading: productsLoading } = useAggregatedProducts();
  const { activeOrders, orderHistory, activeOrdersLoading, orderHistoryLoading } = useOptimizedBuyerOrders();
  const { 
    notifications, 
    notificationsLoading, 
    unreadNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    isMarkingAllAsRead
  } = useOptimizedBuyerNotifications();

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesGrade = selectedGrade === 'all' || product.quality_grade === selectedGrade;
      
      return matchesSearch && matchesCategory && matchesGrade;
    });

    // Apply sorting
    switch (selectedSort) {
      case 'price-low':
        filtered.sort((a, b) => a.standard_price - b.standard_price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.standard_price - a.standard_price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        break;
      case 'relevance':
      default:
        // Sort by relevance (admin certified first, then quality grade, then quantity)
        filtered.sort((a, b) => {
          if (a.admin_certified !== b.admin_certified) {
            return b.admin_certified ? 1 : -1;
          }
          if (a.quality_grade !== b.quality_grade) {
            const gradeOrder = { 'A+': 5, 'A': 4, 'B+': 3, 'B': 2, 'C': 1 };
            return (gradeOrder[b.quality_grade as keyof typeof gradeOrder] || 0) - 
                   (gradeOrder[a.quality_grade as keyof typeof gradeOrder] || 0);
          }
          return b.total_quantity - a.total_quantity;
        });
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedGrade, selectedSort]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedGrade('all');
    setSelectedSort('relevance');
  };

  // Action handlers
  const handleViewOrderDetails = (orderId: string) => {
    console.log('Viewing order details:', orderId);
  };

  const handleReorder = (orderId: string) => {
    console.log('Reordering:', orderId);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
  };

  return {
    activeSection,
    setActiveSection,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedGrade,
    setSelectedGrade,
    selectedSort,
    setSelectedSort: (sort: string) => setSelectedSort(sort as SortOption),
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
  };
};
