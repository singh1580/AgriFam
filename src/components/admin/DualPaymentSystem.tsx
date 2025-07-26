
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, TrendingUp, CreditCard } from 'lucide-react';
import BuyerPaymentManagement from './BuyerPaymentManagement';
import FarmerPaymentManagement from './FarmerPaymentManagement';
import { useDualPaymentStats } from '@/hooks/useDualPaymentStats';
import AnimatedCounter from '@/components/ui/animated-counter';

const DualPaymentSystem = () => {
  const [activeTab, setActiveTab] = useState('buyer-payments');
  const { buyerStats, farmerStats, isLoading } = useDualPaymentStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-blue-700">Buyer Payments</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              <AnimatedCounter end={buyerStats.totalPayments} prefix="₹" />
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {buyerStats.pendingCount} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-700">Farmer Payments</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              <AnimatedCounter end={farmerStats.totalPayments} prefix="₹" />
            </p>
            <p className="text-xs text-green-600 mt-1">
              {farmerStats.pendingCount} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-yellow-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-sm font-medium text-yellow-700">Platform Revenue</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              <AnimatedCounter end={buyerStats.totalPayments - farmerStats.totalPayments} prefix="₹" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-200 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-purple-700">Total Processed</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              <AnimatedCounter end={buyerStats.totalPayments + farmerStats.totalPayments} prefix="₹" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dual Payment Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-harvest-yellow" />
            <span>Payment Management System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer-payments" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Buyer Payments</span>
                {buyerStats.pendingCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {buyerStats.pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="farmer-payments" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Farmer Payments</span>
                {farmerStats.pendingCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {farmerStats.pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="buyer-payments" className="mt-6">
              <BuyerPaymentManagement />
            </TabsContent>
            
            <TabsContent value="farmer-payments" className="mt-6">
              <FarmerPaymentManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DualPaymentSystem;
