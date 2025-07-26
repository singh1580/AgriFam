
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { CheckCircle, Package, CreditCard, MessageSquare, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Notification } from '@/types/order';

interface NotificationItemProps {
  notification: Notification & { productName?: string };
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case 'order_update':
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-crop-green" />;
      case 'product_status':
        return <Package className="h-4 w-4 sm:h-5 sm:w-5 text-sky-blue" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-harvest-yellow" />;
      case 'admin_message':
        return <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />;
      case 'collection':
        return <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />;
      case 'general':
      default:
        return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />;
    }
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(notification.id);
    setShowDeleteConfirm(false);
  };

  // Display product name if available, otherwise show order ID
  const getOrderDisplayText = () => {
    if (notification.productName) {
      return `Order for ${notification.productName}`;
    }
    return notification.orderId ? `Order #${notification.orderId.slice(0, 8).toUpperCase()}` : null;
  };

  return (
    <>
      <Card 
        className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
          !notification.read ? 'border-l-4 border-l-sky-blue bg-sky-blue/5' : ''
        } ${isExpanded ? 'shadow-lg' : ''}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className={`text-sm font-medium break-words flex-1 ${
                    !notification.read ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {notification.title}
                  </h4>
                  <div className="flex items-center space-x-2 ml-2">
                    {!notification.read && (
                      <Badge variant="secondary" className="bg-sky-blue/20 text-sky-blue text-xs whitespace-nowrap">
                        New
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <p className={`text-sm break-words ${
                  !notification.read ? 'text-foreground/80' : 'text-muted-foreground'
                } ${!isExpanded ? 'line-clamp-2' : ''}`}>
                  {notification.message}
                </p>
                
                {isExpanded && (
                  <div className="pt-2 border-t border-border/50 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {new Date(notification.timestamp).toLocaleString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {notification.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    {getOrderDisplayText() && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{getOrderDisplayText()}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleDateString('en-IN')}
                  </p>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleMarkAsRead}
                        className="h-6 px-2 py-1 text-xs text-sky-blue hover:text-sky-blue hover:bg-sky-blue/10"
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDelete}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
      />
    </>
  );
};

export default NotificationItem;
