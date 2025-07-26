
import React, { useEffect, useState } from 'react';
import { Package, DollarSign, Clock, CheckCircle } from 'lucide-react';
import AnimatedStatsCard from '@/components/ui/animated-stats-card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StatsData {
  totalProducts: number;
  totalRevenue: number;
  pendingReview: number;
  paymentsReceived: number;
}

const FarmerStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    totalRevenue: 0,
    pendingReview: 0,
    paymentsReceived: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Fetch products stats
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('farmer_id', user.id);

        // Fetch payments stats
        const { data: payments } = await supabase
          .from('payments')
          .select('farmer_amount, status')
          .eq('farmer_id', user.id);

        const totalProducts = products?.length || 0;
        const pendingReview = products?.filter(p => p.status === 'admin_review' || p.status === 'pending_review').length || 0;
        const totalRevenue = products?.reduce((sum, p) => sum + (p.quantity_available * p.price_per_unit), 0) || 0;
        const paymentsReceived = payments?.filter(p => p.status === 'paid_to_farmer').reduce((sum, p) => sum + p.farmer_amount, 0) || 0;

        setStats({
          totalProducts,
          totalRevenue,
          pendingReview,
          paymentsReceived
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscription for stats updates
    const channel = supabase
      .channel('farmer-stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `farmer_id=eq.${user.id}`
        },
        () => {
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `farmer_id=eq.${user.id}`
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const statsConfig = [
    { 
      title: 'Products Submitted', 
      value: stats.totalProducts, 
      icon: Package, 
      gradient: 'from-blue-50 via-sky-100 to-blue-200',
      trend: { value: '+12%', isPositive: true },
      loading
    },
    { 
      title: 'Total Expected Revenue', 
      value: stats.totalRevenue, 
      prefix: '₹',
      icon: DollarSign, 
      gradient: 'from-green-50 via-emerald-100 to-teal-200',
      trend: { value: '+8%', isPositive: true },
      loading
    },
    { 
      title: 'Pending Admin Review', 
      value: stats.pendingReview, 
      icon: Clock, 
      gradient: 'from-orange-50 via-amber-100 to-yellow-200',
      trend: { value: '-2%', isPositive: false },
      loading
    },
    { 
      title: 'Payments Received', 
      value: stats.paymentsReceived, 
      prefix: '₹',
      icon: CheckCircle, 
      gradient: 'from-purple-50 via-violet-100 to-indigo-200',
      trend: { value: '+15%', isPositive: true },
      loading
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statsConfig.map((stat) => (
        <AnimatedStatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          prefix={stat.prefix}
          icon={stat.icon}
          gradient={stat.gradient}
          trend={stat.trend}
          loading={stat.loading}
          className="hover:shadow-2xl transition-all duration-300"
        />
      ))}
    </div>
  );
};

export default FarmerStats;
