
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, Check, X, Eye, Clock, CheckSquare } from 'lucide-react';
import { useOptimizedAdminData } from '@/hooks/useOptimizedAdminData';
import { useAdminActions } from '@/hooks/useAdminActions';
import { useBulkActions } from '@/hooks/useBulkActions';
import BulkActionsToolbar from './BulkActionsToolbar';
import { format } from 'date-fns';

const AdminProductApprovalsGrid = () => {
  const { products, isLoading } = useOptimizedAdminData();
  const { 
    handleApproveProduct, 
    handleRejectProduct, 
    handleBulkApproveProducts,
    handleBulkRejectProducts,
    processingId 
  } = useAdminActions();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState<{ [key: string]: string }>({});
  const [bulkRejectionNotes, setBulkRejectionNotes] = useState('');

  const pendingProducts = products.filter(p => 
    p.status === 'pending_review' || p.status === 'admin_review'
  );

  const {
    selectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    isItemSelected,
    getSelectedItems,
    hasSelection,
    selectionCount
  } = useBulkActions();

  const selectedProducts = getSelectedItems(pendingProducts);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'admin_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReject = async (productId: string) => {
    const notes = rejectionNotes[productId];
    if (!notes?.trim()) {
      return;
    }
    await handleRejectProduct(productId, notes);
    setRejectionNotes(prev => ({ ...prev, [productId]: '' }));
  };

  const handleBulkApprove = async () => {
    const productIds = selectedProducts.map(p => p.id);
    await handleBulkApproveProducts(productIds);
    clearSelection();
  };

  const handleBulkReject = async () => {
    if (!bulkRejectionNotes.trim()) return;
    const productIds = selectedProducts.map(p => p.id);
    await handleBulkRejectProducts(productIds, bulkRejectionNotes);
    setBulkRejectionNotes('');
    clearSelection();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-crop-green" />
            <span>Product Approvals</span>
            <Badge variant="secondary">
              {pendingProducts.length} pending
            </Badge>
          </CardTitle>
          
          {pendingProducts.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectionCount === pendingProducts.length}
                onCheckedChange={() => toggleAll(pendingProducts)}
              />
              <span className="text-sm text-gray-600">Select all</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <BulkActionsToolbar 
          selectedCount={selectionCount} 
          onClearSelection={clearSelection}
        >
          <Button
            onClick={handleBulkApprove}
            disabled={processingId === 'bulk'}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Check className="h-4 w-4 mr-1" />
            Approve Selected
          </Button>
          
          <div className="flex items-center space-x-2">
            <Textarea
              value={bulkRejectionNotes}
              onChange={(e) => setBulkRejectionNotes(e.target.value)}
              placeholder="Rejection notes for selected products..."
              className="w-48 h-8"
              rows={1}
            />
            <Button
              onClick={handleBulkReject}
              disabled={processingId === 'bulk' || !bulkRejectionNotes.trim()}
              variant="destructive"
              size="sm"
            >
              <X className="h-4 w-4 mr-1" />
              Reject Selected
            </Button>
          </div>
        </BulkActionsToolbar>

        {pendingProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products pending approval</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={isItemSelected(product.id)}
                      onCheckedChange={() => toggleItem(product.id)}
                      className="mt-1"
                    />
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-4">
                        <h4 className="font-semibold text-lg">{product.name}</h4>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Category:</span>
                          <p className="capitalize">{product.category}</p>
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>
                          <p>{product.quantity_available} {product.quantity_unit || 'units'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Price:</span>
                          <p>₹{product.price_per_unit}/{product.quantity_unit || 'unit'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Quality:</span>
                          <p>{product.quality_grade || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Farmer:</span>
                        <span className="ml-1">{product.farmer?.full_name}</span>
                        <span className="ml-4 font-medium">Submitted:</span>
                        <span className="ml-1">{format(new Date(product.created_at), 'MMM dd, yyyy')}</span>
                      </div>

                      {product.description && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Description:</span>
                          <p className="mt-1">{product.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>

                    <Button
                      onClick={() => handleApproveProduct(product.id)}
                      disabled={processingId === product.id}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>

                {selectedProduct === product.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Product Details</h5>
                        {product.location && <p><span className="font-medium">Location:</span> {product.location}</p>}
                        {product.harvest_date && (
                          <p><span className="font-medium">Harvest Date:</span> {format(new Date(product.harvest_date), 'MMM dd, yyyy')}</p>
                        )}
                        <p><span className="font-medium">Organic Certified:</span> {product.organic_certified ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Farmer Info</h5>
                        <p><span className="font-medium">Email:</span> {product.farmer?.email}</p>
                        <p><span className="font-medium">Product ID:</span> {product.id.slice(-8)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rejection Notes (if rejecting):</label>
                      <Textarea
                        value={rejectionNotes[product.id] || ''}
                        onChange={(e) => setRejectionNotes(prev => ({ ...prev, [product.id]: e.target.value }))}
                        placeholder="Provide feedback for the farmer..."
                        rows={3}
                      />
                      <Button
                        onClick={() => handleReject(product.id)}
                        disabled={processingId === product.id || !rejectionNotes[product.id]?.trim()}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject with Feedback
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProductApprovalsGrid;
