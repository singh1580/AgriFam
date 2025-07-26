
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useOrderActions = () => {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpdateOrderStatus = useCallback(async (orderId: string, status: string) => {
    setProcessingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: status as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order status updated to ${status}.`,
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
    handleUpdateOrderStatus,
    processingId
  };
};
