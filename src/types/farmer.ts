
export interface FarmerNotification {
  id: string;
  type: 'admin_approval' | 'admin_rejection' | 'collection_scheduled' | 'collection_completed' | 'payment_processed' | 'admin_message' | 'quality_feedback';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  productId?: string;
  productName?: string;
}

// Database notification interface for mapping
export interface DatabaseNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  metadata?: {
    product_id?: string;
    product_name?: string;
    order_id?: string;
  };
}

export interface FarmerProduct {
  id: number;
  name: string;
  category: string;
  quantity: string;
  quantityUnit?: string;
  location?: string;
  submittedPrice: string;
  quality: string;
  status: 'submitted' | 'admin_review' | 'approved' | 'scheduled_collection' | 'collected' | 'payment_processed' | 'rejected';
  submittedDate: string;
  expectedPayment?: string;
  collectionDate?: string;
  adminNotes?: string;
}

// Admin-specific interface for ProductAggregation component
export interface AdminFarmerProduct {
  id: number;
  farmerId: string;
  farmerName: string;
  productName: string;
  quantity: string;
  quality: string;
  location: string;
  price: string;
  status: 'pending' | 'approved' | 'collected';
  submittedDate: string;
}

// Status utility types and functions
export type ProductStatus = FarmerProduct['status'];

export const getStatusInfo = (status: ProductStatus) => {
  switch (status) {
    case 'submitted':
      return { color: 'bg-gray-100 text-gray-700', text: 'Submitted' };
    case 'admin_review':
      return { color: 'bg-harvest-yellow/10 text-harvest-yellow border-harvest-yellow/30', text: 'Admin Review' };
    case 'approved':
      return { color: 'bg-crop-green/10 text-crop-green border-crop-green/30', text: 'Approved' };
    case 'scheduled_collection':
      return { color: 'bg-sky-blue/10 text-sky-blue border-sky-blue/30', text: 'Collection Scheduled' };
    case 'collected':
      return { color: 'bg-purple-100 text-purple-700 border-purple-300', text: 'Collected' };
    case 'payment_processed':
      return { color: 'bg-green-500/10 text-green-600 border-green-500/30', text: 'Payment Processed' };
    case 'rejected':
      return { color: 'bg-red-100 text-red-700 border-red-300', text: 'Rejected' };
    default:
      return { color: 'bg-gray-100 text-gray-600', text: status };
  }
};

// Helper function to map database notifications to farmer notifications
export const mapDatabaseNotificationToFarmer = (dbNotification: DatabaseNotification): FarmerNotification => {
  // Map database notification types to farmer-friendly types
  const getNotificationType = (type: string): FarmerNotification['type'] => {
    switch (type) {
      case 'product_approved':
        return 'admin_approval';
      case 'product_rejected':
        return 'admin_rejection';
      case 'collection_scheduled':
        return 'collection_scheduled';
      case 'collection_completed':
        return 'collection_completed';
      case 'payment_processed':
        return 'payment_processed';
      case 'admin_message':
        return 'admin_message';
      case 'quality_feedback':
        return 'quality_feedback';
      default:
        return 'admin_message';
    }
  };

  return {
    id: dbNotification.id,
    type: getNotificationType(dbNotification.type),
    title: dbNotification.title,
    message: dbNotification.message,
    timestamp: dbNotification.created_at,
    read: dbNotification.read,
    productId: dbNotification.metadata?.product_id,
    productName: dbNotification.metadata?.product_name
  };
};
