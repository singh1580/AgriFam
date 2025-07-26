
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FarmerStats from './FarmerStats';
import QuickActionsGrid from './QuickActionsGrid';
import ProductStatusList from './ProductStatusList';
import FarmerNotificationCenter from './FarmerNotificationCenter';
import FarmerNotificationBell from './FarmerNotificationBell';
import AnimatedBackground from '@/components/ui/animated-background';
import { useToast } from '@/hooks/use-toast';
import { Package, DollarSign, Clock, CheckCircle, Shield, Bell, Menu, Home } from 'lucide-react';
import { FarmerProduct, FarmerNotification } from '@/types/farmer';

type DashboardSection = 'dashboard' | 'products' | 'notifications';

const FarmerAnonymousDashboard = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [products] = useState<FarmerProduct[]>([
    {
      id: 1,
      name: 'Premium Wheat',
      category: 'Grain',
      quantity: '50 tons',
      submittedPrice: '₹24,000/ton',
      quality: 'A',
      status: 'scheduled_collection',
      submittedDate: '2024-01-15',
      expectedPayment: '₹12,00,000',
      collectionDate: '2024-01-22',
      adminNotes: 'Excellent quality confirmed. Collection scheduled.'
    },
    {
      id: 2,
      name: 'Organic Rice',
      category: 'Grain',
      quantity: '30 tons',
      submittedPrice: '₹35,000/ton',
      quality: 'A+',
      status: 'admin_review',
      submittedDate: '2024-01-18',
      expectedPayment: '₹10,50,000'
    },
    {
      id: 3,
      name: 'Fresh Tomatoes',
      category: 'Vegetable',
      quantity: '25 tons',
      submittedPrice: '₹40,000/ton',
      quality: 'A',
      status: 'payment_processed',
      submittedDate: '2024-01-10',
      expectedPayment: '₹10,00,000',
      collectionDate: '2024-01-20',
      adminNotes: 'Collection completed. Payment processed instantly.'
    }
  ]);

  const [notifications, setNotifications] = useState<FarmerNotification[]>([
    {
      id: 'FARN001',
      type: 'collection_scheduled',
      title: 'Collection Scheduled',
      message: 'आपका Premium Wheat का collection 22 Jan को scheduled है। Admin team आपसे contact करेगी।',
      timestamp: '2024-01-20T10:30:00Z',
      read: false,
      productId: '1',
      productName: 'Premium Wheat'
    },
    {
      id: 'FARN002',
      type: 'admin_approval',
      title: 'Product Approved',
      message: 'आपका Organic Rice admin द्वारा approve हो गया है। जल्द ही collection schedule होगा।',
      timestamp: '2024-01-19T14:15:00Z',
      read: false,
      productId: '2',
      productName: 'Organic Rice'
    },
    {
      id: 'FARN003',
      type: 'payment_processed',
      title: 'Payment Processed',
      message: 'आपका ₹10,00,000 का payment successfully process हो गया है। Fresh Tomatoes के लिए धन्यवाद!',
      timestamp: '2024-01-20T16:45:00Z',
      read: true,
      productId: '3',
      productName: 'Fresh Tomatoes'
    }
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (notificationId: string): Promise<void> => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
      description: "All your notifications have been marked as read.",
    });
  };

  const handleDeleteNotification = async (notificationId: string): Promise<void> => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted.",
    });
  };

  const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'products', label: 'My Products', icon: Package },
    { key: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-4 sm:space-y-6">
            <FarmerStats />
            <QuickActionsGrid />
          </div>
        );
      case 'products':
        return <ProductStatusList products={products} />;
      case 'notifications':
        return (
          <FarmerNotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
          />
        );
    }
  };

  return (
    <AnimatedBackground variant="gradient" className="min-h-screen bg-background">
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-200 ease-in-out
        `}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-crop-green to-harvest-yellow rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-foreground">Farmer Portal</h1>
                  <p className="text-xs text-muted-foreground">Admin Protected</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.key}
                      variant={activeSection === item.key ? 'default' : 'ghost'}
                      className="w-full justify-start h-10 sm:h-12 text-sm"
                      onClick={() => {
                        setActiveSection(item.key as DashboardSection);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <Card className="bg-crop-green/10 border-crop-green/20">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2 text-crop-green">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">Protected Portal</span>
                  </div>
                  <p className="text-xs text-crop-green/80 mt-1">
                    Instant payment guarantee
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Header */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-crop-green to-harvest-yellow bg-clip-text text-transparent">
                    Farmer Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Submit products • Get instant payments • Admin protected
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <FarmerNotificationBell
                  unreadCount={unreadNotifications}
                  onClick={() => setActiveSection('notifications')}
                />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="p-4 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default FarmerAnonymousDashboard;
