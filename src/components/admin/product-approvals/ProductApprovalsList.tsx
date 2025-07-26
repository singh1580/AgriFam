
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import EnhancedProductApprovalCard from './EnhancedProductApprovalCard';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity_available: number;
  quantity_unit: string;
  price_per_unit: number;
  quality_grade: string;
  status: string;
  created_at: string;
  harvest_date?: string;
  expiry_date?: string;
  description?: string;
  images?: string[];
  location?: string;
  organic_certified?: boolean;
  farmer?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

interface ProductApprovalsListProps {
  products: Product[];
  selectedItems: Set<string>;
  onToggleItem: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  adminNotes: { [key: string]: string };
  onNoteChange: (id: string, note: string) => void;
  isUpdating: boolean;
}

const ProductApprovalsList = ({
  products,
  selectedItems,
  onToggleItem,
  onApprove,
  onReject,
  adminNotes,
  onNoteChange,
  isUpdating
}: ProductApprovalsListProps) => {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Pending Review</h3>
          <p className="text-gray-600">All submitted products have been reviewed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <EnhancedProductApprovalCard
          key={product.id}
          product={product}
          isSelected={selectedItems.has(product.id)}
          onToggleSelect={onToggleItem}
          onApprove={onApprove}
          onReject={onReject}
          adminNote={adminNotes[product.id] || ''}
          onNoteChange={onNoteChange}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
};

export default ProductApprovalsList;
