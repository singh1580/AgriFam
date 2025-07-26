
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Activity, ShoppingCart, Package, CreditCard, FileText, User } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
}

const UserActivityModal = ({ isOpen, onClose, userId, userName }: UserActivityModalProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUserActivity = async () => {
    if (!userId || !isOpen) return;
    
    setIsLoading(true);
    try {
      // Fetch user's products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch user's orders (as buyer)
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch user's payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .or(`buyer_id.eq.${userId},farmer_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch user's notifications
      const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (productsError || ordersError || paymentsError || notificationsError) {
        console.error('Error fetching activity:', { productsError, ordersError, paymentsError, notificationsError });
      }

      // Combine all activities
      const allActivities: ActivityItem[] = [];

      // Add product activities
      products?.forEach(product => {
        allActivities.push({
          id: `product-${product.id}`,
          type: 'product',
          description: `${product.status === 'approved' ? 'Approved' : 'Submitted'} product: ${product.name} - ${product.quantity_available} ${product.quantity_unit} at ₹${product.price_per_unit}/${product.quantity_unit} (${product.category})`,
          timestamp: product.created_at,
          icon: Package,
          color: product.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        });
      });

      // Add order activities
      orders?.forEach(order => {
        allActivities.push({
          id: `order-${order.id}`,
          type: 'order',
          description: `Placed order #${order.id.slice(0, 8)} - ₹${order.total_amount} for ${order.quantity_ordered} units, Status: ${order.status}${order.delivery_address ? `, Delivery: ${order.delivery_address}` : ''}`,
          timestamp: order.created_at,
          icon: ShoppingCart,
          color: 'bg-purple-100 text-purple-800'
        });
      });

      // Add payment activities
      payments?.forEach(payment => {
        const isReceiver = payment.farmer_id === userId;
        allActivities.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          description: `${isReceiver ? 'Received' : 'Made'} payment of ₹${payment.amount} (Farmer gets: ₹${payment.farmer_amount}, Platform fee: ₹${payment.platform_fee || (payment.amount - payment.farmer_amount)}) - Status: ${payment.status}${payment.payment_method ? `, Method: ${payment.payment_method}` : ''}`,
          timestamp: payment.created_at,
          icon: CreditCard,
          color: 'bg-yellow-100 text-yellow-800'
        });
      });

      // Add notification activities
      notifications?.forEach(notification => {
        allActivities.push({
          id: `notification-${notification.id}`,
          type: 'notification',
          description: `Received: ${notification.title}`,
          timestamp: notification.created_at,
          icon: FileText,
          color: 'bg-gray-100 text-gray-800'
        });
      });

      // Sort by timestamp
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivities(allActivities.slice(0, 10)); // Show latest 10 activities
    } catch (error) {
      console.error('Error fetching user activity:', error);
      toast({
        title: "Error",
        description: "Failed to load user activity.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivity();
  }, [userId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Activity History - {userName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading activity...</p>
            </div>
          ) : activities.length > 0 ? (
            activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <Card key={activity.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${activity.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(activity.timestamp), 'PPp')}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserActivityModal;
