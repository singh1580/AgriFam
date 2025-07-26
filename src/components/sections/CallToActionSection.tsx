
import React from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import InteractiveButton from '@/components/ui/interactive-button';

interface CallToActionSectionProps {
  onNavigate: (section: string) => void;
}

const CallToActionSection = ({ onNavigate }: CallToActionSectionProps) => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)`
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-crop-green/90 via-crop-green/80 to-harvest-yellow/70" />
          
          {/* Content */}
          <div className="relative z-10 text-center p-16 md:p-24">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Time to Transform Your 
                  <br />
                  <span className="text-harvest-yellow">
                    Agricultural Business
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                  Like thousands of successful farmers and buyers, revolutionize your agricultural operation with AgriLink Direct. <span className="font-semibold text-harvest-yellow">Get started today!</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <InteractiveButton 
                  size="lg" 
                  className="bg-white text-crop-green hover:bg-gray-100 px-12 py-6 text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 min-w-[300px] border-0"
                  glow
                  onClick={() => onNavigate('farmers')}
                >
                  <Sparkles className="mr-3 h-6 w-6" />
                  Get Started Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </InteractiveButton>
                
                <InteractiveButton 
                  size="lg" 
                  variant="ghost"
                  className="text-white hover:bg-white/20 backdrop-blur-sm px-12 py-6 text-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-500 min-w-[250px] border-2 border-white/50"
                  onClick={() => onNavigate('marketplace')}
                >
                  <Heart className="mr-3 h-6 w-6" />
                  Learn More
                </InteractiveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
