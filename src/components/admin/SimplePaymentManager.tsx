import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Check, Clock, Users, CreditCard, AlertCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const SimplePaymentManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  // Fetch all payments with comprehensive data
  const { data: payments = [], isLoading } = useQuery({
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

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const completedPayments = payments.filter(p => p.status === 'paid_to_farmer' || p.status === 'completed');
  const buyerPayments = payments.filter(p => p.buyer_id);
  const collectionPayments = payments.filter(p => !p.buyer_id && p.payment_method === 'instant_collection_payment');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid_to_farmer': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Buyer Orders</p>
                <p className="text-2xl font-bold text-blue-600">{buyerPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Collections</p>
                <p className="text-2xl font-bold text-purple-600">{collectionPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Payment Management */}
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
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="pending" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Pending</span>
                <span className="sm:hidden">P</span>
                <span>({pendingPayments.length})</span>
              </TabsTrigger>
              <TabsTrigger value="completed">
                <Check className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">C</span>
                <span>({completedPayments.length})</span>
              </TabsTrigger>
              <TabsTrigger value="farmers">
                <Users className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Farmers</span>
                <span className="sm:hidden">F</span>
              </TabsTrigger>
              <TabsTrigger value="buyers">
                <CreditCard className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Buyers</span>
                <span className="sm:hidden">B</span>
              </TabsTrigger>
              <TabsTrigger value="all">
                <span className="hidden sm:inline">All</span>
                <span className="sm:hidden">A</span>
                <span>({payments.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-3">
              {pendingPayments.length === 0 ? (
                <div className="text-center py-8">
                  <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending payments</p>
                </div>
              ) : (
                pendingPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedPayments.includes(payment.id)}
                          onCheckedChange={() => togglePaymentSelection(payment.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">
                              {payment.order?.product?.name || 'Collection Payment'}
                            </h4>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                            {payment.payment_method === 'instant_collection_payment' && (
                              <Badge variant="outline">Collection</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Farmer:</span>
                              <p>{payment.farmer?.full_name}</p>
                            </div>
                            <div>
                              <span className="font-medium">Amount:</span>
                              <p className="font-bold text-green-600">₹{payment.farmer_amount?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Date:</span>
                              <p>{format(new Date(payment.created_at), 'MMM dd, yyyy')}</p>
                            </div>
                            <div>
                              <span className="font-medium">Type:</span>
                              <p>{payment.buyer_id ? 'Order Payment' : 'Collection Payment'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => processPayment(payment.id)}
                        disabled={processing === payment.id}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {processing === payment.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <><Check className="h-4 w-4 mr-1" />Process</>
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3">
              {completedPayments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">
                          {payment.order?.product?.name || 'Collection Payment'}
                        </h4>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Farmer:</span>
                          <p>{payment.farmer?.full_name}</p>
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span>
                          <p className="font-bold text-green-600">₹{payment.farmer_amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Processed:</span>
                          <p>{payment.processed_at ? format(new Date(payment.processed_at), 'MMM dd, yyyy') : 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Transaction ID:</span>
                          <p className="font-mono text-xs">{payment.transaction_id || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="farmers" className="space-y-3">
              {payments.filter(p => p.farmer_id).map((payment) => (
                <Card key={payment.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <h4 className="font-semibold text-green-800">
                            {payment.order?.product?.name || 'Collection Payment'}
                          </h4>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-white/60 p-3 rounded-lg">
                            <span className="font-medium text-green-700">Farmer:</span>
                            <p className="font-semibold">{payment.farmer?.full_name}</p>
                            <p className="text-xs text-gray-600">{payment.farmer?.email}</p>
                          </div>
                          <div className="bg-white/60 p-3 rounded-lg">
                            <span className="font-medium text-green-700">Amount:</span>
                            <p className="font-bold text-green-600 text-lg">₹{payment.farmer_amount?.toLocaleString()}</p>
                          </div>
                          <div className="bg-white/60 p-3 rounded-lg">
                            <span className="font-medium text-green-700">Date:</span>
                            <p>{format(new Date(payment.created_at), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                      </div>
                      {payment.status === 'pending' && (
                        <Button
                          onClick={() => processPayment(payment.id)}
                          disabled={processing === payment.id}
                          className="bg-green-600 hover:bg-green-700 ml-4"
                          size="sm"
                        >
                          {processing === payment.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <><Check className="h-4 w-4 mr-1" />Pay Farmer</>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="buyers" className="space-y-3">
              {payments.filter(p => p.buyer_id).map((payment) => (
                <Card key={payment.id} className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <h4 className="font-semibold text-blue-800">
                            {payment.order?.product?.name || 'Order Payment'}
                          </h4>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-white/60 p-3 rounded-lg">
                            <span className="font-medium text-blue-700">Buyer:</span>
                            <p className="font-semibold">{payment.buyer?.full_name}</p>
                            <p className="text-xs text-gray-600">{payment.buyer?.email}</p>
                          </div>
                          <div className="bg-white/60 p-3 rounded-lg">
                            <span className="font-medium text-blue-700">Order Amount:</span>
                            <p className="font-bold text-blue-600 text-lg">₹{payment.amount?.toLocaleString()}</p>
                          </div>
                          <div className="bg-white/60 p-3 rounded-lg">
                            <span className="font-medium text-blue-700">Farmer Gets:</span>
                            <p className="font-bold text-green-600">₹{payment.farmer_amount?.toLocaleString()}</p>
                          </div>
                          <div className="bg-white/60 p-3 rounded-lg">
                            <span className="font-medium text-blue-700">Platform Fee:</span>
                            <p className="font-bold text-orange-600">₹{((payment.amount || 0) - (payment.farmer_amount || 0)).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className={`border rounded-lg p-4 ${payment.status === 'pending' ? 'hover:bg-gray-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">
                          {payment.order?.product?.name || 'Collection Payment'}
                        </h4>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status.replace('_', ' ')}
                        </Badge>
                        {payment.payment_method === 'instant_collection_payment' && (
                          <Badge variant="outline">Collection</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Farmer:</span>
                          <p>{payment.farmer?.full_name}</p>
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span>
                          <p className="font-bold text-green-600">₹{payment.farmer_amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>
                          <p>{format(new Date(payment.created_at), 'MMM dd')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>
                          <p>{payment.buyer_id ? 'Order Payment' : 'Collection'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <p className="capitalize">{payment.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplePaymentManager;