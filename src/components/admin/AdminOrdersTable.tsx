
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePagination } from '@/hooks/usePagination';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  quantity_ordered: number;
  product?: {
    name: string;
    category: string;
  };
  buyer?: {
    full_name: string;
    email: string;
  };
}

interface AdminOrdersTableProps {
  orders: Order[];
  onStatusUpdate?: (orderId: string, status: string) => void;
}

const AdminOrdersTable = ({ orders, onStatusUpdate }: AdminOrdersTableProps) => {
  const { 
    currentPage, 
    totalPages, 
    paginatedData, 
    goToPage, 
    nextPage, 
    prevPage,
    hasNextPage,
    hasPrevPage 
  } = usePagination({ data: orders, itemsPerPage: 20 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.product?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{order.product?.category}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.buyer?.full_name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{order.buyer?.email}</p>
                  </div>
                </TableCell>
                <TableCell>{order.quantity_ordered}</TableCell>
                <TableCell>₹{order.total_amount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  {order.status === 'pending' && onStatusUpdate && (
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onStatusUpdate(order.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => onStatusUpdate(order.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

export default AdminOrdersTable;
