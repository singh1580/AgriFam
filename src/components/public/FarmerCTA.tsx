
import React from 'react';
import { Button } from '@/components/ui/button';

const FarmerCTA = () => {
  return (
    <div className="text-center bg-gradient-to-r from-soil-brown/5 to-harvest-yellow/10 p-12 rounded-lg border border-border/50">
      <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Start Selling?</h3>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Join AgriLink Direct today and transform your farming business. 
        Start listing your products and connect with bulk buyers immediately.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="bg-crop-green hover:bg-crop-field">
          Register as Farmer
        </Button>
        <Button size="lg" variant="outline" className="border-soil-brown text-soil-brown hover:bg-soil-brown hover:text-white">
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default FarmerCTA;
