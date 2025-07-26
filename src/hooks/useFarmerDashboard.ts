import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFarmerProducts } from '@/hooks/useProductsData';
import { supabase } from '@/integrations/supabase/client';

export type DashboardSection = 'dashboard' | 'products' | 'notifications';

export interface RealFarmerProduct {
  id: string;
  name: string;
  category: string;
  quantity_available: number;
  quantity_unit: string;
  price_per_unit: number;
  quality_grade: string;
  status: string;
  created_at: string;
  collection_date?: string;
  admin_notes?: string;
  harvest_date?: string;
  location?: string;
  organic_certified: boolean;
}

export const useFarmerDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [realTimeProducts, setRealTimeProducts] = useState<RealFarmerProduct[]>([]);
  const { data: products, refetch } = useFarmerProducts();

  // Set up real-time subscription for products
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('farmer-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `farmer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time product update:', payload);
          refetch(); // Refetch products when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  // Transform Supabase products to match the expected format
  const transformedProducts = products?.map(product => ({
    id: parseInt(product.id.slice(-3)) || 1, // Use last 3 chars as number for compatibility
    name: product.name,
    category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
    quantity: `${product.quantity_available} ${product.quantity_unit}`,
    submittedPrice: `₹${product.price_per_unit.toLocaleString()}/${product.quantity_unit}`,
    quality: product.quality_grade,
    status: product.status.replace('_', ' ') as any,
    submittedDate: new Date(product.created_at).toLocaleDateString('en-IN'),
    expectedPayment: `₹${(product.quantity_available * product.price_per_unit).toLocaleString()}`,
    collectionDate: product.collection_date ? new Date(product.collection_date).toLocaleDateString('en-IN') : undefined,
    adminNotes: product.admin_notes
  })) || [];

  return {
    activeSection,
    setActiveSection,
    sidebarOpen,
    setSidebarOpen,
    products: transformedProducts,
    realTimeProducts
  };
};
