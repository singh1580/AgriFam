import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, DollarSign, MessageSquare, Clock, X, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { FarmerNotification } from '@/types/farmer';
import { NotificationDeleteConfirmation } from './NotificationDeleteConfirmation';

interface FarmerNotificationItemProps {
  notification: FarmerNotification;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isActionLoading?: boolean;
}

const FarmerNotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  isActionLoading = false 
}: FarmerNotificationItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case 'admin_approval':
      case 'collection_completed':
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-crop-green" />;
      case 'admin_rejection':
        return <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case 'collection_scheduled':
        return <Package className="h-4 w-4 sm:h-5 sm:w-5 text-sky-blue" />;
      case 'payment_processed':
        return <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
      case 'admin_message':
      case 'quality_feedback':
        return <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-harvest-yellow" />;
      default:
        return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />;
    }
  };

  const handleMarkAsRead = async () => {
    if (!notification.read && !isActionLoading) {
      await onMarkAsRead(notification.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(notification.id);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Mark as read when opened
    if (!isExpanded && !notification.read) {
      handleMarkAsRead();
    }
  };

  return (
    <>
      <Card 
        className={`transition-all duration-300 hover:shadow-lg backdrop-blur-sm cursor-pointer ${
          !notification.read 
            ? 'border-l-4 border-l-crop-green bg-gradient-to-r from-crop-green/5 via-emerald-50/30 to-white/90 shadow-md' 
            : 'bg-white/80 hover:bg-white/90'
        } ${isActionLoading ? 'opacity-50' : ''}`}
        onClick={handleToggleExpand}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <h4 className={`text-sm font-semibold break-words ${
                      !notification.read ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <Badge className="bg-gradient-to-r from-crop-green to-emerald-600 text-white text-xs whitespace-nowrap shadow-sm">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleExpand();
                      }}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-crop-green"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <p className={`text-sm break-words leading-relaxed ${
                  !notification.read ? 'text-gray-700' : 'text-gray-500'
                } ${!isExpanded ? 'line-clamp-2' : ''}`}>
                  {notification.message}
                </p>
                
                {notification.productName && (
                  <div className="px-3 py-1 bg-crop-green/10 rounded-lg border border-crop-green/20 backdrop-blur-sm">
                    <p className="text-xs text-crop-green font-medium">
                      Product: {notification.productName}
                    </p>
                  </div>
                )}
                
                {isExpanded && (
                  <div className="space-y-3 pt-2 border-t border-gray-200/50">
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><strong>Notification Type:</strong> {notification.type.replace('_', ' ').toUpperCase()}</p>
                      <p><strong>Received:</strong> {new Date(notification.timestamp).toLocaleString('en-IN')}</p>
                      <p><strong>Status:</strong> {notification.read ? 'Read' : 'Unread'}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                  <p className="text-xs text-gray-500 font-medium">
                    {new Date(notification.timestamp).toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleMarkAsRead}
                        disabled={isActionLoading}
                        className="h-7 px-3 py-1 text-xs bg-crop-green/10 text-crop-green hover:text-crop-green hover:bg-crop-green/20 transition-all duration-200 rounded-lg"
                      >
                        {isActionLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Mark Read'
                        )}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDeleteClick}
                      disabled={isActionLoading || isDeleting}
                      className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-lg"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <NotificationDeleteConfirmation
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default FarmerNotificationItem;
