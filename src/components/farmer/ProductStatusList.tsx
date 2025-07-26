
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, DollarSign, Clock, CheckCircle, Upload, Truck, X } from 'lucide-react';
import GradientCard from '@/components/ui/gradient-card';
import { FarmerProduct, getStatusInfo } from '@/types/farmer';

interface ProductStatusListProps {
  products: FarmerProduct[];
}

const ProductStatusList = ({ products }: ProductStatusListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return Upload;
      case 'admin_review':
        return Clock;
      case 'approved':
        return CheckCircle;
      case 'scheduled_collection':
        return Truck;
      case 'collected':
        return Package;
      case 'payment_processed':
        return DollarSign;
      case 'rejected':
        return X;
      default:
        return Package;
    }
  };

  return (
    <GradientCard gradient="from-white to-crop-green/5">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-crop-green" />
            <span className="text-base sm:text-lg">Your Product Submissions</span>
          </div>
          <Badge variant="secondary" className="bg-crop-green/10 text-crop-green w-fit">
            {products.length} total submissions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {products.map((product) => {
            const statusInfo = getStatusInfo(product.status);
            const StatusIcon = getStatusIcon(product.status);
            
            return (
              <div key={product.id} className="bg-white rounded-xl p-4 sm:p-6 border border-border/10 shadow-sm">
                <div className="space-y-4">
                  {/* Product Info - Mobile Stacked */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <h4 className="font-bold text-base sm:text-lg">{product.name}</h4>
                        <Badge variant="outline" className={`${statusInfo.color} w-fit`}>
                          <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {statusInfo.text}
                        </Badge>
                      </div>

                      {/* Details - Mobile Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <div className="font-medium">{product.category}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <div className="font-medium">{product.quantity}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <div className="font-medium">Grade {product.quality}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected Payment:</span>
                          <div className="font-bold text-crop-green">{product.expectedPayment}</div>
                        </div>
                      </div>
                    </div>

                    {/* Status Actions - Mobile Adjusted */}
                    <div className="text-left sm:text-right space-y-2">
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Submitted: {product.submittedDate}
                      </div>
                      {product.status === 'payment_processed' && (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Payment Complete
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Collection Date - Mobile Responsive */}
                  {product.collectionDate && (
                    <div className="bg-sky-blue/5 rounded-lg p-3 text-xs sm:text-sm">
                      <span className="font-medium text-sky-blue">Collection Date: </span>
                      <span>{product.collectionDate}</span>
                    </div>
                  )}

                  {/* Admin Notes - Mobile Responsive */}
                  {product.adminNotes && (
                    <div className="bg-crop-green/5 rounded-lg p-3 text-xs sm:text-sm">
                      <span className="font-medium text-crop-green">Admin Notes: </span>
                      <span>{product.adminNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </GradientCard>
  );
};

export default ProductStatusList;
