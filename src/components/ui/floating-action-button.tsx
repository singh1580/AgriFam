
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon, Plus } from 'lucide-react';

interface FloatingAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  icon?: LucideIcon;
  actions?: FloatingAction[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FloatingActionButton = ({
  icon: MainIcon = Plus,
  actions = [],
  className = '',
  size = 'md'
}: FloatingActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-14 w-14',
    lg: 'h-16 w-16'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7'
  };

  return (
    <div className={cn("fixed bottom-8 right-8 z-50", className)}>
      {/* Secondary Actions */}
      {actions.length > 0 && (
        <div className={cn(
          "flex flex-col items-end space-y-3 mb-4 transition-all duration-300",
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}>
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="bg-black/80 text-white text-sm px-3 py-1 rounded-lg backdrop-blur-sm">
                {action.label}
              </span>
              <Button
                size="icon"
                onClick={action.onClick}
                className={cn(
                  "h-11 w-11 rounded-full shadow-lg hover:scale-110 transition-all duration-300",
                  action.color ? `bg-${action.color}` : "bg-white text-crop-green hover:bg-gray-50"
                )}
              >
                <action.icon className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Main FAB */}
      <Button
        size="icon"
        onClick={() => actions.length > 0 ? setIsExpanded(!isExpanded) : undefined}
        className={cn(
          sizeClasses[size],
          "rounded-full bg-crop-green hover:bg-crop-green/90 text-white shadow-2xl hover:scale-110 transition-all duration-300 relative overflow-hidden group"
        )}
      >
        {/* Ripple effect */}
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-active:scale-100 transition-transform duration-300" />
        
        <MainIcon className={cn(
          iconSizes[size],
          "transition-transform duration-300",
          isExpanded && "rotate-45"
        )} />
      </Button>
    </div>
  );
};

export default FloatingActionButton;
