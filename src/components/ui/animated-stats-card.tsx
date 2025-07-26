
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from '@/components/ui/animated-counter';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface AnimatedStatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  gradient?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
}

const AnimatedStatsCard = ({ 
  title, 
  value, 
  suffix = '', 
  prefix = '',
  icon: Icon, 
  trend,
  gradient = 'from-white via-gray-50 to-gray-100',
  className = '',
  loading = false
}: AnimatedStatsCardProps) => {
  return (
    <Card 
      className={cn(
        `bg-gradient-to-br ${gradient} border-0 shadow-lg hover:shadow-xl transition-all duration-500 group hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden relative backdrop-blur-sm`,
        className
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/90 transition-all duration-500 shadow-md border border-white/50">
            <Icon className="h-6 w-6 text-crop-green group-hover:scale-110 transition-transform duration-300" />
          </div>
          {trend && (
            <div className={cn(
              "text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 shadow-sm",
              trend.isPositive 
                ? "text-emerald-700 bg-emerald-100/80 group-hover:bg-emerald-200/80" 
                : "text-red-600 bg-red-100/80 group-hover:bg-red-200/80"
            )}>
              {trend.isPositive ? '↗' : '↘'} {trend.value}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-800 group-hover:text-crop-green transition-colors duration-300">
            {loading ? (
              <LoadingSpinner size="sm" variant="agricultural" />
            ) : (
              <AnimatedCounter 
                end={value} 
                prefix={prefix} 
                suffix={suffix}
                duration={2000}
              />
            )}
          </p>
        </div>
        
        {/* Animated bottom border */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-crop-green via-emerald-500 to-teal-600 group-hover:w-full transition-all duration-500 shadow-sm" />
      </CardContent>
    </Card>
  );
};

export default AnimatedStatsCard;
