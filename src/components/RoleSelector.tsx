
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout, ShoppingCart, Shield } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'farmer' | 'buyer' | 'admin') => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'farmer' as const,
      title: 'Farmer',
      description: 'Sell your produce directly to bulk buyers',
      icon: Sprout,
      color: 'from-green-500 to-green-600',
      features: ['Upload Products', 'Track Orders', 'Manage Inventory', 'Payment Tracking']
    },
    {
      id: 'buyer' as const,
      title: 'Buyer',
      description: 'Source quality produce directly from farmers',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      features: ['Browse Products', 'Bulk Orders', 'Filter & Search', 'Order Tracking']
    },
    {
      id: 'admin' as const,
      title: 'Admin',
      description: 'Manage platform operations and transactions',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      features: ['Product Verification', 'Payment Management', 'Analytics', 'User Management']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sprout className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">AgriLink Direct</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Choose Your Role to Get Started</p>
          <p className="text-gray-500">Eliminating middlemen, maximizing profits</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            
            return (
              <Card key={role.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden">
                <div className={`h-32 bg-gradient-to-r ${role.color} flex items-center justify-center`}>
                  <Icon className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{role.title}</h3>
                  <p className="text-gray-600 mb-4">{role.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => onRoleSelect(role.id)}
                    className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 transition-opacity`}
                  >
                    Continue as {role.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
