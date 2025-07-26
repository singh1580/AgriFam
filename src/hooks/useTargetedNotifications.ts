
import { useState } from 'react';
import { FarmerNotification } from '@/types/farmer';

export interface TargetedNotificationOptions {
  recipientType: 'farmer' | 'buyer' | 'specific';
  recipientId?: string;
  productId?: string;
  orderId?: string;
  category: 'product_status' | 'payment' | 'collection' | 'order_status' | 'quality_feedback' | 'general';
}

export const useTargetedNotifications = () => {
  const [notifications, setNotifications] = useState<FarmerNotification[]>([]);

  const sendTargetedNotification = (
    title: string,
    message: string,
    options: TargetedNotificationOptions
  ) => {
    const notification: FarmerNotification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: getNotificationType(options.category),
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      productId: options.productId,
      productName: options.productId ? `Product #${options.productId}` : undefined
    };

    console.log(`Sending targeted notification to ${options.recipientType}:`, {
      notification,
      options
    });

    // In a real implementation, this would send to specific users
    // For now, we'll add to the local state for demonstration
    setNotifications(prev => [notification, ...prev]);

    return notification;
  };

  const sendFarmerNotification = (
    farmerId: string,
    productId: string,
    title: string,
    message: string,
    category: TargetedNotificationOptions['category'] = 'product_status'
  ) => {
    return sendTargetedNotification(title, message, {
      recipientType: 'specific',
      recipientId: farmerId,
      productId,
      category
    });
  };

  const sendBuyerNotification = (
    buyerId: string,
    orderId: string,
    title: string,
    message: string,
    category: TargetedNotificationOptions['category'] = 'order_status'
  ) => {
    return sendTargetedNotification(title, message, {
      recipientType: 'specific',
      recipientId: buyerId,
      orderId,
      category
    });
  };

  const sendBulkNotification = (
    title: string,
    message: string,
    recipientType: 'farmer' | 'buyer',
    category: TargetedNotificationOptions['category'] = 'general'
  ) => {
    return sendTargetedNotification(title, message, {
      recipientType,
      category
    });
  };

  return {
    notifications,
    sendTargetedNotification,
    sendFarmerNotification,
    sendBuyerNotification,
    sendBulkNotification
  };
};

const getNotificationType = (category: TargetedNotificationOptions['category']): FarmerNotification['type'] => {
  switch (category) {
    case 'product_status': return 'admin_approval';
    case 'payment': return 'payment_processed';
    case 'collection': return 'collection_scheduled';
    case 'order_status': return 'admin_message';
    case 'quality_feedback': return 'quality_feedback';
    default: return 'admin_message';
  }
};
