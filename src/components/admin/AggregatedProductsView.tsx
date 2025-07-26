
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Package, Search, Filter, MapPin, Users, Star } from 'lucide-react';
import { useAggregatedProducts } from '@/hooks/useAggregatedProducts';
import LoadingSpinner from '@/components/ui/loading-spinner';
import GradientCard from '@/components/ui/gradient-card';

interface AggregatedProductsViewProps {
  onBack: () => void;
}

const AggregatedProductsView = ({ onBack }: AggregatedProductsViewProps) => {
  const { products, isLoading } = useAggregatedProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesGrade = selectedGrade === 'all' || product.quality_grade === selectedGrade;
    
    return matchesSearch && matchesCategory && matchesGrade;
  });

  const categories = [...new Set(products.map(p => p.category))];
  const grades = [...new Set(products.map(p => p.quality_grade))];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="agricultural" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Products Inventory</h2>
            <p className="text-gray-600">Manage all aggregated products systematically</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {filteredProducts.length} Products Available
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Products</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Quality Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <GradientCard key={product.id} gradient="from-white to-blue-50/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Product Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{product.product_name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant="outline" className="border-crop-green/30 text-crop-green">
                      Grade {product.quality_grade}
                    </Badge>
                    {product.admin_certified && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Certified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Product Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-crop-green">
                      {product.total_quantity}
                    </div>
                    <div className="text-sm text-gray-600">{product.quantity_unit}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-harvest-yellow">
                      {formatCurrency(product.standard_price)}
                    </div>
                    <div className="text-sm text-gray-600">per {product.quantity_unit}</div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{product.farmer_count} Farmers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{product.regions?.slice(0, 2).join(', ')}{product.regions && product.regions.length > 2 ? '...' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>Total Value: {formatCurrency(product.total_quantity * product.standard_price)}</span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1 bg-crop-green hover:bg-crop-green/90">
                    Manage Stock
                  </Button>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all' || selectedGrade !== 'all'
              ? 'Try adjusting your filters to see more products.'
              : 'No products are currently available in the inventory.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AggregatedProductsView;
