
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStartCollection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: 'scheduled_collection',
          collection_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection-stats'] });
      toast({
        title: "Collection Started",
        description: "Collection has been scheduled and is now in progress.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start collection",
        variant: "destructive",
      });
    }
  });
};

export const useCompleteCollection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, notes, qualityGrade }: { 
      productId: string; 
      notes?: string; 
      qualityGrade?: string; 
    }) => {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: 'collected',
          admin_notes: notes,
          quality_grade: (qualityGrade || 'A') as 'A+' | 'A' | 'B+' | 'B' | 'C'
        })
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection-stats'] });
      toast({
        title: "Collection Completed",
        description: "Product has been successfully collected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete collection",
        variant: "destructive",
      });
    }
  });
};

export const useProcessPayment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      // Update the product status to payment_processed
      const { error: productError } = await supabase
        .from('products')
        .update({ status: 'payment_processed' })
        .eq('id', productId);

      if (productError) throw productError;

      // Get product details for payment record
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('farmer_id, quantity_available, price_per_unit, name')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;

      // Create payment record directly without creating fake orders
      const paymentAmount = product.quantity_available * product.price_per_unit;
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          farmer_id: product.farmer_id,
          buyer_id: null, // No buyer for direct farmer payments
          order_id: null, // No order for collection payments
          amount: paymentAmount,
          farmer_amount: paymentAmount * 0.95, // 95% to farmer, 5% platform fee
          platform_fee: paymentAmount * 0.05,
          status: 'paid_to_farmer',
          processed_at: new Date().toISOString(),
          payment_method: 'instant_collection_payment'
        });

      if (paymentError) throw paymentError;

      // Send notification to farmer
      await supabase.rpc('send_notification', {
        p_user_id: product.farmer_id,
        p_title: 'Payment Processed',
        p_message: `Payment of ₹${paymentAmount.toLocaleString()} for ${product.name} has been processed and sent to your account.`,
        p_type: 'payment',
        p_product_id: productId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: "Payment Processed",
        description: "Instant payment has been sent to the farmer.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    }
  });
};
