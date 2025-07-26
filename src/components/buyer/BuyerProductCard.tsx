
import React from 'react';
import ModernProductCard from '@/components/ui/modern-product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share, MapPin, User, CheckCircle } from 'lucide-react';

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

interface BuyerProductCardProps {
  product: Product;
}

const BuyerProductCard = ({ product }: BuyerProductCardProps) => {
  const badges = [
    ...(product.verified ? [{
      text: '✓ Verified',
      color: 'crop-green',
      variant: 'default' as const
    }] : []),
    {
      text: product.category,
      variant: 'outline' as const
    },
    {
      text: `Grade ${product.quality}`,
      color: 'harvest-yellow',
      variant: 'outline' as const
    }
  ];

  const actions = [
    {
      icon: Heart,
      label: 'Add to Wishlist',
      onClick: () => console.log('Add to wishlist', product.id),
      variant: 'outline' as const
    },
    {
      icon: Share,
      label: 'Share',
      onClick: () => console.log('Share product', product.id),
      variant: 'outline' as const
    }
  ];

  const metadata = [
    {
      label: 'Farmer',
      value: product.farmer,
      icon: User
    },
    {
      label: 'Available',
      value: product.quantity,
      icon: CheckCircle
    }
  ];

  return (
    <ModernProductCard
      title={product.name}
      image={product.image}
      badges={badges}
      actions={actions}
      metadata={metadata}
      gradient="from-white via-sky-50 to-crop-50"
    >
      <div className="space-y-4">
        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-crop-green" />
          {product.location}
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="text-sm text-muted-foreground">Price per ton</p>
            <p className="text-2xl font-bold text-crop-green">{product.price}</p>
          </div>
          
          <Button className="bg-sky-blue hover:bg-sky-deep text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Order Now
          </Button>
        </div>
      </div>
    </ModernProductCard>
  );
};

export default BuyerProductCard;
