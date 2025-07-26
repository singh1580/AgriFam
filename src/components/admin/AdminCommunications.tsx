import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Send, 
  Bell, 
  Mail,
  Users,
  Megaphone,
  History,
  Settings,
  Filter,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';
import { format } from 'date-fns';

const AdminCommunications = () => {
  const { toast } = useToast();
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const communicationStats = [
    {
      title: 'Total Sent',
      value: 1247,
      icon: Send,
      gradient: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Active Recipients',
      value: 89,
      icon: Users,
      gradient: 'from-green-50 to-green-100',
    },
    {
      title: 'Open Rate',
      value: 78,
      suffix: '%',
      icon: Mail,
      gradient: 'from-purple-50 to-purple-100',
    },
    {
      title: 'Pending',
      value: 12,
      icon: Bell,
      gradient: 'from-orange-50 to-orange-100',
    },
  ];

  const recentNotifications = [
    {
      id: 1,
      title: 'Harvest Season Update',
      message: 'मानसून के बाद फसल की कटाई के लिए तैयार रहें...',
      audience: 'farmers',
      sentAt: new Date(),
      status: 'sent',
      recipients: 45
    },
    {
      id: 2,
      title: 'New Product Categories',
      message: 'We have added new product categories for better...',
      audience: 'buyers',
      sentAt: new Date(Date.now() - 3600000),
      status: 'sent',
      recipients: 23
    },
    {
      id: 3,
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday from 2 AM to 4 AM...',
      audience: 'all',
      sentAt: new Date(Date.now() - 7200000),
      status: 'scheduled',
      recipients: 89
    },
  ];

  const predefinedTemplates = [
    {
      id: 1,
      name: 'Product Approval',
      title: 'Your Product Has Been Approved',
      message: 'आपका {productName} admin द्वारा approve हो गया है। Collection जल्द schedule होगा।',
      audience: 'farmers'
    },
    {
      id: 2,
      name: 'Order Confirmation',
      title: 'Order Confirmation',
      message: 'Your order #{orderId} has been confirmed and is being processed.',
      audience: 'buyers'
    },
    {
      id: 3,
      name: 'Payment Processed',
      title: 'Payment Received',
      message: 'आपका payment ₹{amount} successfully process हो गया है।',
      audience: 'farmers'
    },
    {
      id: 4,
      name: 'Collection Scheduled',
      title: 'Collection Scheduled',
      message: 'आपके product का collection {date} को schedule है। तैयार रहें।',
      audience: 'farmers'
    },
  ];

  const handleSendNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and message",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // In a real implementation, you'd send to selected audience
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Notification Sent",
        description: `Successfully sent to ${selectedAudience === 'all' ? 'all users' : selectedAudience}`,
      });

      // Reset form
      setNotificationTitle('');
      setNotificationMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleUseTemplate = (template: any) => {
    setNotificationTitle(template.title);
    setNotificationMessage(template.message);
    setSelectedAudience(template.audience);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'farmers': return 'bg-green-100 text-green-800';
      case 'buyers': return 'bg-blue-100 text-blue-800';
      case 'all': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Communication Center
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Send notifications and manage communications
          </p>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {communicationStats.map((stat) => (
          <ResponsiveStatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            suffix={stat.suffix}
            icon={stat.icon}
            gradient={stat.gradient}
          />
        ))}
      </div>

      {/* Communication Interface */}
      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Megaphone className="h-5 w-5 text-primary" />
                <span>Send Notification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Audience Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users (89)</SelectItem>
                    <SelectItem value="farmers">Farmers Only (45)</SelectItem>
                    <SelectItem value="buyers">Buyers Only (23)</SelectItem>
                    <SelectItem value="admin">Admin Users (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notification Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Title</label>
                <Input
                  placeholder="Enter notification title..."
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                />
              </div>

              {/* Notification Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here... (supports Hindi/English)"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Use {'{productName}'}, {'{amount}'}, {'{date}'} for dynamic content
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleSendNotification}
                  disabled={isSending}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? 'Sending...' : 'Send Now'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <History className="h-4 w-4 mr-2" />
                  Schedule for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Notification Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predefinedTemplates.map((template) => (
                  <Card key={template.id} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge className={getAudienceColor(template.audience)}>
                            {template.audience}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Title:</p>
                          <p className="text-sm">{template.title}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Message:</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{template.message}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          className="w-full"
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-primary" />
                  <span>Communication History</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search notifications..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <Card key={notification.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge className={getStatusColor(notification.status)}>
                              {notification.status}
                            </Badge>
                            <Badge className={getAudienceColor(notification.audience)}>
                              {notification.audience}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Sent {format(notification.sentAt, 'MMM dd, yyyy HH:mm')}</span>
                            <span>{notification.recipients} recipients</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Resend
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCommunications;