
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

const BuyerDashboardHeader = () => {
  return (
    <div className="relative mb-8 p-8 bg-gradient-to-r from-sky-blue/5 via-crop-green/5 to-harvest-yellow/5 rounded-3xl border border-border/50 backdrop-blur-sm overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-crop-green/10 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-harvest-yellow/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-blue to-crop-green bg-clip-text text-transparent">
                Browse Products
              </h1>
              <Badge className="bg-harvest-yellow/20 text-harvest-yellow border-harvest-yellow/30 animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                New
              </Badge>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover quality produce directly from verified farmers across the region
            </p>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-border/30">
            <div className="p-2 bg-crop-green/10 rounded-lg">
              <Users className="h-5 w-5 text-crop-green" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verified Farmers</p>
              <p className="text-xl font-bold text-crop-green">150+</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-border/30">
            <div className="p-2 bg-sky-blue/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-sky-blue" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fresh Products</p>
              <p className="text-xl font-bold text-sky-blue">500+</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-border/30">
            <div className="p-2 bg-harvest-yellow/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-harvest-yellow" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Premium Quality</p>
              <p className="text-xl font-bold text-harvest-yellow">Grade A+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardHeader;
