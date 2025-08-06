
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { DashboardSection } from '@/hooks/useFarmerDashboard';
import FarmerProfileDropdown from './FarmerProfileDropdown';
import FarmerBreadcrumb from './FarmerBreadcrumb';
import LanguageSelector from './LanguageSelector';

interface FarmerDashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

const FarmerDashboardHeader = ({
  setSidebarOpen,
  activeSection,
  setActiveSection
}: FarmerDashboardHeaderProps) => {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-crop-green/10 rounded-xl transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="flex flex-col space-y-3">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-crop-green via-emerald-600 to-teal-700 bg-clip-text text-transparent drop-shadow-sm">
              Farmer Dashboard
            </h1>
            <div className="hidden sm:block">
              <FarmerBreadcrumb 
                activeSection={activeSection} 
                onSectionChange={setActiveSection}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <FarmerProfileDropdown />
        </div>
      </div>
      
      {/* Mobile breadcrumb */}
      <div className="block sm:hidden px-4 pb-4">
        <FarmerBreadcrumb 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
      </div>
    </div>
  );
};

export default FarmerDashboardHeader;
