
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Bell,
  Truck,
  Users,
  BarChart3,
  Settings,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import { useOptimizedAdminData } from '@/hooks/useOptimizedAdminData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const navigationItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin-dashboard',
  },
  {
    key: 'products',
    label: 'Products',
    icon: Package,
    path: '/admin-dashboard/products',
    badgeKey: 'pendingProducts',
  },
  {
    key: 'orders',
    label: 'Buyer Orders',
    icon: ShoppingCart,
    path: '/admin-dashboard/orders',
    badgeKey: 'pendingOrders',
  },
  {
    key: 'payments',
    label: 'Payment Management',
    icon: DollarSign,
    path: '/admin-dashboard/payments',
    badgeKey: 'pendingPayments',
  },
  {
    key: 'collections',
    label: 'Farmer Collections',
    icon: Truck,
    path: '/admin-dashboard/collections',
  },
  {
    key: 'users',
    label: 'User Management',
    icon: Users,
    path: '/admin-dashboard/users',
  },
  {
    key: 'analytics',
    label: 'Analytics & Reports',
    icon: BarChart3,
    path: '/admin-dashboard/analytics',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: '/admin-dashboard/notifications',
  },
  {
    key: 'settings',
    label: 'System Settings',
    icon: Settings,
    path: '/admin-dashboard/settings',
  },
  {
    key: 'feedback',
    label: 'User Feedback',
    icon: MessageSquare,
    path: '/admin-dashboard/feedback',
  },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { badges } = useOptimizedAdminData();
  const { toast } = useToast();

  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/admin-dashboard' || path === '/admin-dashboard/') return 'dashboard';
    if (path.includes('/products')) return 'products';
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/payments')) return 'payments';
    if (path.includes('/collections')) return 'collections';
    if (path.includes('/users')) return 'users';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/notifications') || path.includes('/communications')) return 'notifications';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/feedback')) return 'feedback';
    return 'dashboard';
  };

  const activeSection = getActiveSection();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className="border-r border-white/10 bg-gradient-to-b from-white/80 via-white/90 to-white/80 backdrop-blur-xl shadow-xl">
      <SidebarHeader className="p-3 sm:p-4 bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
            <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">Farm Direct Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-transparent to-white/20">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider px-3 sm:px-4 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                const badgeCount = item.badgeKey ? badges[item.badgeKey as keyof typeof badges] : 0;

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full justify-start transition-all duration-200 hover:bg-white/40 hover:backdrop-blur-sm hover:shadow-sm rounded-lg text-sm sm:text-base ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 text-primary shadow-sm' 
                          : 'hover:bg-white/30'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium hidden sm:inline">{item.label}</span>
                      <span className="font-medium sm:hidden text-xs">{item.label.split(' ')[0]}</span>
                      {badgeCount > 0 && (
                        <SidebarMenuBadge className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm border-0 text-xs">
                          {badgeCount > 99 ? '99+' : badgeCount}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4 bg-gradient-to-t from-white/50 to-transparent border-t border-white/10">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Sign Out</span>
          <span className="sm:hidden text-xs">Out</span>
        </Button>
        <div className="text-xs text-muted-foreground text-center mt-2 hidden sm:block">
          Farm Direct Admin v2.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
