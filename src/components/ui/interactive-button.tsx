
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InteractiveButtonProps extends ButtonProps {
  ripple?: boolean;
  glow?: boolean;
}

const InteractiveButton = ({ 
  children, 
  className = '', 
  ripple = true,
  glow = false,
  onClick,
  ...props 
}: InteractiveButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [rippleCoords, setRippleCoords] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      setRippleCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 600);
    }
    onClick?.(e);
  };

  return (
    <Button
      className={cn(
        'relative overflow-hidden transition-all duration-300 transform modern-button smooth-transition',
        'hover:scale-105 hover:shadow-xl active:scale-95',
        'focus:ring-4 focus:ring-primary/20',
        glow && 'hover:shadow-2xl hover:shadow-primary/30',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripple && isClicked && (
        <span 
          className="absolute bg-white/30 rounded-full animate-ping pointer-events-none"
          style={{
            left: rippleCoords.x - 10,
            top: rippleCoords.y - 10,
            width: '20px',
            height: '20px',
            animationDuration: '0.6s'
          }}
        />
      )}
    </Button>
  );
};

export default InteractiveButton;
