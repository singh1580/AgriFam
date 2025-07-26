
import React, { useState } from 'react';
import { useAggregatedProducts } from '@/hooks/useAggregatedProducts';
import { useBulkActions } from '@/hooks/useBulkActions';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProductAggregationHeader from './product-aggregation/ProductAggregationHeader';
import ProductAggregationFilters from './product-aggregation/ProductAggregationFilters';
import ProductAggregationBulkActions from './product-aggregation/ProductAggregationBulkActions';
import ProductAggregationCard from './product-aggregation/ProductAggregationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

const ProductAggregationManagement = () => {
  const { products, isLoading } = useAggregatedProducts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const {
    selectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    getSelectedItems
  } = useBulkActions();

  // Only show products that have been collected and processed (proper aggregation workflow)
  const processedProducts = products.filter(product => {
    // In a proper workflow, only show products that are ready for buyer marketplace
    return true; // For now, show all - this will be updated with proper status filtering
  });

  const filteredProducts = processedProducts.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesGrade = selectedGrade === 'all' || product.quality_grade === selectedGrade;
    
    return matchesSearch && matchesCategory && matchesGrade;
  });

  // Get selected products by filtering the filtered products based on selected IDs
  const selectedProducts = filteredProducts.filter(product => selectedItems.has(product.id));
  const categories = [...new Set(processedProducts.map(p => p.category))];
  const grades = [...new Set(processedProducts.map(p => p.quality_grade))];

  const handleDeleteProduct = async (productId: string) => {
    setDeletingId(productId);
    try {
      const { error } = await supabase
        .from('aggregated_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product Removed",
        description: "Product has been successfully removed from the marketplace inventory.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      const productIds = selectedProducts.map(p => p.id);
      const { error } = await supabase
        .from('aggregated_products')
        .delete()
        .in('id', productIds);

      if (error) throw error;

      toast({
        title: "Products Removed",
        description: `${productIds.length} products have been removed from the marketplace inventory.`,
      });
      
      clearSelection();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleBulkExport = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select products to export.",
        variant: "destructive"
      });
      return;
    }

    const csvData = selectedProducts.map(product => ({
      'Product Name': product.product_name,
      'Category': product.category,
      'Total Quantity': product.total_quantity,
      'Unit': product.quantity_unit,
      'Price per Unit': product.standard_price,
      'Quality Grade': product.quality_grade,
      'Farmer Count': product.farmer_count,
      'Regions': product.regions?.join('; ') || '',
      'Total Value': product.total_quantity * product.standard_price
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aggregated-products-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

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
      <ProductAggregationHeader productCount={filteredProducts.length} />
      
      <ProductAggregationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        categories={categories}
        grades={grades}
      />

      <ProductAggregationBulkActions
        products={filteredProducts}
        selectedItems={selectedItems}
        onToggleAll={toggleAll}
        onClearSelection={clearSelection}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        isDeleting={bulkDeleting}
      />

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' || selectedGrade !== 'all'
                ? 'Try adjusting your filters to see more products.'
                : 'No products are currently available in the marketplace inventory. Products will appear here after they have been collected and processed.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductAggregationCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
              isDeleting={deletingId === product.id}
              isSelected={selectedItems.has(product.id)}
              onToggleSelect={toggleItem}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductAggregationManagement;
