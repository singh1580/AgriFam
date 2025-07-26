
import React from 'react';
import { Package, ShoppingCart, Shield, MapPin, Star, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface ResponsiveAggregatedProductGridProps {
  products: AggregatedProduct[];
  onOrderProduct: (productId: string) => void;
}

const ResponsiveAggregatedProductGrid = ({ products, onOrderProduct }: ResponsiveAggregatedProductGridProps) => {
  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Quality-Assured Aggregated Products
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Curated by our admin team from verified farmers
          </p>
        </div>
        
        <Badge variant="secondary" className="self-start sm:self-center bg-blue-100 text-blue-800">
          {products.length} products available
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product, index) => (
          <Card
            key={product.id}
            className="group bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4 sm:p-6">
              {/* Product Header */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-900 transition-colors">
                    {product.product_name}
                  </h3>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Grade {product.quality_grade}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-600 text-white text-xs">
                    ✓ Admin Certified
                  </Badge>
                  <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                    {product.farmer_count} Farmers
                  </Badge>
                </div>
              </div>

              {/* Product Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>Available</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {product.total_quantity} {product.quantity_unit}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Regions</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-right">
                    {product.regions?.slice(0, 2).join(', ')}
                    {product.regions?.length > 2 && ` +${product.regions.length - 2}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Farmers</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {product.farmer_count} verified
                  </span>
                </div>
              </div>

              {/* Quality Assurance */}
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    Quality Guaranteed by Admin Team
                  </span>
                </div>
              </div>
              
              {/* Price and Action */}
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Standard Price</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    ₹{product.standard_price?.toLocaleString()}/{product.quantity_unit}
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => onOrderProduct(product.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order via Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card className="text-center py-12 sm:py-16">
          <CardContent>
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <Package className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              No aggregated products found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
              Try adjusting your filters or check back later for newly aggregated products
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponsiveAggregatedProductGrid;
