
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Globe } from 'lucide-react';
import { DashboardSection } from '@/hooks/useFarmerDashboard';
import FarmerProfileDropdown from './FarmerProfileDropdown';
import FarmerBreadcrumb from './FarmerBreadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FarmerDashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  activeSection: DashboardSection;
}

const FarmerDashboardHeader = ({
  setSidebarOpen,
  activeSection
}: FarmerDashboardHeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-primary/10 rounded-xl transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="flex flex-col space-y-3">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent drop-shadow-sm">
              {t('dashboard.farmer.title')}
            </h1>
            <div className="hidden sm:block">
              <FarmerBreadcrumb activeSection={activeSection} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
                <SelectItem value="ur">اردو</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FarmerProfileDropdown />
        </div>
      </div>
      
      {/* Mobile breadcrumb */}
      <div className="block sm:hidden px-4 pb-4">
        <FarmerBreadcrumb activeSection={activeSection} />
      </div>
    </div>
  );
};

export default FarmerDashboardHeader;
