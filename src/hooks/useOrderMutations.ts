
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCreateOrder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      product_id: string;
      quantity: number;
      delivery_address: string;
      phone: string;
      special_instructions?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      console.log('Creating order with data:', orderData);

      const { data, error } = await supabase.rpc('process_aggregated_order', {
        p_buyer_id: user.id,
        p_aggregated_product_id: orderData.product_id,
        p_quantity: orderData.quantity,
        p_delivery_address: orderData.delivery_address,
        p_phone: orderData.phone,
        p_preferred_delivery_date: null,
        p_special_instructions: orderData.special_instructions || null
      });

      if (error) {
        console.error('Order creation error:', error);
        throw error;
      }
      
      console.log('Order created successfully:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['buyer-active-orders'] });
      queryClient.invalidateQueries({ queryKey: ['buyer-order-history'] });
      queryClient.invalidateQueries({ queryKey: ['aggregated-products'] });
      queryClient.invalidateQueries({ queryKey: ['buyer-notifications'] });
      
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been submitted. Our admin team will review it and confirm the delivery date shortly.",
      });
    },
    onError: (error: any) => {
      console.error('Order creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useOrderMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { 
      orderId: string; 
      status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      // Auto-create payment record if it doesn't exist
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('order_id', orderId)
        .single();

      if (!existingPayment) {
        const { data: orderData } = await supabase
          .from('orders')
          .select(`
            *,
            product:products(farmer_id)
          `)
          .eq('id', orderId)
          .single();

        if (orderData?.product?.farmer_id) {
          await supabase
            .from('payments')
            .insert({
              order_id: orderId,
              buyer_id: orderData.buyer_id,
              farmer_id: orderData.product.farmer_id,
              amount: orderData.total_amount,
              farmer_amount: orderData.total_amount * 0.85,
              platform_fee: orderData.total_amount * 0.15,
              status: 'pending'
            });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-buyer-orders'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update order status.",
        variant: "destructive"
      });
    }
  });

  return { updateOrderStatus };
};
