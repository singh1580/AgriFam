
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DollarSign, 
  Check, 
  Clock, 
  User, 
  Package, 
  Calendar, 
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

interface ResponsivePaymentCardProps {
  payment: {
    id: string;
    status: string;
    amount: number;
    farmer_amount: number;
    platform_fee: number;
    created_at: string;
    processed_at?: string;
    transaction_id?: string;
    order?: {
      product?: {
        name: string;
      };
    };
  };
  onProcessPayment?: (paymentId: string) => void;
  onSelect?: (paymentId: string) => void;
  isSelected?: boolean;
  isProcessing?: boolean;
}

const ResponsivePaymentCard = ({ 
  payment, 
  onProcessPayment,
  onSelect,
  isSelected = false,
  isProcessing = false
}: ResponsivePaymentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid_to_farmer': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'paid_to_farmer': return <Check className="h-3 w-3" />;
      case 'completed': return <Check className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/30 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              {payment.status === 'pending' && onSelect && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelect(payment.id)}
                  className="mt-1 flex-shrink-0"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-base text-gray-900 truncate">
                    {payment.order?.product?.name || 'Product'}
                  </h4>
                  <Badge className={`${getStatusColor(payment.status)} flex items-center gap-1 flex-shrink-0 text-xs`}>
                    {getStatusIcon(payment.status)}
                    <span className="capitalize">{payment.status?.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-gray-600">Total Amount:</span>
              </div>
              <span className="font-bold text-gray-900">₹{payment.amount?.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Farmer Amount:</span>
              </div>
              <span className="font-bold text-green-800">₹{payment.farmer_amount?.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700">Platform Fee:</span>
              </div>
              <span className="font-bold text-blue-800">₹{payment.platform_fee?.toLocaleString() || '0'}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-purple-700">Created:</span>
              </div>
              <span className="font-bold text-purple-800">
                {format(new Date(payment.created_at), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>

          {/* Processing Status */}
          {payment.processed_at && (
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 text-sm">Payment Processed</span>
              </div>
              <p className="text-xs text-green-600">
                {format(new Date(payment.processed_at), 'MMM dd, yyyy HH:mm')}
              </p>
              {payment.transaction_id && (
                <p className="text-xs text-green-600 font-mono mt-1 break-all">
                  ID: {payment.transaction_id}
                </p>
              )}
            </div>
          )}

          {/* Action Button */}
          {payment.status === 'pending' && onProcessPayment && (
            <div className="pt-2 border-t">
              <Button
                onClick={() => onProcessPayment(payment.id)}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Process Payment'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsivePaymentCard;
