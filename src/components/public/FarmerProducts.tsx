
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

const FarmerProducts = () => {
  const demoProducts = [
    {
      id: 1,
      name: 'Premium Wheat (Gehun)',
      category: 'Grain',
      quantity: '100 tons',
      price: '₹25,000/ton',
      quality: 'A',
      status: 'Active',
      paymentStatus: 'Paid',
      image: 'photo-1574323347407-f5e1ad6d020b' // wheat field
    },
    {
      id: 2,
      name: 'Basmati Rice (Chawal)',
      category: 'Grain',
      quantity: '75 tons',
      price: '₹45,000/ton',
      quality: 'A',
      status: 'Pending Approval',
      paymentStatus: 'Unpaid',
      image: 'photo-1586201375761-83865001e31c' // rice grains
    },
    {
      id: 3,
      name: 'Moong Dal (Green Gram)',
      category: 'Pulse',
      quantity: '30 tons',
      price: '₹80,000/ton',
      quality: 'A',
      status: 'Active',
      paymentStatus: 'Paid',
      image: 'photo-1610440042657-612c34d95e9f' // green lentils
    }
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Your Product Listings</CardTitle>
        <Button className="bg-crop-green hover:bg-crop-field flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProducts.map((product) => (
            <div key={product.id} className="border border-border/50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card">
              <div className="h-48 bg-gradient-to-br from-harvest-yellow/10 to-crop-green/10 flex items-center justify-center">
                <img 
                  src={`https://images.unsplash.com/${product.image}?w=400&h=300&fit=crop`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <Badge variant="outline" className="text-xs border-soil-brown text-soil-brown">
                    Grade {product.quality}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground">{product.quantity}</span>
                  <span className="font-semibold text-crop-green">{product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant={product.status === 'Active' ? 'default' : 'secondary'} 
                         className={product.status === 'Active' ? 'bg-crop-green text-white' : ''}>
                    {product.status}
                  </Badge>
                  <Badge variant={product.paymentStatus === 'Paid' ? 'default' : 'destructive'}
                         className={product.paymentStatus === 'Paid' ? 'bg-harvest-yellow text-foreground' : ''}>
                    {product.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmerProducts;
