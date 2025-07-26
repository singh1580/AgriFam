
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentActions = () => {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleProcessPayment = useCallback(async (paymentId: string) => {
    setProcessingId(paymentId);
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'paid_to_farmer',
          processed_at: new Date().toISOString(),
          transaction_id: `TXN_${Date.now()}`
        })
        .eq('id', paymentId);

      if (error) throw error;

      // Get payment info for notification
      const { data: payment } = await supabase
        .from('payments')
        .select('farmer_id, farmer_amount')
        .eq('id', paymentId)
        .single();

      if (payment?.farmer_id) {
        await supabase.rpc('send_notification', {
          p_user_id: payment.farmer_id,
          p_title: 'Payment Processed',
          p_message: `Your payment of ₹${payment.farmer_amount?.toLocaleString()} has been processed.`,
          p_type: 'payment'
        });
      }

      toast({
        title: "Payment Processed",
        description: "Payment has been sent to farmer successfully.",
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
  }, [toast]);

  return {
    handleProcessPayment,
    processingId
  };
};
