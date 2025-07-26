
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Download, Edit } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import BulkActionsToolbar from '../BulkActionsToolbar';

interface AggregatedProduct {
  id: string;
  product_name: string;
  category: string;
  total_quantity: number;
  standard_price: number;
  quality_grade: string;
  farmer_count: number;
  regions: string[];
  quantity_unit: string;
}

interface ProductAggregationBulkActionsProps {
  products: AggregatedProduct[];
  selectedItems: Set<string>;
  onToggleAll: (products: AggregatedProduct[]) => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkExport?: () => void;
  isDeleting: boolean;
}

const ProductAggregationBulkActions = ({
  products,
  selectedItems,
  onToggleAll,
  onClearSelection,
  onBulkDelete,
  onBulkExport,
  isDeleting
}: ProductAggregationBulkActionsProps) => {
  const selectionCount = selectedItems.size;

  return (
    <>
      {/* Bulk Selection Header */}
      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg gap-4">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectionCount === products.length && products.length > 0}
              onCheckedChange={() => onToggleAll(products)}
            />
            <span className="text-sm font-medium text-gray-700">
              Select all products ({products.length})
            </span>
          </div>
          
          {selectionCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-blue-600 font-medium">
                {selectionCount} selected
              </span>
              
              {onBulkExport && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onBulkExport}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {isDeleting ? 'Deleting...' : 'Delete Selected'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Products</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectionCount} selected products from the inventory? 
                      This action cannot be undone and will remove these products from the buyer marketplace.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={onBulkDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete {selectionCount} Products
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      )}

      {/* Bulk Actions Toolbar for smaller screens */}
      <BulkActionsToolbar 
        selectedCount={selectionCount} 
        onClearSelection={onClearSelection}
      >
        {onBulkExport && (
          <Button
            onClick={onBulkExport}
            size="sm"
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete Selected'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Selected Products</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectionCount} selected products? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onBulkDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Products
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </BulkActionsToolbar>
    </>
  );
};

export default ProductAggregationBulkActions;
