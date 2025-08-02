import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveDashboardGridProps {
  children: React.ReactNode;
  className?: string;
  gridCols?: 1 | 2 | 3 | 4;
}

export const ResponsiveDashboardGrid = ({ 
  children, 
  className,
  gridCols = 3 
}: ResponsiveDashboardGridProps) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={cn(
      'grid gap-4 lg:gap-6',
      gridClasses[gridCols],
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveDashboardGrid;