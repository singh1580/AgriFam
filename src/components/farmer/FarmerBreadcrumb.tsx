
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
  onSectionChange?: (section: DashboardSection) => void;
}

const FarmerBreadcrumb = ({ activeSection, onSectionChange }: FarmerBreadcrumbProps) => {
  const getSectionInfo = (section: DashboardSection) => {
    switch (section) {
      case 'products':
        return { label: 'My Products', icon: Package };
      case 'notifications':
        return { label: 'Notifications', icon: Bell };
      case 'feedback':
        return { label: 'Feedback', icon: MessageSquare };
      case 'dashboard':
      default:
        return { label: 'Dashboard', icon: Home };
    }
  };

  const sectionInfo = getSectionInfo(activeSection);
  const Icon = sectionInfo.icon;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-gray-200/50">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => onSectionChange?.('dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-crop-green transition-colors duration-200 font-medium cursor-pointer"
            >
              <Home className="h-3 w-3" />
              <span>Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          {activeSection === 'dashboard' ? (
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center space-x-2 text-crop-green font-semibold">
                <Icon className="h-3 w-3" />
                <span>{sectionInfo.label}</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => onSectionChange?.('dashboard')}
                  className="text-gray-600 hover:text-crop-green transition-colors duration-200 font-medium cursor-pointer"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center space-x-2 text-crop-green font-semibold">
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
