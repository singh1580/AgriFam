
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AdminSettingsModal from './AdminSettingsModal';

export const AdminProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your admin account.",
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

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';

  return (
    <>
      <Button 
        variant="ghost" 
        className="relative h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
        onClick={() => setIsSettingsOpen(true)}
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-gradient-to-br from-primary via-primary-light to-primary-dark text-white font-semibold text-sm shadow-inner">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </Button>
      <AdminSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
