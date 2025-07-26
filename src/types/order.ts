
export interface Order {
  id: string;
  productName: string;
  productImage: string;
  quantity: string;
  totalPrice: string;
  orderDate: string;
  estimatedDelivery: string;
  status: 'placed' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingId?: string;
  adminContact?: string;
  farmerName?: string;
  region?: string;
}

export interface OrderTimeline {
  status: Order['status'];
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Notification {
  id: string;
  type: 'product_status' | 'order_update' | 'payment' | 'collection' | 'admin_message' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
}
