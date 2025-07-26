import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Check, Clock, Users, CreditCard, AlertCircle, Calendar, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';
import EnhancedPaymentTabs from './payment-management/EnhancedPaymentTabs';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PaymentErrorBoundary } from './payment-management/PaymentErrorBoundary';

const EnhancedPaymentDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  // Fetch all payments with comprehensive data
  const { data: payments = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-all-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          buyer:profiles!buyer_id(full_name, email, phone),
          farmer:profiles!farmer_id(full_name, email, phone),
          order:orders(
            id,
            quantity_ordered,
            delivery_address,
            status,
            product:products(name, category, price_per_unit, quantity_unit)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  // Process single payment
  const processPayment = async (paymentId: string) => {
    setProcessing(paymentId);
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'paid_to_farmer',
          processed_at: new Date().toISOString(),
          transaction_id: `TXN_${Date.now()}`
        })
        .eq('id', paymentId);

      if (error) throw error;

      // Get payment info for notification
      const payment = payments.find(p => p.id === paymentId);
      if (payment?.farmer_id) {
        await supabase.rpc('send_notification', {
          p_user_id: payment.farmer_id,
          p_title: 'Payment Processed',
          p_message: `Your payment of ₹${payment.farmer_amount?.toLocaleString()} has been processed.`,
          p_type: 'payment'
        });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-all-payments'] });
      toast({
        title: "Success",
        description: "Payment processed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  // Process multiple payments
  const processBulkPayments = async () => {
    if (selectedPayments.length === 0) return;
    
    setProcessing('bulk');
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'paid_to_farmer',
          processed_at: new Date().toISOString(),
          transaction_id: `BULK_TXN_${Date.now()}`
        })
        .in('id', selectedPayments);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-all-payments'] });
      setSelectedPayments([]);
      toast({
        title: "Success",
        description: `${selectedPayments.length} payments processed successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Payment data has been updated successfully.",
    });
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const completedPayments = payments.filter(p => p.status === 'paid_to_farmer' || p.status === 'completed');
  const buyerPayments = payments.filter(p => p.buyer_id);
  const collectionPayments = payments.filter(p => !p.buyer_id && p.payment_method === 'instant_collection_payment');

  // Calculate stats like collections dashboard
  const totalValue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const pendingAmount = pendingPayments.reduce((sum, payment) => sum + (payment.farmer_amount || 0), 0);
  const completedAmount = completedPayments.reduce((sum, payment) => sum + (payment.farmer_amount || 0), 0);
  const todaysPayments = payments.filter(p => {
    const today = new Date().toDateString();
    return new Date(p.created_at).toDateString() === today;
  }).length;

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
    <PaymentErrorBoundary>
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

        {/* Enhanced Payment Statistics - Like Collections Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <ResponsiveStatsCard
            title="Today's Payments"
            value={todaysPayments}
            icon={Calendar}
            gradient="from-harvest-yellow/10 to-harvest-sunshine/5"
          />
          
          <ResponsiveStatsCard
            title="Pending Amount"
            value={pendingAmount}
            prefix="₹"
            icon={Clock}
            gradient="from-sky-blue/10 to-sky-deep/5"
          />
          
          <ResponsiveStatsCard
            title="Completed Amount"
            value={completedAmount}
            prefix="₹"
            icon={Check}
            gradient="from-crop-green/10 to-crop-field/5"
          />
          
          <ResponsiveStatsCard
            title="Total Value"
            value={totalValue}
            prefix="₹"
            icon={TrendingUp}
            gradient="from-green-500/10 to-green-600/5"
          />

          <ResponsiveStatsCard
            title="Payment Types"
            value={4}
            icon={DollarSign}
            gradient="from-purple-500/10 to-purple-600/5"
          />
        </div>

        {/* Enhanced Payment Management with Fixed Layout */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-harvest-yellow" />
                <span>Enhanced Payment Management</span>
                <Badge variant="secondary">{pendingPayments.length} pending</Badge>
              </CardTitle>

              {selectedPayments.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{selectedPayments.length} selected</Badge>
                  <Button
                    onClick={processBulkPayments}
                    disabled={processing === 'bulk'}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Process Selected
                  </Button>
                  <Button
                    onClick={() => setSelectedPayments([])}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <EnhancedPaymentTabs 
              payments={payments}
              pendingPayments={pendingPayments}
              completedPayments={completedPayments}
              buyerPayments={buyerPayments}
              collectionPayments={collectionPayments}
              selectedPayments={selectedPayments}
              processing={processing}
              onToggleSelection={togglePaymentSelection}
              onProcessPayment={processPayment}
            />
          </CardContent>
        </Card>
      </div>
    </PaymentErrorBoundary>
  );
};

export default EnhancedPaymentDashboard;