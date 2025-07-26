
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useMemo, useEffect } from 'react';

export const useOptimizedAdminData = () => {
  const queryClient = useQueryClient();

  // Set up real-time subscriptions
  useEffect(() => {
    const ordersChannel = supabase
      .channel('admin-orders-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      })
      .subscribe();

    const paymentsChannel = supabase
      .channel('admin-payments-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      })
      .subscribe();

    const productsChannel = supabase
      .channel('admin-products-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(productsChannel);
    };
  }, [queryClient]);

  // Optimized products query with all required fields
  const productsQuery = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          category,
          status,
          price_per_unit,
          quantity_available,
          quantity_unit,
          quality_grade,
          description,
          location,
          harvest_date,
          expiry_date,
          organic_certified,
          images,
          created_at,
          farmer:profiles!farmer_id(full_name, email, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // Optimized orders query with all required fields
  const ordersQuery = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total_amount,
          created_at,
          quantity_ordered,
          delivery_address,
          delivery_date,
          payment_status,
          tracking_id,
          notes,
          product:products(name, category, quantity_unit),
          buyer:profiles!buyer_id(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    staleTime: 300000,
    gcTime: 600000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // Optimized payments query with all required fields
  const paymentsQuery = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          farmer_amount,
          platform_fee,
          status,
          created_at,
          processed_at,
          transaction_id,
          payment_method,
          order:orders(
            id,
            product:products(name)
          ),
          buyer:profiles!buyer_id(full_name, email),
          farmer:profiles!farmer_id(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    staleTime: 300000,
    gcTime: 600000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // Lightweight stats query
  const statsQuery = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [productsRes, ordersRes, farmersRes, buyersRes, adminsRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'farmer'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'buyer'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin')
      ]);

      const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      return {
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalRevenue: Math.round(totalRevenue),
        activeFarmers: farmersRes.count || 0,
        activeBuyers: buyersRes.count || 0,
        admins: adminsRes.count || 0,
      };
    },
    staleTime: 600000, // 10 minutes for stats
    gcTime: 900000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // Memoized badges computation
  const badges = useMemo(() => {
    const products = productsQuery.data || [];
    const orders = ordersQuery.data || [];
    const payments = paymentsQuery.data || [];

    return {
      pendingProducts: products.filter(p => p.status === 'pending_review').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      pendingPayments: payments.filter(p => p.status === 'pending').length,
    };
  }, [productsQuery.data, ordersQuery.data, paymentsQuery.data]);

  // Manual refetch function
  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  }, [queryClient]);

  // Individual refetch functions for specific data types
  const refetchOrders = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
  }, [queryClient]);

  const refetchPayments = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
  }, [queryClient]);

  const refetchProducts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
  }, [queryClient]);

  return {
    products: productsQuery.data || [],
    orders: ordersQuery.data || [],
    payments: paymentsQuery.data || [],
    stats: statsQuery.data || {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeFarmers: 0,
      activeBuyers: 0,
      admins: 0,
    },
    badges,
    isLoading: productsQuery.isLoading || ordersQuery.isLoading || paymentsQuery.isLoading || statsQuery.isLoading,
    error: productsQuery.error || ordersQuery.error || paymentsQuery.error || statsQuery.error,
    refetch,
    refetchOrders,
    refetchPayments,
    refetchProducts,
  };
};
