
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, MapPin } from 'lucide-react';

const InsightsSection = () => {
  const platformStats = [
    { title: 'Active Farmers', value: '1,234', icon: Users, color: 'text-blue-600', change: '+12%' },
    { title: 'Products Listed', value: '856', icon: Package, color: 'text-green-600', change: '+8%' },
    { title: 'Orders Completed', value: '2,341', icon: ShoppingCart, color: 'text-purple-600', change: '+15%' },
    { title: 'Total Revenue', value: '$1.2M', icon: DollarSign, color: 'text-orange-600', change: '+22%' }
  ];

  const recentOrders = [
    {
      id: 1,
      product: 'Premium Wheat',
      buyer: 'ABC Corp',
      farmer: 'John Smith',
      quantity: '50 tons',
      amount: '$12,500',
      status: 'Completed',
      location: 'Punjab'
    },
    {
      id: 2,
      product: 'Organic Rice',
      buyer: 'XYZ Ltd',
      farmer: 'Maria Garcia',
      quantity: '75 tons',
      amount: '$22,500',
      status: 'Processing',
      location: 'Tamil Nadu'
    },
    {
      id: 3,
      product: 'Fresh Tomatoes',
      buyer: 'DEF Industries',
      farmer: 'David Johnson',
      quantity: '25 tons',
      amount: '$10,000',
      status: 'Shipped',
      location: 'Karnataka'
    }
  ];

  const topProducts = [
    { name: 'Premium Wheat', orders: 145, revenue: '$362,500' },
    { name: 'Organic Rice', orders: 128, revenue: '$384,000' },
    { name: 'Quality Corn', orders: 96, revenue: '$192,000' },
    { name: 'Fresh Tomatoes', orders: 84, revenue: '$336,000' }
  ];

  const regionalData = [
    { region: 'Punjab', farmers: 412, volume: '2,100 tons' },
    { region: 'Tamil Nadu', farmers: 356, volume: '1,850 tons' },
    { region: 'Karnataka', farmers: 298, volume: '1,420 tons' },
    { region: 'Uttar Pradesh', farmers: 168, volume: '890 tons' }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Insights & Analytics</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent data showing the growth and impact of AgriLink Direct. 
            See how we're transforming agricultural trade across India.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {platformStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Recent Market Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">{order.product}</h4>
                      <p className="text-sm text-gray-600">{order.farmer} → {order.buyer}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {order.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{order.amount}</p>
                      <p className="text-sm text-gray-600">{order.quantity}</p>
                      <Badge 
                        variant={order.status === 'Completed' ? 'default' : 'secondary'}
                        className="text-xs mt-1"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Top Performing Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.orders} orders completed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{product.revenue}</p>
                      <p className="text-xs text-gray-500">Total revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Distribution */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <span>Regional Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regionalData.map((region, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{region.region}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-1">{region.farmers}</p>
                  <p className="text-sm text-gray-600 mb-2">Active Farmers</p>
                  <p className="text-lg font-semibold text-green-600">{region.volume}</p>
                  <p className="text-xs text-gray-500">Monthly Volume</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Statement */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white p-12 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">Transforming Agriculture, One Connection at a Time</h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            AgriLink Direct has facilitated over $1.2M in direct farmer sales, 
            eliminating middleman costs and ensuring fair prices for quality produce. 
            Join us in revolutionizing agricultural trade.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">30-40%</div>
              <div className="opacity-90">Higher farmer profits</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">96%</div>
              <div className="opacity-90">Order satisfaction rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2 days</div>
              <div className="opacity-90">Average delivery time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
