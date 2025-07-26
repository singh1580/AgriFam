
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, Users, TrendingUp, Shield } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const features = [
    {
      icon: Sprout,
      title: 'Direct Farm Connection',
      description: 'Connect directly with verified farmers and eliminate middleman costs'
    },
    {
      icon: Users,
      title: 'Bulk Ordering',
      description: 'Place large orders for quality produce at competitive prices'
    },
    {
      icon: TrendingUp,
      title: 'Market Transparency',
      description: 'Real-time pricing and quality grades for informed decisions'
    },
    {
      icon: Shield,
      title: 'Verified Quality',
      description: 'All products are verified and graded by our quality experts'
    }
  ];

  const stats = [
    { value: '1,234', label: 'Active Farmers' },
    { value: '856', label: 'Quality Products' },
    { value: '2,341', label: 'Successful Orders' },
    { value: '$1.2M', label: 'Revenue Generated' }
  ];

  return (
    <div className="bg-gradient-to-br from-harvest-yellow/10 to-sky-blue/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Farm to Business,
            <span className="text-crop-green"> Direct</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AgriLink Direct connects farmers directly with bulk buyers, eliminating middlemen 
            and ensuring fair prices for quality produce. Join the agricultural revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-crop-green hover:bg-crop-field text-lg px-8"
              onClick={() => onNavigate('marketplace')}
            >
              Browse Products
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-soil-brown text-soil-brown hover:bg-soil-brown hover:text-white text-lg px-8"
              onClick={() => onNavigate('farmers')}
            >
              Become a Farmer
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-crop-green mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-border/50">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-crop-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-crop-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
