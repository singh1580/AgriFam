
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

interface Payment {
  id: string;
  amount: number;
  farmer_amount: number;
  status: string;
  created_at: string;
  buyer?: {
    full_name: string;
    email: string;
  };
  farmer?: {
    full_name: string;
    email: string;
  };
}

interface AdminPaymentsTableProps {
  payments: Payment[];
  onStatusUpdate?: (paymentId: string, status: string) => void;
}

const AdminPaymentsTable = ({ payments, onStatusUpdate }: AdminPaymentsTableProps) => {
  const { 
    currentPage, 
    totalPages, 
    paginatedData, 
    goToPage, 
    nextPage, 
    prevPage,
    hasNextPage,
    hasPrevPage 
  } = usePagination({ data: payments, itemsPerPage: 20 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paid_to_farmer': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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
              <TableHead>Payment ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Farmer</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Farmer Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-sm">
                  {payment.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{payment.buyer?.full_name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{payment.buyer?.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{payment.farmer?.full_name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{payment.farmer?.email}</p>
                  </div>
                </TableCell>
                <TableCell>₹{payment.amount?.toLocaleString()}</TableCell>
                <TableCell>₹{payment.farmer_amount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(payment.created_at)}</TableCell>
                <TableCell>
                  {payment.status === 'pending' && onStatusUpdate && (
                    <Button 
                      size="sm" 
                      onClick={() => onStatusUpdate(payment.id, 'paid_to_farmer')}
                    >
                      Process Payment
                    </Button>
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

export default AdminPaymentsTable;
