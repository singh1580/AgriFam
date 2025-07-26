
import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  className = '' 
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
