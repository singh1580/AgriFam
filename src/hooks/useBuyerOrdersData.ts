
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBuyerOrdersData = () => {
  const ordersQuery = useQuery({
    queryKey: ['admin-buyer-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(*),
          buyer:profiles!buyer_id(full_name, email, role)
        `)
        .not('buyer_id', 'is', null) // Ensure we only get buyer orders
        .eq('buyer.role', 'buyer') // Only actual buyers, not farmers
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  const statsQuery = useQuery({
    queryKey: ['admin-buyer-order-stats'],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          status, 
          total_amount,
          buyer:profiles!buyer_id(role)
        `)
        .not('buyer_id', 'is', null)
        .eq('buyer.role', 'buyer');

      if (error) throw error;

      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
      const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      return {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue: Math.round(totalRevenue)
      };
    },
    refetchInterval: 60000,
  });

  return {
    orders: ordersQuery.data || [],
    stats: statsQuery.data || {
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      totalRevenue: 0
    },
    isLoading: ordersQuery.isLoading || statsQuery.isLoading,
    error: ordersQuery.error || statsQuery.error
  };
};
