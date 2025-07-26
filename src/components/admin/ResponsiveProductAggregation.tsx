
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Users, Star, MapPin, Combine, CheckCircle, Edit, TrendingUp, DollarSign } from 'lucide-react';
import { useAggregatedProducts } from '@/hooks/useProductsData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AggregatedProduct {
  id: string;
  product_name: string;
  category: string;
  total_quantity: number;
  quality_grade: string;
  standard_price: number;
  farmer_count: number;
  regions: string[];
  admin_certified: boolean;
  quality_assured: boolean;
  quantity_unit: string;
  created_at: string;
  updated_at: string;
}

const ResponsiveProductAggregation = () => {
  const { data: aggregatedProducts = [], refetch } = useAggregatedProducts();
  const [editingProduct, setEditingProduct] = useState<AggregatedProduct | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePrice = async (productId: string) => {
    if (!newPrice || isNaN(Number(newPrice))) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('aggregated_products')
        .update({ 
          standard_price: Number(newPrice),
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Price updated successfully');
      setEditingProduct(null);
      setNewPrice('');
      refetch();
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Failed to update price');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManageInventory = async (productId: string) => {
    if (!newQuantity || isNaN(Number(newQuantity))) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('aggregated_products')
        .update({ 
          total_quantity: Number(newQuantity),
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Inventory updated successfully');
      setEditingProduct(null);
      setNewQuantity('');
      refetch();
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast.error('Failed to update inventory');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Product Aggregation Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage aggregated products for buyers
          </p>
        </div>
        <Badge variant="secondary" className="self-start sm:self-center bg-blue-100 text-blue-800">
          {aggregatedProducts.length} aggregated products
        </Badge>
      </div>

      {/* Aggregated Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {aggregatedProducts.map((product) => (
          <Card key={product.id} className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold text-blue-900 leading-tight">
                    {product.product_name}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Grade {product.quality_grade}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                    {product.farmer_count} farmers
                  </Badge>
                  {product.admin_certified && (
                    <Badge className="bg-green-500 text-white text-xs">
                      ✓ Certified
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-600">Available</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {product.total_quantity} {product.quantity_unit}
                    </p>
                  </div>
                  
                  <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-gray-600">Price</span>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      ₹{product.standard_price?.toLocaleString()}/{product.quantity_unit}
                    </p>
                  </div>
                </div>

                {/* Regions */}
                <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-gray-600">Regions</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.regions?.map((region, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-700">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                          setEditingProduct(product);
                          setNewPrice(product.standard_price?.toString() || '');
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Update Price
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Update Price - {product.product_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            New Price (₹ per {product.quantity_unit})
                          </label>
                          <Input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="Enter new price"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUpdatePrice(product.id)}
                            disabled={isUpdating}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            {isUpdating ? 'Updating...' : 'Update Price'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingProduct(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setEditingProduct(product);
                          setNewQuantity(product.total_quantity?.toString() || '');
                        }}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Manage Inventory
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Manage Inventory - {product.product_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            New Quantity ({product.quantity_unit})
                          </label>
                          <Input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(e.target.value)}
                            placeholder="Enter new quantity"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleManageInventory(product.id)}
                            disabled={isUpdating}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {isUpdating ? 'Updating...' : 'Update Inventory'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingProduct(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {aggregatedProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Aggregated Products</h3>
            <p className="text-gray-600 mb-4">
              Aggregated products will appear here once farmers submit products for aggregation.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponsiveProductAggregation;
