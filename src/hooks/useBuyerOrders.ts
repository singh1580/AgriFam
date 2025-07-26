
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';

export const useBuyerOrders = () => {
  const { user } = useAuth();

  // Fetch active orders with better error handling and data mapping
  const { data: activeOrders = [], isLoading: activeOrdersLoading } = useQuery({
    queryKey: ['buyer-active-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          quantity_ordered,
          total_amount,
          created_at,
          delivery_date,
          updated_at,
          status,
          tracking_id,
          delivery_address,
          products(name, category, images)
        `)
        .eq('buyer_id', user.id)
        .in('status', ['pending', 'confirmed', 'processing', 'shipped'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(order => ({
        id: order.id,
        productName: order.products?.name || 'Product Name',
        productImage: order.products?.images?.[0] || 'photo-1618160702438-9b02ab6515c9',
        quantity: `${order.quantity_ordered} tons`,
        totalPrice: `₹${order.total_amount?.toLocaleString() || '0'}`,
        orderDate: order.created_at,
        estimatedDelivery: order.delivery_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: order.status as Order['status'],
        trackingId: order.tracking_id || `ORD-${order.id.slice(0, 8).toUpperCase()}`,
        adminContact: '+91-9876543210',
        farmerName: 'Multiple Farmers',
        region: order.delivery_address || 'Location'
      }));
    },
    enabled: !!user,
    retry: 2,
    refetchOnWindowFocus: false
  });

  // Fetch order history with better error handling and data mapping
  const { data: orderHistory = [], isLoading: orderHistoryLoading } = useQuery({
    queryKey: ['buyer-order-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          quantity_ordered,
          total_amount,
          created_at,
          delivery_date,
          updated_at,
          status,
          tracking_id,
          delivery_address,
          products(name, category, images)
        `)
        .eq('buyer_id', user.id)
        .in('status', ['delivered', 'cancelled'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      
        return data.map(order => ({
        id: order.id,
        productName: order.products?.name || 'Product Name',
        productImage: order.products?.images?.[0] || 'photo-1618160702438-9b02ab6515c9',
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
      }));
    },
    enabled: !!user,
    retry: 2,
    refetchOnWindowFocus: false
  });

  return {
    activeOrders,
    orderHistory,
    activeOrdersLoading,
    orderHistoryLoading
  };
};
