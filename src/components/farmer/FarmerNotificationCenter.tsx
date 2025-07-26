
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Trash2, Loader2 } from 'lucide-react';
import FarmerNotificationItem from './FarmerNotificationItem';
import { FarmerNotification } from '@/types/farmer';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface FarmerNotificationCenterProps {
  notifications: FarmerNotification[];
  onMarkAsRead: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onDeleteNotification: (id: string) => Promise<void>;
  isLoading?: boolean;
  error?: any;
}

const FarmerNotificationCenter = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  isLoading = false,
  error
}: FarmerNotificationCenterProps) => {
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    setIsMarkingAllRead(true);
    try {
      await onMarkAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleDeleteAllConfirm = async () => {
    setIsDeletingAll(true);
    try {
      // Delete all notifications one by one
      for (const notification of notifications) {
        await onDeleteNotification(notification.id);
      }
      setShowDeleteAllConfirmation(false);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-600">Error loading notifications: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge className="bg-gradient-to-r from-crop-green to-emerald-600 text-white">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0 || isMarkingAllRead}
                  className="bg-white/70 backdrop-blur-sm border-white/30"
                >
                  {isMarkingAllRead ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Marking...
                    </>
                  ) : (
                    <>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Mark All Read
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteAllConfirmation(true)}
                  disabled={notifications.length === 0 || isDeletingAll}
                  className="bg-white/70 backdrop-blur-sm border-white/30 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isDeletingAll ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No notifications yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You'll receive notifications about your products, orders, and payments here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <FarmerNotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDeleteNotification}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteAllConfirmation}
        onClose={() => setShowDeleteAllConfirmation(false)}
        onConfirm={handleDeleteAllConfirm}
        title="Delete All Notifications"
        description="Are you sure you want to delete all notifications? This action cannot be undone."
        confirmText={isDeletingAll ? "Deleting..." : "Delete All"}
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
};

export default FarmerNotificationCenter;
