
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductApprovalHeaderProps {
  pendingCount: number;
}

const ProductApprovalHeader = ({ pendingCount }: ProductApprovalHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Product Approvals</h2>
        <p className="text-gray-600">Review and approve products submitted by farmers</p>
      </div>
      <Badge variant="secondary" className="text-lg px-4 py-2">
        {pendingCount} Pending Review
      </Badge>
    </div>
  );
};

export default ProductApprovalHeader;
