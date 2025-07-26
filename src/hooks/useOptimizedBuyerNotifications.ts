
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/order';
import { useEffect } from 'react';

export const useOptimizedBuyerNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Optimized notifications query with product names
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['buyer-notifications-optimized', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          type,
          title,
          message,
          created_at,
          read,
          order_id,
          orders!left(
            id,
            products!inner(
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
      
      return data.map(notification => ({
        id: notification.id,
        type: notification.type as Notification['type'],
        title: notification.title,
        message: notification.message,
        timestamp: notification.created_at || new Date().toISOString(),
        read: notification.read || false,
        orderId: notification.order_id || undefined,
        productName: notification.orders?.products?.name || undefined
      }));
    },
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 30000 // 30 seconds
  });

  // Optimized real-time notifications subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('buyer-notifications-optimized')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = {
            id: payload.new.id,
            type: payload.new.type as Notification['type'],
            title: payload.new.title,
            message: payload.new.message,
            timestamp: payload.new.created_at || new Date().toISOString(),
            read: false,
            orderId: payload.new.order_id || undefined
          };

          // Update cache
          queryClient.setQueryData(['buyer-notifications-optimized', user.id], (old: any[] = []) => {
            return [newNotification, ...old.slice(0, 49)]; // Keep only 50 notifications
          });

          // Show toast
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast]);

  // Optimized mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onMutate: async (notificationId) => {
      // Optimistic update
      queryClient.setQueryData(['buyer-notifications-optimized', user?.id], (old: any[] = []) => {
        return old.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        );
      });
    },
    onError: () => {
      // Revert on error
      queryClient.invalidateQueries({ queryKey: ['buyer-notifications-optimized'] });
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  });

  // Optimized mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
    },
    onMutate: async () => {
      // Optimistic update
      queryClient.setQueryData(['buyer-notifications-optimized', user?.id], (old: any[] = []) => {
        return old.map(notification => ({ ...notification, read: true }));
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-notifications-optimized'] });
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onMutate: async (notificationId) => {
      // Optimistic update
      queryClient.setQueryData(['buyer-notifications-optimized', user?.id], (old: any[] = []) => {
        return old.filter(notification => notification.id !== notificationId);
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-notifications-optimized'] });
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    }
  });

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return {
    notifications,
    notificationsLoading,
    unreadNotifications,
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    deleteNotification: (id: string) => deleteNotificationMutation.mutate(id),
    isMarkingAllAsRead: markAllAsReadMutation.isPending
  };
};
