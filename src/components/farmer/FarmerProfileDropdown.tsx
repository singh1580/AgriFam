
import React, { useState } from 'react';
import { User, Settings, Edit, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import FarmerProfileModal from './FarmerProfileModal';
import FarmerSettingsModal from './FarmerSettingsModal';

const FarmerProfileDropdown = () => {
  const { user, profile, signOut } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Farmer';
  const userEmail = user?.email || '';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-white/20 transition-all duration-200">
            <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-crop-green via-emerald-600 to-teal-700 text-white font-bold text-sm shadow-inner">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl" align="end">
          <DropdownMenuLabel className="p-0 mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-14 w-14 border-2 border-crop-green/30 shadow-lg">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-crop-green via-emerald-600 to-teal-700 text-white font-bold shadow-inner">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {displayName}
                  </p>
                  <Badge className="bg-gradient-to-r from-crop-green/20 via-emerald-200/60 to-teal-200/60 text-crop-green border-0 shadow-sm">
                    <Shield className="h-3 w-3 mr-1" />
                    Farmer
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
            onClick={() => setIsProfileModalOpen(true)}
            className="cursor-pointer py-3 px-3 rounded-lg hover:bg-crop-green/10 transition-colors duration-200"
          >
            <User className="h-4 w-4 mr-3 text-crop-green" />
            <span className="text-gray-700 font-medium">View Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setIsProfileModalOpen(true)}
            className="cursor-pointer py-3 px-3 rounded-lg hover:bg-crop-green/10 transition-colors duration-200"
          >
            <Edit className="h-4 w-4 mr-3 text-crop-green" />
            <span className="text-gray-700 font-medium">Edit Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setIsSettingsModalOpen(true)}
            className="cursor-pointer py-3 px-3 rounded-lg hover:bg-crop-green/10 transition-colors duration-200"
          >
            <Settings className="h-4 w-4 mr-3 text-crop-green" />
            <span className="text-gray-700 font-medium">Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-gray-200/60" />
          
          <DropdownMenuItem 
            onClick={() => signOut()}
            className="cursor-pointer py-3 px-3 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span className="font-medium">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FarmerProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      
      <FarmerSettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
};

export default FarmerProfileDropdown;
