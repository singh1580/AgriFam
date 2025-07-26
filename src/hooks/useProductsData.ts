
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          farmer:profiles!farmer_id(full_name, email)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};

export const useFarmerProducts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['farmer-products', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

export const useAggregatedProducts = () => {
  return useQuery({
    queryKey: ['aggregated-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aggregated_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
  });
};
