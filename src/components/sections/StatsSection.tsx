
import React from 'react';
import { Users, Package, CheckCircle, Award } from 'lucide-react';
import StatsCard from '@/components/ui/stats-card';

const StatsSection = () => {
  const stats = [
    { title: "Registered Farmers", value: 15000, icon: Users, trend: "+25%", suffix: "+", gradient: "from-green-600/20 to-green-500/10" },
    { title: "Products Listed", value: 25000, icon: Package, trend: "+35%", suffix: "+", gradient: "from-blue-600/20 to-blue-500/10" },
    { title: "Success Rate", value: 98, icon: CheckCircle, trend: "+2%", suffix: "%", gradient: "from-purple-600/20 to-purple-500/10" },
    { title: "Customer Satisfaction", value: 99, icon: Award, trend: "+1%", suffix: "%", gradient: "from-orange-600/20 to-orange-500/10" }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8">
            Trusted by Thousands of Farmers
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Join our growing community of successful farmers and traders who trust AgriConnect for their agricultural business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="animate-fade-in hover-scale group" 
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <StatsCard {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
