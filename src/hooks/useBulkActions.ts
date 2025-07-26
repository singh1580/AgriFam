
import { useState, useCallback } from 'react';

export const useBulkActions = <T extends { id: string }>() => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleItem = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback((items: T[]) => {
    setSelectedItems(prev => {
      if (prev.size === items.length) {
        return new Set();
      } else {
        return new Set(items.map(item => item.id));
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const isItemSelected = useCallback((itemId: string) => {
    return selectedItems.has(itemId);
  }, [selectedItems]);

  const getSelectedItems = useCallback((items: T[]) => {
    return items.filter(item => selectedItems.has(item.id));
  }, [selectedItems]);

  return {
    selectedItems,
    isProcessing,
    setIsProcessing,
    toggleItem,
    toggleAll,
    clearSelection,
    isItemSelected,
    getSelectedItems,
    hasSelection: selectedItems.size > 0,
    selectionCount: selectedItems.size
  };
};
