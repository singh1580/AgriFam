import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Globe, 
  Bell,
  Shield,
  DollarSign,
  Database,
  Mail,
  Smartphone,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Server,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);

  // Platform Settings State
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'Farm Direct Platform',
    supportEmail: 'support@farmdirect.com',
    supportPhone: '+91-1234567890',
    platformDescription: 'Connecting farmers directly with buyers for fresh, quality produce.',
    allowRegistrations: true,
    requireEmailVerification: true,
    enableSMS: true,
    maintenanceMode: false,
    maxOrdersPerDay: 100,
    systemTimezone: 'Asia/Kolkata',
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    platformFeePercentage: 15,
    minimumOrderAmount: 500,
    maximumOrderAmount: 100000,
    enableCOD: true,
    enableUPI: true,
    enableBankTransfer: true,
    autoProcessPayments: false,
    paymentGateway: 'razorpay',
    refundProcessingDays: 7,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    paymentAlerts: true,
    systemMaintenanceAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    lowStockAlerts: true,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    passwordComplexity: 'medium',
    apiRateLimit: 1000,
    ipWhitelist: '',
    enableAuditLog: true,
  });

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      });

      // Store in localStorage for persistence
      localStorage.setItem(`${section.toLowerCase()}Settings`, JSON.stringify(
        section === 'Platform' ? platformSettings :
        section === 'Payment' ? paymentSettings :
        section === 'Notification' ? notificationSettings :
        securitySettings
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefaults = (section: string) => {
    switch (section) {
      case 'platform':
        setPlatformSettings({
          platformName: 'Farm Direct Platform',
          supportEmail: 'support@farmdirect.com',
          supportPhone: '+91-1234567890',
          platformDescription: 'Connecting farmers directly with buyers for fresh, quality produce.',
          allowRegistrations: true,
          requireEmailVerification: true,
          enableSMS: true,
          maintenanceMode: false,
          maxOrdersPerDay: 100,
          systemTimezone: 'Asia/Kolkata',
        });
        break;
      case 'payment':
        setPaymentSettings({
          platformFeePercentage: 15,
          minimumOrderAmount: 500,
          maximumOrderAmount: 100000,
          enableCOD: true,
          enableUPI: true,
          enableBankTransfer: true,
          autoProcessPayments: false,
          paymentGateway: 'razorpay',
          refundProcessingDays: 7,
        });
        break;
      case 'notifications':
        setNotificationSettings({
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          orderUpdates: true,
          paymentAlerts: true,
          systemMaintenanceAlerts: true,
          marketingEmails: false,
          weeklyReports: true,
          lowStockAlerts: true,
        });
        break;
      case 'security':
        setSecuritySettings({
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          requireTwoFactor: false,
          passwordComplexity: 'medium',
          apiRateLimit: 1000,
          ipWhitelist: '',
          enableAuditLog: true,
        });
        break;
    }
    
    toast({
      title: "Settings Reset",
      description: `${section} settings have been reset to defaults.`,
    });
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      const savedPlatform = localStorage.getItem('platformSettings');
      const savedPayment = localStorage.getItem('paymentSettings');
      const savedNotification = localStorage.getItem('notificationSettings');
      const savedSecurity = localStorage.getItem('securitySettings');

      if (savedPlatform) setPlatformSettings(JSON.parse(savedPlatform));
      if (savedPayment) setPaymentSettings(JSON.parse(savedPayment));
      if (savedNotification) setNotificationSettings(JSON.parse(savedNotification));
      if (savedSecurity) setSecuritySettings(JSON.parse(savedSecurity));
    };

    loadSettings();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            System Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Configure platform behavior and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>System Healthy</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Server className="h-3 w-3" />
            <span>v2.1.0</span>
          </Badge>
        </div>
      </div>

      {/* Settings Interface */}
      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Platform Settings */}
        <TabsContent value="platform" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Platform Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input
                    value={platformSettings.platformName}
                    onChange={(e) => setPlatformSettings(prev => ({ ...prev, platformName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Support Email</label>
                  <Input
                    type="email"
                    value={platformSettings.supportEmail}
                    onChange={(e) => setPlatformSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Support Phone</label>
                  <Input
                    value={platformSettings.supportPhone}
                    onChange={(e) => setPlatformSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">System Timezone</label>
                  <Select value={platformSettings.systemTimezone} onValueChange={(value) => setPlatformSettings(prev => ({ ...prev, systemTimezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">India Standard Time (IST) - Asia/Kolkata</SelectItem>
                      <SelectItem value="Asia/Mumbai">Asia/Mumbai (Mumbai Time)</SelectItem>
                      <SelectItem value="Asia/Delhi">Asia/Delhi (Delhi Time)</SelectItem>
                      <SelectItem value="Asia/Calcutta">Asia/Calcutta (Kolkata Time)</SelectItem>
                      <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST/EDT)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Description</label>
                <Textarea
                  value={platformSettings.platformDescription}
                  onChange={(e) => setPlatformSettings(prev => ({ ...prev, platformDescription: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Orders Per Day</label>
                <Input
                  type="number"
                  value={platformSettings.maxOrdersPerDay}
                  onChange={(e) => setPlatformSettings(prev => ({ ...prev, maxOrdersPerDay: Number(e.target.value) }))}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">User Registration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow New Registrations</p>
                      <p className="text-sm text-muted-foreground">Enable new user account creation</p>
                    </div>
                    <Switch
                      checked={platformSettings.allowRegistrations}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, allowRegistrations: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Email Verification</p>
                      <p className="text-sm text-muted-foreground">Users must verify email before accessing platform</p>
                    </div>
                    <Switch
                      checked={platformSettings.requireEmailVerification}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable SMS Services</p>
                      <p className="text-sm text-muted-foreground">Allow SMS notifications and OTP</p>
                    </div>
                    <Switch
                      checked={platformSettings.enableSMS}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, enableSMS: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-600">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Put platform in maintenance mode (users cannot access)</p>
                  </div>
                  <Switch
                    checked={platformSettings.maintenanceMode}
                    onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
                {platformSettings.maintenanceMode && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Platform is currently in maintenance mode. Users will see a maintenance page.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => handleSaveSettings('Platform')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => handleResetToDefaults('platform')}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Payment Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Fee (%)</label>
                  <Input
                    type="number"
                    value={paymentSettings.platformFeePercentage}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, platformFeePercentage: Number(e.target.value) }))}
                    min="0"
                    max="30"
                  />
                  <p className="text-xs text-muted-foreground">Commission charged on each transaction</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Order Amount (₹)</label>
                  <Input
                    type="number"
                    value={paymentSettings.minimumOrderAmount}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, minimumOrderAmount: Number(e.target.value) }))}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Order Amount (₹)</label>
                  <Input
                    type="number"
                    value={paymentSettings.maximumOrderAmount}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, maximumOrderAmount: Number(e.target.value) }))}
                    min="1000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Refund Processing (Days)</label>
                  <Input
                    type="number"
                    value={paymentSettings.refundProcessingDays}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, refundProcessingDays: Number(e.target.value) }))}
                    min="1"
                    max="30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Gateway</label>
                <Select value={paymentSettings.paymentGateway} onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, paymentGateway: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="payu">PayU</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cash on Delivery (COD)</p>
                      <p className="text-sm text-muted-foreground">Allow cash payments on delivery</p>
                    </div>
                    <Switch
                      checked={paymentSettings.enableCOD}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableCOD: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">UPI Payments</p>
                      <p className="text-sm text-muted-foreground">Enable UPI payment gateway</p>
                    </div>
                    <Switch
                      checked={paymentSettings.enableUPI}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableUPI: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">Allow direct bank transfers</p>
                    </div>
                    <Switch
                      checked={paymentSettings.enableBankTransfer}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableBankTransfer: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Process Payments</p>
                    <p className="text-sm text-muted-foreground">Automatically process verified payments</p>
                  </div>
                  <Switch
                    checked={paymentSettings.autoProcessPayments}
                    onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, autoProcessPayments: checked }))}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => handleSaveSettings('Payment')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => handleResetToDefaults('payment')}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Send notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-muted-foreground">Notify users about order status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.orderUpdates}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, orderUpdates: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify about payment confirmations and issues</p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentAlerts}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, paymentAlerts: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Maintenance</p>
                      <p className="text-sm text-muted-foreground">Notify about system maintenance and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemMaintenanceAlerts}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemMaintenanceAlerts: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => handleSaveSettings('Notification')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => handleResetToDefaults('notifications')}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security & Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                    min="5"
                    max="120"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Login Attempts</label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: Number(e.target.value) }))}
                    min="3"
                    max="10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password Complexity</label>
                  <Select value={securitySettings.passwordComplexity} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, passwordComplexity: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Rate Limit (per hour)</label>
                  <Input
                    type="number"
                    value={securitySettings.apiRateLimit}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, apiRateLimit: Number(e.target.value) }))}
                    min="100"
                    max="10000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">IP Whitelist (comma-separated)</label>
                <Textarea
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                  placeholder="192.168.1.1, 10.0.0.1"
                  rows={2}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
                    </div>
                    <Switch
                      checked={securitySettings.requireTwoFactor}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireTwoFactor: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Audit Logging</p>
                      <p className="text-sm text-muted-foreground">Log all administrative actions</p>
                    </div>
                    <Switch
                      checked={securitySettings.enableAuditLog}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableAuditLog: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Security settings are critical. Changes will be logged and may require additional verification.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-4">
                <Button onClick={() => handleSaveSettings('Security')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => handleResetToDefaults('security')}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
