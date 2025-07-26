
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, MessageSquare, Bell, Filter } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'farmer' | 'buyer' | 'both';
  category: string;
  title: string;
  message: string;
}

const AdminNotificationManagement = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipientType, setRecipientType] = useState<'farmer' | 'buyer' | 'both'>('both');
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'send' | 'templates' | 'history'>('send');

  const notificationTemplates: NotificationTemplate[] = [
    {
      id: 'farmer_approval',
      name: 'Product Approval',
      type: 'farmer',
      category: 'Product Status',
      title: 'Product Approved',
      message: 'आपका {productName} admin द्वारा approve हो गया है। Collection जल्द schedule होगा।'
    },
    {
      id: 'farmer_rejection',
      name: 'Product Rejection',
      type: 'farmer',
      category: 'Product Status',
      title: 'Product Rejected',
      message: 'आपका {productName} quality standards के अनुसार reject हो गया है। कृपया बेहतर quality के साथ फिर submit करें।'
    },
    {
      id: 'collection_scheduled',
      name: 'Collection Scheduled',
      type: 'farmer',
      category: 'Collection',
      title: 'Collection Scheduled',
      message: 'आपका {productName} का collection {date} को scheduled है। हमारी team आपसे contact करेगी।'
    },
    {
      id: 'payment_processed',
      name: 'Payment Processed',
      type: 'farmer',
      category: 'Payment',
      title: 'Payment Processed',
      message: 'आपका ₹{amount} का payment successfully process हो गया है। {productName} के लिए धन्यवाद!'
    },
    {
      id: 'order_confirmed',
      name: 'Order Confirmed',
      type: 'buyer',
      category: 'Order Status',
      title: 'Order Confirmed',
      message: 'आपका order #{orderId} confirm हो गया है। Processing शुरू हो गई है।'
    },
    {
      id: 'order_shipped',
      name: 'Order Shipped',
      type: 'buyer',
      category: 'Order Status',
      title: 'Order Shipped',
      message: 'आपका order #{orderId} ship हो गया है। Tracking ID: {trackingId}'
    }
  ];

  const [sentNotifications] = useState([
    {
      id: '1',
      timestamp: '2024-01-20T10:30:00Z',
      type: 'farmer',
      title: 'Collection Scheduled',
      recipients: 12,
      category: 'Collection'
    },
    {
      id: '2',
      timestamp: '2024-01-19T15:45:00Z',
      type: 'buyer',
      title: 'Order Confirmed',
      recipients: 8,
      category: 'Order Status'
    }
  ]);

  const handleSendNotification = () => {
    if (!customTitle || !customMessage) {
      toast({
        title: "Error",
        description: "Please fill in both title and message",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Notification Sent Successfully",
      description: `Sent to all ${recipientType} users`,
    });

    // Clear form
    setCustomTitle('');
    setCustomMessage('');
    setSelectedTemplate('');
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = notificationTemplates.find(t => t.id === templateId);
    if (template) {
      setCustomTitle(template.title);
      setCustomMessage(template.message);
      setRecipientType(template.type);
    }
  };

  const getRecipientBadgeColor = (type: string) => {
    switch (type) {
      case 'farmer': return 'bg-crop-green/20 text-crop-green';
      case 'buyer': return 'bg-sky-blue/20 text-sky-blue';
      default: return 'bg-harvest-yellow/20 text-harvest-yellow';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Notification Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Send notifications to farmers and buyers</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Users className="h-4 w-4 text-crop-green" />
          <span>1,234 Farmers</span>
          <span className="text-muted-foreground">•</span>
          <Users className="h-4 w-4 text-sky-blue" />
          <span>856 Buyers</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'send' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('send')}
          className="rounded-md text-xs sm:text-sm"
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('templates')}
          className="rounded-md text-xs sm:text-sm"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Templates
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('history')}
          className="rounded-md text-xs sm:text-sm"
        >
          <Bell className="h-4 w-4 mr-2" />
          History
        </Button>
      </div>

      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send Notification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Send className="h-5 w-5 mr-2" />
                Send Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Template (Optional)</label>
                <Select value={selectedTemplate} onValueChange={(value) => {
                  setSelectedTemplate(value);
                  handleTemplateSelect(value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Recipients</label>
                <Select value={recipientType} onValueChange={(value: 'farmer' | 'buyer' | 'both') => setRecipientType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmers Only</SelectItem>
                    <SelectItem value="buyer">Buyers Only</SelectItem>
                    <SelectItem value="both">Both Farmers & Buyers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Notification Title</label>
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use variables like {'{productName}'}, {'{amount}'}, {'{orderId}'} for dynamic content
                </p>
              </div>

              <Button onClick={handleSendNotification} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {customTitle || customMessage ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{customTitle || 'Notification Title'}</h4>
                    <Badge className={getRecipientBadgeColor(recipientType)}>
                      {recipientType === 'both' ? 'All Users' : recipientType}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {customMessage || 'Your message will appear here...'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Will be sent to {recipientType === 'farmer' ? '1,234 farmers' : 
                                   recipientType === 'buyer' ? '856 buyers' : '2,090 total users'}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Fill in the form to see preview
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notificationTemplates.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <Badge className={getRecipientBadgeColor(template.type)} variant="secondary">
                    {template.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{template.category}</p>
                <p className="text-sm font-medium mb-1">{template.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-3">{template.message}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    handleTemplateSelect(template.id);
                    setActiveTab('send');
                  }}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bell className="h-5 w-5 mr-2" />
              Notification History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getRecipientBadgeColor(notification.type)}>
                      {notification.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {notification.recipients} recipients
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminNotificationManagement;
