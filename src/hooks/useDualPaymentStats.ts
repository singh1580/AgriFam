
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDualPaymentStats = () => {
  const statsQuery = useQuery({
    queryKey: ['dual-payment-stats'],
    queryFn: async () => {
      const { data: payments, error } = await supabase
        .from('payments')
        .select('amount, farmer_amount, status, buyer_id, farmer_id');

      if (error) throw error;

      // Calculate buyer payment stats (payments received from buyers)
      const buyerPayments = payments?.filter(p => p.buyer_id) || [];
      const buyerStats = {
        totalPayments: buyerPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        pendingCount: buyerPayments.filter(p => p.status === 'pending').length,
        completedCount: buyerPayments.filter(p => p.status === 'completed').length
      };

      // Calculate farmer payment stats (payments made to farmers)
      const farmerPayments = payments?.filter(p => p.farmer_id) || [];
      const farmerStats = {
        totalPayments: farmerPayments.reduce((sum, p) => sum + (p.farmer_amount || 0), 0),
        pendingCount: farmerPayments.filter(p => p.status === 'pending').length,
        completedCount: farmerPayments.filter(p => p.status === 'paid_to_farmer' || p.status === 'completed').length
      };

      return { buyerStats, farmerStats };
    },
    refetchInterval: 30000
  });

  return {
    buyerStats: statsQuery.data?.buyerStats || { totalPayments: 0, pendingCount: 0, completedCount: 0 },
    farmerStats: statsQuery.data?.farmerStats || { totalPayments: 0, pendingCount: 0, completedCount: 0 },
    isLoading: statsQuery.isLoading,
    error: statsQuery.error
  };
};
