
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Debounce hook for search and filters
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for scroll events
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRan = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Memoized data processing
export const useMemoizedData = <T, R>(
  data: T[],
  processor: (data: T[]) => R,
  dependencies: any[] = []
): R => {
  return useMemo(() => processor(data), [data, ...dependencies]);
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount
  );

  const visibleItems = useMemo(() => {
    return Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);
  }, [startIndex, endIndex]);

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight: itemCount * itemHeight,
    offsetY: startIndex * itemHeight,
    onScroll: (e: React.UIEvent<HTMLElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
};

// Performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Only log in development and for significant performance issues
      if (process.env.NODE_ENV === 'development' && renderTime > 50) {
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    };
  });
};
