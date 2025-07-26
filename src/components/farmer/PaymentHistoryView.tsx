
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Package } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentItem {
  id: string;
  amount: number;
  farmer_amount: number;
  platform_fee: number;
  status: string;
  processed_at: string;
  created_at: string;
  payment_method?: string;
  transaction_id?: string;
  order: {
    product: {
      name: string;
      quantity_available: number;
      quantity_unit: string;
    };
    quantity_ordered: number;
  };
}

const PaymentHistoryView = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          order:orders!inner(
            quantity_ordered,
            product:products!inner(
              name,
              quantity_available,
              quantity_unit
            )
          )
        `)
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
      } else {
        setPayments(data || []);
        const total = data?.reduce((sum, payment) => 
          sum + (payment.status === 'paid_to_farmer' ? payment.farmer_amount : 0), 0
        ) || 0;
        setTotalEarnings(total);
      }
      setLoading(false);
    };

    fetchPayments();

    // Set up real-time subscription
    const channel = supabase
      .channel('payment-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `farmer_id=eq.${user.id}`
        },
        () => {
          fetchPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-crop-green/10 to-harvest-yellow/10 border-crop-green/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Total Earnings</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-crop-green to-harvest-yellow bg-clip-text text-transparent">
                ₹{totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-crop-green to-harvest-yellow rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-crop-green" />
            <span>Payment History</span>
            <Badge variant="secondary" className="bg-crop-green/20 text-crop-green">
              {payments.length} transactions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payments received yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {payment.order.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {payment.order.quantity_ordered} {payment.order.product.quantity_unit} sold
                      </p>
                    </div>
                    <Badge 
                      variant={payment.status === 'paid_to_farmer' ? 'default' : 'secondary'}
                      className={payment.status === 'paid_to_farmer' ? 'bg-crop-green text-white' : 'bg-harvest-yellow text-white'}
                    >
                      {payment.status === 'paid_to_farmer' ? 'Payment Received' : 'Payment Pending'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Your Earnings:</span>
                      <p className="font-semibold text-crop-green">
                        ₹{payment.farmer_amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Platform Fee:</span>
                      <p className="font-semibold">₹{payment.platform_fee.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Method:</span>
                      <p className="font-semibold">{payment.payment_method || 'Instant Transfer'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {payment.processed_at 
                          ? format(new Date(payment.processed_at), 'MMM dd, yyyy')
                          : format(new Date(payment.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    {payment.transaction_id && (
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>ID: {payment.transaction_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistoryView;
