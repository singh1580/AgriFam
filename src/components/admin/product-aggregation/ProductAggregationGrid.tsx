
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import ProductAggregationCard from './ProductAggregationCard';

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

interface ProductAggregationGridProps {
  products: AggregatedProduct[];
  onDeleteProduct: (productId: string) => void;
  deletingId: string | null;
  formatCurrency: (amount: number) => string;
  searchTerm: string;
  selectedCategory: string;
  selectedGrade: string;
}

const ProductAggregationGrid = ({
  products,
  onDeleteProduct,
  deletingId,
  formatCurrency,
  searchTerm,
  selectedCategory,
  selectedGrade
}: ProductAggregationGridProps) => {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all' || selectedGrade !== 'all'
              ? 'Try adjusting your filters to see more products.'
              : 'No products are currently available in the inventory.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductAggregationCard
          key={product.id}
          product={product}
          onDelete={onDeleteProduct}
          isDeleting={deletingId === product.id}
          formatCurrency={formatCurrency}
        />
      ))}
    </div>
  );
};

export default ProductAggregationGrid;
