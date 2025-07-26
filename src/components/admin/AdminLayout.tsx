
import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminErrorBoundary } from './AdminErrorBoundary';

export const AdminLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminHeader />
          <main className="flex-1 p-4 lg:p-6">
            <AdminErrorBoundary>
              <Outlet />
            </AdminErrorBoundary>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
