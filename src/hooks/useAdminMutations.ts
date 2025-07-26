
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useProcessPayment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'paid_to_farmer',
          processed_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: "Payment Processed",
        description: "Payment has been sent to farmer.",
      });
    }
  });
};
