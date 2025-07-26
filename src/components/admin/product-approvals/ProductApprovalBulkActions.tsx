
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X } from 'lucide-react';
import BulkActionsToolbar from '../BulkActionsToolbar';

interface ProductApprovalBulkActionsProps {
  products: any[];
  selectedItems: Set<string>;
  onToggleAll: (products: any[]) => void;
  onClearSelection: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  isUpdating: boolean;
}

const ProductApprovalBulkActions = ({
  products,
  selectedItems,
  onToggleAll,
  onClearSelection,
  onBulkApprove,
  onBulkReject,
  isUpdating
}: ProductApprovalBulkActionsProps) => {
  const selectionCount = selectedItems.size;

  return (
    <>
      {/* Bulk Selection Header */}
      {products.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectionCount === products.length}
              onCheckedChange={() => onToggleAll(products)}
            />
            <span className="text-sm font-medium text-gray-700">
              Select all products ({products.length})
            </span>
          </div>
          {selectionCount > 0 && (
            <span className="text-sm text-blue-600">
              {selectionCount} selected
            </span>
          )}
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar 
        selectedCount={selectionCount} 
        onClearSelection={onClearSelection}
      >
        <Button
          onClick={onBulkApprove}
          disabled={isUpdating}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="h-4 w-4 mr-1" />
          Approve Selected
        </Button>
        <Button
          onClick={onBulkReject}
          disabled={isUpdating}
          variant="destructive"
        >
          <X className="h-4 w-4 mr-1" />
          Reject Selected
        </Button>
      </BulkActionsToolbar>
    </>
  );
};

export default ProductApprovalBulkActions;
