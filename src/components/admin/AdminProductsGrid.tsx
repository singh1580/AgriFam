
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VirtualList } from '@/components/ui/virtual-list';
import { usePagination } from '@/hooks/usePagination';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  price_per_unit: number;
  quantity_available: number;
  created_at: string;
  farmer?: {
    full_name: string;
    email: string;
  };
}

interface AdminProductsGridProps {
  products: Product[];
  onStatusUpdate?: (productId: string, status: string) => void;
}

const AdminProductsGrid = ({ products, onStatusUpdate }: AdminProductsGridProps) => {
  const { 
    currentPage, 
    totalPages, 
    paginatedData, 
    goToPage, 
    nextPage, 
    prevPage,
    hasNextPage,
    hasPrevPage 
  } = usePagination({ data: products, itemsPerPage: 12 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProductCard = (product: Product) => (
    <Card key={product.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate">{product.name}</CardTitle>
          <Badge className={getStatusColor(product.status)}>
            {product.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{product.category}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Price:</span>
            <p>₹{product.price_per_unit}/unit</p>
          </div>
          <div>
            <span className="font-medium">Quantity:</span>
            <p>{product.quantity_available} units</p>
          </div>
        </div>
        
        {product.farmer && (
          <div className="text-sm">
            <span className="font-medium">Farmer:</span>
            <p>{product.farmer.full_name}</p>
          </div>
        )}

        {product.status === 'pending_review' && onStatusUpdate && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              onClick={() => onStatusUpdate(product.id, 'approved')}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onStatusUpdate(product.id, 'rejected')}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedData.map(renderProductCard)}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={prevPage}
                className={!hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => goToPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={nextPage}
                className={!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminProductsGrid;
