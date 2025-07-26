
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BuyerProfileDropdownProps {
  onSettingsClick: () => void;
  onProfileClick: () => void;
}

const BuyerProfileDropdown = ({ onSettingsClick, onProfileClick }: BuyerProfileDropdownProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      // Use React Router navigation instead of forcing page reload
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while signing out.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-white">
              {user?.user_metadata?.full_name || 'Buyer'}
            </p>
            <p className="text-xs text-white/70">{user?.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border border-white/20">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.user_metadata?.full_name || 'Buyer'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="cursor-pointer text-red-600 focus:text-red-600"
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BuyerProfileDropdown;
