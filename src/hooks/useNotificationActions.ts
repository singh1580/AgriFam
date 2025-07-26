
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotificationActions = () => {
  const handleMarkNotificationRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  return {
    handleMarkNotificationRead
  };
};
