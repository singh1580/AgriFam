
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  User, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Phone,
  Mail,
  Check,
  X,
  Clock,
  Truck
} from 'lucide-react';
import { format } from 'date-fns';

interface ResponsiveOrderCardProps {
  order: {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    quantity_ordered: number;
    delivery_date?: string;
    delivery_address?: string;
    tracking_id?: string;
    notes?: string;
    product?: {
      name: string;
      category: string;
      images?: string[];
    };
    buyer?: {
      full_name: string;
      email: string;
      phone?: string;
    };
  };
  onStatusUpdate?: (orderId: string, status: string) => void;
}

const ResponsiveOrderCard = ({ order, onStatusUpdate }: ResponsiveOrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <Check className="h-3 w-3" />;
      case 'confirmed': return <Clock className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'cancelled': return <X className="h-3 w-3" />;
      case 'shipped': return <Truck className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary/30">
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {order.product?.name || 'Product Name'}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {order.product?.category}
              </p>
            </div>
          </div>
          
          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 px-3 py-1`}>
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status}</span>
          </Badge>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Order ID */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 rounded">
              <Package className="h-3 w-3 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="text-sm font-medium font-mono">
                {order.id.slice(0, 8)}...
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 rounded">
              <Package className="h-3 w-3 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="text-sm font-medium">{order.quantity_ordered} units</p>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 rounded">
              <DollarSign className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-sm font-medium">₹{order.total_amount?.toLocaleString()}</p>
            </div>
          </div>

          {/* Order Date */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded">
              <Calendar className="h-3 w-3 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Order Date</p>
              <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
            </div>
          </div>

          {/* Delivery Date */}
          {order.delivery_date && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded">
                <Truck className="h-3 w-3 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Delivery Date</p>
                <p className="text-sm font-medium">{formatDate(order.delivery_date)}</p>
              </div>
            </div>
          )}

          {/* Tracking ID */}
          {order.tracking_id && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 rounded">
                <MapPin className="h-3 w-3 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tracking ID</p>
                <p className="text-sm font-medium font-mono">{order.tracking_id}</p>
              </div>
            </div>
          )}
        </div>

        {/* Buyer Information */}
        {order.buyer && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Buyer Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{order.buyer.full_name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600 truncate">{order.buyer.email}</span>
              </div>
              {order.buyer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{order.buyer.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        {order.delivery_address && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Delivery Address</span>
            </div>
            <p className="text-sm text-gray-600">{order.delivery_address}</p>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="bg-yellow-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-900">Order Notes</span>
            </div>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        {order.status === 'pending' && onStatusUpdate && (
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button 
              size="sm" 
              onClick={() => onStatusUpdate(order.id, 'confirmed')}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Confirm Order
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onStatusUpdate(order.id, 'cancelled')}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel Order
            </Button>
          </div>
        )}

        {order.status === 'confirmed' && onStatusUpdate && (
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button 
              size="sm" 
              onClick={() => onStatusUpdate(order.id, 'shipped')}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              <Truck className="h-4 w-4 mr-1" />
              Mark as Shipped
            </Button>
          </div>
        )}

        {order.status === 'shipped' && onStatusUpdate && (
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button 
              size="sm" 
              onClick={() => onStatusUpdate(order.id, 'delivered')}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark as Delivered
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsiveOrderCard;
