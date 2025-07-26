
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChip {
  id: string;
  label: string;
  value: string;
  color?: string;
}

interface InteractiveSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  filters?: FilterChip[];
  onFilterRemove?: (filterId: string) => void;
  onFilterClick?: () => void;
  className?: string;
}

const InteractiveSearch = ({
  placeholder = "Search...",
  value,
  onChange,
  filters = [],
  onFilterRemove,
  onFilterClick,
  className = ''
}: InteractiveSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className={cn(
        "relative transition-all duration-300",
        isFocused && "scale-105"
      )}>
        <Search className={cn(
          "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300",
          isFocused ? "text-crop-green" : "text-muted-foreground"
        )} />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-12 pr-12 h-12 text-base transition-all duration-300 border-2",
            isFocused 
              ? "border-crop-green shadow-lg shadow-crop-green/20" 
              : "border-border hover:border-crop-green/50"
          )}
        />
        {onFilterClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onFilterClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-crop-green/10"
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Filter Chips */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {filters.map((filter, index) => (
            <Badge
              key={filter.id}
              variant="outline"
              className={cn(
                "flex items-center gap-2 px-3 py-1 transition-all duration-300 hover:scale-105 cursor-pointer",
                filter.color ? `border-${filter.color} text-${filter.color}` : "border-crop-green text-crop-green",
                "animate-scale-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {filter.label}
              {onFilterRemove && (
                <X 
                  className="h-3 w-3 hover:text-red-500 transition-colors duration-200" 
                  onClick={() => onFilterRemove(filter.id)}
                />
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractiveSearch;
