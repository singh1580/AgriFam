
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAggregatedProductsInventory = () => {
  return useQuery({
    queryKey: ['aggregated-products-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aggregated_products')
        .select('*')
        .gt('total_quantity', 0);

      if (error) throw error;

      const totalProducts = data?.length || 0;
      const totalQuantity = data?.reduce((sum, product) => sum + product.total_quantity, 0) || 0;
      const totalValue = data?.reduce((sum, product) => sum + (product.total_quantity * product.standard_price), 0) || 0;
      const totalFarmers = data?.reduce((sum, product) => sum + product.farmer_count, 0) || 0;

      return {
        totalProducts,
        totalQuantity,
        totalValue,
        totalFarmers,
        products: data || []
      };
    },
    refetchInterval: 60000
  });
};
