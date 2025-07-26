
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductAggregationHeaderProps {
  productCount: number;
}

const ProductAggregationHeader = ({ productCount }: ProductAggregationHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Product Inventory Management</h2>
        <p className="text-gray-600">Manage aggregated products ready for buyer marketplace</p>
      </div>
      <Badge variant="secondary" className="text-lg px-4 py-2">
        {productCount} Products in Inventory
      </Badge>
    </div>
  );
};

export default ProductAggregationHeader;
