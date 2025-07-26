
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  DollarSign,
  Check,
  Clock,
  X
} from 'lucide-react';
import { useOptimizedAdminData } from '@/hooks/useOptimizedAdminData';
import { usePaymentActions } from '@/hooks/usePaymentActions';
import ResponsivePaymentCard from './payment-management/ResponsivePaymentCard';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';

const FarmerPaymentManagement = () => {
  const { payments, isLoading, refetch } = useOptimizedAdminData();
  const { handleProcessPayment, processingId } = usePaymentActions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filter payments to show only farmer-related payments
  const farmerPayments = payments.filter(payment => payment.farmer);

  // Apply filters
  const filteredPayments = farmerPayments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.order?.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Calculate stats
  const totalPayments = farmerPayments.reduce((sum, payment) => sum + (payment.farmer_amount || 0), 0);
  const pendingPayments = farmerPayments.filter(p => p.status === 'pending');
  const completedPayments = farmerPayments.filter(p => p.status === 'paid_to_farmer');
  const pendingAmount = pendingPayments.reduce((sum, payment) => sum + (payment.farmer_amount || 0), 0);

  const handleExport = () => {
    const csvContent = [
      ['Payment ID', 'Product', 'Farmer Amount', 'Status', 'Date'].join(','),
      ...filteredPayments.map(payment => [
        payment.id,
        payment.order?.product?.name || '',
        payment.farmer_amount,
        payment.status,
        new Date(payment.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `farmer-payments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Farmer Payment Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Process and track payments to farmers
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ResponsiveStatsCard
          title="Total Payouts"
          value={totalPayments}
          prefix="₹"
          icon={DollarSign}
          gradient="from-green-50 to-green-100"
        />
        <ResponsiveStatsCard
          title="Pending Payments"
          value={pendingAmount}
          prefix="₹"
          icon={Clock}
          gradient="from-yellow-50 to-yellow-100"
        />
        <ResponsiveStatsCard
          title="Completed Payments"
          value={completedPayments.length}
          icon={Check}
          gradient="from-blue-50 to-blue-100"
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>Farmer Payments</span>
              <Badge variant="secondary">
                {filteredPayments.length} payments
              </Badge>
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search payments..."
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
                  <SelectItem value="paid_to_farmer">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Tabs for quick filtering */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid_to_farmer">Paid</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Payments Grid */}
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No farmer payments have been processed yet'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPayments.map((payment) => (
                <ResponsivePaymentCard
                  key={payment.id}
                  payment={payment}
                  onProcessPayment={handleProcessPayment}
                  isProcessing={processingId === payment.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerPaymentManagement;
