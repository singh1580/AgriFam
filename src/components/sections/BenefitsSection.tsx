
import React, { useEffect, useState } from 'react';
import { DollarSign, Zap, Shield, Heart } from 'lucide-react';
import GradientCard from '@/components/ui/gradient-card';

const BenefitsSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const benefits = [
    {
      icon: DollarSign,
      title: "30% Higher Earnings",
      description: "Earn 30% more than market rates through direct selling",
      gradient: "from-green-50 to-emerald-50",
      hoverGradient: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
      iconBg: "bg-green-100"
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Get paid immediately upon product collection",
      gradient: "from-yellow-50 to-amber-50",
      hoverGradient: "from-yellow-100 to-amber-100",
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Expert grading and premium rates guarantee",
      gradient: "from-blue-50 to-sky-50",
      hoverGradient: "from-blue-100 to-sky-100",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100"
    },
    {
      icon: Heart,
      title: "Farmer First",
      description: "Farmer interests are our top priority",
      gradient: "from-red-50 to-pink-50",
      hoverGradient: "from-red-100 to-pink-100",
      iconColor: "text-red-600",
      iconBg: "bg-red-100"
    }
  ];

  return (
    <section className="py-24 -mt-16 relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group animate-fade-in cursor-pointer" 
              style={{ 
                animationDelay: `${index * 0.15}s`,
                transform: `translateY(${Math.sin(scrollY * 0.01 + index) * 8}px)`
              }}
            >
              <div className={`bg-gradient-to-br ${benefit.gradient} hover:bg-gradient-to-br hover:${benefit.hoverGradient} 
                             backdrop-blur-lg border border-white/40 shadow-xl hover:shadow-2xl 
                             transition-all duration-500 rounded-2xl p-8 text-center h-full
                             hover:scale-105 hover:-translate-y-2 group-hover:border-white/60`}>
                
                <div className={`w-16 h-16 ${benefit.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 
                               shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300
                               group-hover:rotate-3`}>
                  <benefit.icon className={`h-8 w-8 ${benefit.iconColor} transition-all duration-300`} />
                </div>
                
                <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                  {benefit.title}
                </h3>
                
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {benefit.description}
                </p>
                
                {/* Animated bottom accent */}
                <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 
                               transition-all duration-500 opacity-0 group-hover:opacity-100 
                               group-hover:w-20 mt-6 mx-auto rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
