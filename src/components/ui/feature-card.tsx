
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string;
  className?: string;
  interactive?: boolean;
}

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  gradient = 'from-white to-gray-50',
  className = '',
  interactive = true
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        `bg-gradient-to-br ${gradient} border-0 shadow-lg transition-all duration-500 group cursor-pointer glass`,
        interactive && 'hover:shadow-2xl hover:scale-105 hover:-translate-y-3',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-8 relative overflow-hidden">
        {/* Animated background overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-crop-green/5 via-transparent to-harvest-yellow/5 opacity-0 transition-opacity duration-500",
          isHovered && "opacity-100"
        )} />
        
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <div className={cn(
            "p-5 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-500 modern-button",
            isHovered && "scale-110 bg-white/90 shadow-xl"
          )}>
            <Icon className={cn(
              "h-8 w-8 text-crop-green transition-all duration-500",
              isHovered && "scale-110 text-harvest-yellow"
            )} />
          </div>
          
          <h3 className={cn(
            "text-xl font-bold text-foreground transition-all duration-300",
            isHovered && "text-crop-green"
          )}>
            {title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed text-center">
            {description}
          </p>
          
          {/* Animated bottom accent */}
          <div className={cn(
            "w-12 h-1 bg-gradient-to-r from-crop-green to-harvest-yellow transition-all duration-500 opacity-0 rounded-full",
            isHovered && "opacity-100 w-20"
          )} />
        </div>

        {/* Shine effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-1000",
          isHovered && "translate-x-full"
        )} />
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
