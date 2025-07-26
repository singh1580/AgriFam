import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Bell, 
  Shield, 
  User, 
  Monitor,
  Sun,
  Moon,
  Mail,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSettingsModal = ({ isOpen, onClose }: AdminSettingsModalProps) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    
    // Notification Preferences
    emailNotifications: true,
    orderNotifications: true,
    paymentAlerts: true,
    systemAlerts: true,
    weeklyReports: true,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    
    // Appearance
    theme: 'system' as 'light' | 'dark' | 'system',
    
    // System Settings
    autoBackup: true,
    dataRetention: '12',
    maintenanceMode: false
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

      // Save other settings to a settings table or localStorage
      localStorage.setItem('adminSettings', JSON.stringify(settings));

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
            Admin Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
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

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-medium">
                  <Monitor className="h-4 w-4" />
                  Appearance
                </h4>
                <div>
                  <Label>Theme Preference</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={settings.theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSettingChange('theme', 'light')}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-3 w-3" />
                      Light
                    </Button>
                    <Button
                      variant={settings.theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSettingChange('theme', 'dark')}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-3 w-3" />
                      Dark
                    </Button>
                    <Button
                      variant={settings.theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSettingChange('theme', 'system')}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="h-3 w-3" />
                      System
                    </Button>
                  </div>
                </div>
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
                    <Label>Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">New orders and order updates</p>
                  </div>
                  <Switch
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => handleSettingChange('orderNotifications', checked)}
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
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">System maintenance and updates</p>
                  </div>
                  <Switch
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Analytics and performance summaries</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-medium text-foreground">
                <Shield className="h-4 w-4" />
                Security Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={settings.loginAlerts}
                    onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-medium text-foreground">
                <Settings className="h-4 w-4" />
                System Configuration
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="dataRetention">Data Retention (months)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable for system maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettingsModal;