
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
  onClick?: () => void;
}

const GradientCard = ({ 
  children, 
  className = '', 
  gradient = 'from-white to-gray-50',
  hover = true,
  onClick
}: GradientCardProps) => {
  return (
    <Card 
      className={cn(
        `bg-gradient-to-br ${gradient} border-0 shadow-lg transition-all duration-300`,
        hover && 'hover:shadow-xl hover:scale-105 hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
};

export default GradientCard;
