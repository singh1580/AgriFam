
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ModernProductCardProps {
  title: string;
  subtitle?: string;
  image: string;
  badges?: Array<{
    text: string;
    variant?: 'default' | 'outline' | 'secondary';
    color?: string;
  }>;
  actions?: Array<{
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }>;
  metadata?: Array<{
    label: string;
    value: string;
    icon?: LucideIcon;
  }>;
  gradient?: string;
  className?: string;
  children?: React.ReactNode;
}

const ModernProductCard = ({
  title,
  subtitle,
  image,
  badges = [],
  actions = [],
  metadata = [],
  gradient = 'from-white to-gray-50',
  className = '',
  children
}: ModernProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        `bg-gradient-to-br ${gradient} border-0 shadow-lg transition-all duration-500 group hover:shadow-2xl hover:scale-105 overflow-hidden cursor-pointer`,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={`https://images.unsplash.com/${image}?w=400&h=300&fit=crop`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge 
              key={index}
              variant={badge.variant || 'default'} 
              className={cn(
                "backdrop-blur-sm bg-white/80 text-xs transition-all duration-300",
                badge.color && `bg-${badge.color} text-white`
              )}
            >
              {badge.text}
            </Badge>
          ))}
        </div>
        
        {/* Action Buttons - Appear on Hover */}
        <div className={cn(
          "absolute top-4 right-4 flex flex-col gap-2 transition-all duration-500",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          {actions.map((action, index) => (
            <Button
              key={index}
              size="icon"
              variant={action.variant || 'outline'}
              className="backdrop-blur-sm bg-white/80 hover:bg-white hover:scale-110 transition-all duration-300"
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
      
      {/* Content Section */}
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-crop-green transition-colors duration-300">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        
        {/* Metadata */}
        {metadata.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {metadata.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {children}
        
        {/* Animated Bottom Border */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-crop-green to-harvest-yellow group-hover:w-full transition-all duration-500" />
      </CardContent>
    </Card>
  );
};

export default ModernProductCard;
