
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, DollarSign } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  children: React.ReactNode;
}

const BulkActionsToolbar = ({ selectedCount, onClearSelection, children }: BulkActionsToolbarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedCount} selected
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear selection
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;
