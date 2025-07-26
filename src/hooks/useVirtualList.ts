
import { useState, useEffect, useMemo, RefObject } from 'react';

interface UseVirtualListProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualList = ({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5
}: UseVirtualListProps) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        offsetTop: i * itemHeight,
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const totalHeight = itemCount * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return {
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
  };
};
