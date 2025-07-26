
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Phone, Eye } from 'lucide-react';
import { Order } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
  showFullDetails?: boolean;
}

const OrderCard = ({ order, onViewDetails, showFullDetails = false }: OrderCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Order #{order.id}</h3>
            <p className="text-sm text-muted-foreground">
              Ordered on {new Date(order.orderDate).toLocaleDateString('en-IN')}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-blue/20 to-crop-green/20 rounded-lg flex items-center justify-center">
            <img 
              src={`https://images.unsplash.com/${order.productImage}?auto=format&fit=crop&w=64&h=64`}
              alt={order.productName}
              className="w-12 h-12 object-cover rounded"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">{order.productName}</h4>
            <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
            <p className="text-lg font-bold text-crop-green">{order.totalPrice}</p>
          </div>
        </div>

        {showFullDetails && (
          <div className="space-y-3 pt-4 border-t border-border">
            {order.farmerName && (
              <div className="flex items-center space-x-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Farmer:</span>
                <span className="font-medium">{order.farmerName}</span>
              </div>
            )}
            
            {order.region && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Region:</span>
                <span className="font-medium">{order.region}</span>
              </div>
            )}
            
            {order.trackingId && (
              <div className="flex items-center space-x-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tracking ID:</span>
                <span className="font-medium">{order.trackingId}</span>
              </div>
            )}
            
            {order.adminContact && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Support:</span>
                <span className="font-medium">{order.adminContact}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <span>{order.status === 'delivered' ? 'Delivered on: ' : 'Expected delivery: '}</span>
            <span className="font-medium text-foreground">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(order.id)}
            className="w-full sm:w-auto"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
