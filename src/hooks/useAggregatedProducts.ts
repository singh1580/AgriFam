
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AggregatedProduct {
  id: string;
  product_name: string;
  category: string;
  total_quantity: number;
  standard_price: number;
  quality_grade: string;
  farmer_count: number;
  regions: string[];
  admin_certified: boolean;
  quality_assured: boolean;
  quantity_unit: string;
  description?: string;
  image?: string;
}

export const useAggregatedProducts = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['aggregated-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aggregated_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(product => ({
        id: product.id,
        product_name: product.product_name,
        category: product.category,
        total_quantity: product.total_quantity || 0,
        standard_price: product.standard_price || 0,
        quality_grade: product.quality_grade,
        farmer_count: product.farmer_count || 0,
        regions: product.regions || [],
        admin_certified: product.admin_certified || true,
        quality_assured: product.quality_assured || true,
        quantity_unit: product.quantity_unit || 'tons',
        description: product.description || null,
        image: product.image || 'photo-1618160702438-9b02ab6515c9'
      })) as AggregatedProduct[];
    }
  });

  return {
    products,
    isLoading
  };
};
