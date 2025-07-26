import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseRealTimeUpdatesProps {
  onOrderUpdate?: () => void;
  onPaymentUpdate?: () => void;
  onProductUpdate?: () => void;
  onNotificationUpdate?: () => void;
}

export const useRealTimeUpdates = ({
  onOrderUpdate,
  onPaymentUpdate,
  onProductUpdate,
  onNotificationUpdate
}: UseRealTimeUpdatesProps = {}) => {
  const { toast } = useToast();

  const setupOrderSubscription = useCallback(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order update:', payload);
          onOrderUpdate?.();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Order",
              description: "A new order has been placed.",
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Order Updated",
              description: "An order status has been updated.",
            });
          }
        }
      )
      .subscribe();

    return channel;
  }, [onOrderUpdate, toast]);

  const setupPaymentSubscription = useCallback(() => {
    const channel = supabase
      .channel('payments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments'
        },
        (payload) => {
          console.log('Payment update:', payload);
          onPaymentUpdate?.();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Payment",
              description: "A new payment has been processed.",
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Payment Updated",
              description: "A payment status has been updated.",
            });
          }
        }
      )
      .subscribe();

    return channel;
  }, [onPaymentUpdate, toast]);

  const setupProductSubscription = useCallback(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Product update:', payload);
          onProductUpdate?.();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Product",
              description: "A new product has been submitted.",
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Product Updated",
              description: "A product has been updated.",
            });
          }
        }
      )
      .subscribe();

    return channel;
  }, [onProductUpdate, toast]);

  const setupNotificationSubscription = useCallback(() => {
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Notification update:', payload);
          onNotificationUpdate?.();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Notification",
              description: "You have a new notification.",
            });
          }
        }
      )
      .subscribe();

    return channel;
  }, [onNotificationUpdate, toast]);

  useEffect(() => {
    const channels = [];
    
    if (onOrderUpdate) {
      channels.push(setupOrderSubscription());
    }
    
    if (onPaymentUpdate) {
      channels.push(setupPaymentSubscription());
    }
    
    if (onProductUpdate) {
      channels.push(setupProductSubscription());
    }
    
    if (onNotificationUpdate) {
      channels.push(setupNotificationSubscription());
    }

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [
    setupOrderSubscription,
    setupPaymentSubscription,
    setupProductSubscription,
    setupNotificationSubscription
  ]);

  const enableRealTimeForTable = useCallback(async (tableName: string) => {
    try {
      // Set up real-time subscription for the table
      const channel = supabase
        .channel(`${tableName}-realtime`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: tableName },
          (payload) => console.log(`${tableName} update:`, payload)
        )
        .subscribe();
      
      toast({
        title: "Real-time Enabled",
        description: `Real-time updates enabled for ${tableName}.`,
      });
      
      return channel;
    } catch (error: any) {
      console.error('Error enabling real-time:', error);
      toast({
        title: "Error",
        description: `Failed to enable real-time for ${tableName}.`,
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    enableRealTimeForTable
  };
};