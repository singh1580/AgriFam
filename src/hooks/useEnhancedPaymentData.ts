import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PaymentData {
  id: string;
  amount: number;
  farmer_amount: number;
  status: string;
  created_at: string;
  processed_at: string;
  transaction_id: string;
  payment_method: string;
  payment_direction?: string;
  payment_type?: string;
  buyer_id: string;
  farmer_id: string;
  order_id: string;
  buyer?: {
    full_name: string;
    email: string;
  };
  farmer?: {
    full_name: string;
    email: string;
  };
  order?: {
    id: string;
    product?: {
      name: string;
      category: string;
    };
  };
}

export const useEnhancedPaymentData = () => {
  return useQuery({
    queryKey: ['enhanced-payments'],
    queryFn: async (): Promise<{
      allPayments: PaymentData[];
      pendingPayments: PaymentData[];
      completedPayments: PaymentData[];
      farmerPayments: PaymentData[];
      buyerPayments: PaymentData[];
    }> => {
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          *,
          buyer:profiles!buyer_id(full_name, email),
          farmer:profiles!farmer_id(full_name, email),
          order:orders!order_id(
            id,
            product:products(name, category)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allPayments = payments || [];
      
      // Separate payments by their actual purpose and direction
      const farmerPayments = allPayments.filter(p => 
        // Payments TO farmers (collection payments)
        (p.payment_direction === 'outgoing' && p.payment_type === 'collection') ||
        (p.status === 'paid_to_farmer' && p.farmer_id)
      );
      
      const buyerPayments = allPayments.filter(p => 
        // Payments FROM buyers (order payments)
        (p.payment_direction === 'incoming' && p.payment_type === 'order') ||
        (p.buyer_id && !farmerPayments.some(fp => fp.id === p.id))
      );

      const pendingPayments = allPayments.filter(p => p.status === 'pending');
      const completedPayments = allPayments.filter(p => 
        p.status === 'completed' || p.status === 'paid_to_farmer'
      );

      return {
        allPayments,
        pendingPayments,
        completedPayments,
        farmerPayments,
        buyerPayments
      };
    },
    refetchInterval: 30000
  });
};