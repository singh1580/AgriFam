
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Rocket, Users, Heart } from 'lucide-react';

const AboutUsSection = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To connect farmers directly with bulk buyers, increasing their income and bringing transparency to agricultural trade.",
      gradient: "from-green-50 to-emerald-50",
      hoverGradient: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      borderColor: "border-green-200"
    },
    {
      icon: Rocket,
      title: "Our Vision",
      description: "To become India's largest and most trusted agricultural marketplace that contributes to farmers' prosperity.",
      gradient: "from-blue-50 to-sky-50",
      hoverGradient: "from-blue-100 to-sky-100",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      icon: Users,
      title: "Our Team",
      description: "A team of agricultural experts and technology specialists who understand farmers' challenges and solutions.",
      gradient: "from-yellow-50 to-amber-50",
      hoverGradient: "from-yellow-100 to-amber-100",
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      borderColor: "border-yellow-200"
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "Farmer-centric approach, quality assurance, transparency, and instant payments are our top priorities.",
      gradient: "from-red-50 to-pink-50",
      hoverGradient: "from-red-100 to-pink-100",
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      borderColor: "border-red-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-green-50/30 to-yellow-50/20 py-16 font-sans">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            About <span className="text-green-600">AgriConnect</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We are an agricultural marketplace that connects farmers directly with bulk buyers, 
            eliminating middlemen to provide better prices for farmers and guarantee quality.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/40">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600 space-y-6">
              <p className="text-lg leading-relaxed">
                AgriConnect started in 2023 when we saw that Indian farmers weren't getting fair prices for their hard work. 
                Middlemen were taking a large share of their earnings, and quality products often didn't get proper value.
              </p>
              <p className="text-lg leading-relaxed">
                We created a platform with an Admin-centric system for quality control, 
                instant payments for farmers, and aggregated bulk orders facility for buyers.
              </p>
              <p className="text-lg leading-relaxed">
                Today, our platform has 15,000+ farmers connected and handles ₹50 lakh+ transactions monthly. 
                Our goal is to reach every farmer in India and improve their economic condition.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div 
                key={index} 
                className="group animate-fade-in cursor-pointer" 
                style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
              >
                <div className={`bg-gradient-to-br ${value.gradient} hover:bg-gradient-to-br hover:${value.hoverGradient}
                               border-2 ${value.borderColor} hover:border-opacity-60 rounded-2xl p-8 text-center h-full
                               shadow-lg hover:shadow-2xl transition-all duration-500 
                               hover:scale-105 hover:-translate-y-2 hover:rotate-1`}>
                  
                  <div className={`w-16 h-16 ${value.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6
                                 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300
                                 group-hover:-rotate-3`}>
                    <Icon className={`h-8 w-8 ${value.iconColor} transition-all duration-300`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {value.description}
                  </p>
                  
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 
                                 bg-gradient-to-r from-green-400 via-blue-400 to-yellow-400 
                                 transition-opacity duration-500 blur-xl -z-10"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Rahul Sharma",
                role: "CEO & Founder",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "Priya Patel",
                role: "Head of Agriculture",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "Amit Kumar",
                role: "CTO",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden 
                               shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-green-600 font-medium">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;
