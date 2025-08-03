import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home, Package, Bell, MessageSquare } from 'lucide-react';
import { DashboardSection } from '@/hooks/useFarmerDashboard';

interface FarmerBreadcrumbProps {
  activeSection: DashboardSection;
}

const FarmerBreadcrumb = ({ activeSection }: FarmerBreadcrumbProps) => {
  const getSectionInfo = (section: DashboardSection) => {
    switch (section) {
      case 'products':
        return { label: 'My Products', icon: Package, section: 'products' };
      case 'notifications':
        return { label: 'Notifications', icon: Bell, section: 'notifications' };
      case 'feedback':
        return { label: 'Feedback', icon: MessageSquare, section: 'feedback' };
      case 'dashboard':
      default:
        return { label: 'Dashboard', icon: Home, section: 'dashboard' };
    }
  };

  const sectionInfo = getSectionInfo(activeSection);
  const Icon = sectionInfo.icon;

  const handleDashboardClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const customEvent = new CustomEvent('navigate-dashboard', { detail: { section: 'dashboard' } });
    window.dispatchEvent(customEvent);
  };

  const handleHomeClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = '/';
  };

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-border/50 dark:bg-card/20">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={handleHomeClick}
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 font-medium cursor-pointer"
            >
              <Home className="h-3 w-3" />
              <span>Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-muted-foreground" />
          {activeSection === 'dashboard' ? (
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center space-x-2 text-primary font-semibold">
                <Icon className="h-3 w-3" />
                <span>{sectionInfo.label}</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={handleDashboardClick}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium cursor-pointer"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground" />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center space-x-2 text-primary font-semibold">
                  <Icon className="h-3 w-3" />
                  <span>{sectionInfo.label}</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default FarmerBreadcrumb;