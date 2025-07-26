
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package, X } from 'lucide-react';
import { Order } from '@/types/order';
import OrderCard from './OrderCard';
import OrderDetailsModal from './OrderDetailsModal';

interface OrderTrackingSectionProps {
  activeOrders: Order[];
  onViewOrderDetails: (orderId: string) => void;
}

const OrderTrackingSection = ({ activeOrders, onViewOrderDetails }: OrderTrackingSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (orderId: string) => {
    const order = activeOrders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsDetailsModalOpen(true);
    }
    onViewOrderDetails(orderId);
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = activeOrders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.region && order.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.farmerName && order.farmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.trackingId && order.trackingId.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort orders - Fixed sorting logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        case 'oldest':
          return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        case 'amount_high': {
          const priceA = parseFloat(a.totalPrice.replace(/[₹,]/g, ''));
          const priceB = parseFloat(b.totalPrice.replace(/[₹,]/g, ''));
          return priceB - priceA;
        }
        case 'amount_low': {
          const priceA = parseFloat(a.totalPrice.replace(/[₹,]/g, ''));
          const priceB = parseFloat(b.totalPrice.replace(/[₹,]/g, ''));
          return priceA - priceB;
        }
        case 'delivery':
          return new Date(a.estimatedDelivery).getTime() - new Date(b.estimatedDelivery).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [activeOrders, searchTerm, statusFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || sortBy !== 'newest';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Active Orders</h2>
        <p className="text-muted-foreground">Track your ongoing orders and delivery status</p>
      </div>

      {/* Enhanced Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, product name, farmer, location, or tracking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 h-12 text-base"
              />
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount_high">Amount: High to Low</SelectItem>
                  <SelectItem value="amount_low">Amount: Low to High</SelectItem>
                  <SelectItem value="delivery">Delivery Date</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2 md:col-span-2">
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="flex items-center space-x-2 hover:bg-crop-green/10"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear Filters</span>
                  </Button>
                )}
                <div className="text-sm text-muted-foreground">
                  {filteredAndSortedOrders.length} of {activeOrders.length} orders
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredAndSortedOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={handleViewDetails}
            showFullDetails={true}
          />
        ))}
      </div>

      {filteredAndSortedOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-sky-blue/20 to-crop-green/20 rounded-full flex items-center justify-center mb-6">
              <Package className="h-12 w-12 text-sky-blue" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Found</h3>
            <p className="text-muted-foreground">
              {hasActiveFilters 
                ? 'No orders match your current filters'
                : 'You haven\'t placed any orders yet'
              }
            </p>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default OrderTrackingSection;
