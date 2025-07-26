import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Package,
  Users,
  X
} from 'lucide-react';

interface DetailedAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  type: 'revenue' | 'orders' | 'farmers' | 'total_orders';
}

const DetailedAnalyticsModal = ({ isOpen, onClose, title, data, type }: DetailedAnalyticsModalProps) => {
  const renderContent = () => {
    switch (type) {
      case 'revenue':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Platform Fee</p>
                      <p className="text-xl font-bold text-green-600">₹{data.platformFee?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fee Percentage</p>
                      <p className="text-xl font-bold">{data.feePercentage}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue Orders</p>
                      <p className="text-xl font-bold">{data.orderBreakdown?.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <h3 className="font-semibold">Recent Platform Fee Collections</h3>
              {data.orderBreakdown?.slice(0, 10).map((order: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.orderId?.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.platformFee?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">from ₹{order.amount?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'orders':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Average Order Value</p>
                      <p className="text-xl font-bold">₹{data.avgOrderValue?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-xl font-bold">{data.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Order Value Distribution</h3>
              {data.orderDistribution?.map((range: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span>{range.range}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{range.count} orders</span>
                    <Badge variant="secondary">{range.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'farmers':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Farmer Earnings</p>
                      <p className="text-xl font-bold text-green-600">₹{data.totalEarnings?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Farmers</p>
                      <p className="text-xl font-bold">{data.activeFarmers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg per Farmer</p>
                      <p className="text-xl font-bold">₹{data.avgPerFarmer?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <h3 className="font-semibold">Top Earning Farmers</h3>
              {data.topFarmers?.map((farmer: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{farmer.name}</p>
                    <p className="text-sm text-muted-foreground">{farmer.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{farmer.earnings?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{farmer.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default DetailedAnalyticsModal;