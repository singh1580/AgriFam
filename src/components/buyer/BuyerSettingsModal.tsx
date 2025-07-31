
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, Eye, Moon, Sun, Monitor, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';

interface BuyerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyerSettingsModal = ({ isOpen, onClose }: BuyerSettingsModalProps) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    
    // Notification Preferences
    emailNotifications: true,
    orderUpdates: true,
    priceAlerts: false,
    marketingEmails: false,
    deliveryUpdates: true,
    paymentAlerts: true,
    
    // Appearance - removed from state as they're handled by providers
    currency: 'INR',
    
    // Privacy & Security
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true,
    
  });

  useEffect(() => {
    if (profile) {
      setSettings(prev => ({
        ...prev,
        fullName: profile.full_name || '',
        phone: profile.phone || ''
      }));
    }
  }, [profile]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: settings.fullName,
          phone: settings.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Save buyer-specific settings
      const { error: buyerError } = await supabase
        .from('buyer_profiles')
        .upsert({
          id: user?.id,
          settings: {
            notifications: {
              emailNotifications: settings.emailNotifications,
              orderUpdates: settings.orderUpdates,
              priceAlerts: settings.priceAlerts,
              marketingEmails: settings.marketingEmails,
              deliveryUpdates: settings.deliveryUpdates,
              paymentAlerts: settings.paymentAlerts
            },
                appearance: {
                  currency: settings.currency
                },
            privacy: {
              profileVisibility: settings.profileVisibility,
              dataSharing: settings.dataSharing,
              analyticsTracking: settings.analyticsTracking
            }
          }
        });

      if (buyerError) throw buyerError;

      toast({
        title: "Settings saved successfully",
        description: "Your preferences have been updated.",
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Settings className="h-6 w-6 text-primary" />
            Buyer Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="appearance">Display</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-medium text-foreground">
                <User className="h-4 w-4" />
                Profile Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={settings.fullName}
                    onChange={(e) => handleSettingChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={settings.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleSettingChange('phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-medium text-foreground">
                <Bell className="h-4 w-4" />
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Order status and tracking information</p>
                  </div>
                  <Switch
                    checked={settings.orderUpdates}
                    onCheckedChange={(checked) => handleSettingChange('orderUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">Product price changes and deals</p>
                  </div>
                  <Switch
                    checked={settings.priceAlerts}
                    onCheckedChange={(checked) => handleSettingChange('priceAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Delivery Updates</Label>
                    <p className="text-sm text-muted-foreground">Delivery schedule and confirmations</p>
                  </div>
                  <Switch
                    checked={settings.deliveryUpdates}
                    onCheckedChange={(checked) => handleSettingChange('deliveryUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Payment Alerts</Label>
                    <p className="text-sm text-muted-foreground">Payment confirmations and issues</p>
                  </div>
                  <Switch
                    checked={settings.paymentAlerts}
                    onCheckedChange={(checked) => handleSettingChange('paymentAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Promotional offers and newsletters</p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-medium text-foreground">
                <Eye className="h-4 w-4" />
                Display Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label>{t('settings.theme')}</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-3 w-3" />
                      {t('theme.light')}
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-3 w-3" />
                      {t('theme.dark')}
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="h-3 w-3" />
                      {t('theme.system')}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">{t('settings.language')}</Label>
                    <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">हिंदी</SelectItem>
                        <SelectItem value="bengali">বাংলা</SelectItem>
                        <SelectItem value="tamil">தமிழ்</SelectItem>
                        <SelectItem value="telugu">తెలుగు</SelectItem>
                        <SelectItem value="marathi">मराठी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">₹ Indian Rupee</SelectItem>
                        <SelectItem value="USD">$ US Dollar</SelectItem>
                        <SelectItem value="EUR">€ Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t('settings.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            {loading ? 'Saving...' : t('settings.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyerSettingsModal;
