import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from '@/components/ui/animated-counter';

interface ResponsiveStatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  gradient?: string;
  className?: string;
}

const ResponsiveStatsCard = ({ 
  title, 
  value, 
  suffix = '', 
  prefix = '',
  icon: Icon, 
  gradient = 'from-white to-gray-50',
  className = ''
}: ResponsiveStatsCardProps) => {
  return (
    <Card className={cn(
      `bg-gradient-to-br ${gradient} border-0 shadow-lg transition-all duration-300 group hover:shadow-xl hover:scale-105`,
      className
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 rounded-xl bg-white/50 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-crop-green" />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 truncate">{title}</p>
        <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">
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

export default ResponsiveStatsCard;