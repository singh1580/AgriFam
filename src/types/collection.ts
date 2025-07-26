
export interface CollectionSchedule {
  id: string;
  productId: string;
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  productName: string;
  category: string;
  quantity: number;
  quantityUnit: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'approved' | 'scheduled_collection' | 'collected' | 'payment_processed';
  estimatedValue: number;
  pricePerUnit: number;
  qualityGrade?: string;
  collectionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionStats {
  todaysCollections: number;
  inProgress: number;
  totalValue: number;
  paidToday: number;
}
