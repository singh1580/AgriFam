import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

export const useAdminActions = () => {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApproveProduct = useCallback(async (productId: string, notes?: string) => {
    setProcessingId(productId);
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: 'approved',
          admin_notes: notes || 'Product approved by admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      // Get product info for notification
      const { data: product } = await supabase
        .from('products')
        .select('name, farmer_id')
        .eq('id', productId)
        .single();

      if (product?.farmer_id) {
        await supabase.rpc('send_notification', {
          p_user_id: product.farmer_id,
          p_title: 'Product Approved!',
          p_message: `Your product "${product.name}" has been approved and is now live.`,
          p_type: 'admin_message',
          p_product_id: productId
        });
      }

      toast({
        title: "Product Approved",
        description: "Product has been approved successfully.",
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

  const handleRejectProduct = useCallback(async (productId: string, notes: string) => {
    if (!notes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide feedback for the farmer.",
        variant: "destructive"
      });
      return;
    }

    setProcessingId(productId);
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: 'rejected',
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      // Get product info for notification
      const { data: product } = await supabase
        .from('products')
        .select('name, farmer_id')
        .eq('id', productId)
        .single();

      if (product?.farmer_id) {
        await supabase.rpc('send_notification', {
          p_user_id: product.farmer_id,
          p_title: 'Product Needs Revision',
          p_message: `Your product "${product.name}" needs some changes. Please check admin feedback.`,
          p_type: 'admin_message',
          p_product_id: productId
        });
      }

      toast({
        title: "Product Rejected",
        description: "Farmer has been notified with feedback.",
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

  const handleUpdateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setProcessingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
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

  const handleBulkApproveProducts = useCallback(async (productIds: string[], notes?: string) => {
    setProcessingId('bulk');
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: 'approved',
          admin_notes: notes || 'Products approved by admin',
          updated_at: new Date().toISOString()
        })
        .in('id', productIds);

      if (error) throw error;

      // Send notifications to farmers
      const { data: products } = await supabase
        .from('products')
        .select('name, farmer_id, id')
        .in('id', productIds);

      if (products) {
        for (const product of products) {
          if (product.farmer_id) {
            await supabase.rpc('send_notification', {
              p_user_id: product.farmer_id,
              p_title: 'Product Approved!',
              p_message: `Your product "${product.name}" has been approved and is now live.`,
              p_type: 'admin_message',
              p_product_id: product.id
            });
          }
        }
      }

      toast({
        title: "Products Approved",
        description: `${productIds.length} products have been approved successfully.`,
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

  const handleBulkRejectProducts = useCallback(async (productIds: string[], notes: string) => {
    if (!notes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide feedback for the farmers.",
        variant: "destructive"
      });
      return;
    }

    setProcessingId('bulk');
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: 'rejected',
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .in('id', productIds);

      if (error) throw error;

      // Send notifications to farmers
      const { data: products } = await supabase
        .from('products')
        .select('name, farmer_id, id')
        .in('id', productIds);

      if (products) {
        for (const product of products) {
          if (product.farmer_id) {
            await supabase.rpc('send_notification', {
              p_user_id: product.farmer_id,
              p_title: 'Product Needs Revision',
              p_message: `Your product "${product.name}" needs some changes. Please check admin feedback.`,
              p_type: 'admin_message',
              p_product_id: product.id
            });
          }
        }
      }

      toast({
        title: "Products Rejected",
        description: `${productIds.length} products have been rejected. Farmers have been notified.`,
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

  const handleBulkUpdateOrderStatus = useCallback(async (orderIds: string[], status: OrderStatus) => {
    setProcessingId('bulk');
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .in('id', orderIds);

      if (error) throw error;

      toast({
        title: "Orders Updated",
        description: `${orderIds.length} orders updated to ${status}.`,
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

  const handleBulkProcessPayments = useCallback(async (paymentIds: string[]) => {
    setProcessingId('bulk');
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'paid_to_farmer',
          processed_at: new Date().toISOString()
        })
        .in('id', paymentIds);

      if (error) throw error;

      toast({
        title: "Bulk Payments Processed",
        description: `${paymentIds.length} payments processed successfully.`,
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
    handleApproveProduct,
    handleRejectProduct,
    handleUpdateOrderStatus,
    handleBulkApproveProducts,
    handleBulkRejectProducts,
    handleBulkUpdateOrderStatus,
    handleBulkProcessPayments,
    processingId
  };
};
