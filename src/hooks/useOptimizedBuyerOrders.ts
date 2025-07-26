
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';
import { useMemo } from 'react';

export const useOptimizedBuyerOrders = () => {
  const { user } = useAuth();

  // Optimized active orders query using product_name column
  const { data: activeOrdersRaw = [], isLoading: activeOrdersLoading } = useQuery({
    queryKey: ['buyer-active-orders-optimized', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', user.id)
        .in('status', ['pending', 'confirmed', 'processing', 'shipped'])
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching active orders:', error);
        throw error;
      }
      
      console.log('Active orders data:', data);
      return data || [];
    },
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });

  // Optimized order history query using product_name column
  const { data: orderHistoryRaw = [], isLoading: orderHistoryLoading } = useQuery({
    queryKey: ['buyer-order-history-optimized', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', user.id)
        .in('status', ['delivered', 'cancelled'])
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching order history:', error);
        throw error;
      }
      
      console.log('Order history data:', data);
      return data || [];
    },
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
  });

  // Memoized transformation to prevent unnecessary re-renders
  const activeOrders = useMemo(() => {
    console.log('Processing active orders:', activeOrdersRaw);
    return (activeOrdersRaw || []).map(order => {
      console.log('Order data:', order);
      
      return {
        id: order.id,
        productName: order.product_name || 'Product Name Not Available',
        productImage: 'photo-1618160702438-9b02ab6515c9',
        quantity: `${order.quantity_ordered} tons`,
        totalPrice: `₹${order.total_amount?.toLocaleString() || '0'}`,
        orderDate: order.created_at,
        estimatedDelivery: order.delivery_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: order.status as Order['status'],
        trackingId: order.tracking_id || `ORD-${order.id.slice(0, 8).toUpperCase()}`,
        adminContact: '+91-9876543210',
        farmerName: 'Multiple Farmers',
        region: order.delivery_address || 'Location'
      };
    });
  }, [activeOrdersRaw]);

  const orderHistory = useMemo(() => {
    console.log('Processing order history:', orderHistoryRaw);
    return (orderHistoryRaw || []).map(order => {
      console.log('History order data:', order);
      
      return {
        id: order.id,
        productName: order.product_name || 'Product Name Not Available',
        productImage: 'photo-1618160702438-9b02ab6515c9',
        quantity: `${order.quantity_ordered} tons`,
        totalPrice: `₹${order.total_amount?.toLocaleString() || '0'}`,
        orderDate: order.created_at,
        estimatedDelivery: order.status === 'delivered' 
          ? (order.delivery_date || order.updated_at || order.created_at)
          : (order.delivery_date || order.created_at),
        status: order.status as Order['status'],
        trackingId: order.tracking_id || `ORD-${order.id.slice(0, 8).toUpperCase()}`,
        adminContact: '+91-9876543210',
        farmerName: 'Multiple Farmers',
        region: order.delivery_address || 'Location'
      };
    });
  }, [orderHistoryRaw]);

  return {
    activeOrders,
    orderHistory,
    activeOrdersLoading,
    orderHistoryLoading
  };
};
