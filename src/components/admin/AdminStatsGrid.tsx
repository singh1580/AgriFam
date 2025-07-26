
import React from 'react';
import { Package, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';
import AnimatedStatsCard from '@/components/ui/animated-stats-card';
import { useOptimizedAdminData } from '@/hooks/useOptimizedAdminData';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminStatsGrid = () => {
  const { stats, isLoading } = useOptimizedAdminData();

  const statsConfig = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      gradient: 'from-blue-50 to-blue-100',
      loading: isLoading
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: TrendingUp,
      color: 'text-green-600',
      gradient: 'from-green-50 to-green-100',
      loading: isLoading
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      prefix: '₹',
      icon: DollarSign,
      color: 'text-yellow-600',
      gradient: 'from-yellow-50 to-yellow-100',
      loading: isLoading
    },
    {
      title: 'Active Farmers',
      value: stats.activeFarmers,
      icon: Users,
      color: 'text-purple-600',
      gradient: 'from-purple-50 to-purple-100',
      loading: isLoading
    }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {statsConfig.map((stat) => (
          <AnimatedStatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            prefix={stat.prefix}
            icon={stat.icon}
            className={stat.color}
            gradient={stat.gradient}
            loading={stat.loading}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminStatsGrid;
