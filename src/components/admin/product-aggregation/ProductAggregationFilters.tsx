
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface ProductAggregationFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  categories: string[];
  grades: string[];
}

const ProductAggregationFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedGrade,
  setSelectedGrade,
  categories,
  grades
}: ProductAggregationFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filter & Search Products</span>
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
  );
};

export default ProductAggregationFilters;
