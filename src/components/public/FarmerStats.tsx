
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, DollarSign, Clock, CheckCircle } from 'lucide-react';

const FarmerStats = () => {
  const stats = [
    { title: 'Average Products Listed', value: '8', icon: Package, color: 'text-sky-blue' },
    { title: 'Average Monthly Revenue', value: '₹15,00,000', icon: DollarSign, color: 'text-crop-green' },
    { title: 'Order Fulfillment Rate', value: '96%', icon: CheckCircle, color: 'text-soil-brown' },
    { title: 'Time to Market', value: '2 days', icon: Clock, color: 'text-harvest-yellow' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FarmerStats;
