
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Package, Bell, Shield, ExternalLink, LogOut, Sparkles, MessageSquare } from 'lucide-react';
import { DashboardSection } from '@/hooks/useFarmerDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationItem {
  key: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface FarmerDashboardSidebarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  setSidebarOpen: (open: boolean) => void;
  unreadNotifications: number;
  sidebarOpen: boolean;
}

const FarmerDashboardSidebar = ({
  activeSection,
  setActiveSection,
  setSidebarOpen,
  unreadNotifications,
  sidebarOpen
}: FarmerDashboardSidebarProps) => {
  const { signOut } = useAuth();
  const { t } = useLanguage();

  const navigationItems: NavigationItem[] = [
    { key: 'dashboard', label: t('dashboard'), icon: Home },
    { key: 'products', label: t('products'), icon: Package },
    { key: 'notifications', label: t('notifications'), icon: Bell, badge: unreadNotifications },
    { key: 'feedback', label: t('feedback.title'), icon: MessageSquare }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-white/95 via-white/90 to-gray-50/80 backdrop-blur-xl border-r border-white/20 transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-all duration-500 ease-out shadow-2xl lg:shadow-none
      `}>
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Glassmorphism background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-crop-green/5 via-transparent to-harvest-yellow/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-crop-green/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-harvest-yellow/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          {/* Header */}
          <div className="relative p-6 border-b border-white/20 bg-gradient-to-r from-crop-green/5 via-transparent to-harvest-yellow/5 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-crop-green via-emerald-500 to-harvest-yellow rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                  <Shield className="h-7 w-7 text-white drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-crop-green via-emerald-600 to-harvest-yellow bg-clip-text text-transparent drop-shadow-sm">
                  Farmer Portal
                </h1>
                <p className="text-sm text-gray-600 font-medium tracking-wide">Admin Protected</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 relative p-4 space-y-2">
            {/* Home Page Button */}
            <Button
              variant="ghost"
              className="w-full justify-start h-14 text-sm mb-6 bg-white/40 backdrop-blur-sm border border-white/30 hover:bg-gradient-to-r hover:from-crop-green/20 hover:to-harvest-yellow/20 hover:border-crop-green/30 transition-all duration-300 shadow-sm hover:shadow-md rounded-xl"
              onClick={() => {
                window.location.href = '/';
                setSidebarOpen(false);
              }}
            >
              <ExternalLink className="h-5 w-5 mr-3 text-crop-green" />
              <span className="flex-1 text-left font-medium text-gray-700">Home Page</span>
            </Button>

            {/* Navigation Items */}
            <div className="space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                
                return (
                  <Button
                    key={item.key}
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start h-14 text-sm transition-all duration-300 rounded-xl relative overflow-hidden ${
                      isActive 
                        ? "bg-gradient-to-r from-crop-green via-emerald-500 to-harvest-yellow text-white shadow-xl border-0 scale-105 hover:scale-105" 
                        : "bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-gradient-to-r hover:from-crop-green/20 hover:to-harvest-yellow/20 hover:border-crop-green/30 hover:scale-102 shadow-sm hover:shadow-md"
                    }`}
                    onClick={() => {
                      setActiveSection(item.key);
                      setSidebarOpen(false);
                    }}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
                    )}
                    <Icon className={`h-5 w-5 mr-3 relative z-10 ${isActive ? "text-white drop-shadow-sm" : "text-gray-600"}`} />
                    <span className={`flex-1 text-left font-medium relative z-10 ${isActive ? "text-white" : "text-gray-700"}`}>
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="relative z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs min-w-6 h-6 flex items-center justify-center shadow-md border-0"
                      >
                        {item.badge > 9 ? '9+' : item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="relative p-4 space-y-4 border-t border-white/20 bg-gradient-to-r from-crop-green/5 via-transparent to-harvest-yellow/5 backdrop-blur-sm">
            {/* Protected Portal Card */}
            <Card className="bg-gradient-to-r from-crop-green/20 via-emerald-100/50 to-harvest-yellow/20 border-crop-green/30 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-crop-green">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-semibold">Protected Portal</span>
                </div>
                <p className="text-xs text-crop-green/80 mt-1 font-medium">
                  Instant payment guarantee
                </p>
              </CardContent>
            </Card>

            {/* Sign Out Button */}
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full justify-start h-12 text-sm bg-white/40 backdrop-blur-sm border border-red-200/50 text-red-600 hover:bg-red-50/80 hover:border-red-300 hover:text-red-700 transition-all duration-300 shadow-sm hover:shadow-md rounded-xl"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left font-medium">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerDashboardSidebar;
