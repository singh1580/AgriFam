
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotificationsData';
import { useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from '@/hooks/useNotificationMutations';
import { FarmerNotification, DatabaseNotification, mapDatabaseNotificationToFarmer } from '@/types/farmer';
import { useToast } from '@/hooks/use-toast';

export const useFarmerNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [localNotifications, setLocalNotifications] = useState<FarmerNotification[]>([]);
  
  // Fetch notifications from database
  const { data: dbNotifications, isLoading, error, refetch } = useNotifications();
  
  // Mutation hooks
  const markAsReadMutation = useMarkNotificationRead();
  const markAllAsReadMutation = useMarkAllNotificationsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // Transform database notifications to farmer notifications
  const notifications = useMemo(() => {
    if (!dbNotifications) return [];
    
    return dbNotifications.map((dbNotification: any) => {
      // Create a DatabaseNotification-like object from Supabase data
      const mappedNotification: DatabaseNotification = {
        id: dbNotification.id,
        user_id: dbNotification.user_id,
        title: dbNotification.title,
        message: dbNotification.message,
        type: dbNotification.type || 'admin_message',
        read: dbNotification.read || false,
        created_at: dbNotification.created_at,
        metadata: dbNotification.metadata || {}
      };
      
      return mapDatabaseNotificationToFarmer(mappedNotification);
    });
  }, [dbNotifications]);

  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('farmer-notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          refetch(); // Refetch notifications when changes occur
          
          // Show toast for new notifications
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Notification",
              description: payload.new.title || "You have a new notification",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch, toast]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
      toast({
        title: "Notification marked as read",
        description: "The notification has been marked as read.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast({
        title: "All notifications marked as read",
        description: "All your notifications have been marked as read.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(notificationId);
      toast({
        title: "Notification deleted",
        description: "The notification has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    unreadCount,
    isLoading,
    error,
    refetch
  };
};
