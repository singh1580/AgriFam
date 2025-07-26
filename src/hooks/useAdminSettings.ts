import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SettingsConfig {
  key: string;
  defaultValues: any;
}

export const useAdminSettings = <T>(config: SettingsConfig) => {
  const [settings, setSettings] = useState<T>(config.defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(`${config.key}Settings`);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, [config.key]);

  const saveSettings = async (sectionName: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would save to your backend/database here
      // For now, we'll simulate an API call and save to localStorage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for persistence
      localStorage.setItem(`${config.key}Settings`, JSON.stringify(settings));
      
      // Also send a notification to admin about settings change
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Settings Updated',
          message: `${sectionName} settings have been updated successfully.`,
          type: 'admin_message'
        });
      }
      
      toast({
        title: "Settings Saved",
        description: `${sectionName} settings have been updated successfully.`,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = (sectionName: string) => {
    setSettings(config.defaultValues);
    localStorage.removeItem(`${config.key}Settings`);
    
    toast({
      title: "Settings Reset",
      description: `${sectionName} settings have been reset to defaults.`,
    });
  };

  const updateSettings = (updates: Partial<T>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return {
    settings,
    isLoading,
    saveSettings,
    resetToDefaults,
    updateSettings,
    setSettings,
  };
};