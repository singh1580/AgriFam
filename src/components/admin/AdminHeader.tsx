
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useOptimizedAdminData } from '@/hooks/useOptimizedAdminData';
import { AdminProfileDropdown } from './AdminProfileDropdown';

export const AdminHeader = () => {
  const { isLoading, refetch } = useOptimizedAdminData();

  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-white/80 via-white/90 to-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-lg">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="hover:bg-white/20 transition-colors duration-200" />
        <div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage platform operations and oversee transactions
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 transition-all duration-200 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <AdminProfileDropdown />
      </div>
    </header>
  );
};
