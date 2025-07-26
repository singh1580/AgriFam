
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const useProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = useCallback(async (userId: string, retryCount = 0) => {
    try {
      console.log(`Fetching profile for user: ${userId} (attempt ${retryCount + 1})`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116' && retryCount < 8) {
          // Profile not found, retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          console.log(`Profile not found, retrying in ${delay}ms...`);
          setTimeout(() => fetchProfile(userId, retryCount + 1), delay);
          return;
        }
        return;
      }

      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      if (retryCount < 5) {
        const delay = Math.min(2000 * Math.pow(1.5, retryCount), 8000);
        setTimeout(() => fetchProfile(userId, retryCount + 1), delay);
      }
    }
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error('Profile update error:', error);
        return { error };
      }

      await fetchProfile(userId);
      return { error: null };
    } catch (error: any) {
      console.error('Profile update exception:', error);
      return { error };
    }
  }, [fetchProfile]);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  return {
    profile,
    fetchProfile,
    updateProfile,
    clearProfile
  };
};
