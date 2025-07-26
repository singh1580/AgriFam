
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Shield, MapPin } from 'lucide-react';
import ModernProductCard from '@/components/ui/modern-product-card';

interface AggregatedProduct {
  id: string;
  productName: string;
  category: string;
  totalQuantity: string;
  standardPrice: string;
  qualityGrade: string;
  farmerCount: number;
  regions: string[];
  adminCertified: boolean;
  qualityAssured: boolean;
  image: string;
}

interface AggregatedProductCardProps {
  product: AggregatedProduct;
  index: number;
  onOrderProduct: (productId: string) => void;
}

const AggregatedProductCard = ({ product, index, onOrderProduct }: AggregatedProductCardProps) => {
  const badges = [
    {
      text: '✓ Admin Certified',
      color: 'crop-green',
      variant: 'default' as const
    },
    {
      text: `${product.farmerCount} Farmers`,
      variant: 'outline' as const
    },
    {
      text: `Grade ${product.qualityGrade}`,
      color: 'harvest-yellow',
      variant: 'outline' as const
    }
  ];

  const metadata = [
    {
      label: 'Available',
      value: product.totalQuantity,
      icon: Package
    },
    {
      label: 'Regions',
      value: product.regions.join(', '),
      icon: MapPin
    }
  ];

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <ModernProductCard
        title={product.productName}
        subtitle={`Aggregated from ${product.farmerCount} verified farmers`}
        image={product.image}
        badges={badges}
        metadata={metadata}
        gradient="from-white via-sky-50 to-crop-50"
      >
        <div className="space-y-3 sm:space-y-4">
          {/* Quality Assurance Badge */}
          <div className="flex items-center justify-center p-2 sm:p-3 bg-crop-green/5 rounded-lg border border-crop-green/20">
            <div className="flex items-center space-x-2 text-crop-green">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Quality Guaranteed by Admin Team</span>
            </div>
          </div>
          
          {/* Price and Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-3 sm:pt-4 border-t border-border/50">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Standard Price</p>
              <p className="text-lg sm:text-2xl font-bold text-crop-green">{product.standardPrice}</p>
            </div>
            
            <Button 
              className="bg-sky-blue hover:bg-sky-deep text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto px-4 sm:px-6"
              onClick={() => onOrderProduct(product.id)}
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Order via Admin
            </Button>
          </div>
        </div>
      </ModernProductCard>
    </div>
  );
};

export default AggregatedProductCard;
