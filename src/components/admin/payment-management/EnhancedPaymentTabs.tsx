import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Check, Users, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  farmer_amount: number;
  status: string;
  created_at: string;
  processed_at: string;
  transaction_id: string;
  payment_method: string;
  buyer_id: string;
  farmer_id: string;
  buyer?: {
    full_name: string;
    email: string;
  };
  farmer?: {
    full_name: string;
    email: string;
  };
  order?: {
    id: string;
    product?: {
      name: string;
      category: string;
    };
  };
}

interface EnhancedPaymentTabsProps {
  payments: Payment[];
  pendingPayments: Payment[];
  completedPayments: Payment[];
  buyerPayments: Payment[];
  collectionPayments: Payment[];
  selectedPayments: string[];
  processing: string | null;
  onToggleSelection: (paymentId: string) => void;
  onProcessPayment: (paymentId: string) => void;
}

const EnhancedPaymentTabs = ({
  payments,
  pendingPayments,
  completedPayments,
  buyerPayments,
  collectionPayments,
  selectedPayments,
  processing,
  onToggleSelection,
  onProcessPayment,
}: EnhancedPaymentTabsProps) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid_to_farmer': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const PaymentCard = ({ payment, showCheckbox = false }: { payment: Payment, showCheckbox?: boolean }) => (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {showCheckbox && (
            <Checkbox
              checked={selectedPayments.includes(payment.id)}
              onCheckedChange={() => onToggleSelection(payment.id)}
            />
          )}
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
        {payment.status === 'pending' && (
          <Button
            onClick={() => onProcessPayment(payment.id)}
            disabled={processing === payment.id}
            className="bg-green-600 hover:bg-green-700 ml-4"
            size="sm"
          >
            {processing === payment.id ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <><Check className="h-4 w-4 mr-1" />Process</>
            )}
          </Button>
        )}
        {payment.status !== 'pending' && (
          <Check className="h-5 w-5 text-green-600" />
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <Tabs defaultValue="pending" className="space-y-6">
        {/* Fixed TabsList with proper responsive behavior */}
        <div className="w-full overflow-x-auto">
          <TabsList className="grid w-full min-w-max grid-cols-5 lg:grid-cols-5 gap-1">
            <TabsTrigger value="pending" className="flex items-center space-x-2 min-w-max px-3 py-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Pending</span>
              <span className="sm:hidden">P</span>
              <span>({pendingPayments.length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center space-x-2 min-w-max px-3 py-2">
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">C</span>
              <span>({completedPayments.length})</span>
            </TabsTrigger>
            <TabsTrigger value="farmers" className="flex items-center space-x-2 min-w-max px-3 py-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Farmers</span>
              <span className="sm:hidden">F</span>
            </TabsTrigger>
            <TabsTrigger value="buyers" className="flex items-center space-x-2 min-w-max px-3 py-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Buyers</span>
              <span className="sm:hidden">B</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center space-x-2 min-w-max px-3 py-2">
              <span className="hidden sm:inline">All</span>
              <span className="sm:hidden">A</span>
              <span>({payments.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents with proper spacing */}
        <div className="mt-6">
          <TabsContent value="pending" className="space-y-4 mt-0">
            {pendingPayments.length === 0 ? (
              <div className="text-center py-8">
                <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pending payments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPayments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} showCheckbox />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-0">
            <div className="space-y-3">
              {completedPayments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="farmers" className="space-y-4 mt-0">
            <div className="space-y-3">
              {payments.filter(p => p.farmer_id).map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buyers" className="space-y-4 mt-0">
            <div className="space-y-3">
              {buyerPayments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4 mt-0">
            <div className="space-y-3">
              {payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EnhancedPaymentTabs;