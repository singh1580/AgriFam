import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export interface FeedbackTrend {
  date: string;
  count: number;
  avgRating: number;
}

export interface CategoryAnalytics {
  category: string;
  count: number;
  avgRating: number;
  avgResponseTime: number;
}

export interface FeedbackAnalytics {
  totalFeedback: number;
  avgRating: number;
  avgResponseTime: number;
  resolutionRate: number;
  trends: FeedbackTrend[];
  categoryBreakdown: CategoryAnalytics[];
  userTypeStats: {
    buyer: { count: number; avgRating: number };
    farmer: { count: number; avgRating: number };
  };
  priorityStats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export const useFeedbackAnalytics = (timeRange: number = 30) => {
  return useQuery<FeedbackAnalytics>({
    queryKey: ['feedback-analytics', timeRange],
    queryFn: async () => {
      const startDate = subDays(new Date(), timeRange);
      
      // Fetch all feedback within the time range
      const { data: feedbacks, error } = await supabase
        .from('feedback')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalFeedback = feedbacks?.length || 0;
      const avgRating = feedbacks?.length ? 
        feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : 0;

      // Calculate response time for resolved feedback
      const resolvedFeedback = feedbacks?.filter(f => f.status === 'resolved') || [];
      const avgResponseTime = resolvedFeedback.length ? 
        resolvedFeedback.reduce((sum, f) => {
          const responseTime = new Date(f.updated_at).getTime() - new Date(f.created_at).getTime();
          return sum + (responseTime / (1000 * 60 * 60)); // Convert to hours
        }, 0) / resolvedFeedback.length : 0;

      const resolutionRate = totalFeedback ? (resolvedFeedback.length / totalFeedback) * 100 : 0;

      // Generate daily trends
      const dateRange = eachDayOfInterval({ start: startDate, end: new Date() });
      const trends: FeedbackTrend[] = dateRange.map(date => {
        const dayFeedbacks = feedbacks?.filter(f => 
          format(new Date(f.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ) || [];
        
        return {
          date: format(date, 'MMM dd'),
          count: dayFeedbacks.length,
          avgRating: dayFeedbacks.length ? 
            dayFeedbacks.reduce((sum, f) => sum + f.rating, 0) / dayFeedbacks.length : 0
        };
      });

      // Category breakdown
      const categories = [...new Set(feedbacks?.map(f => f.category) || [])];
      const categoryBreakdown: CategoryAnalytics[] = categories.map(category => {
        const categoryFeedbacks = feedbacks?.filter(f => f.category === category) || [];
        const resolvedCategoryFeedbacks = categoryFeedbacks.filter(f => f.status === 'resolved');
        
        return {
          category,
          count: categoryFeedbacks.length,
          avgRating: categoryFeedbacks.length ? 
            categoryFeedbacks.reduce((sum, f) => sum + f.rating, 0) / categoryFeedbacks.length : 0,
          avgResponseTime: resolvedCategoryFeedbacks.length ? 
            resolvedCategoryFeedbacks.reduce((sum, f) => {
              const responseTime = new Date(f.updated_at).getTime() - new Date(f.created_at).getTime();
              return sum + (responseTime / (1000 * 60 * 60));
            }, 0) / resolvedCategoryFeedbacks.length : 0
        };
      });

      // User type stats
      const buyerFeedbacks = feedbacks?.filter(f => f.user_type === 'buyer') || [];
      const farmerFeedbacks = feedbacks?.filter(f => f.user_type === 'farmer') || [];

      const userTypeStats = {
        buyer: {
          count: buyerFeedbacks.length,
          avgRating: buyerFeedbacks.length ? 
            buyerFeedbacks.reduce((sum, f) => sum + f.rating, 0) / buyerFeedbacks.length : 0
        },
        farmer: {
          count: farmerFeedbacks.length,
          avgRating: farmerFeedbacks.length ? 
            farmerFeedbacks.reduce((sum, f) => sum + f.rating, 0) / farmerFeedbacks.length : 0
        }
      };

      // Priority stats
      const priorityStats = {
        critical: feedbacks?.filter(f => f.priority === 'critical').length || 0,
        high: feedbacks?.filter(f => f.priority === 'high').length || 0,
        medium: feedbacks?.filter(f => f.priority === 'medium').length || 0,
        low: feedbacks?.filter(f => f.priority === 'low').length || 0
      };

      return {
        totalFeedback,
        avgRating,
        avgResponseTime,
        resolutionRate,
        trends,
        categoryBreakdown,
        userTypeStats,
        priorityStats
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
};