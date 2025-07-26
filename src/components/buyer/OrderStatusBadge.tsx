
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';

interface OrderStatusBadgeProps {
  status: Order['status'];
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    placed: { label: 'Order Placed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    confirmed: { label: 'Confirmed', color: 'bg-crop-green/20 text-crop-green border-crop-green/30' },
    processing: { label: 'Processing', color: 'bg-harvest-yellow/20 text-harvest-yellow border-harvest-yellow/30' },
    shipped: { label: 'Shipped', color: 'bg-sky-blue/20 text-sky-blue border-sky-blue/30' },
    delivered: { label: 'Delivered', color: 'bg-crop-green/20 text-crop-green border-crop-green/30' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
    pending: { label: 'Pending', color: 'bg-orange-100 text-orange-800 border-orange-200' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge className={`${config.color} font-medium px-3 py-1`}>
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
