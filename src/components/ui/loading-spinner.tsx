
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'agricultural';
  className?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (variant === 'agricultural') {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 border-2 border-crop-green/20 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-crop-green border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border border-harvest-yellow/50 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "border-2 border-muted border-t-crop-green rounded-full animate-spin",
      sizeClasses[size],
      className
    )} />
  );
};

export default LoadingSpinner;
