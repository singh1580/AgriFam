import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, MessageSquare, Bell, User, Package, FileText, History, Clipboard, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  user_id: string;
  created_at: string;
  read: boolean;
  profiles?: {
    full_name: string;
    email: string;
    role: string;
  };
}

type TemplateType = {
  title: string;
  message: string;
};

const EnhancedNotificationSystem = () => {
  const { toast } = useToast();
  
  const [notificationType, setNotificationType] = useState<'individual' | 'bulk'>('individual');
  const [recipientType, setRecipientType] = useState<'farmer' | 'buyer' | 'all'>('farmer');
  const [specificRecipient, setSpecificRecipient] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const notificationTemplates: {
    farmer: Record<string, TemplateType>;
    buyer: Record<string, TemplateType>;
    all: Record<string, TemplateType>;
  } = {
    farmer: {
      product_approved: {
        title: "Product Approved ✅",
        message: "आपका product approve हो गया है! अब यह buyers को दिखेगा।"
      },
      product_rejected: {
        title: "Product Update Required ⚠️",
        message: "आपका product में कुछ improvements की जरूरत है। कृपया quality check करें।"
      },
      payment_processed: {
        title: "Payment Received 💰",
        message: "बधाई हो! आपका payment आपके account में आ गया है।"
      },
      collection_scheduled: {
        title: "Collection Scheduled 🚛",
        message: "आपका product collection कल scheduled है। तैयार रखें।"
      }
    },
    buyer: {
      order_confirmed: {
        title: "Order Confirmed ✅",
        message: "आपका order confirm हो गया है। Delivery जल्द होगी।"
      },
      order_shipped: {
        title: "Order Shipped 🚛",
        message: "आपका order ship हो गया है।"
      },
      payment_required: {
        title: "Payment Pending 💳",
        message: "आपका order के लिए payment pending है।"
      },
      delivery_completed: {
        title: "Order Delivered 📦",
        message: "आपका order successfully deliver हो गया है। Thank you!"
      }
    },
    all: {
      system_maintenance: {
        title: "System Maintenance 🔧",
        message: "System maintenance scheduled. Please check timings."
      },
      new_feature: {
        title: "New Feature Added 🚀",
        message: "हमने platform में नए features add किए हैं।"
      },
      policy_update: {
        title: "Policy Update 📋",
        message: "Platform policies updated. Please review."
      }
    }
  };

  // Fetch users and notifications on component mount
  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleTemplateSelect = (templateKey: string) => {
    const templates = notificationTemplates[recipientType];
    const template = templates[templateKey];
    if (template) {
      setTitle(template.title);
      setMessage(template.message);
      setSelectedTemplate(templateKey);
    }
  };

  const handleSendNotification = async () => {
    if (!title || !message) {
      toast({
        title: "Error",
        description: "कृपया title और message दोनों भरें",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (notificationType === 'individual') {
        if (!specificRecipient) {
          toast({
            title: "Error",
            description: "कृपया specific recipient select करें",
            variant: "destructive"
          });
          return;
        }

        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: specificRecipient,
            title,
            message,
            type: 'admin_message'
          });

        if (error) throw error;

        toast({
          title: "Notification Sent",
          description: "Individual notification भेजा गया",
        });
      } else {
        // Bulk notification
        let targetUsers = users;
        if (recipientType !== 'all') {
          targetUsers = users.filter(user => user.role === recipientType);
        }

        const notifications = targetUsers.map(user => ({
          user_id: user.id,
          title,
          message,
          type: 'admin_message' as const
        }));

        const { error } = await supabase
          .from('notifications')
          .insert(notifications);

        if (error) throw error;

        toast({
          title: "Bulk Notification Sent",
          description: `${targetUsers.length} users को notification भेजा गया`,
        });
      }

      // Clear form
      setTitle('');
      setMessage('');
      setSpecificRecipient('');
      setSelectedTemplate('');
      
      // Refresh notifications
      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Notification भेजने में समस्या हुई",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });

      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getRecipientOptions = () => {
    if (recipientType === 'all') return users;
    return users.filter(user => user.role === recipientType);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Enhanced Notification System
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Send targeted notifications to users with templates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Users className="h-3 w-3 mr-1" />
            {users.filter(u => u.role === 'farmer').length} Farmers
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Users className="h-3 w-3 mr-1" />
            {users.filter(u => u.role === 'buyer').length} Buyers
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Clipboard className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5 text-primary" />
                  <span>Send Notification</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Notification Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notification Type</label>
                  <Select value={notificationType} onValueChange={(value: 'individual' | 'bulk') => setNotificationType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Individual
                        </div>
                      </SelectItem>
                      <SelectItem value="bulk">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Bulk
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Recipient Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Type</label>
                  <Select value={recipientType} onValueChange={(value: 'farmer' | 'buyer' | 'all') => {
                    setRecipientType(value);
                    setSelectedTemplate('');
                    setTitle('');
                    setMessage('');
                    setSpecificRecipient('');
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">Farmers Only</SelectItem>
                      <SelectItem value="buyer">Buyers Only</SelectItem>
                      <SelectItem value="all">All Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Templates</label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(notificationTemplates[recipientType]).map(([key, template]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            {template.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Individual Recipient */}
                {notificationType === 'individual' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Recipient</label>
                    <Select value={specificRecipient} onValueChange={setSpecificRecipient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {getRecipientOptions().map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                              <span>{user.full_name}</span>
                              <span className="text-xs text-muted-foreground">({user.email})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Notification title"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="आपका message यहाँ लिखें..."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleSendNotification} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? 'Sending...' : 'Send Notification'}
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {title || message ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{title || 'Notification Title'}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {notificationType === 'individual' ? 'Individual' : 'Bulk'}
                        </Badge>
                        <Badge className={
                          recipientType === 'farmer' ? 'bg-green-100 text-green-800' :
                          recipientType === 'buyer' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }>
                          {recipientType}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                      {message || 'Your message will appear here...'}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">
                      {notificationType === 'individual' 
                        ? `Will be sent to selected ${recipientType}`
                        : `Will be sent to all ${recipientType === 'all' ? 'users' : recipientType + 's'} (${getRecipientOptions().length} users)`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Fill in the form to see preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(notificationTemplates).map(([type, templates]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="capitalize">{type} Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(templates).map(([key, template]) => (
                    <div key={key} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-sm">{template.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{template.message}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2 w-full"
                        onClick={() => {
                          setRecipientType(type as 'farmer' | 'buyer' | 'all');
                          handleTemplateSelect(key);
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5 text-primary" />
                <span>Notification History</span>
                <Badge variant="secondary">{notifications.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications sent yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {notification.profiles?.role || 'unknown'}
                            </Badge>
                            {notification.read ? (
                              <Badge className="bg-green-100 text-green-800 text-xs">Read</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">Unread</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>To: {notification.profiles?.full_name || 'Unknown'}</span>
                            <span>Sent: {format(new Date(notification.created_at), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedNotificationSystem;