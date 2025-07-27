import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Calendar,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
  PieChart,
  Target
} from 'lucide-react';
import { useOptimizedAdminData } from '@/hooks/useOptimizedAdminData';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import DetailedAnalyticsModal from './analytics/DetailedAnalyticsModal';

const AdminAnalytics = () => {
  const { stats, products, orders, payments, isLoading, refetch } = useOptimizedAdminData();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedAnalyticsType, setSelectedAnalyticsType] = useState<'platform-fee' | 'average-order' | 'farmer-earnings' | 'total-orders' | null>(null);
  const { toast } = useToast();

  const analyticsStats = [
    {
      title: 'Total Revenue',
      value: stats.totalRevenue || 0,
      prefix: '₹',
      change: '+24%',
      changeType: 'positive' as const,
      icon: DollarSign,
      gradient: 'from-green-50 to-green-100',
    },
    {
      title: 'Total Orders',
      value: orders?.length || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      gradient: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Active Users',
      value: (stats.activeFarmers || 0) + (stats.activeBuyers || 0),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users,
      gradient: 'from-purple-50 to-purple-100',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      change: '+15%',
      changeType: 'positive' as const,
      icon: Package,
      gradient: 'from-orange-50 to-orange-100',
    },
  ];

  // Calculate real revenue breakdown from orders
  const calculateRevenueByCategory = () => {
    const categoryRevenue: { [key: string]: number } = {};
    
    orders?.forEach(order => {
      if (order.product && order.product.category) {
        const category = order.product.category;
        categoryRevenue[category] = (categoryRevenue[category] || 0) + (order.total_amount || 0);
      }
    });

    const totalRevenue = stats.totalRevenue || 0;
    return Object.entries(categoryRevenue).map(([category, amount]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: Math.round(amount),
      percentage: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0,
      color: {
        grain: 'bg-blue-500',
        vegetable: 'bg-green-500', 
        fruit: 'bg-yellow-500',
        pulse: 'bg-purple-500',
        spice: 'bg-red-500',
        other: 'bg-gray-500'
      }[category] || 'bg-gray-500'
    }));
  };

  const revenueBreakdown = calculateRevenueByCategory();

  const handleExportReport = (type: string) => {
    try {
      // Generate comprehensive analytics report
      const reportData = {
        generatedAt: new Date().toLocaleString(),
        period: selectedPeriod,
        summary: {
          totalRevenue: stats.totalRevenue || 0,
          totalOrders: stats.totalOrders || 0,
          totalProducts: stats.totalProducts || 0,
          activeFarmers: stats.activeFarmers || 0,
          activeBuyers: stats.activeBuyers || 0,
          platformFee: Math.round((stats.totalRevenue || 0) * 0.15),
          farmerEarnings: Math.round((stats.totalRevenue || 0) * 0.85),
        },
        revenueByCategory: revenueBreakdown,
        productStats: {
          categories: (() => {
            const counts: { [key: string]: number } = {};
            products?.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
            return counts;
          })(),
          statusDistribution: (() => {
            const counts: { [key: string]: number } = {};
            products?.forEach(p => counts[p.status || 'pending_review'] = (counts[p.status || 'pending_review'] || 0) + 1);
            return counts;
          })(),
        },
        orderMetrics: {
          avgOrderValue: Math.round((stats.totalRevenue || 0) / Math.max(orders?.length || 1, 1)),
          fulfillmentRate: orders?.length > 0 ? Math.round((orders.filter(o => ['delivered', 'completed'].includes(o.status || '')).length / orders.length) * 100) : 0,
          avgOrdersPerBuyer: Math.round((orders?.length || 0) / Math.max(stats.activeBuyers || 1, 1)),
        }
      };

      // Create HTML report
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>AgriConnect Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #10b981; padding-bottom: 20px; }
            .header h1 { color: #10b981; margin: 0; font-size: 28px; }
            .summary { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
            .metric-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .metric-value { font-size: 24px; font-weight: bold; color: #10b981; }
            .section { margin: 40px 0; }
            .section h2 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f3f4f6; font-weight: bold; }
            .category-bar { height: 20px; background: #e5e7eb; border-radius: 10px; overflow: hidden; margin: 5px 0; }
            .category-fill { height: 100%; border-radius: 10px; }
            .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌾 AgriConnect Analytics Report</h1>
            <p>Generated on ${reportData.generatedAt} | Period: ${reportData.period}</p>
          </div>

          <div class="summary">
            <h2>📊 Executive Summary</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div>Total Revenue</div>
                <div class="metric-value">₹${reportData.summary.totalRevenue.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div>Total Orders</div>
                <div class="metric-value">${reportData.summary.totalOrders}</div>
              </div>
              <div class="metric-card">
                <div>Active Users</div>
                <div class="metric-value">${reportData.summary.activeFarmers + reportData.summary.activeBuyers}</div>
              </div>
              <div class="metric-card">
                <div>Platform Revenue</div>
                <div class="metric-value">₹${reportData.summary.platformFee.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>💰 Revenue Analysis</h2>
            <table>
              <thead>
                <tr><th>Category</th><th>Revenue</th><th>Percentage</th><th>Visual</th></tr>
              </thead>
              <tbody>
                ${reportData.revenueByCategory.map(item => `
                  <tr>
                    <td>${item.category}</td>
                    <td>₹${item.amount.toLocaleString()}</td>
                    <td>${item.percentage}%</td>
                    <td>
                      <div class="category-bar">
                        <div class="category-fill" style="width: ${item.percentage}%; background: #10b981;"></div>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>📦 Product Analysis</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div>Total Products</div>
                <div class="metric-value">${reportData.summary.totalProducts}</div>
              </div>
              <div class="metric-card">
                <div>Active Farmers</div>
                <div class="metric-value">${reportData.summary.activeFarmers}</div>
              </div>
              <div class="metric-card">
                <div>Avg Products/Farmer</div>
                <div class="metric-value">${Math.round(reportData.summary.totalProducts / Math.max(reportData.summary.activeFarmers, 1))}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>🛒 Order Performance</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div>Average Order Value</div>
                <div class="metric-value">₹${reportData.orderMetrics.avgOrderValue.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div>Order Fulfillment Rate</div>
                <div class="metric-value">${reportData.orderMetrics.fulfillmentRate}%</div>
              </div>
              <div class="metric-card">
                <div>Avg Orders per Buyer</div>
                <div class="metric-value">${reportData.orderMetrics.avgOrdersPerBuyer}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This report contains confidential business information.</p>
            <p>© 2024 AgriConnect - Agricultural Management Platform</p>
          </div>
        </body>
        </html>
      `;

      // Create and download HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AgriConnect_Analytics_${type}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Also open print dialog for PDF conversion
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.onload = () => {
          setTimeout(() => printWindow.print(), 500);
        };
      }

      toast({
        title: "Report Generated",
        description: `${type} analytics report has been downloaded and print dialog opened.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefreshData = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated successfully.",
    });
  };

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
            Analytics & Reports
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Business insights and performance metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportReport('Comprehensive')}>
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {analyticsStats.map((stat) => (
          <Card key={stat.title} className={`bg-gradient-to-br ${stat.gradient} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl bg-white/50">
                  <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700" />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.changeType === 'positive' ? (
                    <ArrowUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 leading-tight">{stat.title}</p>
              <div className="flex items-center">
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-none">
                  {stat.prefix}{stat.value.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="w-full">
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="revenue" className="text-xs sm:text-sm">Revenue</TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm">Products</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
          </TabsList>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span>Revenue by Category</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <span className="text-sm text-muted-foreground font-semibold">₹{item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">{item.percentage}% of total</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span>Key Performance Indicators</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                   <Button 
                     variant="ghost" 
                     className="w-full justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors h-auto"
                     onClick={() => setSelectedAnalyticsType('platform-fee')}
                   >
                     <div className="text-left flex-1">
                       <p className="text-sm font-medium text-green-800">Platform Fee Revenue</p>
                       <p className="text-xl sm:text-2xl font-bold text-green-900">₹{Math.round((stats.totalRevenue || 0) * 0.15).toLocaleString()}</p>
                     </div>
                     <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                   </Button>
                   <Button 
                     variant="ghost" 
                     className="w-full justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors h-auto"
                     onClick={() => setSelectedAnalyticsType('average-order')}
                   >
                     <div className="text-left flex-1">
                       <p className="text-sm font-medium text-blue-800">Average Order Value</p>
                       <p className="text-xl sm:text-2xl font-bold text-blue-900">₹{Math.round((stats.totalRevenue || 0) / Math.max(stats.totalOrders || 1, 1)).toLocaleString()}</p>
                     </div>
                     <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                   </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors h-auto"
                    onClick={() => setSelectedAnalyticsType('farmer-earnings')}
                  >
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-orange-800">Farmer Earnings</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-900">₹{Math.round((stats.totalRevenue || 0) * 0.85).toLocaleString()}</p>
                    </div>
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
                  </Button>
                  
                   <Button 
                     variant="ghost" 
                     className="w-full justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors h-auto"
                     onClick={() => setSelectedAnalyticsType('total-orders')}
                   >
                     <div className="text-left flex-1">
                       <p className="text-sm font-medium text-purple-800">Total Orders</p>
                       <p className="text-xl sm:text-2xl font-bold text-purple-900">{(orders?.length || 0).toLocaleString()}</p>
                     </div>
                     <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const categoryCounts: { [key: string]: number } = {};
                    products?.forEach(product => {
                      const category = product.category;
                      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                    });
                    
                    return Object.entries(categoryCounts).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Product Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const statusCounts: { [key: string]: { count: number; color: string; bgColor: string } } = {
                      'approved': { count: 0, color: 'text-green-800', bgColor: 'bg-green-50' },
                      'pending_review': { count: 0, color: 'text-yellow-800', bgColor: 'bg-yellow-50' },
                      'admin_review': { count: 0, color: 'text-orange-800', bgColor: 'bg-orange-50' },
                      'rejected': { count: 0, color: 'text-red-800', bgColor: 'bg-red-50' },
                      'scheduled_collection': { count: 0, color: 'text-blue-800', bgColor: 'bg-blue-50' },
                      'collected': { count: 0, color: 'text-purple-800', bgColor: 'bg-purple-50' }
                    };
                    
                    products?.forEach(product => {
                      const status = product.status || 'pending_review';
                      if (statusCounts[status]) {
                        statusCounts[status].count++;
                      }
                    });
                    
                    return Object.entries(statusCounts)
                      .filter(([_, data]) => data.count > 0)
                      .map(([status, data]) => (
                        <div key={status} className={`flex justify-between items-center p-3 ${data.bgColor} rounded-lg`}>
                          <span className={`font-medium ${data.color}`}>
                            {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                          <Badge className={`${data.bgColor.replace('50', '100')} ${data.color}`}>{data.count}</Badge>
                        </div>
                      ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-800">Active Farmers</p>
                      <p className="text-2xl font-bold text-green-900">{stats.activeFarmers || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Active Buyers</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.activeBuyers || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Admin Users</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.admins || 1}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Average Orders per Buyer</p>
                    <p className="text-2xl font-bold">{Math.round((stats.totalOrders || 0) / Math.max(stats.activeBuyers || 1, 1))}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Average Products per Farmer</p>
                    <p className="text-2xl font-bold">{Math.round((stats.totalProducts || 0) / Math.max(stats.activeFarmers || 1, 1))}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Order Success Rate</p>
                    <p className="text-2xl font-bold">
                      {orders?.length > 0 ? 
                        Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100) 
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Platform Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Order Fulfillment Rate</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {orders?.length > 0 ? 
                      Math.round((orders.filter(o => ['delivered', 'completed'].includes(o.status || '')).length / orders.length) * 100) 
                      : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Orders successfully completed</p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{orders?.length > 0 ? 
                      Math.round(orders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / orders.length)
                      : 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Average value per order</p>
                </div>
                  <div className="text-center p-6 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Active Products</h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {products?.filter(p => p.status === 'approved' || p.status === 'scheduled_collection').length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Currently available products</p>
                  </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedAnalyticsType && (
        <DetailedAnalyticsModal
          isOpen={selectedAnalyticsType !== null}
          onClose={() => setSelectedAnalyticsType(null)}
          title={`${selectedAnalyticsType.replace('-', ' ')} Analytics`}
          type={selectedAnalyticsType === 'platform-fee' ? 'revenue' : 
                selectedAnalyticsType === 'average-order' ? 'orders' :
                selectedAnalyticsType === 'farmer-earnings' ? 'farmers' : 'total_orders'}
          data={{
            ...stats,
            platformFee: Math.round((stats.totalRevenue || 0) * 0.15),
            feePercentage: 15,
            avgOrderValue: Math.round((stats.totalRevenue || 0) / Math.max(stats.totalOrders || 1, 1)),
            totalEarnings: Math.round((stats.totalRevenue || 0) * 0.85),
            avgPerFarmer: Math.round((stats.totalRevenue || 0) * 0.85 / Math.max(stats.activeFarmers || 1, 1)),
            orderBreakdown: orders?.slice(0, 10).map(order => ({
              orderId: order.id,
              date: order.created_at,
              amount: order.total_amount,
              platformFee: Math.round((order.total_amount || 0) * 0.15),
              productName: order.product?.name || 'Unknown Product'
            })) || [],
            orders: orders || [],
            totalValue: stats.totalRevenue || 0,
            topFarmers: [], // This would need to be calculated from actual farmer data
            orderDistribution: [
              { range: '₹0 - ₹1,000', count: orders?.filter(o => (o.total_amount || 0) <= 1000).length || 0, percentage: Math.round(((orders?.filter(o => (o.total_amount || 0) <= 1000).length || 0) / Math.max(orders?.length || 1, 1)) * 100) },
              { range: '₹1,001 - ₹5,000', count: orders?.filter(o => (o.total_amount || 0) > 1000 && (o.total_amount || 0) <= 5000).length || 0, percentage: Math.round(((orders?.filter(o => (o.total_amount || 0) > 1000 && (o.total_amount || 0) <= 5000).length || 0) / Math.max(orders?.length || 1, 1)) * 100) },
              { range: '₹5,001+', count: orders?.filter(o => (o.total_amount || 0) > 5000).length || 0, percentage: Math.round(((orders?.filter(o => (o.total_amount || 0) > 5000).length || 0) / Math.max(orders?.length || 1, 1)) * 100) }
            ]
          }}
        />
      )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
