
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCreateProduct = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: any) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('products')
        .insert([{ ...productData, farmer_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['farmer-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "Product Submitted",
        description: "Your product has been submitted for admin review.",
      });

      // Send notification to admin
      supabase.rpc('send_notification', {
        p_user_id: 'admin',
        p_title: 'New Product Submitted',
        p_message: `New product "${data.name}" submitted for review.`,
        p_type: 'admin_message',
        p_product_id: data.id
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useUpdateProductStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, status, notes }: { 
      productId: string; 
      status: string; 
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: status as any,
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product Updated",
        description: "Product status updated successfully.",
      });
    }
  });
};
