
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Package } from 'lucide-react';
import { FarmerProduct, getStatusInfo } from '@/types/farmer';

interface ProductCardProps {
  product: FarmerProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const statusInfo = getStatusInfo(product.status);
  
  // Determine the correct badge text based on status
  const getBadgeText = (status: FarmerProduct['status']) => {
    switch (status) {
      case 'payment_processed':
        return 'Payment Received';
      case 'collected':
        return 'Collected';
      case 'scheduled_collection':
        return 'Collection Scheduled';
      case 'approved':
        return 'Approved';
      case 'admin_review':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      case 'submitted':
        return 'Submitted';
      default:
        return status;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
            </div>
            <Badge className={`${statusInfo.color} border shadow-sm`}>
              {getBadgeText(product.status)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Quantity:</span>
              </div>
              <p className="font-medium">{product.quantity} {product.quantityUnit || 'tons'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Price:</span>
              </div>
              <p className="font-medium">₹{product.submittedPrice}/unit</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Location:</span>
            </div>
            <p className="text-sm font-medium">{product.location || 'Not specified'}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Submitted:</span>
            </div>
            <p className="text-sm">{new Date(product.submittedDate).toLocaleDateString('en-IN')}</p>
          </div>

          {product.collectionDate && (
            <div className="space-y-2 p-3 bg-sky-blue/10 rounded-lg border border-sky-blue/20">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-sky-blue" />
                <span className="text-sm font-medium text-sky-blue">Collection Date:</span>
              </div>
              <p className="text-sm text-sky-blue">
                {new Date(product.collectionDate).toLocaleDateString('en-IN')}
              </p>
            </div>
          )}

          {product.expectedPayment && product.status === 'payment_processed' && (
            <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-700">Payment Received:</span>
              </div>
              <p className="text-lg font-bold text-green-700">₹{product.expectedPayment}</p>
            </div>
          )}

          {product.adminNotes && (
            <div className="space-y-2 p-3 bg-harvest-yellow/10 rounded-lg border border-harvest-yellow/20">
              <span className="text-sm font-medium text-harvest-yellow">Admin Notes:</span>
              <p className="text-sm text-gray-700">{product.adminNotes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
