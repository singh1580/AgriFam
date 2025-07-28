
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Home, 
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import BuyerProfileDropdown from './BuyerProfileDropdown';
import BuyerSettingsModal from './BuyerSettingsModal';
import UserProfileModal from './UserProfileModal';

type DashboardSection = 'browse' | 'orders' | 'history' | 'notifications' | 'feedback';

interface BuyerDashboardTopHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  unreadNotifications: number;
  setActiveSection: (section: DashboardSection) => void;
  activeSection: DashboardSection;
}

const BuyerDashboardTopHeader = ({ 
  setSidebarOpen, 
  unreadNotifications, 
  setActiveSection,
  activeSection 
}: BuyerDashboardTopHeaderProps) => {
  const navigate = useNavigate();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const getSectionLabel = (section: DashboardSection) => {
    switch (section) {
      case 'browse':
        return 'Browse Products';
      case 'orders':
        return 'Active Orders';
      case 'history':
        return 'Order History';
      case 'notifications':
        return 'Notifications';
      case 'feedback':
        return 'Feedback';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="relative">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-lg border-b border-white/20 shadow-lg"></div>
      
      <div className="relative z-10 px-4 py-4 lg:px-8">
        {/* Main header */}
        <div className="flex items-center justify-between mb-3">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-crop-green/10 transition-all duration-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-crop-green" />
            </Button>

            {/* Home button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoHome}
              className="flex items-center gap-2 hover:bg-crop-green/10 transition-all duration-300 group"
            >
              <Home className="h-4 w-4 text-crop-green group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline text-crop-green font-medium">Home</span>
            </Button>

            {/* Enhanced Title with bigger font and hover effect */}
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-crop-green to-sky-blue bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default">
                Buyer Dashboard
              </h1>
            </div>
          </div>

          {/* Right section - Enhanced Profile Dropdown */}
          <div className="flex items-center gap-3">
            <BuyerProfileDropdown 
              onSettingsClick={handleSettingsClick}
              onProfileClick={handleProfileClick}
            />
          </div>
        </div>

        {/* Bottom row - Dynamic Breadcrumbs */}
        <div className="flex items-center justify-between">
          {/* Dynamic Breadcrumbs */}
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={handleGoHome}
                  className="text-crop-green hover:text-crop-green/80 cursor-pointer transition-colors duration-200"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => setActiveSection('browse')}
                  className="text-muted-foreground hover:text-crop-green cursor-pointer transition-colors duration-200"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">
                  {getSectionLabel(activeSection)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Notification badge for mobile */}
          {unreadNotifications > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden relative"
              onClick={() => setActiveSection('notifications')}
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 text-xs px-2 py-1 rounded-full">
                {unreadNotifications > 9 ? '9+' : unreadNotifications} notifications
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Subtle bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crop-green/30 to-transparent"></div>

      {/* Modals */}
      <BuyerSettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </div>
  );
};

export default BuyerDashboardTopHeader;
