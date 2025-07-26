
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { 
  ShoppingBag, 
  Package, 
  History, 
  Bell,
  Home,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type DashboardSection = 'browse' | 'orders' | 'history' | 'notifications';

interface BuyerDashboardSidebarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  setSidebarOpen: (open: boolean) => void;
  unreadNotifications: number;
  sidebarOpen: boolean;
}

const BuyerDashboardSidebar = ({ 
  activeSection, 
  setActiveSection, 
  setSidebarOpen, 
  unreadNotifications, 
  sidebarOpen 
}: BuyerDashboardSidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSectionChange = (section: DashboardSection) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      id: 'browse' as const,
      label: 'Browse Products',
      icon: ShoppingBag,
      description: 'Discover fresh products'
    },
    {
      id: 'orders' as const,
      label: 'Active Orders',
      icon: Package,
      description: 'Track your orders'
    },
    {
      id: 'history' as const,
      label: 'Order History',
      icon: History,
      description: 'Past orders'
    },
    {
      id: 'notifications' as const,
      label: 'Notifications',
      icon: Bell,
      description: 'Updates & alerts',
      badge: unreadNotifications > 0 ? unreadNotifications : undefined
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-crop-green to-sky-blue flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Buyer Portal</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  "w-full justify-start h-auto p-4 text-left transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-crop-green to-sky-blue text-white shadow-lg scale-105" 
                    : "hover:bg-muted hover:scale-102"
                )}
                onClick={() => handleSectionChange(item.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-white" : "text-muted-foreground"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "font-medium truncate",
                        isActive ? "text-white" : "text-foreground"
                      )}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge className="ml-2 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center">
                          {item.badge > 9 ? '9+' : item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs truncate mt-0.5",
                      isActive ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-border/50 mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start h-12 p-4 text-left transition-all duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          onClick={handleSignOut}
        >
          <div className="flex items-center space-x-3 w-full">
            <LogOut className="h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-red-600">Sign Out</span>
              <p className="text-xs text-red-500 mt-0.5">Logout from account</p>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-background border-r border-border/50 z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BuyerDashboardSidebar;
