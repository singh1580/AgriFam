import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Bell, 
  User, 
  Shield,
  Sprout,
  MapPin,
  Calendar,
  CreditCard,
  Eye,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FarmerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FarmerSettingsModal = ({ isOpen, onClose }: FarmerSettingsModalProps) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    farmLocation: '',
    farmSize: '',
    primaryCrops: [] as string[],
    
    // Notification Preferences
    harvestReminders: true,
    paymentAlerts: true,
    weatherAlerts: false,
    priceUpdates: true,
    orderNotifications: true,
    collectionSchedules: true,
    
    // Farming Preferences
    organicCertified: false,
    sustainablePractices: false,
    cropRotation: false,
    soilTesting: false,
    
    // Collection Settings
    preferredDays: [] as string[],
    timeSlots: 'morning',
    specialInstructions: '',
    
    // Payment Settings
    bankAccount: '',
    upiId: '',
    paymentMethod: 'bank_transfer',
    
    // Privacy Settings
    profileVisibility: 'public',
    contactVisibility: 'buyers_only',
    
    // Appearance
    theme: 'system' as 'light' | 'dark' | 'system',
    language: 'english'
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

  const handleArrayToggle = (key: string, value: string) => {
    setSettings(prev => {
      const currentArray = prev[key as keyof typeof prev] as string[];
      return {
        ...prev,
        [key]: currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
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

      // Save farmer-specific settings
      const { error: farmerError } = await supabase
        .from('farmer_profiles')
        .upsert({
          id: user?.id,
          farm_location: settings.farmLocation,
          farm_size: settings.farmSize,
          primary_crops: settings.primaryCrops,
          settings: {
            notifications: {
              harvestReminders: settings.harvestReminders,
              paymentAlerts: settings.paymentAlerts,
              weatherAlerts: settings.weatherAlerts,
              priceUpdates: settings.priceUpdates,
              orderNotifications: settings.orderNotifications,
              collectionSchedules: settings.collectionSchedules
            },
            farming: {
              organicCertified: settings.organicCertified,
              sustainablePractices: settings.sustainablePractices,
              cropRotation: settings.cropRotation,
              soilTesting: settings.soilTesting
            },
            collection: {
              preferredDays: settings.preferredDays,
              timeSlots: settings.timeSlots,
              specialInstructions: settings.specialInstructions
            },
            payment: {
              bankAccount: settings.bankAccount,
              upiId: settings.upiId,
              paymentMethod: settings.paymentMethod
            },
            privacy: {
              profileVisibility: settings.profileVisibility,
              contactVisibility: settings.contactVisibility
            },
            appearance: {
              theme: settings.theme,
              language: settings.language
            }
          }
        });

      if (farmerError) throw farmerError;

      toast({
        title: "Settings saved successfully",
        description: "Your farmer preferences have been updated.",
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

  const cropOptions = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Groundnut', 'Mustard', 'Sunflower', 'Other'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Settings className="h-6 w-6 text-crop-green" />
            Farmer Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="farming">Farming</TabsTrigger>
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="farmLocation">Farm Location</Label>
                  <Input
                    id="farmLocation"
                    value={settings.farmLocation}
                    onChange={(e) => handleSettingChange('farmLocation', e.target.value)}
                    placeholder="Village, District, State"
                  />
                </div>
                <div>
                  <Label htmlFor="farmSize">Farm Size</Label>
                  <Input
                    id="farmSize"
                    value={settings.farmSize}
                    onChange={(e) => handleSettingChange('farmSize', e.target.value)}
                    placeholder="e.g., 5 acres"
                  />
                </div>
              </div>

              <div>
                <Label>Primary Crops</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {cropOptions.map(crop => (
                    <Label key={crop} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.primaryCrops.includes(crop)}
                        onChange={() => handleArrayToggle('primaryCrops', crop)}
                        className="rounded"
                      />
                      <span className="text-sm">{crop}</span>
                    </Label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-medium">
                  <Eye className="h-4 w-4" />
                  Appearance
                </h4>
                <div className="grid grid-cols-2 gap-4">
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
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
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
                    <Label>Harvest Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminders about harvest schedules</p>
                  </div>
                  <Switch
                    checked={settings.harvestReminders}
                    onCheckedChange={(checked) => handleSettingChange('harvestReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Payment Alerts</Label>
                    <p className="text-sm text-muted-foreground">Payment confirmations and updates</p>
                  </div>
                  <Switch
                    checked={settings.paymentAlerts}
                    onCheckedChange={(checked) => handleSettingChange('paymentAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Weather Alerts</Label>
                    <p className="text-sm text-muted-foreground">Weather updates for your region</p>
                  </div>
                  <Switch
                    checked={settings.weatherAlerts}
                    onCheckedChange={(checked) => handleSettingChange('weatherAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Price Updates</Label>
                    <p className="text-sm text-muted-foreground">Market price changes for your crops</p>
                  </div>
                  <Switch
                    checked={settings.priceUpdates}
                    onCheckedChange={(checked) => handleSettingChange('priceUpdates', checked)}
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
                    <Label>Collection Schedules</Label>
                    <p className="text-sm text-muted-foreground">Product collection reminders</p>
                  </div>
                  <Switch
                    checked={settings.collectionSchedules}
                    onCheckedChange={(checked) => handleSettingChange('collectionSchedules', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="farming" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-medium text-foreground">
                <Sprout className="h-4 w-4" />
                Farming Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Organic Certified</Label>
                    <p className="text-sm text-muted-foreground">Mark products as organic certified</p>
                  </div>
                  <Switch
                    checked={settings.organicCertified}
                    onCheckedChange={(checked) => handleSettingChange('organicCertified', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Sustainable Practices</Label>
                    <p className="text-sm text-muted-foreground">Follow sustainable farming methods</p>
                  </div>
                  <Switch
                    checked={settings.sustainablePractices}
                    onCheckedChange={(checked) => handleSettingChange('sustainablePractices', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Crop Rotation</Label>
                    <p className="text-sm text-muted-foreground">Practice crop rotation for soil health</p>
                  </div>
                  <Switch
                    checked={settings.cropRotation}
                    onCheckedChange={(checked) => handleSettingChange('cropRotation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Soil Testing</Label>
                    <p className="text-sm text-muted-foreground">Regular soil testing and analysis</p>
                  </div>
                  <Switch
                    checked={settings.soilTesting}
                    onCheckedChange={(checked) => handleSettingChange('soilTesting', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collection" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-medium text-foreground">
                <Calendar className="h-4 w-4" />
                Collection Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Preferred Collection Days</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {weekDays.map(day => (
                      <Label key={day} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.preferredDays.includes(day)}
                          onChange={() => handleArrayToggle('preferredDays', day)}
                          className="rounded"
                        />
                        <span className="text-sm">{day}</span>
                      </Label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="timeSlots">Preferred Time Slots</Label>
                  <Select value={settings.timeSlots} onValueChange={(value) => handleSettingChange('timeSlots', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (6 AM - 10 AM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (10 AM - 2 PM)</SelectItem>
                      <SelectItem value="evening">Evening (2 PM - 6 PM)</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={settings.specialInstructions}
                    onChange={(e) => handleSettingChange('specialInstructions', e.target.value)}
                    placeholder="Any special instructions for collection team..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={settings.paymentMethod} onValueChange={(value) => handleSettingChange('paymentMethod', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankAccount">Bank Account</Label>
                    <Input
                      id="bankAccount"
                      value={settings.bankAccount}
                      onChange={(e) => handleSettingChange('bankAccount', e.target.value)}
                      placeholder="Account number"
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      value={settings.upiId}
                      onChange={(e) => handleSettingChange('upiId', e.target.value)}
                      placeholder="farmer@upi"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 mt-6">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-medium text-foreground">
                <Shield className="h-4 w-4" />
                Privacy Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="buyers_only">Buyers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contactVisibility">Contact Visibility</Label>
                  <Select value={settings.contactVisibility} onValueChange={(value) => handleSettingChange('contactVisibility', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyers_only">Buyers Only</SelectItem>
                      <SelectItem value="admin_only">Admin Only</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
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

export default FarmerSettingsModal;