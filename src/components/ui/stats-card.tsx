
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from '@/components/ui/animated-counter';

interface StatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  trend?: string;
  gradient?: string;
  className?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  suffix = '', 
  prefix = '',
  icon: Icon, 
  trend,
  gradient = 'from-white to-gray-50',
  className = ''
}: StatsCardProps) => {
  return (
    <Card className={cn(
      `bg-gradient-to-br ${gradient} border-0 shadow-lg transition-all duration-300 group hover:shadow-xl hover:scale-105`,
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-white/50 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6 text-crop-green" />
          </div>
          {trend && (
            <div className="text-sm font-medium text-crop-green bg-crop-green/10 px-2 py-1 rounded-full">
              {trend}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        <p className="text-3xl font-bold text-foreground">
          <AnimatedCounter 
            end={value} 
            prefix={prefix} 
            suffix={suffix}
            duration={2000}
          />
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
