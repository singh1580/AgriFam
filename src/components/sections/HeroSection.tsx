
import React, { useEffect, useState } from 'react';
import { ArrowRight, Sprout, Users } from 'lucide-react';
import InteractiveButton from '@/components/ui/interactive-button';
import OptimizedImage from '@/components/ui/optimized-image';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#F5F5DC' }}>
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#4CAF50' }} />
        <div 
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-15" 
          style={{ backgroundColor: '#FBC02D', animationDelay: '2s' }} 
        />
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          
          {/* Text Content - Left Column */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{ color: '#212121' }}>
                <span className="block" style={{ color: '#4CAF50' }}>
                  Connecting Farmers
                </span>
                <span className="block mt-2" style={{ color: '#212121' }}>
                  to Buyers
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium mt-4" style={{ color: '#8D6E63' }}>
                  Simple, Trusted & Instant
                </span>
              </h1>
              
              {/* Subheading */}
              <p className="text-xl sm:text-2xl font-light leading-relaxed max-w-2xl" style={{ color: '#212121', opacity: 0.8 }}>
                India's premier agricultural marketplace where farmers sell directly to buyers with guaranteed quality and instant payments.
              </p>
            </div>
            
            {/* Call-to-Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 pt-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <InteractiveButton 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl border-0 text-white"
                style={{ backgroundColor: '#4CAF50' }}
                glow
                onClick={() => onNavigate('contact')}
              >
                <Sprout className="mr-3 h-5 w-5" />
                Join as Farmer
                <ArrowRight className="ml-3 h-5 w-5" />
              </InteractiveButton>
              
              <InteractiveButton 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 rounded-xl backdrop-blur-sm border-2"
                style={{ 
                  borderColor: '#29B6F6', 
                  color: '#29B6F6',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}
                onClick={() => onNavigate('contact')}
              >
                <Users className="mr-3 h-5 w-5" />
                Join as Buyer
              </InteractiveButton>
            </div>
            
            {/* Trust Indicators */}
            <div className={`flex flex-wrap gap-4 pt-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="backdrop-blur-sm border px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: '#4CAF50' }}>
                <span className="font-medium" style={{ color: '#4CAF50' }}>✓ Admin Verified Quality</span>
              </div>
              <div className="backdrop-blur-sm border px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: '#4CAF50' }}>
                <span className="font-medium" style={{ color: '#4CAF50' }}>✓ Instant Payments</span>
              </div>
              <div className="backdrop-blur-sm border px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: '#4CAF50' }}>
                <span className="font-medium" style={{ color: '#4CAF50' }}>✓ Direct Connection</span>
              </div>
            </div>
          </div>
          
          {/* Image Content - Right Column */}
          <div className={`relative transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
                  alt="Indian farmer in agricultural field with crops"
                  width={800}
                  height={600}
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                  priority
                />
                
                {/* Image Overlay for Better Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl" />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border animate-fade-in" style={{ borderColor: '#4CAF50', animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#4CAF50' }}></div>
                  <span className="font-medium" style={{ color: '#212121' }}>Live Marketplace</span>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border animate-fade-in" style={{ borderColor: '#4CAF50', animationDelay: '1.5s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#4CAF50' }}>24/7</div>
                  <div className="text-sm" style={{ color: '#212121', opacity: 0.7 }}>Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
