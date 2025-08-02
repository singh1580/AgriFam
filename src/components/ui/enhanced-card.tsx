import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const EnhancedCard = ({
  title,
  subtitle,
  icon,
  children,
  className,
  hover = true,
  gradient = false
}: EnhancedCardProps) => {
  return (
    <Card className={cn(
      'transition-all duration-300',
      hover && 'hover:shadow-lg hover:-translate-y-1',
      gradient && 'bg-gradient-to-br from-card to-card/80',
      className
    )}>
      {(title || icon) && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            <div className="flex flex-col">
              {title && <span>{title}</span>}
              {subtitle && (
                <span className="text-sm font-normal text-muted-foreground">
                  {subtitle}
                </span>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default EnhancedCard;