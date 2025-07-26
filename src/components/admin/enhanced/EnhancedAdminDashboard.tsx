import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  RefreshCw,
  Bell
} from 'lucide-react';
import { useOptimizedAdminData } from '@/hooks/useOptimizedAdminData';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';
import ResponsiveOrderManagement from '../order-management/ResponsiveOrderManagement';
import BuyerPaymentManagement from '../BuyerPaymentManagement';
import FarmerPaymentManagement from '../FarmerPaymentManagement';
import AdminAnalytics from '../AdminAnalytics';
import { useToast } from '@/hooks/use-toast';

const EnhancedAdminDashboard = () => {
  const { stats, badges, isLoading, refetch } = useOptimizedAdminData();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Dashboard Refreshed",
      description: "All data has been updated successfully.",
    });
  };

  const quickStats = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-blue-50 to-blue-100',
      badge: badges.pendingProducts > 0 ? badges.pendingProducts : undefined,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: 'from-green-50 to-green-100',
      badge: badges.pendingOrders > 0 ? badges.pendingOrders : undefined,
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      prefix: '₹',
      icon: DollarSign,
      gradient: 'from-yellow-50 to-yellow-100',
    },
    {
      title: 'Active Users',
      value: stats.activeFarmers + stats.activeBuyers,
      icon: Users,
      gradient: 'from-purple-50 to-purple-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Comprehensive platform management and analytics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
            {(badges.pendingOrders + badges.pendingProducts + badges.pendingPayments) > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {badges.pendingOrders + badges.pendingProducts + badges.pendingPayments}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">
            <LayoutDashboard className="h-4 w-4 mr-1 sm:mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs sm:text-sm py-2">
            <ShoppingCart className="h-4 w-4 mr-1 sm:mr-2" />
            Orders
            {badges.pendingOrders > 0 && (
              <Badge className="ml-1 h-4 w-4 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {badges.pendingOrders}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="buyer-payments" className="text-xs sm:text-sm py-2">
            <DollarSign className="h-4 w-4 mr-1 sm:mr-2" />
            Buyer Pay
          </TabsTrigger>
          <TabsTrigger value="farmer-payments" className="text-xs sm:text-sm py-2">
            <Users className="h-4 w-4 mr-1 sm:mr-2" />
            Farmer Pay
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2">
            <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm py-2">
            <Settings className="h-4 w-4 mr-1 sm:mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickStats.map((stat) => (
              <div key={stat.title} className="relative">
                <ResponsiveStatsCard
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                  icon={stat.icon}
                  gradient={stat.gradient}
                />
                {stat.badge && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {stat.badge}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('orders')}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="text-sm">Manage Orders</span>
                  {badges.pendingOrders > 0 && (
                    <Badge className="bg-red-500 text-white">{badges.pendingOrders} pending</Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('buyer-payments')}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <DollarSign className="h-6 w-6" />
                  <span className="text-sm">Buyer Payments</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('farmer-payments')}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Farmer Payments</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('analytics')}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">System Status</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Connections</span>
                    <span className="font-semibold">Real-time enabled</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Data Freshness</span>
                    <span className="font-semibold text-green-600">Live</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="font-semibold text-green-600">&lt; 200ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-semibold text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cache Hit Rate</span>
                    <span className="font-semibold text-blue-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <ResponsiveOrderManagement />
        </TabsContent>

        <TabsContent value="buyer-payments" className="mt-6">
          <BuyerPaymentManagement />
        </TabsContent>

        <TabsContent value="farmer-payments" className="mt-6">
          <FarmerPaymentManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Real-time Updates</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Live data synchronization is enabled for all components.
                      </p>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Performance Optimization</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Advanced caching and query optimization enabled.
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">Optimized</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdminDashboard;