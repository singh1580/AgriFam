
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Upload, CheckCircle } from 'lucide-react';

const FarmerBenefits = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Higher Profits',
      description: 'Eliminate middlemen and get 30-40% higher prices for your produce'
    },
    {
      icon: TrendingUp,
      title: 'Market Access',
      description: 'Connect directly with bulk buyers and expand your market reach'
    },
    {
      icon: Upload,
      title: 'Easy Listing',
      description: 'Simple product upload with photo, quality grade, and pricing'
    },
    {
      icon: CheckCircle,
      title: 'Quality Verification',
      description: 'Get your products verified to build trust with buyers'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow border-border/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-crop-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-8 w-8 text-crop-green" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FarmerBenefits;
