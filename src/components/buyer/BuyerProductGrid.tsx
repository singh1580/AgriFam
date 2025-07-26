
import React from 'react';
import BuyerProductCard from './BuyerProductCard';
import { Package, Search } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  farmer: string;
  location: string;
  category: string;
  quantity: string;
  price: string;
  quality: string;
  verified: boolean;
  image: string;
}

interface BuyerProductGridProps {
  products: Product[];
}

const BuyerProductGrid = ({ products }: BuyerProductGridProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Available Products</h2>
          <p className="text-muted-foreground">Fresh produce from verified farmers</p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{products.length}</span> products found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <BuyerProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-sky-blue/20 to-crop-green/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Search className="h-12 w-12 text-sky-blue" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground/70 mb-6 max-w-md mx-auto">
            Try adjusting your search terms or filters to discover amazing products from our farmers
          </p>
          <button className="bg-crop-green text-white px-6 py-3 rounded-lg hover:bg-crop-green/90 transition-colors duration-300">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyerProductGrid;
