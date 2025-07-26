
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Users,
  Package,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { useBuyerOrdersData } from '@/hooks/useBuyerOrdersData';
import { useOrderMutations } from '@/hooks/useOrderMutations';
import ResponsiveOrderCard from './ResponsiveOrderCard';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';
import { useToast } from '@/hooks/use-toast';

const SimpleBuyerOrderManager = () => {
  const { orders, stats, isLoading } = useBuyerOrdersData();
  const { updateOrderStatus } = useOrderMutations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled") => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      toast({
        title: "Order Updated",
        description: `Order status has been updated to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Product', 'Buyer', 'Quantity', 'Amount', 'Status', 'Date'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.product?.name || '',
        order.buyer?.full_name || '',
        order.quantity_ordered,
        order.total_amount,
        order.status,
        new Date(order.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `buyer-orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Order data has been exported successfully.",
    });
  };

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Package,
      gradient: 'from-yellow-50 to-yellow-100',
    },
    {
      title: 'Delivered Orders', 
      value: stats.deliveredOrders,
      icon: TrendingUp,
      gradient: 'from-green-50 to-green-100',
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      prefix: '₹',
      icon: DollarSign,
      gradient: 'from-purple-50 to-purple-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Buyer Order Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage and track all buyer orders
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <ResponsiveStatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            prefix={stat.prefix}
            icon={stat.icon}
            gradient={stat.gradient}
          />
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span>Order Management</span>
              <Badge variant="secondary">
                {filteredOrders.length} orders
              </Badge>
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Tabs for quick filtering */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
              <TabsTrigger value="confirmed" className="text-xs sm:text-sm">Confirmed</TabsTrigger>
              <TabsTrigger value="shipped" className="text-xs sm:text-sm">Shipped</TabsTrigger>
              <TabsTrigger value="delivered" className="text-xs sm:text-sm">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs sm:text-sm">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No orders have been placed yet'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <ResponsiveOrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleBuyerOrderManager;
