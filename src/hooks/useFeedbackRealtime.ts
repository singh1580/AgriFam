import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface UseFeedbackRealtimeProps {
  onNewFeedback?: (feedback: any) => void;
  onFeedbackUpdate?: (feedback: any) => void;
}

export const useFeedbackRealtime = ({
  onNewFeedback,
  onFeedbackUpdate
}: UseFeedbackRealtimeProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setupFeedbackSubscription = useCallback(() => {
    const channel = supabase
      .channel('feedback-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback'
        },
        async (payload) => {
          console.log('New feedback received:', payload);
          
          // Fetch user details for the new feedback
          const { data: userDetails } = await supabase
            .from('profiles')
            .select('full_name, email, role')
            .eq('id', payload.new.user_id)
            .single();

          const enrichedFeedback = {
            ...payload.new,
            user: userDetails || { full_name: 'Unknown User', email: 'unknown@email.com', role: 'unknown' }
          };

          onNewFeedback?.(enrichedFeedback);
          
          // Show priority-based notification
          const priority = payload.new.priority;
          const variant = priority === 'critical' ? 'destructive' : 'default';
          
          toast({
            title: `New ${priority.toUpperCase()} Feedback`,
            description: `${payload.new.subject} - from ${payload.new.user_type}`,
            variant,
            duration: priority === 'critical' ? 0 : 5000, // Critical feedback stays until dismissed
          });

          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
          queryClient.invalidateQueries({ queryKey: ['feedback-analytics'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'feedback'
        },
        async (payload) => {
          console.log('Feedback updated:', payload);
          
          const { data: userDetails } = await supabase
            .from('profiles')
            .select('full_name, email, role')
            .eq('id', payload.new.user_id)
            .single();

          const enrichedFeedback = {
            ...payload.new,
            user: userDetails || { full_name: 'Unknown User', email: 'unknown@email.com', role: 'unknown' }
          };

          onFeedbackUpdate?.(enrichedFeedback);
          
          // Show update notification if status changed
          if (payload.old.status !== payload.new.status) {
            toast({
              title: "Feedback Status Updated",
              description: `Feedback "${payload.new.subject}" is now ${payload.new.status}`,
            });
          }

          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
          queryClient.invalidateQueries({ queryKey: ['feedback-analytics'] });
        }
      )
      .subscribe();

    return channel;
  }, [onNewFeedback, onFeedbackUpdate, toast, queryClient]);

  useEffect(() => {
    const channel = setupFeedbackSubscription();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setupFeedbackSubscription]);

  // Real-time is already enabled via migration
  useEffect(() => {
    console.log('Real-time enabled for feedback table');
  }, []);

  return {
    setupFeedbackSubscription
  };
};