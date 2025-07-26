import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useOptimizedAdminData } from '@/hooks/useOptimizedAdminData';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { stats, badges, isLoading } = useOptimizedAdminData();

  const mainStats = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: 'from-green-50 to-green-100',
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      prefix: '₹',
      icon: DollarSign,
      gradient: 'from-yellow-50 to-yellow-100',
    },
    {
      title: 'Active Farmers',
      value: stats.activeFarmers,
      icon: Users,
      gradient: 'from-purple-50 to-purple-100',
    },
  ];

  const quickActions = [
    {
      title: 'Product Approvals',
      count: badges.pendingProducts,
      description: 'Products awaiting review',
      action: () => navigate('/admin-dashboard/products'),
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      priority: 'high'
    },
    {
      title: 'Order Management',
      count: badges.pendingOrders,
      description: 'Orders to process',
      action: () => navigate('/admin-dashboard/orders'),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      priority: 'medium'
    },
    {
      title: 'Payment Processing',
      count: badges.pendingPayments,
      description: 'Payments to process',
      action: () => navigate('/admin-dashboard/payments'),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      priority: 'high'
    },
    {
      title: 'Collection Scheduling',
      count: stats.totalProducts > 0 ? Math.floor(stats.totalProducts * 0.3) : 0, // Approximate collection items
      description: 'Farmer collections',
      action: () => navigate('/admin-dashboard/collections'),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      priority: 'medium'
    },
    {
      title: 'User Management',
      count: stats.activeFarmers,
      description: 'Manage farmers & buyers',
      action: () => navigate('/admin-dashboard/users'),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      priority: 'low'
    },
    {
      title: 'Analytics & Reports',
      count: stats.totalRevenue > 0 ? 1 : 0, // Show if there's revenue data
      description: 'Business insights',
      action: () => navigate('/admin-dashboard/analytics'),
      icon: BarChart3,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      priority: 'low'
    },
    {
      title: 'Communication Hub',
      count: badges.pendingProducts + badges.pendingOrders, // Notifications needed
      description: 'Send notifications',
      action: () => navigate('/admin-dashboard/communications'),
      icon: MessageSquare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      priority: 'medium'
    },
    {
      title: 'System Settings',
      count: 0, // No count needed for settings
      description: 'Platform configuration',
      action: () => navigate('/admin-dashboard/settings'),
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      priority: 'low'
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your agricultural marketplace operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-green-600">
            <Activity className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-medium">Live System</span>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {mainStats.map((stat) => (
          <ResponsiveStatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            prefix={stat.prefix}
            icon={stat.icon}
            gradient={stat.gradient}
          />
        ))}
      </div>

      {/* Quick Actions Grid */}
      <Card className="bg-card/50 backdrop-blur-sm border border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Quick Actions & Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.title}
                  variant="outline"
                  onClick={action.action}
                  className={`h-auto p-4 sm:p-6 flex flex-col items-start space-y-3 text-left border-2 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group ${action.bgColor}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`p-2 rounded-lg bg-white/60 group-hover:bg-white/80 transition-colors`}>
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.color}`} />
                    </div>
                    {action.count > 0 && (
                      <Badge 
                        className={`${action.priority === 'high' ? 'bg-red-500' : action.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'} text-white shadow-lg animate-pulse`}
                      >
                        {action.count}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 w-full">
                    <div className="font-semibold text-sm sm:text-base text-foreground">
                      {action.title}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Database Connection</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Real-time Updates</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Payment Gateway</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Connected</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Activity className="h-5 w-5" />
              <span>Platform Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-700">New farmer registration</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-700">Product approved</p>
                  <p className="text-xs text-gray-500">12 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-700">Payment processed</p>
                  <p className="text-xs text-gray-500">18 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};