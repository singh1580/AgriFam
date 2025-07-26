
import React, { useState } from 'react';
import ResponsiveAggregatedProductGrid from './ResponsiveAggregatedProductGrid';
import OrderDialog from './OrderDialog';

interface AggregatedProduct {
  id: string;
  product_name: string;
  category: string;
  total_quantity: number;
  standard_price: number;
  quality_grade: string;
  farmer_count: number;
  regions: string[];
  admin_certified: boolean;
  quality_assured: boolean;
  quantity_unit: string;
  image?: string;
}

interface AggregatedProductGridProps {
  products: AggregatedProduct[];
  onOrderProduct: (productId: string) => void;
}

const AggregatedProductGrid = ({ products }: AggregatedProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<AggregatedProduct | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const handleOrderProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsOrderDialogOpen(true);
    }
  };

  return (
    <>
      <ResponsiveAggregatedProductGrid 
        products={products} 
        onOrderProduct={handleOrderProduct} 
      />
      
      <OrderDialog
        isOpen={isOrderDialogOpen}
        onClose={() => {
          setIsOrderDialogOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </>
  );
};

export default AggregatedProductGrid;
