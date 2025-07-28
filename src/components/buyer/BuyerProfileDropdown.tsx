
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, Edit, LogOut, Shield, Loader2 } from 'lucide-react';
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Buyer';
  const userEmail = user?.email || '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-white/20 transition-all duration-200">
          <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
            <AvatarImage src="" alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white font-bold text-sm shadow-inner">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl" align="end">
        <DropdownMenuLabel className="p-0 mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-14 w-14 border-2 border-blue-600/30 shadow-lg">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white font-bold shadow-inner">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {displayName}
                </p>
                <Badge className="bg-gradient-to-r from-blue-600/20 via-purple-200/60 to-indigo-200/60 text-blue-600 border-0 shadow-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  Buyer
                </Badge>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-200/60" />
        
        <DropdownMenuItem 
          onClick={onProfileClick}
          className="cursor-pointer py-3 px-3 rounded-lg hover:bg-blue-600/10 transition-colors duration-200"
        >
          <User className="h-4 w-4 mr-3 text-blue-600" />
          <span className="text-gray-700 font-medium">View Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onProfileClick}
          className="cursor-pointer py-3 px-3 rounded-lg hover:bg-blue-600/10 transition-colors duration-200"
        >
          <Edit className="h-4 w-4 mr-3 text-blue-600" />
          <span className="text-gray-700 font-medium">Edit Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onSettingsClick}
          className="cursor-pointer py-3 px-3 rounded-lg hover:bg-blue-600/10 transition-colors duration-200"
        >
          <Settings className="h-4 w-4 mr-3 text-blue-600" />
          <span className="text-gray-700 font-medium">Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-200/60" />
        
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="cursor-pointer py-3 px-3 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600 focus:text-red-600"
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="h-4 w-4 mr-3 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 mr-3" />
          )}
          <span className="font-medium">{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BuyerProfileDropdown;
