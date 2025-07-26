import { useEffect } from 'react';

interface PerformanceMonitorProps {
  componentName: string;
  threshold?: number; // ms
  onSlowRender?: (renderTime: number, componentName: string) => void;
}

export const PerformanceMonitor = ({ 
  componentName, 
  threshold = 50,
  onSlowRender 
}: PerformanceMonitorProps) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > threshold) {
        const message = `🐌 ${componentName} render took ${renderTime.toFixed(2)}ms`;
        console.warn(message);
        onSlowRender?.(renderTime, componentName);
      }
    };
  });

  return null;
};

export const usePerformanceMonitor = (
  componentName: string, 
  threshold = 50
) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > threshold) {
        console.warn(`🐌 ${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    };
  });
};