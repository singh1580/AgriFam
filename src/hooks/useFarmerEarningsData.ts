import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFarmerEarningsData = () => {
  return useQuery({
    queryKey: ['farmer-earnings-data'],
    queryFn: async () => {
      // Get all payments made to farmers
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          farmer_amount,
          farmer_id,
          status,
          created_at,
          farmer:profiles!farmer_id(full_name, email)
        `)
        .not('farmer_id', 'is', null);

      if (paymentsError) throw paymentsError;

      // Get all orders with farmer info
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          total_amount,
          status,
          created_at,
          product:products(
            farmer_id,
            farmer:profiles!farmer_id(full_name, email, phone)
          )
        `)
        .not('product.farmer_id', 'is', null);

      if (ordersError) throw ordersError;

      // Calculate farmer earnings
      const farmerEarnings: { [key: string]: { 
        name: string; 
        email: string;
        totalEarnings: number; 
        paidEarnings: number;
        pendingEarnings: number;
        orders: number; 
        location?: string;
      } } = {};

      // From direct payments
      payments?.forEach(payment => {
        if (payment.farmer_id && payment.farmer) {
          const farmerId = payment.farmer_id;
          if (!farmerEarnings[farmerId]) {
            farmerEarnings[farmerId] = {
              name: payment.farmer.full_name || 'Unknown Farmer',
              email: payment.farmer.email || '',
              totalEarnings: 0,
              paidEarnings: 0,
              pendingEarnings: 0,
              orders: 0
            };
          }
          
          const amount = payment.farmer_amount || 0;
          farmerEarnings[farmerId].totalEarnings += amount;
          
          if (payment.status === 'paid_to_farmer' || payment.status === 'completed') {
            farmerEarnings[farmerId].paidEarnings += amount;
          } else {
            farmerEarnings[farmerId].pendingEarnings += amount;
          }
        }
      });

      // From orders (calculate 85% farmer share)
      orders?.forEach(order => {
        if (order.product?.farmer_id && order.product?.farmer && order.total_amount) {
          const farmerId = order.product.farmer_id;
          const farmerShare = Math.round(order.total_amount * 0.85);
          
          if (!farmerEarnings[farmerId]) {
            farmerEarnings[farmerId] = {
              name: order.product.farmer.full_name || 'Unknown Farmer',
              email: order.product.farmer.email || '',
              totalEarnings: 0,
              paidEarnings: 0,
              pendingEarnings: 0,
              orders: 0
            };
          }
          
          farmerEarnings[farmerId].orders += 1;
          farmerEarnings[farmerId].totalEarnings += farmerShare;
          
          if (order.status === 'delivered') {
            farmerEarnings[farmerId].paidEarnings += farmerShare;
          } else {
            farmerEarnings[farmerId].pendingEarnings += farmerShare;
          }
        }
      });

      // Convert to array and sort by total earnings
      const topFarmers = Object.entries(farmerEarnings)
        .map(([farmerId, data]) => ({
          farmerId,
          ...data
        }))
        .sort((a, b) => b.totalEarnings - a.totalEarnings)
        .slice(0, 10);

      const totalEarnings = Object.values(farmerEarnings).reduce((sum, farmer) => sum + farmer.totalEarnings, 0);
      const totalPaidEarnings = Object.values(farmerEarnings).reduce((sum, farmer) => sum + farmer.paidEarnings, 0);
      const totalPendingEarnings = Object.values(farmerEarnings).reduce((sum, farmer) => sum + farmer.pendingEarnings, 0);
      const activeFarmers = Object.keys(farmerEarnings).length;

      return {
        topFarmers,
        totalEarnings,
        totalPaidEarnings,
        totalPendingEarnings,
        activeFarmers,
        avgEarningsPerFarmer: activeFarmers > 0 ? Math.round(totalEarnings / activeFarmers) : 0
      };
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider stale after 30 seconds
  });
};