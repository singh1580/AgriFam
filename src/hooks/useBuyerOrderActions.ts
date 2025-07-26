
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useBuyerOrderActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    setProcessingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: status as any,
          updated_at: new Date().toISOString(),
          // Generate tracking ID if shipping
          ...(status === 'shipped' && { tracking_id: `TRK-${orderId.slice(0, 8).toUpperCase()}` })
        })
        .eq('id', orderId);

      if (error) throw error;

      // Send notification to buyer
      const { data: order } = await supabase
        .from('orders')
        .select('buyer_id, product:products(name)')
        .eq('id', orderId)
        .single();

      if (order) {
        await supabase.rpc('send_notification', {
          p_user_id: order.buyer_id,
          p_title: 'Order Status Updated',
          p_message: `Your order for ${order.product?.name} has been ${status.replace('_', ' ')}.`,
          p_type: 'order_update',
          p_order_id: orderId
        });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-buyer-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-buyer-order-stats'] });

      toast({
        title: "Order Updated",
        description: `Order status updated to ${status.replace('_', ' ')}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  }, [toast, queryClient]);

  const updateDeliveryDate = useCallback(async (orderId: string, deliveryDate: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          delivery_date: deliveryDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Send notification to buyer
      const { data: order } = await supabase
        .from('orders')
        .select('buyer_id, product:products(name)')
        .eq('id', orderId)
        .single();

      if (order) {
        await supabase.rpc('send_notification', {
          p_user_id: order.buyer_id,
          p_title: 'Delivery Date Updated',
          p_message: `Expected delivery date for your order of ${order.product?.name} has been set to ${new Date(deliveryDate).toLocaleDateString()}.`,
          p_type: 'order_update',
          p_order_id: orderId
        });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-buyer-orders'] });

      toast({
        title: "Delivery Date Updated",
        description: "Expected delivery date has been set successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [toast, queryClient]);

  const addSupportNote = useCallback(async (orderId: string, note: string) => {
    try {
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('notes')
        .eq('id', orderId)
        .single();

      const existingNotes = currentOrder?.notes || '';
      const timestamp = new Date().toLocaleString();
      const newNote = `[${timestamp}] Admin Support: ${note}`;
      const updatedNotes = existingNotes ? `${existingNotes}\n\n${newNote}` : newNote;

      const { error } = await supabase
        .from('orders')
        .update({ 
          notes: updatedNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-buyer-orders'] });

      toast({
        title: "Support Note Added",
        description: "Customer support note has been added to the order.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [toast, queryClient]);

  return {
    updateOrderStatus,
    updateDeliveryDate,
    addSupportNote,
    processingId
  };
};
