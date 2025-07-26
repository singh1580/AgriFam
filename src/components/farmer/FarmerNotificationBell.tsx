
import React from 'react';
import { Bell, BellDot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FarmerNotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}

const FarmerNotificationBell = ({ unreadCount, onClick }: FarmerNotificationBellProps) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-accent rounded-lg transition-colors duration-200"
    >
      {unreadCount > 0 ? (
        <BellDot className="h-4 w-4 sm:h-5 sm:w-5 text-crop-green" />
      ) : (
        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
      )}
      
      {unreadCount > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </button>
  );
};

export default FarmerNotificationBell;
