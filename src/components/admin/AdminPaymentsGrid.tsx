
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Check, Clock, TrendingUp, Download, RefreshCw, User, Package, Calendar, MapPin } from 'lucide-react';
import { useOptimizedAdminData } from '@/hooks/useOptimizedAdminData';
import { useAdminActions } from '@/hooks/useAdminActions';
import { useBulkActions } from '@/hooks/useBulkActions';
import { usePaymentActions } from '@/hooks/usePaymentActions';
import BulkActionsToolbar from './BulkActionsToolbar';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';
import ResponsivePaymentCard from './payment-management/ResponsivePaymentCard';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminPaymentsGrid = () => {
  const { payments, isLoading, refetch } = useOptimizedAdminData();
  const { handleBulkProcessPayments, processingId } = useAdminActions();
  const { handleProcessPayment } = usePaymentActions();
  const { toast } = useToast();

  const {
    selectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    isItemSelected,
    getSelectedItems,
    hasSelection,
    selectionCount
  } = useBulkActions();

  // Set up real-time subscription for payments
  useEffect(() => {
    const channel = supabase
      .channel('payments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments'
        },
        (payload) => {
          console.log('Payment updated:', payload);
          refetch();
          
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Payment Updated",
              description: "Payment status has been updated in real-time.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const completedPayments = payments.filter(p => p.status === 'paid_to_farmer' || p.status === 'completed');
  const pendingAmount = pendingPayments.reduce((sum, payment) => sum + (payment.farmer_amount || 0), 0);
  const completedAmount = completedPayments.reduce((sum, payment) => sum + (payment.farmer_amount || 0), 0);

  const selectedPayments = getSelectedItems(payments.filter(p => p.status === 'pending'));

  const handleBulkProcess = async () => {
    const paymentIds = selectedPayments.map(p => p.id);
    await handleBulkProcessPayments(paymentIds);
    clearSelection();
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid_to_farmer': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'paid_to_farmer': return <Check className="h-3 w-3" />;
      case 'completed': return <Check className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Payment data has been updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Payment Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Process and track farmer payments in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <ResponsiveStatsCard
          title="Completed Payments"
          value={completedAmount}
          prefix="₹"
          icon={Check}
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
          title="Total Revenue"
          value={totalRevenue}
          prefix="₹"
          icon={TrendingUp}
          gradient="from-blue-50 to-blue-100"
        />
      </div>

      {/* Payment Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-harvest-yellow" />
              <span>Payment Management</span>
              <Badge variant="secondary">
                {pendingPayments.length} pending
              </Badge>
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {pendingPayments.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectionCount === pendingPayments.length}
                    onCheckedChange={() => toggleAll(pendingPayments)}
                  />
                  <span className="text-sm text-gray-600">Select all pending</span>
                </div>
              )}
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BulkActionsToolbar 
            selectedCount={selectionCount} 
            onClearSelection={clearSelection}
          >
            <Button
              onClick={handleBulkProcess}
              disabled={processingId === 'bulk'}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Process Selected Payments
            </Button>
          </BulkActionsToolbar>

          {payments.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payments to process</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {payments.map((payment) => (
                <ResponsivePaymentCard
                  key={payment.id}
                  payment={payment}
                  onProcessPayment={handleProcessPayment}
                  onSelect={toggleItem}
                  isSelected={isItemSelected(payment.id)}
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

export default AdminPaymentsGrid;
