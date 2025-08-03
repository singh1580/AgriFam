import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'agricultural';
  className?: string;
  text?: string;
}

const OptimizedLoading = memo(({ 
  size = 'md', 
  variant = 'default',
  className = '',
  text
}: OptimizedLoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerSizeClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  if (variant === 'agricultural') {
    return (
      <div className={cn("flex flex-col items-center justify-center", containerSizeClasses[size], className)}>
        <div className={cn("relative", sizeClasses[size])}>
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border border-accent/50 rounded-full animate-pulse"></div>
        </div>
        {text && (
          <span className="text-sm text-muted-foreground animate-pulse">{text}</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", containerSizeClasses[size], className)}>
      <div className={cn(
        "border-2 border-muted border-t-primary rounded-full animate-spin",
        sizeClasses[size]
      )} />
      {text && (
        <span className="text-sm text-muted-foreground animate-pulse">{text}</span>
      )}
    </div>
  );
});

OptimizedLoading.displayName = 'OptimizedLoading';

export default OptimizedLoading;