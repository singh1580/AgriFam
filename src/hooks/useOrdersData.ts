
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(*),
          buyer:profiles!buyer_id(full_name, email)
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

export const useFarmerOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['farmer-orders', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          product:products!inner(*),
          buyer:profiles!buyer_id(full_name, email)
        `)
        .eq('product.farmer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};
