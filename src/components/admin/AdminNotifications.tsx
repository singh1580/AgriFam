
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTargetedNotifications } from '@/hooks/useTargetedNotifications';
import { Send, Users, MessageSquare, Bell, User, Package, FileText, History, Clipboard } from 'lucide-react';

type TemplateType = {
  title: string;
  message: string;
};

const AdminNotifications = () => {
  const { toast } = useToast();
  const { sendFarmerNotification, sendBuyerNotification, sendBulkNotification } = useTargetedNotifications();
  
  const [notificationType, setNotificationType] = useState<'individual' | 'bulk'>('individual');
  const [recipientType, setRecipientType] = useState<'farmer' | 'buyer'>('farmer');
  const [specificRecipient, setSpecificRecipient] = useState('');
  const [productId, setProductId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'product_status' | 'payment' | 'collection' | 'order_status'>('product_status');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const notificationTemplates: {
    farmer: Record<string, TemplateType>;
    buyer: Record<string, TemplateType>;
  } = {
    farmer: {
      product_approved: {
        title: "Product Approved ✅",
        message: "आपका {productName} product approve हो गया है! अब यह buyers को दिखेगा।"
      },
      product_rejected: {
        title: "Product Update Required ⚠️",
        message: "आपका {productName} में कुछ improvements की जरूरत है। कृपया quality check करें।"
      },
      payment_processed: {
        title: "Payment Received 💰",
        message: "बधाई हो! आपका ₹{amount} का payment आपके account में आ गया है।"
      },
      collection_scheduled: {
        title: "Collection Scheduled 🚛",
        message: "आपका {productName} collection कल {time} बजे scheduled है। तैयार रखें।"
      },
      quality_feedback: {
        title: "Quality Feedback 📋",
        message: "आपके {productName} की quality excellent है! Rating: {rating}/5"
      }
    },
    buyer: {
      order_confirmed: {
        title: "Order Confirmed ✅",
        message: "आपका order #{orderId} confirm हो गया है। Delivery in {days} days।"
      },
      order_shipped: {
        title: "Order Shipped 🚛",
        message: "आपका order #{orderId} ship हो गया है। Tracking: {trackingId}"
      },
      payment_required: {
        title: "Payment Pending 💳",
        message: "आपका order #{orderId} के लिए ₹{amount} का payment pending है।"
      },
      delivery_completed: {
        title: "Order Delivered 📦",
        message: "आपका order #{orderId} successfully deliver हो गया है। Thank you!"
      }
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

  const handleSendNotification = () => {
    if (!title || !message) {
      toast({
        title: "Error",
        description: "कृपया title और message दोनों भरें",
        variant: "destructive"
      });
      return;
    }

    try {
      if (notificationType === 'individual') {
        if (!specificRecipient) {
          toast({
            title: "Error",
            description: "कृपया specific recipient ID दें",
            variant: "destructive"
          });
          return;
        }

        if (recipientType === 'farmer') {
          sendFarmerNotification(specificRecipient, productId || '1', title, message, category);
          toast({
            title: "Notification Sent",
            description: `Farmer ${specificRecipient} को notification भेजा गया`,
          });
        } else {
          sendBuyerNotification(specificRecipient, orderId || '1', title, message, category);
          toast({
            title: "Notification Sent",
            description: `Buyer ${specificRecipient} को notification भेजा गया`,
          });
        }
      } else {
        sendBulkNotification(title, message, recipientType, 'general');
        toast({
          title: "Bulk Notification Sent",
          description: `सभी ${recipientType}s को notification भेजा गया`,
        });
      }

      // Clear form
      setTitle('');
      setMessage('');
      setSpecificRecipient('');
      setProductId('');
      setOrderId('');
      setSelectedTemplate('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Notification भेजने में समस्या हुई",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2 sm:space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Enhanced Notification System</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Templates के साथ individual और bulk notifications भेजें
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Badge variant="outline" className="bg-crop-green/20 text-crop-green">
            <Users className="h-3 w-3 mr-1" />
            1,234 Farmers
          </Badge>
          <Badge variant="outline" className="bg-sky-blue/20 text-sky-blue">
            <Users className="h-3 w-3 mr-1" />
            856 Buyers
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="send" className="text-xs sm:text-sm py-2">
            <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Send</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs sm:text-sm py-2">
            <Clipboard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm py-2">
            <History className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Notification Form */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Send Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Notification Type */}
                <div>
                  <label className="text-xs sm:text-sm font-medium">Notification Type</label>
                  <Select value={notificationType} onValueChange={(value: 'individual' | 'bulk') => setNotificationType(value)}>
                    <SelectTrigger className="h-8 sm:h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">
                        <div className="flex items-center">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Individual
                        </div>
                      </SelectItem>
                      <SelectItem value="bulk">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Bulk
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Recipient Type */}
                <div>
                  <label className="text-xs sm:text-sm font-medium">Recipient Type</label>
                  <Select value={recipientType} onValueChange={(value: 'farmer' | 'buyer') => {
                    setRecipientType(value);
                    setSelectedTemplate('');
                    setTitle('');
                    setMessage('');
                  }}>
                    <SelectTrigger className="h-8 sm:h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">Farmers</SelectItem>
                      <SelectItem value="buyer">Buyers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Template Selection */}
                <div>
                  <label className="text-xs sm:text-sm font-medium">Quick Templates</label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger className="h-8 sm:h-10">
                      <SelectValue placeholder="Choose template (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(notificationTemplates[recipientType]).map(([key, template]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            {template.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Individual Recipient Fields */}
                {notificationType === 'individual' && (
                  <>
                    <div>
                      <label className="text-xs sm:text-sm font-medium">
                        {recipientType === 'farmer' ? 'Farmer ID' : 'Buyer ID'}
                      </label>
                      <Input
                        value={specificRecipient}
                        onChange={(e) => setSpecificRecipient(e.target.value)}
                        placeholder={`Enter ${recipientType} ID`}
                        className="h-8 sm:h-10 text-xs sm:text-sm"
                      />
                    </div>

                    {recipientType === 'farmer' && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium">Product ID (Optional)</label>
                        <Input
                          value={productId}
                          onChange={(e) => setProductId(e.target.value)}
                          placeholder="Enter product ID"
                          className="h-8 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                    )}

                    {recipientType === 'buyer' && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium">Order ID (Optional)</label>
                        <Input
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          placeholder="Enter order ID"
                          className="h-8 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Title */}
                <div>
                  <label className="text-xs sm:text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Notification title"
                    className="h-8 sm:h-10 text-xs sm:text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs sm:text-sm font-medium">Message</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="आपका message यहाँ लिखें..."
                    rows={3}
                    className="text-xs sm:text-sm resize-none"
                  />
                </div>

                <Button onClick={handleSendNotification} className="w-full h-8 sm:h-10 text-xs sm:text-sm">
                  <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Send Notification
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-sm sm:text-base md:text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {title || message ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <h4 className="font-medium text-sm sm:text-base">{title || 'Notification Title'}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {notificationType === 'individual' ? 'Individual' : 'Bulk'}
                        </Badge>
                        <Badge className={recipientType === 'farmer' ? 'bg-crop-green/20 text-crop-green' : 'bg-sky-blue/20 text-sky-blue'}>
                          {recipientType}
                        </Badge>
                      </div>
                    </div>
                    
                    {notificationType === 'individual' && specificRecipient && (
                      <div className="text-xs sm:text-sm text-muted-foreground flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        Recipient: {recipientType} #{specificRecipient}
                      </div>
                    )}
                    
                    {productId && (
                      <div className="text-xs sm:text-sm text-muted-foreground flex items-center">
                        <Package className="h-3 w-3 mr-1" />
                        Product: #{productId}
                      </div>
                    )}
                    
                    <p className="text-xs sm:text-sm text-muted-foreground bg-gray-50 p-2 sm:p-3 rounded">
                      {message || 'Your message will appear here...'}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">
                      {notificationType === 'individual' 
                        ? `Will be sent to specific ${recipientType}`
                        : `Will be sent to all ${recipientType}s (${recipientType === 'farmer' ? '1,234' : '856'} users)`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <Bell className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Fill in the form to see preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">Farmer Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {Object.entries(notificationTemplates.farmer).map(([key, template]) => (
                  <div key={key} className="p-2 sm:p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-xs sm:text-sm">{template.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{template.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">Buyer Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {Object.entries(notificationTemplates.buyer).map(([key, template]) => (
                  <div key={key} className="p-2 sm:p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-xs sm:text-sm">{template.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{template.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 sm:py-8">
                <History className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Notification history will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
