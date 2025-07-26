
import React, { useState, Suspense, lazy } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import StatsSection from '@/components/sections/StatsSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';

// Lazy load new sections
const AboutUsSection = lazy(() => import('@/components/sections/AboutUsSection'));
const ContactUsSection = lazy(() => import('@/components/sections/ContactUsSection'));

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const handleSectionChange = React.useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  const renderContent = React.useCallback(() => {
    switch (activeSection) {
      case 'about':
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <AboutUsSection />
          </Suspense>
        );
      case 'contact':
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <ContactUsSection />
          </Suspense>
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-yellow-50/30 to-blue-50/50 font-sans">
            <HeroSection onNavigate={handleSectionChange} />
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <BenefitsSection />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <StatsSection />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <FeaturesSection />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <TestimonialsSection />
            </div>
          </div>
        );
    }
  }, [activeSection, handleSectionChange]);

  return (
    <div className="font-sans antialiased">
      <Navigation activeSection={activeSection} onSectionChange={handleSectionChange} />
      {renderContent()}
      <Footer />
    </div>
  );
};

export default React.memo(Index);
