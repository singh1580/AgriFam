
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CollectionSchedule, CollectionStats } from '@/types/collection';

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async (): Promise<CollectionSchedule[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          farmer_id,
          name,
          category,
          quantity_available,
          quantity_unit,
          price_per_unit,
          location,
          quality_grade,
          status,
          created_at,
          updated_at,
          collection_date,
          admin_notes,
          farmer:profiles!farmer_id(full_name, email)
        `)
        .in('status', ['approved', 'scheduled_collection', 'collected', 'payment_processed'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(product => ({
        id: product.id,
        productId: product.id,
        farmerId: product.farmer_id,
        farmerName: product.farmer?.full_name || 'Unknown Farmer',
        farmerEmail: product.farmer?.email || '',
        productName: product.name,
        category: product.category,
        quantity: product.quantity_available,
        quantityUnit: product.quantity_unit || 'kg',
        location: product.location,
        scheduledDate: product.collection_date || new Date().toISOString().split('T')[0],
        scheduledTime: '09:00 AM',
        status: product.status as CollectionSchedule['status'],
        estimatedValue: product.quantity_available * product.price_per_unit,
        pricePerUnit: product.price_per_unit,
        qualityGrade: product.quality_grade,
        collectionNotes: product.admin_notes,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }));
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};

export const useCollectionStats = () => {
  return useQuery({
    queryKey: ['collection-stats'],
    queryFn: async (): Promise<CollectionStats> => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('products')
        .select('status, quantity_available, price_per_unit, collection_date')
        .in('status', ['approved', 'scheduled_collection', 'collected', 'payment_processed']);

      if (error) throw error;

      const todaysCollections = data?.filter(p => 
        p.collection_date === today && 
        ['scheduled_collection', 'collected', 'payment_processed'].includes(p.status)
      ).length || 0;

      const scheduledCollections = data?.filter(p => p.status === 'scheduled_collection').length || 0;

      const totalValue = data?.reduce((sum, p) => 
        sum + (p.quantity_available * p.price_per_unit), 0
      ) || 0;

      const paidToday = data?.filter(p => 
        p.status === 'payment_processed' && p.collection_date === today
      ).reduce((sum, p) => sum + (p.quantity_available * p.price_per_unit), 0) || 0;

      return {
        todaysCollections,
        inProgress: scheduledCollections,
        totalValue,
        paidToday
      };
    },
    refetchInterval: 30000
  });
};
