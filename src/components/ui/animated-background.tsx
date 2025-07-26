
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'gradient' | 'particles' | 'waves';
}

const AnimatedBackground = ({ 
  children, 
  className = '', 
  variant = 'gradient' 
}: AnimatedBackgroundProps) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Animated gradient background */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-crop-green/5 via-harvest-yellow/5 to-sky-blue/5 animate-pulse" />
      )}
      
      {/* Floating particles */}
      {variant === 'particles' && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 bg-crop-green/20 rounded-full animate-pulse",
                `animation-delay-${i * 500}ms`
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Wave patterns */}
      {variant === 'waves' && (
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320">
            <path
              fill="currentColor"
              fillOpacity="0.1"
              d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-pulse"
            />
          </svg>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default AnimatedBackground;
