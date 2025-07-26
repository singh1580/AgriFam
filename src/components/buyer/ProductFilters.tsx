import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InteractiveSearch from '@/components/ui/interactive-search';
import { Filter, SlidersHorizontal, Star, X } from 'lucide-react';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  clearAllFilters: () => void;
}

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedGrade,
  setSelectedGrade,
  selectedSort,
  setSelectedSort,
  clearAllFilters
}: ProductFiltersProps) => {
  const activeFilters = [
    ...(selectedCategory && selectedCategory !== 'all' ? [{ id: 'category', label: `Category: ${selectedCategory}`, value: selectedCategory }] : []),
    ...(selectedGrade && selectedGrade !== 'all' ? [{ id: 'grade', label: `Grade: ${selectedGrade}`, value: selectedGrade }] : []),
    ...(selectedSort && selectedSort !== 'relevance' ? [{ id: 'sort', label: `Sort: ${selectedSort}`, value: selectedSort }] : [])
  ];

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedGrade !== 'all' || selectedSort !== 'relevance';

  const handleFilterRemove = (filterId: string) => {
    if (filterId === 'category') setSelectedCategory('all');
    if (filterId === 'grade') setSelectedGrade('all');
    if (filterId === 'sort') setSelectedSort('relevance');
  };

  const quickFilters = [
    { label: 'Grade A', action: () => setSelectedGrade('A') },
    { label: 'Organic', action: () => setSelectedCategory('organic') },
    { label: 'Grains', action: () => setSelectedCategory('grain') },
    { label: 'Vegetables', action: () => setSelectedCategory('vegetable') }
  ];

  return (
    <Card className="mb-4 sm:mb-8 border-0 shadow-lg bg-gradient-to-r from-white via-gray-50 to-white backdrop-blur-sm">
      <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full">
            <InteractiveSearch
              placeholder="Search products, farmers, or locations..."
              value={searchTerm}
              onChange={setSearchTerm}
              filters={activeFilters}
              onFilterRemove={handleFilterRemove}
              onFilterClick={() => console.log('Open advanced filters')}
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Quick Filters - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Quick filters:</span>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter, index) => (
              <Button
                key={filter.label}
                variant="outline"
                size="sm"
                onClick={filter.action}
                className="hover:bg-crop-green/10 hover:border-crop-green transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Star className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Filter Controls - Mobile Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10 sm:h-12 border-2 hover:border-crop-green/50 transition-colors duration-300">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="grain">🌾 Grain</SelectItem>
              <SelectItem value="vegetable">🥕 Vegetable</SelectItem>
              <SelectItem value="fruit">🍎 Fruit</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="h-10 sm:h-12 border-2 hover:border-crop-green/50 transition-colors duration-300">
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="A">⭐ Grade A</SelectItem>
              <SelectItem value="B">⭐ Grade B</SelectItem>
              <SelectItem value="C">⭐ Grade C</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="h-10 sm:h-12 border-2 hover:border-crop-green/50 transition-colors duration-300">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="h-10 sm:h-12 flex items-center justify-center space-x-2 border-2 border-soil-brown/20 text-soil-brown hover:bg-soil-brown hover:text-white transition-all duration-300 hover:scale-105"
          >
            <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Advanced</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
