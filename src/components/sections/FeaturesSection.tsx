
import React from 'react';
import { Upload, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import FeatureCard from '@/components/ui/feature-card';

const FeaturesSection = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Product Upload",
      description: "Upload your products easily and start selling immediately after admin approval with our streamlined process.",
      gradient: "from-green-600/20 to-green-500/10"
    },
    {
      icon: ShieldCheck,
      title: "Admin Quality Check",
      description: "Our expert admin team verifies every product quality and guarantees the best price for premium produce.",
      gradient: "from-blue-600/20 to-blue-500/10"
    },
    {
      icon: TrendingUp,
      title: "Bulk Order Aggregation",
      description: "Buyers receive aggregated bulk orders that are cost-effective and quality assured for optimal business outcomes.",
      gradient: "from-yellow-600/20 to-yellow-500/10"
    },
    {
      icon: Users,
      title: "Trusted Network",
      description: "Join a network of verified farmers and buyers where every transaction is secure, transparent, and reliable.",
      gradient: "from-purple-600/20 to-purple-500/10"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50/50 to-green-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8">
            Why Choose AgriConnect?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            India's most advanced agricultural marketplace to grow your farm business with confidence and success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="animate-fade-in transform hover:scale-105 transition-all duration-500 group" 
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
