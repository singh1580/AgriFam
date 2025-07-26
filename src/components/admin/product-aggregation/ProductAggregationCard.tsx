
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Users, MapPin } from 'lucide-react';
import GradientCard from '@/components/ui/gradient-card';

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

interface ProductAggregationCardProps {
  product: AggregatedProduct;
  onDelete: (productId: string) => void;
  isDeleting: boolean;
  isSelected?: boolean;
  onToggleSelect?: (productId: string) => void;
  formatCurrency: (amount: number) => string;
}

const ProductAggregationCard = ({ 
  product, 
  onDelete, 
  isDeleting,
  isSelected = false,
  onToggleSelect,
  formatCurrency 
}: ProductAggregationCardProps) => {
  return (
    <GradientCard gradient="from-white to-blue-50/30" className="relative">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{product.product_name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
            <Badge variant="outline" className="border-crop-green/30 text-crop-green">
              Grade {product.quality_grade}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-crop-green">
                {product.total_quantity}
              </div>
              <div className="text-xs text-gray-600">{product.quantity_unit} available</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-harvest-yellow">
                {formatCurrency(product.standard_price)}
              </div>
              <div className="text-xs text-gray-600">per {product.quantity_unit}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{product.farmer_count} Farmers</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{product.regions?.slice(0, 2).join(', ')}{product.regions && product.regions.length > 2 ? '...' : ''}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove "{product.product_name}" from the inventory?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(product.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Product
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </GradientCard>
  );
};

export default ProductAggregationCard;
