
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Loader2, X, Trash2 } from 'lucide-react';
import { Notification } from '@/types/order';
import NotificationItem from './NotificationItem';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/hooks/use-toast';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  isLoading?: boolean;
  isMarkingAllAsRead?: boolean;
}

const NotificationCenter = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDeleteNotification,
  isLoading = false,
  isMarkingAllAsRead = false
}: NotificationCenterProps) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showMarkAllReadDialog, setShowMarkAllReadDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const sortedNotifications = filteredNotifications.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      setShowMarkAllReadDialog(true);
    }
  };

  const confirmMarkAllAsRead = () => {
    onMarkAllAsRead();
    setShowMarkAllReadDialog(false);
    toast({
      title: "Success",
      description: `Marking ${unreadCount} notifications as read`,
    });
  };

  const handleDeleteAll = () => {
    if (notifications.length > 0) {
      setShowDeleteAllDialog(true);
    }
  };

  const confirmDeleteAll = async () => {
    setIsDeleting(true);
    try {
      // Delete all notifications one by one with proper error handling
      const deletePromises = notifications.map(notification => 
        new Promise<void>((resolve, reject) => {
          try {
            onDeleteNotification(notification.id);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
      );
      
      await Promise.all(deletePromises);
      
      toast({
        title: "Success",
        description: `Deleted ${notifications.length} notifications`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete all notifications",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteAllDialog(false);
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'unread') => {
    setFilter(newFilter);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-sky-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Notifications</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Stay updated with your order status and messages
          </p>
        </div>
        
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Badge variant="secondary" className="bg-sky-blue/20 text-sky-blue">
            {unreadCount} New
          </Badge>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
              className="hover:bg-crop-green/10 hover:text-crop-green hover:border-crop-green transition-all duration-200"
            >
              {isMarkingAllAsRead ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">
                {isMarkingAllAsRead ? 'Marking...' : 'Mark All Read'}
              </span>
              <span className="sm:hidden">
                {isMarkingAllAsRead ? 'Marking...' : 'All Read'}
              </span>
            </Button>
          )}
          {notifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeleteAll}
              disabled={isDeleting}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">
                {isDeleting ? 'Deleting...' : 'Delete All'}
              </span>
              <span className="sm:hidden">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFilterChange('all')}
                className="rounded-md text-xs sm:text-sm transition-all duration-200"
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFilterChange('unread')}
                className="rounded-md text-xs sm:text-sm transition-all duration-200"
              >
                Unread ({unreadCount})
              </Button>
            </div>
            
            {filter === 'unread' && unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange('all')}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {sortedNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDeleteNotification}
          />
        ))}
      </div>

      {sortedNotifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-sky-blue/20 to-crop-green/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <Bell className="h-8 w-8 sm:h-12 sm:w-12 text-sky-blue" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              {filter === 'unread' 
                ? 'All your notifications have been read'
                : 'You\'ll receive notifications about your orders here'
              }
            </p>
            {filter === 'unread' && notifications.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => handleFilterChange('all')}
                className="hover:bg-crop-green/10 hover:text-crop-green hover:border-crop-green transition-all duration-200"
              >
                View All Notifications
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showMarkAllReadDialog}
        onClose={() => setShowMarkAllReadDialog(false)}
        onConfirm={confirmMarkAllAsRead}
        title="Mark All as Read"
        description={`Are you sure you want to mark all ${unreadCount} unread notifications as read?`}
        confirmText="Mark All Read"
        cancelText="Cancel"
      />

      <ConfirmationDialog
        isOpen={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Notifications"
        description={`Are you sure you want to delete all ${notifications.length} notifications? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        isDestructive
      />
    </div>
  );
};

export default NotificationCenter;
