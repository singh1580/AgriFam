
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  Truck,
  CheckCircle,
  Clock,
  X,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { Order } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, isOpen, onClose }: OrderDetailsModalProps) => {
  if (!order) return null;

  const orderTimeline = [
    { status: 'placed', label: 'Order Placed', completed: true, date: order.orderDate },
    { status: 'confirmed', label: 'Order Confirmed', completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status), date: order.orderDate },
    { status: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(order.status), date: order.orderDate },
    { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.status), date: order.orderDate },
    { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered', date: order.estimatedDelivery }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                  <p className="text-muted-foreground">
                    Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <OrderStatusBadge status={order.status} />
                  <Button size="sm" variant="outline" className="text-sky-blue hover:bg-sky-blue/10">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Status
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Product Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-sky-blue/20 to-crop-green/20 rounded-lg flex items-center justify-center">
                    <img 
                      src={`https://images.unsplash.com/${order.productImage}?auto=format&fit=crop&w=80&h=80`}
                      alt={order.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{order.productName}</h3>
                    <p className="text-muted-foreground">Quantity: {order.quantity}</p>
                    <p className="text-2xl font-bold text-crop-green mt-2">{order.totalPrice}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {order.farmerName && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Farmer:</span>
                      <span className="font-medium">{order.farmerName}</span>
                    </div>
                  )}
                  
                  {order.region && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Region:</span>
                      <span className="font-medium">{order.region}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery & Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Delivery & Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {order.status === 'delivered' ? 'Delivered on:' : 'Expected Delivery:'}
                    </span>
                    <span className="font-medium">
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  
                  {order.trackingId && (
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Tracking ID:</span>
                      <Badge variant="outline" className="font-mono">
                        {order.trackingId}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Customer Support Contact - Not user's own number */}
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Customer Support:</span>
                    <a 
                      href="tel:+919876543210"
                      className="font-medium text-crop-green hover:underline"
                    >
                      +91-987-654-3210
                    </a>
                  </div>
                </div>

                {/* Real-time Tracking Status */}
                <div className="mt-4 p-3 bg-gradient-to-r from-sky-blue/10 to-crop-green/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-4 w-4 text-crop-green" />
                    <span className="font-medium text-crop-green">Live Tracking</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.status === 'delivered' 
                      ? 'Your order has been delivered successfully!'
                      : order.status === 'shipped' 
                      ? 'Your order is on its way! Expected delivery within 2-3 days.'
                      : order.status === 'processing'
                      ? 'Your order is being prepared for shipment.'
                      : order.status === 'confirmed'
                      ? 'Your order has been confirmed and will be processed soon.'
                      : order.status === 'cancelled'
                      ? 'This order has been cancelled.'
                      : 'Order status will be updated shortly.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Order Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderTimeline.map((step, index) => (
                  <div key={step.status} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-crop-green text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        step.completed ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </p>
                      {step.completed && step.date && (
                        <p className="text-sm text-muted-foreground">
                          {new Date(step.date).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                    {step.completed && (
                      <div className="text-xs text-crop-green font-medium">
                        Completed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => window.open('tel:+919876543210', '_self')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => {
                // Copy tracking ID to clipboard and show success message
                if (order.trackingId) {
                  navigator.clipboard.writeText(order.trackingId).then(() => {
                    const toast = document.createElement('div');
                    toast.className = 'fixed top-4 right-4 bg-crop-green text-white px-4 py-2 rounded-lg shadow-lg z-50';
                    toast.textContent = 'Tracking ID copied to clipboard!';
                    document.body.appendChild(toast);
                    setTimeout(() => document.body.removeChild(toast), 3000);
                  });
                } else {
                  alert('No tracking ID available for this order.');
                }
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
