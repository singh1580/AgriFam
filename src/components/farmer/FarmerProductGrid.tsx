
import React from 'react';
import ProductCard from './ProductCard';
import FloatingActionButton from '@/components/ui/floating-action-button';
import { Plus, Package, BarChart3, FileText } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: string;
  submittedPrice: string;
  quality: string;
  status: 'submitted' | 'admin_review' | 'approved' | 'scheduled_collection' | 'collected' | 'payment_processed' | 'rejected';
  submittedDate: string;
  expectedPayment?: string;
  collectionDate?: string;
  adminNotes?: string;
  quantityUnit?: string;
  location?: string;
}

interface FarmerProductGridProps {
  products: Product[];
}

const FarmerProductGrid = ({ products }: FarmerProductGridProps) => {
  const floatingActions = [
    {
      icon: Package,
      label: 'Add Product',
      onClick: () => console.log('Add product'),
      color: 'crop-green'
    },
    {
      icon: BarChart3,
      label: 'View Analytics',
      onClick: () => console.log('View analytics'),
      color: 'sky-blue'
    },
    {
      icon: FileText,
      label: 'Generate Report',
      onClick: () => console.log('Generate report'),
      color: 'harvest-yellow'
    }
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Products</h2>
          <p className="text-muted-foreground">Manage and track your product listings</p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{products.length}</span> products total
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-crop-green/20 to-harvest-yellow/20 rounded-full flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-crop-green" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-6">Start by adding your first product to the marketplace</p>
          <button className="bg-crop-green text-white px-6 py-3 rounded-lg hover:bg-crop-green/90 transition-colors duration-300">
            Add Your First Product
          </button>
        </div>
      )}

      <FloatingActionButton
        icon={Plus}
        actions={floatingActions}
      />
    </div>
  );
};

export default FarmerProductGrid;
