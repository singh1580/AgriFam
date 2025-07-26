
import { useCallback, useEffect, useRef } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string, threshold = 16) => {
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    
    startTimeRef.current = performance.now();
    
    return () => {
      if (startTimeRef.current) {
        const renderTime = performance.now() - startTimeRef.current;
        if (renderTime > threshold) {
          console.warn(`⚠️ ${componentName} slow render: ${renderTime.toFixed(2)}ms`);
        }
      }
    };
  });
};

// Memory leak prevention
export const useCleanupEffect = (cleanup: () => void, deps: any[] = []) => {
  useEffect(() => {
    return cleanup;
  }, deps);
};

// Optimized debounce
export const useOptimizedDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Production error logging
export const useErrorLogger = () => {
  return useCallback((error: Error, componentName: string) => {
    if (process.env.NODE_ENV === 'production') {
      // In production, you would send this to your logging service
      console.error(`Error in ${componentName}:`, error);
    } else {
      console.error(`Dev Error in ${componentName}:`, error);
    }
  }, []);
};
