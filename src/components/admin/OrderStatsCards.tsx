
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Calendar, TrendingUp, Truck } from 'lucide-react';

interface OrderStatsCardsProps {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    deliveredOrders: number;
  };
}

const OrderStatsCards = ({ stats }: OrderStatsCardsProps) => {
  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: 'from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-200/50',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50/50',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Calendar,
      gradient: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-200/50',
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/50',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-green-500/20 to-green-600/10',
      borderColor: 'border-green-200/50',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50/50',
    },
    {
      title: 'Delivered',
      value: stats.deliveredOrders,
      icon: Truck,
      gradient: 'from-emerald-500/20 to-emerald-600/10',
      borderColor: 'border-emerald-200/50',
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-sm border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-2 rounded-lg ${stat.bgColor} backdrop-blur-sm`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrderStatsCards;
