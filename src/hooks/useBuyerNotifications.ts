
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/order';
import { useEffect } from 'react';

export const useBuyerNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications with better error handling
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['buyer-notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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
        orderId: notification.order_id || undefined
      }));
    },
    enabled: !!user,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30000 // 30 seconds
  });

  // Real-time notifications subscription
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time notifications for user:', user.id);

    const channel = supabase
      .channel('buyer-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          
          const newNotification = {
            id: payload.new.id,
            type: payload.new.type as Notification['type'],
            title: payload.new.title,
            message: payload.new.message,
            timestamp: payload.new.created_at || new Date().toISOString(),
            read: false,
            orderId: payload.new.order_id || undefined
          };

          // Update the query cache
          queryClient.setQueryData(['buyer-notifications', user.id], (old: Notification[] = []) => {
            return [newNotification, ...old];
          });

          // Show toast notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification updated:', payload);
          
          // Update the query cache
          queryClient.setQueryData(['buyer-notifications', user.id], (old: Notification[] = []) => {
            return old.map(notification => 
              notification.id === payload.new.id 
                ? { ...notification, read: payload.new.read }
                : notification
            );
          });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast]);

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-notifications'] });
    },
    onError: (error: any) => {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  });

  // Mark all notifications as read
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-notifications'] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
    onError: (error: any) => {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  });

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-notifications'] });
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting notification:', error);
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
